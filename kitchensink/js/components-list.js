import { LitElement, html, css } from 'lit';
import { getAllComponents } from './components-registry.js';

/**
 * @element kitchensink-components-list
 * 
 * A dynamic list of all available components for the kitchensink home page.
 */
export class KitchensinkComponentsList extends LitElement {
  static get properties() {
    return {
      _components: { type: Array, state: true }
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
      
      .list-group {
        display: flex;
        flex-direction: column;
        padding-left: 0;
        margin-bottom: 0;
      }
      
      .list-group-item {
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem 1.25rem;
        margin-bottom: -1px;
        background-color: #fff;
        border: 1px solid rgba(0, 0, 0, 0.125);
      }
      
      .list-group-item:first-child {
        border-top-left-radius: 0.25rem;
        border-top-right-radius: 0.25rem;
      }
      
      .list-group-item:last-child {
        margin-bottom: 0;
        border-bottom-right-radius: 0.25rem;
        border-bottom-left-radius: 0.25rem;
      }
      
      .badge {
        display: inline-block;
        padding: 0.25em 0.4em;
        font-size: 75%;
        font-weight: 700;
        line-height: 1;
        text-align: center;
        white-space: nowrap;
        vertical-align: baseline;
        border-radius: 0.25rem;
        color: #fff;
        background-color: #007bff;
        text-decoration: none;
        cursor: pointer;
      }
      
      .badge:hover {
        background-color: #0056b3;
        text-decoration: none;
      }
      
      .component-description {
        color: #6c757d;
        font-size: 0.875rem;
        margin-top: 0.25rem;
      }
    `;
  }

  constructor() {
    super();
    this._components = [];
  }

  async connectedCallback() {
    super.connectedCallback();
    
    // Load components
    this._components = await getAllComponents();
  }
  
  _handleComponentClick(e, componentName) {
    e.preventDefault();
    
    // Dispatch navigation event
    document.dispatchEvent(new CustomEvent('kitchensink-navigate', { 
      detail: { targetId: componentName } 
    }));
  }

  render() {
    return html`
      <ul class="list-group">
        ${this._components.map(component => html`
          <li class="list-group-item">
            <div>
              <div><i class="fa ${component.icon}"></i> ${component.displayName}</div>
              <div class="component-description">${component.description}</div>
            </div>
            <a href="#${component.name}" 
               class="badge component-link"
               @click=${(e) => this._handleComponentClick(e, component.name)}>View</a>
          </li>
        `)}
      </ul>
    `;
  }
}

customElements.define('kitchensink-components-list', KitchensinkComponentsList); 