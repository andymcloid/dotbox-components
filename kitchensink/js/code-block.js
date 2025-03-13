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
      _content: { type: String, state: true }
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
        padding: 15px;
        padding-top: 25px;
        border-radius: 6px;
        font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
        white-space: pre-wrap;
        color: #e6e6e6;
        font-size: 0.9rem;
        overflow-x: auto;
        line-height: 1.5;
        box-shadow: 0 3px 6px rgba(0,0,0,0.16);
        border: 1px solid #1e2127;
      }
      
      .code-content {
        margin: 0;
        padding: 0;
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
      
      /* Syntax highlighting colors */
      .tag { color: #e06c75; }
      .attr { color: #d19a66; }
      .string { color: #98c379; }
      .comment { color: #7f848e; font-style: italic; }
      .keyword { color: #c678dd; }
      .function { color: #61afef; }
      .number { color: #d19a66; }
    `;
  }

  constructor() {
    super();
    this.language = 'HTML';
    this.copyable = true;
    this._content = '';
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
    
    // Process the content to remove excessive whitespace
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