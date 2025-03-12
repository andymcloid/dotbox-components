import { LitElement, css } from 'lit';

/**
 * Base component class that all Dotbox components should extend from.
 * Provides common functionality and styles.
 * 
 * @abstract
 */
export class DotboxBaseComponent extends LitElement {
  // Static flag to track if FontAwesome has been loaded
  static fontAwesomeLoaded = false;
  
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
   * Load external CSS file into the shadow DOM
   * @param {string} cssPath - Path to the CSS file (should be absolute URL)
   */
  loadComponentStyles(cssPath) {
    try {
      console.log(`Creating link element for CSS: ${cssPath}`);
      const linkElem = document.createElement('link');
      linkElem.rel = 'stylesheet';
      linkElem.href = cssPath;
      
      // Add an event listener to check if the CSS loaded successfully
      linkElem.addEventListener('load', () => {
        console.log(`CSS loaded successfully: ${cssPath}`);
      });
      
      linkElem.addEventListener('error', (error) => {
        console.error(`Failed to load CSS: ${cssPath}`, error);
      });
      
      console.log(`Appending link element to shadow root`);
      this.shadowRoot.appendChild(linkElem);
    } catch (error) {
      console.error(`Error in loadComponentStyles: ${cssPath}`, error);
    }
  }

  /**
   * Load FontAwesome directly into the shadow DOM
   * This ensures that FontAwesome icons are available within the component
   */
  loadFontAwesome() {
    try {
      // Check if FontAwesome is already loaded in this shadow DOM
      if (this.shadowRoot.querySelector('link[href*="font-awesome"]')) {
        console.log('FontAwesome already loaded in this shadow DOM');
        return;
      }
      
      // Check if we've already loaded FontAwesome in another component
      if (DotboxBaseComponent.fontAwesomeLoaded) {
        console.log('FontAwesome already loaded globally, skipping');
        return;
      }
      
      console.log('Loading FontAwesome directly into shadow DOM');
      const linkElem = document.createElement('link');
      linkElem.rel = 'stylesheet';
      linkElem.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css';
      
      linkElem.addEventListener('load', () => {
        console.log('FontAwesome loaded successfully in shadow DOM');
        DotboxBaseComponent.fontAwesomeLoaded = true;
        
        // Add a test element to verify FontAwesome is working
        const testElem = document.createElement('span');
        testElem.style.visibility = 'hidden';
        testElem.style.position = 'absolute';
        testElem.className = 'fa fa-check';
        this.shadowRoot.appendChild(testElem);
        
        // Check if FontAwesome is applied
        const computedStyle = window.getComputedStyle(testElem);
        const fontFamily = computedStyle.getPropertyValue('font-family');
        console.log('FontAwesome test element font-family:', fontFamily);
        
        // Clean up
        this.shadowRoot.removeChild(testElem);
      });
      
      linkElem.addEventListener('error', (error) => {
        console.error('Failed to load FontAwesome in shadow DOM', error);
      });
      
      this.shadowRoot.appendChild(linkElem);
    } catch (error) {
      console.error('Error loading FontAwesome in shadow DOM:', error);
    }
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
    // Load FontAwesome by default for all components
    this.loadFontAwesome();
    
    // Inject FontAwesome styles directly into shadow DOM
    this.injectFontAwesomeStyles();
    
    // Enable transitions after a short delay
    setTimeout(() => {
      this._noTransitions = false;
    }, 100);
  }
} 