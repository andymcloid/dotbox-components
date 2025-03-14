import { html, css } from 'lit';
import { DotboxBaseComponent } from '../base/base-component.js';

/**
 * @element dotbox-checkbox
 * 
 * @prop {String} type - Type of input (checkbox, radio, toggle)
 * @prop {String} name - Name attribute for the input
 * @prop {String} value - Value attribute for the input
 * @prop {Boolean} checked - Whether the input is checked
 * @prop {Boolean} disabled - Whether the input is disabled
 * @prop {String} variant - Visual variant (primary, success, danger, info, default)
 * @prop {String} size - Size of the input (small, default, large)
 * @prop {String} label - Label text for the input
 * @prop {String} labelPosition - Position of the label (left, right)
 * @prop {Boolean} required - Whether the input is required
 * 
 * @csspart container - The container element
 * @csspart input - The input element
 * @csspart label - The label element
 * @csspart toggle - The toggle switch element (only for toggle type)
 * @csspart slider - The slider element (only for toggle type)
 * 
 * @fires change - Dispatched when the input value changes
 * @fires input - Dispatched when the input value is being changed
 */
export class DotboxCheckbox extends DotboxBaseComponent {
  static get properties() {
    return {
      type: { type: String, reflect: true },
      name: { type: String, reflect: true },
      value: { type: String, reflect: true },
      checked: { type: Boolean, reflect: true },
      disabled: { type: Boolean, reflect: true },
      variant: { type: String, reflect: true },
      size: { type: String, reflect: true },
      label: { type: String },
      labelPosition: { type: String, reflect: true },
      required: { type: Boolean, reflect: true }
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
    this.type = 'checkbox';
    this.name = '';
    this.value = '';
    this.checked = false;
    this.disabled = false;
    this.variant = 'primary';
    this.size = '';
    this.label = '';
    this.labelPosition = 'right';
    this.required = false;
  }

  connectedCallback() {
    super.connectedCallback();
    
    // Load component-specific CSS
    this.loadComponentStyles('checkbox');
    
    // If this is a radio button and it's checked, uncheck other radio buttons in the same group
    if (this.type === 'radio' && this.checked && this.name) {
      this._uncheckOtherRadioButtons();
    }
  }

  updated(changedProperties) {
    super.updated && super.updated(changedProperties);
    
    // If type changed to radio and it's checked, uncheck other radio buttons in the same group
    if (changedProperties.has('type') && this.type === 'radio' && this.checked && this.name) {
      this._uncheckOtherRadioButtons();
    }
    
    // If name changed and it's a radio button and it's checked, uncheck other radio buttons in the same group
    if (changedProperties.has('name') && this.type === 'radio' && this.checked && this.name) {
      this._uncheckOtherRadioButtons();
    }
    
    // If checked changed to true for a radio button, uncheck other radio buttons in the same group
    if (changedProperties.has('checked') && this.checked && this.type === 'radio' && this.name) {
      this._uncheckOtherRadioButtons();
    }
  }

  render() {
    const containerClasses = this._getContainerClasses();
    const inputId = `dotbox-${this.type}-${Math.random().toString(36).substring(2, 11)}`;
    
    // Create the input element based on type
    let inputElement;
    if (this.type === 'toggle') {
      inputElement = this._renderToggle(inputId);
    } else {
      inputElement = this._renderCheckboxOrRadio(inputId);
    }
    
    // Create the label element
    const labelElement = this.label ? html`
      <label for="${inputId}" part="label" class="form-check-label">
        ${this.label}
      </label>
    ` : '';
    
    // Arrange elements based on label position
    return html`
      <div class="${containerClasses}" part="container">
        ${this.labelPosition === 'left' ? labelElement : ''}
        ${inputElement}
        ${this.labelPosition === 'right' ? labelElement : ''}
      </div>
    `;
  }

  _renderCheckboxOrRadio(inputId) {
    return html`
      <input 
        type="${this.type}" 
        id="${inputId}" 
        name="${this.name}" 
        value="${this.value}" 
        ?checked="${this.checked}" 
        ?disabled="${this.disabled}" 
        ?required="${this.required}" 
        @change="${this._handleChange}" 
        @input="${this._handleInput}" 
        part="input" 
        class="form-check-input"
      />
    `;
  }

  _renderToggle(inputId) {
    return html`
      <div class="toggle-switch" part="toggle">
        <input 
          type="checkbox" 
          id="${inputId}" 
          name="${this.name}" 
          value="${this.value}" 
          ?checked="${this.checked}" 
          ?disabled="${this.disabled}" 
          ?required="${this.required}" 
          @change="${this._handleChange}" 
          @input="${this._handleInput}" 
          part="input" 
          class="toggle-input"
        />
        <span class="toggle-slider" part="slider" @click="${this._handleSliderClick}"></span>
      </div>
    `;
  }

  _handleSliderClick(e) {
    // Don't handle click if disabled
    if (this.disabled) {
      return;
    }
    
    // Find the input element (previous sibling of the slider)
    const input = e.target.previousElementSibling;
    if (input) {
      // Toggle the checked state
      input.checked = !input.checked;
      
      // Dispatch a change event
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  _getContainerClasses() {
    const classes = ['form-check', 'dotbox-interactive'];
    
    // Add no-transitions class if needed
    if (this._noTransitions) {
      classes.push('no-transitions');
    }
    
    // Add type-specific classes
    if (this.type === 'toggle') {
      classes.push('toggle-container');
    } else {
      classes.push(`${this.type}-container`);
    }
    
    // Add variant
    if (this.variant) {
      classes.push(`${this.type}-${this.variant}`);
    }
    
    // Add size
    if (this.size === 'small') {
      classes.push(`${this.type}-sm`);
    } else if (this.size === 'large') {
      classes.push(`${this.type}-lg`);
    }
    
    // Add label position
    if (this.label) {
      classes.push(`label-${this.labelPosition}`);
    }
    
    // Add inline class if needed
    if (this.labelPosition === 'right') {
      classes.push('form-check-inline');
    }
    
    return classes.join(' ');
  }

  _handleChange(e) {
    // Update the checked state
    this.checked = e.target.checked;
    
    // For radio buttons, uncheck other radio buttons in the same group
    if (this.type === 'radio' && this.checked && this.name) {
      this._uncheckOtherRadioButtons();
    }
    
    // Dispatch a change event
    this.dispatchEvent(new CustomEvent('change', {
      detail: {
        checked: this.checked,
        value: this.value
      },
      bubbles: true,
      composed: true
    }));
  }

  _handleInput(e) {
    this.dispatchEvent(new CustomEvent('input', {
      detail: {
        checked: e.target.checked,
        value: this.value
      },
      bubbles: true,
      composed: true
    }));
  }
  
  /**
   * Uncheck all other radio buttons with the same name
   * @private
   */
  _uncheckOtherRadioButtons() {
    if (!this.name || this.type !== 'radio') return;
    
    // Find all radio buttons with the same name
    const radioButtons = document.querySelectorAll(`dotbox-checkbox[type="radio"][name="${this.name}"]`);
    
    // Uncheck all except this one
    radioButtons.forEach(radio => {
      if (radio !== this && radio.checked) {
        // Set checked to false directly on the element
        radio.checked = false;
        
        // Also update the internal input element if it exists
        const inputElement = radio.shadowRoot?.querySelector('input[type="radio"]');
        if (inputElement) {
          inputElement.checked = false;
        }
      }
    });
  }
}

customElements.define('dotbox-checkbox', DotboxCheckbox); 