import { LitElement, html, css } from 'lit';

/**
 * @element kitchensink-documentation-renderer
 * 
 * @prop {String} component - The name of the component to render documentation for
 * 
 * @fires loaded - Dispatched when the documentation is loaded
 */
export class KitchensinkDocumentationRenderer extends LitElement {
  static get properties() {
    return {
      component: { type: String, reflect: true },
      _documentation: { type: Object, state: true }
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        margin: 2rem 0;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      }
      
      .api-section {
        margin-bottom: 2rem;
      }
      
      .api-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 1.5rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }
      
      .api-table th, 
      .api-table td {
        padding: 0.75rem;
        border: 1px solid #dee2e6;
        vertical-align: top;
      }
      
      .api-table th {
        background-color: #f8f9fa;
        font-weight: 600;
        text-align: left;
        border-bottom: 2px solid #dee2e6;
      }
      
      .api-table tr:nth-child(even) {
        background-color: #f9f9f9;
      }
      
      .api-table tr:hover {
        background-color: #f2f2f2;
      }
      
      .api-table code {
        background-color: #f0f0f0;
        padding: 0.2rem 0.4rem;
        border-radius: 0.25rem;
        font-family: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
        font-size: 0.875em;
        color: #e83e8c;
      }
      
      .api-section h2 {
        margin-top: 2rem;
        margin-bottom: 1rem;
        font-size: 1.75rem;
        font-weight: 500;
        color: #212529;
        border-bottom: 1px solid #eee;
        padding-bottom: 0.5rem;
      }
      
      .api-section h3 {
        margin-top: 1.5rem;
        margin-bottom: 0.75rem;
        font-size: 1.25rem;
        font-weight: 500;
        color: #212529;
      }
      
      .empty-message {
        font-style: italic;
        color: #6c757d;
        padding: 1rem;
        background-color: #f8f9fa;
        border-radius: 0.25rem;
        text-align: center;
      }
      
      /* Responsive table */
      @media (max-width: 768px) {
        .api-table {
          display: block;
          overflow-x: auto;
        }
      }
    `;
  }

  constructor() {
    super();
    this.component = '';
    this._documentation = null;
  }

  connectedCallback() {
    super.connectedCallback();
    
    // Load documentation if component is set
    if (this.component) {
      this._loadDocumentation();
    }
  }

  updated(changedProperties) {
    if (changedProperties.has('component') && this.component) {
      this._loadDocumentation();
    }
  }

  async _loadDocumentation() {
    if (!this.component) return;
    
    try {
      const response = await fetch(`/components/${this.component}/${this.component}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load documentation for ${this.component}`);
      }
      
      this._documentation = await response.json();
      
      // Dispatch loaded event
      this.dispatchEvent(new CustomEvent('loaded', {
        detail: {
          component: this.component,
          documentation: this._documentation
        },
        bubbles: true,
        composed: true
      }));
    } catch (error) {
      console.error(`Error loading documentation for ${this.component}:`, error);
      this._documentation = null;
    }
  }

  render() {
    if (!this._documentation) {
      return html`
        <div>
          <p class="empty-message">No documentation available for ${this.component || 'this component'}.</p>
        </div>
      `;
    }
    
    return html`
      <div>
        <div class="api-section">
          <h2>API Reference</h2>
          
          ${this._renderProperties()}
          ${this._renderCssParts()}
          ${this._renderSlots()}
          ${this._renderEvents()}
        </div>
      </div>
    `;
  }

  _renderProperties() {
    if (!this._documentation.properties || this._documentation.properties.length === 0) {
      return html``;
    }
    
    return html`
      <h3>Properties</h3>
      <table class="api-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Default</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          ${this._documentation.properties.map(prop => html`
            <tr>
              <td><code>${prop.name}</code></td>
              <td>${prop.type}</td>
              <td>${this._formatDefaultValue(prop.default)}</td>
              <td>${prop.description}</td>
            </tr>
          `)}
        </tbody>
      </table>
    `;
  }

  _renderCssParts() {
    if (!this._documentation.cssParts || this._documentation.cssParts.length === 0) {
      return html``;
    }
    
    return html`
      <h3>CSS Parts</h3>
      <table class="api-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          ${this._documentation.cssParts.map(part => html`
            <tr>
              <td><code>${part.name}</code></td>
              <td>${part.description}</td>
            </tr>
          `)}
        </tbody>
      </table>
    `;
  }

  _renderSlots() {
    if (!this._documentation.slots || this._documentation.slots.length === 0) {
      return html``;
    }
    
    return html`
      <h3>Slots</h3>
      <table class="api-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          ${this._documentation.slots.map(slot => html`
            <tr>
              <td><code>${slot.name === 'default' ? '' : slot.name}</code></td>
              <td>${slot.description}</td>
            </tr>
          `)}
        </tbody>
      </table>
    `;
  }

  _renderEvents() {
    if (!this._documentation.events || this._documentation.events.length === 0) {
      return html``;
    }
    
    return html`
      <h3>Events</h3>
      <table class="api-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          ${this._documentation.events.map(event => html`
            <tr>
              <td><code>${event.name}</code></td>
              <td>${event.description}</td>
            </tr>
          `)}
        </tbody>
      </table>
    `;
  }

  _formatDefaultValue(value) {
    if (value === undefined || value === null) {
      return '';
    }
    
    if (typeof value === 'string') {
      return value === '' ? '""' : `"${value}"`;
    }
    
    if (typeof value === 'boolean') {
      return value ? 'true' : 'false';
    }
    
    return String(value);
  }
}

customElements.define('kitchensink-documentation-renderer', KitchensinkDocumentationRenderer); 