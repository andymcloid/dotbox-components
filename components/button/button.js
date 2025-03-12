import { html, css } from 'lit';
import { DotboxBaseComponent } from '../base/base-component.js';

/**
 * @element dotbox-button
 * 
 * @prop {String} variant - Button variant (primary, success, danger, info, default)
 * @prop {String} size - Button size (small, default, large)
 * @prop {String} icon - FontAwesome icon name (e.g., 'fa-arrow-right')
 * @prop {String} iconPosition - Position of the icon (before, after)
 * @prop {Boolean} animated - Whether the icon should be animated
 * @prop {String} animationType - Type of animation (spin, pulse)
 * @prop {Boolean} disabled - Whether the button is disabled
 * @prop {String} href - If provided, renders as an anchor tag
 * 
 * @csspart button - The button element
 * @csspart icon - The icon element
 * 
 * @fires click - Dispatched when the button is clicked
 */
export class DotboxButton extends DotboxBaseComponent {
  static get properties() {
    return {
      variant: { type: String },
      size: { type: String },
      icon: { type: String },
      iconPosition: { type: String },
      animated: { type: Boolean },
      animationType: { type: String },
      disabled: { type: Boolean },
      href: { type: String }
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: inline-block;
        }
      `
    ];
  }

  constructor() {
    super();
    this.variant = 'primary';
    this.size = '';
    this.icon = '';
    this.iconPosition = 'after';
    this.animated = false;
    this.animationType = 'spin';
    this.disabled = false;
    this.href = '';
  }

  connectedCallback() {
    super.connectedCallback();
    
    // Load component CSS
    const cssPath = new URL('./button.css', import.meta.url).href;
    console.log('Loading button CSS from:', cssPath);
    this.loadComponentStyles(cssPath);
    
    // Debug FontAwesome availability
    this._checkFontAwesome();
  }

  _checkFontAwesome() {
    // Check if FontAwesome is loaded
    const fontAwesomeLink = document.querySelector('link[href*="font-awesome"]');
    console.log('FontAwesome link found in document:', fontAwesomeLink);
    
    const shadowFontAwesomeLink = this.shadowRoot.querySelector('link[href*="font-awesome"]');
    console.log('FontAwesome link found in shadow DOM:', shadowFontAwesomeLink);
    
    // Create a test element to check if FontAwesome is working
    const testElement = document.createElement('i');
    testElement.className = 'fa fa-check';
    testElement.style.visibility = 'hidden';
    document.body.appendChild(testElement);
    
    // Get computed style
    const computedStyle = window.getComputedStyle(testElement);
    const fontFamily = computedStyle.getPropertyValue('font-family');
    console.log('FontAwesome test element font-family:', fontFamily);
    
    // Check if FontAwesome is in the font family
    const hasFontAwesome = fontFamily.includes('FontAwesome');
    console.log('FontAwesome is available:', hasFontAwesome);
    
    // Clean up
    document.body.removeChild(testElement);
  }

  render() {
    const buttonClasses = this._getButtonClasses();
    const content = html`
      <slot></slot>
    `;

    if (this.href && !this.disabled) {
      return html`
        <a href="${this.href}" class="${buttonClasses}" part="button">
          ${content}
        </a>
      `;
    } else {
      return html`
        <button class="${buttonClasses}" ?disabled=${this.disabled} part="button">
          ${content}
        </button>
      `;
    }
  }

  _getButtonClasses() {
    const classes = ['btn', 'dotbox-interactive'];
    
    // Add variant
    if (this.variant) {
      classes.push(`btn-${this.variant}`);
    }
    
    // Add size
    if (this.size === 'small') {
      classes.push('btn-sm');
    } else if (this.size === 'large') {
      classes.push('btn-lg');
    }
    
    // Add icon position
    if (this.icon) {
      console.log(`Adding icon: ${this.icon} at position: ${this.iconPosition}`);
      classes.push(this.iconPosition === 'before' ? 'ffab-before' : 'ffab-after');
      classes.push(this.icon);
      
      // Add animation
      if (this.animated) {
        classes.push(this.animationType === 'pulse' ? 'ffab-pulse' : 'ffab-spin');
      }
    }
    
    console.log('Button classes:', classes.join(' '));
    return classes.join(' ');
  }
}

customElements.define('dotbox-button', DotboxButton); 