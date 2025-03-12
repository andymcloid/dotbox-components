import { LitElement, css } from 'lit';

/**
 * Base component class that all Dotbox components should extend from.
 * Provides common functionality and styles.
 * 
 * @abstract
 */
export class DotboxBaseComponent extends LitElement {
  // Static flag to track if FontAwesome styles are injected
  static fontAwesomeStylesInjected = false;
  
  static get properties() {
    return {
      _noTransitions: { type: Boolean, state: true }
    };
  }
  
  static get styles() {
    return css`
      :host {
        display: inline-block;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      }
    `;
  }

  constructor() {
    super();
    this._noTransitions = true; // Start with transitions disabled
  }

  /**
   * Load component-specific CSS into the shadow DOM
   * @param {string} componentName - The name of the component (e.g., 'button', 'card')
   */
  loadComponentStyles(componentName) {
    // Check if styles are already loaded
    if (this.shadowRoot.querySelector(`link[data-component="${componentName}"]`)) {
      return;
    }
    
    // Create a link element for the component's CSS
    const linkElem = document.createElement('link');
    linkElem.rel = 'stylesheet';
    linkElem.href = `/components/${componentName}/${componentName}.css`;
    linkElem.setAttribute('data-component', componentName);
    
    // Add event listeners for load/error
    linkElem.addEventListener('load', () => {
      console.log(`Component CSS loaded: ${componentName}`);
    });
    
    linkElem.addEventListener('error', (error) => {
      console.error(`Failed to load component CSS: ${componentName}`, error);
    });
    
    // Append to shadow root
    this.shadowRoot.appendChild(linkElem);
  }

  /**
   * Inject FontAwesome styles directly into shadow DOM
   * This ensures icons are properly displayed in all components
   */
  injectFontAwesomeStyles() {
    // Check if styles are already injected
    if (this.shadowRoot.querySelector('style[data-fa-styles]')) {
      return;
    }
    
    const style = document.createElement('style');
    style.setAttribute('data-fa-styles', 'true');
    style.textContent = `
      .fa {
        display: inline-block;
        font: normal normal normal 14px/1 FontAwesome;
        font-size: inherit;
        text-rendering: auto;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
      
      /* Common icons used across components */
      .fa-times:before { content: "\\f00d"; }
      .fa-check:before { content: "\\f00c"; }
      .fa-check-circle:before { content: "\\f058"; }
      .fa-info-circle:before { content: "\\f05a"; }
      .fa-exclamation-triangle:before { content: "\\f071"; }
      .fa-exclamation-circle:before { content: "\\f06a"; }
      .fa-star:before { content: "\\f005"; }
      .fa-bell:before { content: "\\f0f3"; }
      
      /* Input specific icons */
      .fa-user:before { content: "\\f007"; }
      .fa-lock:before { content: "\\f023"; }
      .fa-eye:before { content: "\\f06e"; }
      .fa-eye-slash:before { content: "\\f070"; }
      .fa-envelope:before { content: "\\f0e0"; }
      .fa-phone:before { content: "\\f095"; }
      .fa-search:before { content: "\\f002"; }
      .fa-calendar:before { content: "\\f073"; }
      .fa-link:before { content: "\\f0c1"; }
      
      /* Button specific icons */
      .fa-arrow-right:before { content: "\\f061"; }
      .fa-arrow-left:before { content: "\\f060"; }
      .fa-plus:before { content: "\\f067"; }
      .fa-minus:before { content: "\\f068"; }
      .fa-trash:before { content: "\\f1f8"; }
      .fa-edit:before { content: "\\f044"; }
      .fa-save:before { content: "\\f0c7"; }
    `;
    this.shadowRoot.appendChild(style);
  }

  connectedCallback() {
    super.connectedCallback();
    
    // Inject FontAwesome styles directly into shadow DOM
    this.injectFontAwesomeStyles();
    
    // Enable transitions after a short delay
    setTimeout(() => {
      this._noTransitions = false;
    }, 100);
  }
} 