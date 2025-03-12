import { html, css } from 'lit';
import { DotboxBaseComponent } from '../base/base-component.js';

/**
 * @element dotbox-input
 * 
 * @prop {String} label - Input label text
 * @prop {String} labelPosition - Position of the label (before, above). Defaults to "above".
 * @prop {Boolean} disabled - Whether the input is disabled
 * @prop {Boolean} multiline - Whether the input should be a textarea
 * @prop {String} type - Input type (text, number, password, email, tel, url, search, date). Defaults to "text".
 * @prop {String} icon - FontAwesome icon name (e.g., 'fa-user', 'fa-key')
 * @prop {String} iconPosition - Position of the icon (before, after). Defaults to "before".
 * @prop {String} placeholder - Placeholder text
 * @prop {String} value - Input value
 * @prop {Boolean} required - Whether the input is required
 * @prop {String} pattern - Validation pattern (regex)
 * @prop {String} errorMessage - Custom error message for validation
 * @prop {Number} rows - Number of rows for textarea (only applies when multiline is true)
 * @prop {Number} minLength - Minimum length of input
 * @prop {Number} maxLength - Maximum length of input
 * 
 * @csspart container - The container element
 * @csspart label - The label element
 * @csspart input-wrapper - The wrapper around the input
 * @csspart input - The input element
 * @csspart icon - The icon element
 * @csspart error - The error message element
 * 
 * @fires input - Dispatched when the input value changes
 * @fires change - Dispatched when the input loses focus and the value has changed
 * @fires focus - Dispatched when the input gains focus
 * @fires blur - Dispatched when the input loses focus
 */
export class DotboxInput extends DotboxBaseComponent {
  static get properties() {
    return {
      label: { type: String },
      labelPosition: { type: String },
      disabled: { type: Boolean },
      multiline: { type: Boolean },
      type: { type: String },
      icon: { type: String },
      iconPosition: { type: String },
      placeholder: { type: String },
      value: { type: String },
      required: { type: Boolean },
      pattern: { type: String },
      errorMessage: { type: String },
      rows: { type: Number },
      minLength: { type: Number },
      maxLength: { type: Number },
      _showPassword: { type: Boolean, state: true },
      _hasError: { type: Boolean, state: true },
      _touched: { type: Boolean, state: true }
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }
        
        .input-container {
          margin-bottom: 1rem;
        }
        
        .input-container.label-before {
          display: flex;
          align-items: center;
        }
        
        .input-container.label-before label {
          margin-right: 0.5rem;
          min-width: 120px;
        }
        
        .input-container.label-above label {
          display: block;
          margin-bottom: 0.25rem;
        }
        
        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
        }
        
        .icon-before {
          position: absolute;
          left: 10px;
          color: #6c757d;
        }
        
        .icon-after {
          position: absolute;
          right: 10px;
          color: #6c757d;
        }
        
        .has-icon-before input,
        .has-icon-before textarea {
          padding-left: 35px;
        }
        
        .has-icon-after input,
        .has-icon-after textarea {
          padding-right: 35px;
        }
        
        .toggle-password {
          position: absolute;
          right: 10px;
          background: none;
          border: none;
          cursor: pointer;
          color: #6c757d;
          padding: 0;
          font-size: 14px;
        }
        
        .error-message {
          color: #dc3545;
          font-size: 0.875rem;
          margin-top: 0.25rem;
          display: none;
        }
        
        .error-message.visible {
          display: block;
        }
      `
    ];
  }

  constructor() {
    super();
    this.label = '';
    this.labelPosition = 'above';
    this.disabled = false;
    this.multiline = false;
    this.type = 'text';
    this.icon = '';
    this.iconPosition = 'before';
    this.placeholder = '';
    this.value = '';
    this.required = false;
    this.pattern = '';
    this.errorMessage = '';
    this.rows = 3;
    this.minLength = null;
    this.maxLength = null;
    this._showPassword = false;
    this._hasError = false;
    this._touched = false;
  }

  connectedCallback() {
    super.connectedCallback();
    const cssPath = new URL('./input.css', import.meta.url).href;
    console.log('Loading input CSS from:', cssPath);
    this.loadComponentStyles(cssPath);
    
    // Inject FontAwesome styles directly into shadow DOM
    this._injectFontAwesomeStyles();
  }

  /**
   * Inject FontAwesome styles directly into shadow DOM
   * This ensures icons are properly displayed
   */
  _injectFontAwesomeStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .fa {
        display: inline-block;
        font: normal normal normal 14px/1 FontAwesome;
        font-size: inherit;
        text-rendering: auto;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
      .fa-user:before { content: "\\f007"; }
      .fa-lock:before { content: "\\f023"; }
      .fa-eye:before { content: "\\f06e"; }
      .fa-eye-slash:before { content: "\\f070"; }
      .fa-envelope:before { content: "\\f0e0"; }
      .fa-phone:before { content: "\\f095"; }
      .fa-search:before { content: "\\f002"; }
      .fa-calendar:before { content: "\\f073"; }
      .fa-link:before { content: "\\f0c1"; }
    `;
    this.shadowRoot.appendChild(style);
  }

  render() {
    const containerClasses = `input-container label-${this.labelPosition} ${this._hasError ? 'has-error' : ''}`;
    const wrapperClasses = `input-wrapper ${this.icon ? `has-icon-${this.iconPosition}` : ''}`;
    const effectiveType = this.type === 'password' && this._showPassword ? 'text' : this.type;
    
    return html`
      <div class="${containerClasses}" part="container">
        ${this.label ? html`<label part="label">${this.label}${this.required ? ' *' : ''}</label>` : ''}
        
        <div class="${wrapperClasses}" part="input-wrapper">
          ${this.icon && this.iconPosition === 'before' ? 
            html`<i class="fa ${this.icon} icon-before" part="icon"></i>` : ''}
          
          ${this.multiline ? 
            html`<textarea
              part="input"
              .value="${this.value}"
              ?disabled="${this.disabled}"
              placeholder="${this.placeholder}"
              ?required="${this.required}"
              rows="${this.rows}"
              minlength="${this.minLength !== null ? this.minLength : ''}"
              maxlength="${this.maxLength !== null ? this.maxLength : ''}"
              @input="${this._handleInput}"
              @change="${this._handleChange}"
              @focus="${this._handleFocus}"
              @blur="${this._handleBlur}"
            ></textarea>` : 
            html`<input
              part="input"
              type="${effectiveType}"
              .value="${this.value}"
              ?disabled="${this.disabled}"
              placeholder="${this.placeholder}"
              ?required="${this.required}"
              pattern="${this.pattern}"
              minlength="${this.minLength !== null ? this.minLength : ''}"
              maxlength="${this.maxLength !== null ? this.maxLength : ''}"
              @input="${this._handleInput}"
              @change="${this._handleChange}"
              @focus="${this._handleFocus}"
              @blur="${this._handleBlur}"
            />`
          }
          
          ${this.icon && this.iconPosition === 'after' ? 
            html`<i class="fa ${this.icon} icon-after" part="icon"></i>` : ''}
          
          ${this.type === 'password' ? 
            html`<button type="button" class="toggle-password" @click="${this._togglePasswordVisibility}">
              <i class="fa ${this._showPassword ? 'fa-eye-slash' : 'fa-eye'}"></i>
            </button>` : ''
          }
        </div>
        
        <div class="error-message ${this._hasError && this._touched ? 'visible' : ''}" part="error">
          ${this._hasError && this._touched ? (this.errorMessage || this._getDefaultErrorMessage()) : ''}
        </div>
      </div>
    `;
  }

  _handleInput(e) {
    this.value = e.target.value;
    
    // Only validate if the field has been touched
    if (this._touched) {
      this._validate();
    }
    
    this.dispatchEvent(new CustomEvent('input', {
      detail: { value: this.value },
      bubbles: true,
      composed: true
    }));
  }

  _handleChange(e) {
    this.dispatchEvent(new CustomEvent('change', {
      detail: { value: this.value },
      bubbles: true,
      composed: true
    }));
  }

  _handleFocus(e) {
    this.dispatchEvent(new CustomEvent('focus', {
      bubbles: true,
      composed: true
    }));
  }

  _handleBlur(e) {
    // Mark as touched for validation
    this._touched = true;
    
    // Only validate if there are validation requirements
    if (this.required || this.pattern || this.minLength || this.maxLength || 
        this.type === 'email' || this.type === 'number' || 
        this.type === 'url' || this.type === 'tel') {
      this._validate();
    }
    
    this.dispatchEvent(new CustomEvent('blur', {
      bubbles: true,
      composed: true
    }));
  }

  _togglePasswordVisibility() {
    this._showPassword = !this._showPassword;
  }

  _validate() {
    // Don't validate if not touched yet
    if (!this._touched) {
      this._hasError = false;
      return;
    }

    // If not required and empty, it's valid
    if (!this.required && !this.value) {
      this._hasError = false;
      return;
    }

    // If required and empty, it's invalid
    if (this.required && !this.value) {
      this._hasError = true;
      return;
    }

    // If we have a value, check other validations
    const input = this.shadowRoot.querySelector('input, textarea');
    if (!input) return;

    // Custom validation logic
    let isValid = true;

    // Check min length
    if (this.minLength && this.value.length < this.minLength) {
      isValid = false;
    }

    // Check max length
    if (this.maxLength && this.value.length > this.maxLength) {
      isValid = false;
    }

    // Check pattern
    if (this.pattern && !new RegExp(this.pattern).test(this.value)) {
      isValid = false;
    }

    // Check email format
    if (this.type === 'email' && this.value) {
      // Simple email regex that matches most valid emails
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.value)) {
        isValid = false;
      }
    }

    // Check number format
    if (this.type === 'number' && this.value) {
      if (isNaN(Number(this.value))) {
        isValid = false;
      }
    }

    this._hasError = !isValid;
  }

  _getDefaultErrorMessage() {
    if (!this.value && this.required) {
      return 'This field is required';
    }
    
    if (this.minLength && this.value.length < this.minLength) {
      return `Minimum length is ${this.minLength} characters`;
    }
    
    if (this.maxLength && this.value.length > this.maxLength) {
      return `Maximum length is ${this.maxLength} characters`;
    }
    
    if (this.pattern && !new RegExp(this.pattern).test(this.value)) {
      return 'Please match the requested format';
    }
    
    if (this.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.value)) {
      return 'Please enter a valid email address';
    }
    
    if (this.type === 'number' && isNaN(Number(this.value))) {
      return 'Please enter a valid number';
    }
    
    return 'Invalid input';
  }

  /**
   * Checks if the input is valid
   * @returns {Boolean} Whether the input is valid
   */
  checkValidity() {
    const input = this.shadowRoot.querySelector('input, textarea');
    return input ? input.checkValidity() : true;
  }

  /**
   * Focuses the input element
   */
  focus() {
    const input = this.shadowRoot.querySelector('input, textarea');
    if (input) {
      input.focus();
    }
  }

  /**
   * Resets the input to its initial value
   */
  reset() {
    this.value = '';
    this._hasError = false;
    this._touched = false;
  }

  /**
   * Manually set the field as valid
   */
  setValid() {
    this._hasError = false;
    this._touched = true;
  }

  /**
   * Manually set the field as invalid with a custom error message
   * @param {String} message - Custom error message
   */
  setInvalid(message = '') {
    this._hasError = true;
    this._touched = true;
    if (message) {
      this.errorMessage = message;
    }
  }

  /**
   * Manually trigger validation
   * @returns {Boolean} Whether the input is valid
   */
  validate() {
    this._touched = true;
    this._validate();
    return !this._hasError;
  }
}

customElements.define('dotbox-input', DotboxInput);
console.log('DotboxInput component defined as <dotbox-input>'); 