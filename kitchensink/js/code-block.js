import { LitElement, html, css } from 'lit';

/**
 * @element kitchensink-code-block
 * 
 * A component for displaying code examples with syntax highlighting and copy functionality.
 * 
 * @prop {String} language - The language of the code (HTML, CSS, JS, SHELL)
 * @prop {Boolean} copyable - Whether to show a copy button
 * @slot - The code content to display
 */
export class KitchensinkCodeBlock extends LitElement {
  static get properties() {
    return {
      language: { type: String },
      copyable: { type: Boolean },
      _content: { type: String, state: true },
      inline: { type: Boolean, reflect: true }
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        margin-bottom: 20px;
      }
      
      .code-block {
        position: relative;
        background-color: #282c34;
        padding: 10px;
        padding-top: 25px;
        border-radius: 6px;
        font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
        color: #e6e6e6;
        font-size: 0.9rem;
        overflow-x: auto;
        line-height: 1.4;
        box-shadow: 0 3px 6px rgba(0,0,0,0.16);
        border: 1px solid #1e2127;
      }
      
      .code-content {
        margin: 0;
        padding: 0;
        white-space: pre-wrap;
        display: block;
      }
      
      :host([inline]) .code-content {
        display: inline;
        white-space: normal;
      }
      
      .code-label {
        position: absolute;
        top: 0;
        left: 0;
        background-color: #3d4350;
        color: #e6e6e6;
        padding: 2px 8px;
        font-size: 0.7rem;
        border-radius: 0 0 4px 0;
      }
      
      .copy-btn {
        position: absolute;
        top: 0;
        right: 0;
        background-color: #3d4350;
        color: #e6e6e6;
        border: none;
        border-radius: 0 0 0 4px;
        padding: 2px 8px;
        font-size: 0.7rem;
        cursor: pointer;
        transition: background-color 0.2s;
      }
      
      .copy-btn:hover {
        background-color: #4d5466;
      }
      
      .copy-btn:active {
        background-color: #5a6377;
      }
      
      /* Syntax highlighting colors - One Dark theme */
      .token.comment,
      .token.prolog,
      .token.doctype,
      .token.cdata {
        color: #7f848e;
        font-style: italic;
      }
      
      .token.punctuation {
        color: #abb2bf;
      }
      
      .token.selector,
      .token.tag {
        color: #e06c75;
      }
      
      .token.property,
      .token.boolean,
      .token.number,
      .token.constant,
      .token.symbol {
        color: #d19a66;
      }
      
      .token.attr-name {
        color: #d19a66;
      }
      
      .token.string,
      .token.char,
      .token.attr-value {
        color: #98c379;
      }
      
      .token.operator {
        color: #56b6c2;
      }
      
      .token.entity,
      .token.url,
      .language-css .token.string,
      .style .token.string {
        color: #56b6c2;
      }
      
      .token.atrule,
      .token.keyword {
        color: #c678dd;
      }
      
      .token.function {
        color: #61afef;
      }
      
      .token.regex,
      .token.important,
      .token.variable {
        color: #c678dd;
      }
      
      .token.important,
      .token.bold {
        font-weight: bold;
      }
      
      .token.italic {
        font-style: italic;
      }
      
      .token.entity {
        cursor: help;
      }
    `;
  }

  constructor() {
    super();
    this.language = 'HTML';
    this.copyable = true;
    this._content = '';
    this.inline = false;
    
    // Load Prism.js dynamically
    this._loadPrismJS();
  }
  
  _loadPrismJS() {
    // Check if Prism is already loaded
    if (window.Prism) return;
    
    // Create script element for Prism core
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js';
    script.async = true;
    
    // Create link element for Prism CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css';
    
    // Add elements to document head
    document.head.appendChild(script);
    document.head.appendChild(link);
    
    // Load additional language support
    const languages = ['markup', 'css', 'javascript', 'bash'];
    languages.forEach(lang => {
      const langScript = document.createElement('script');
      langScript.src = `https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-${lang}.min.js`;
      langScript.async = true;
      document.head.appendChild(langScript);
    });
  }

  connectedCallback() {
    super.connectedCallback();
    // Process content after connection to DOM
    setTimeout(() => {
      this._processContent();
    }, 0);
  }

  _processContent() {
    // Get the raw content
    const rawContent = this.textContent;
    
    if (!rawContent) return;
    
    // Check if this is likely an inline code block (no newlines)
    this.inline = !rawContent.includes('\n');
    
    if (this.inline) {
      // For inline content, just trim whitespace
      this._content = rawContent.trim();
      this.requestUpdate();
      return;
    }
    
    // Process the content to remove excessive whitespace for multi-line blocks
    // 1. Split by lines
    const lines = rawContent.split('\n');
    
    // 2. Remove empty lines at the beginning and end
    let startIndex = 0;
    let endIndex = lines.length - 1;
    
    while (startIndex < lines.length && lines[startIndex].trim() === '') {
      startIndex++;
    }
    
    while (endIndex >= 0 && lines[endIndex].trim() === '') {
      endIndex--;
    }
    
    // 3. Extract the actual content lines
    const contentLines = lines.slice(startIndex, endIndex + 1);
    
    // 4. Determine common indentation to remove
    let minIndent = Infinity;
    for (const line of contentLines) {
      if (line.trim() === '') continue; // Skip empty lines
      const indent = line.search(/\S/);
      if (indent >= 0 && indent < minIndent) {
        minIndent = indent;
      }
    }
    
    // 5. Remove the common indentation from each line
    const processedLines = contentLines.map(line => {
      if (line.trim() === '') return '';
      return line.substring(minIndent < Infinity ? minIndent : 0);
    });
    
    // 6. Join the lines back together
    this._content = processedLines.join('\n');
    
    this.requestUpdate();
  }

  _detectLanguage(code) {
    if (!this.language || this.language === 'auto') {
      if (code.includes('import ') || 
          code.includes('function ') || 
          code.includes('const ') ||
          code.includes('let ')) {
        return 'JS';
      } else if (code.includes('npm install')) {
        return 'SHELL';
      } else if (code.includes('{') && 
                code.includes('}') && 
                !code.includes('<')) {
        return 'CSS';
      } else {
        return 'HTML';
      }
    }
    return this.language.toUpperCase();
  }
  
  _getPrismLanguage(language) {
    // Map our language codes to Prism's language identifiers
    const languageMap = {
      'HTML': 'markup',
      'CSS': 'css',
      'JS': 'javascript',
      'SHELL': 'bash'
    };
    
    return languageMap[language] || 'markup';
  }

  _copyCode() {
    navigator.clipboard.writeText(this._content)
      .then(() => {
        const copyBtn = this.shadowRoot.querySelector('.copy-btn');
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
          copyBtn.textContent = 'Copy';
        }, 2000);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        const copyBtn = this.shadowRoot.querySelector('.copy-btn');
        copyBtn.textContent = 'Failed';
        setTimeout(() => {
          copyBtn.textContent = 'Copy';
        }, 2000);
      });
  }
  
  updated() {
    // Apply syntax highlighting after the component has updated
    if (window.Prism && this._content) {
      const codeElement = this.shadowRoot.querySelector('.code-content');
      if (codeElement) {
        const language = this._detectLanguage(this._content);
        const prismLanguage = this._getPrismLanguage(language);
        
        // Create a temporary pre and code elements for Prism to highlight
        const tempPre = document.createElement('pre');
        const tempCode = document.createElement('code');
        tempCode.className = `language-${prismLanguage}`;
        tempCode.textContent = this._content;
        tempPre.appendChild(tempCode);
        
        // Let Prism do its magic
        Prism.highlightElement(tempCode);
        
        // Replace the content with the highlighted HTML
        codeElement.innerHTML = tempCode.innerHTML;
      }
    }
  }

  render() {
    const language = this._detectLanguage(this._content || this.textContent);
    
    return html`
      <div class="code-block">
        <span class="code-label">${language}</span>
        ${this.copyable ? html`
          <button class="copy-btn" @click=${this._copyCode}>Copy</button>
        ` : ''}
        <div class="code-content">${this._content}</div>
      </div>
    `;
  }
}

customElements.define('kitchensink-code-block', KitchensinkCodeBlock); 