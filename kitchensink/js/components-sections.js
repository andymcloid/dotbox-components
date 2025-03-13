import { LitElement, html, css } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { getAllComponents } from './components-registry.js';
import {
  enhanceCodeBlocks,
  initializeDialogListeners,
  initializeInputListeners,
  initializeNotificationListeners,
  initializeCheckboxListeners
} from './component-event-handlers.js';

/**
 * @element kitchensink-components-sections
 * 
 * A component that dynamically generates sections for all components.
 */
export class KitchensinkComponentsSections extends LitElement {
  static get properties() {
    return {
      _components: { type: Array, state: true },
      _activeId: { type: String, state: true },
      _loadedSections: { type: Object, state: true }
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
      
      .component-section {
        display: none;
        padding-bottom: 30px;
      }
      
      .component-section.active {
        display: block;
      }
      
      .loading {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 200px;
        font-size: 1.2rem;
        color: #6c757d;
      }
      
      .loading i {
        margin-right: 10px;
        animation: spin 1s infinite linear;
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      .error {
        padding: 20px;
        background-color: #f8d7da;
        color: #721c24;
        border-radius: 4px;
        margin-bottom: 20px;
      }
    `;
  }

  constructor() {
    super();
    this._components = [];
    this._activeId = '';
    this._loadedSections = {};
    
    // Listen for navigation events
    document.addEventListener('kitchensink-navigate', (e) => {
      this._activeId = e.detail.targetId;
      this.requestUpdate();
      
      // Load content if not already loaded
      if (!this._loadedSections[this._activeId]) {
        this._loadComponentContent(this._activeId);
      }
    });
  }

  async connectedCallback() {
    super.connectedCallback();
    
    // Load components
    this._components = await getAllComponents();
  }
  
  async _loadComponentContent(componentId) {
    // Mark as loading
    this._loadedSections[componentId] = 'loading';
    this.requestUpdate();
    
    try {
      // Fetch the component content
      const response = await fetch(`/kitchensink/partials/${componentId}.html`);
      if (!response.ok) {
        throw new Error(`Failed to load ${componentId} component`);
      }
      
      const htmlContent = await response.text();
      
      // Mark as loaded with content
      this._loadedSections[componentId] = htmlContent;
      this.requestUpdate();
      
      // Initialize component-specific functionality
      setTimeout(() => {
        this._initializeComponentListeners(componentId);
      }, 100);
    } catch (error) {
      console.error(error);
      this._loadedSections[componentId] = `error:${error.message}`;
      this.requestUpdate();
    }
  }
  
  _initializeComponentListeners(componentId) {
    // Enhance code blocks for all components
    enhanceCodeBlocks();
    
    // This would be called after the component content is loaded and rendered
    if (componentId === 'dialog') {
      // Initialize dialog event listeners
      initializeDialogListeners();
    } else if (componentId === 'input') {
      // Initialize input event listeners
      initializeInputListeners();
    } else if (componentId === 'notification') {
      // Initialize notification event listeners
      initializeNotificationListeners();
    } else if (componentId === 'checkbox') {
      // Initialize checkbox event listeners
      initializeCheckboxListeners();
    }
  }
  
  createRenderRoot() {
    // Use light DOM instead of shadow DOM to allow proper styling of content
    return this;
  }
  
  _renderSectionContent(id) {
    if (!this._loadedSections[id]) {
      return html`
        <div class="loading">
          <i class="fa fa-spinner"></i> Loading ${id} component...
        </div>
      `;
    } else if (this._loadedSections[id] === 'loading') {
      return html`
        <div class="loading">
          <i class="fa fa-spinner"></i> Loading ${id} component...
        </div>
      `;
    } else if (this._loadedSections[id].startsWith('error:')) {
      const errorMessage = this._loadedSections[id].substring(6);
      return html`
        <div class="error">
          <i class="fa fa-exclamation-triangle"></i> Failed to load ${id} component: ${errorMessage}
        </div>
      `;
    } else {
      // Use unsafeHTML to render the loaded HTML content
      return html`${unsafeHTML(this._loadedSections[id])}`;
    }
  }

  render() {
    return html`
      <!-- Home Section -->
      <section id="home" class="component-section ${this._activeId === 'home' ? 'active' : ''}">
        ${this._renderSectionContent('home')}
      </section>

      ${this._components.map(component => html`
        <!-- ${component.displayName} Section -->
        <section id="${component.name}" class="component-section ${this._activeId === component.name ? 'active' : ''}">
          ${this._renderSectionContent(component.name)}
        </section>
      `)}
    `;
  }
}

customElements.define('kitchensink-components-sections', KitchensinkComponentsSections); 