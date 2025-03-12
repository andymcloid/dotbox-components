import { LitElement, css } from 'lit';

/**
 * Base component class that all Dotbox components should extend from.
 * Provides common functionality and styles.
 * 
 * @abstract
 */
export class DotboxBaseComponent extends LitElement {
  static get styles() {
    return css`
      :host {
        display: inline-block;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      }
    `;
  }

  /**
   * Load external CSS file into the shadow DOM
   * @param {string} cssPath - Path to the CSS file
   */
  loadComponentStyles(cssPath) {
    const linkElem = document.createElement('link');
    linkElem.rel = 'stylesheet';
    linkElem.href = new URL(cssPath, import.meta.url).href;
    this.shadowRoot.appendChild(linkElem);
  }

  /**
   * Load FontAwesome if it's not already loaded
   * This ensures FontAwesome is only loaded once regardless of how many components use it
   */
  static loadFontAwesome() {
    if (!document.querySelector('link[href*="font-awesome"]')) {
      const linkElem = document.createElement('link');
      linkElem.rel = 'stylesheet';
      linkElem.href = 'https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css';
      document.head.appendChild(linkElem);
    }
  }

  connectedCallback() {
    super.connectedCallback();
    // Load FontAwesome when any component is connected
    DotboxBaseComponent.loadFontAwesome();
  }
} 