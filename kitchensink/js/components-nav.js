import { LitElement, html, css } from 'lit';
import { getAllComponents } from './components-registry.js';

/**
 * @element kitchensink-components-nav
 * 
 * A dynamic navigation menu for the kitchensink that displays all available components.
 */
export class KitchensinkComponentsNav extends LitElement {
  static get properties() {
    return {
      _components: { type: Array, state: true },
      _activeId: { type: String, state: true }
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
      
      .nav {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      
      .nav-item {
        margin: 0;
        padding: 0;
      }
      
      .nav-link {
        display: flex;
        align-items: center;
        padding: 0.75rem 1.5rem;
        color: #333;
        text-decoration: none;
        font-weight: 500;
        border-left: 3px solid transparent;
        cursor: pointer;
      }
      
      .nav-link:hover {
        background-color: #e9ecef;
      }
      
      .nav-link.active {
        color: #007bff;
        border-left: 3px solid #007bff;
        background-color: rgba(0, 123, 255, 0.1);
      }
      
      .nav-link i {
        margin-right: 10px;
      }
    `;
  }

  constructor() {
    super();
    this._components = [];
    this._activeId = '';
    
    // Listen for hash changes
    window.addEventListener('hashchange', () => {
      this._updateActiveFromHash();
    });
    
    // Listen for navigation events
    document.addEventListener('kitchensink-navigate', (e) => {
      this._activeId = e.detail.targetId;
      this.requestUpdate();
    });
  }

  async connectedCallback() {
    super.connectedCallback();
    
    // Load components
    this._components = await getAllComponents();
    
    // Set initial active based on hash
    this._updateActiveFromHash();
  }
  
  _updateActiveFromHash() {
    const hash = window.location.hash.substring(1);
    if (hash) {
      this._activeId = hash;
    } else {
      this._activeId = 'home';
    }
    this.requestUpdate();
  }
  
  _handleNavClick(e, targetId) {
    e.preventDefault();
    
    // Update active ID
    this._activeId = targetId;
    
    // Dispatch navigation event
    document.dispatchEvent(new CustomEvent('kitchensink-navigate', { 
      detail: { targetId } 
    }));
  }

  render() {
    return html`
      <ul class="nav flex-column">
        <li class="nav-item">
          <a class="nav-link ${this._activeId === 'home' ? 'active' : ''}" 
             href="#home"
             @click=${(e) => this._handleNavClick(e, 'home')}>
            <i class="fa fa-home"></i> Home
          </a>
        </li>
        
        ${this._components.map(component => html`
          <li class="nav-item">
            <a class="nav-link ${this._activeId === component.name ? 'active' : ''}" 
               href="#${component.name}"
               @click=${(e) => this._handleNavClick(e, component.name)}>
              <i class="fa ${component.icon}"></i> ${component.displayName}
            </a>
          </li>
        `)}
      </ul>
    `;
  }
}

customElements.define('kitchensink-components-nav', KitchensinkComponentsNav); 