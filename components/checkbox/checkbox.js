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
    
    // Bound methods
    this._handleRadioGroupChange = this._handleRadioGroupChange.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    
    // Load component-specific CSS
    this.loadComponentStyles('checkbox');
    
    // For radio buttons, add event listener to document for radio group changes
    if (this.type === 'radio' && this.name) {
      document.addEventListener('dotbox-radio-change', this._handleRadioGroupChange);
    }
    
    // If this is a radio button and it's checked, notify other radio buttons
    if (this.type === 'radio' && this.checked && this.name) {
      this._notifyRadioGroupChange();
    }
  }
  
  disconnectedCallback() {
    super.disconnectedCallback && super.disconnectedCallback();
    
    // Remove event listener when component is removed
    if (this.type === 'radio') {
      document.removeEventListener('dotbox-radio-change', this._handleRadioGroupChange);
    }
  }

  updated(changedProperties) {
    super.updated && super.updated(changedProperties);
    
    // If type changed to radio, add event listener
    if (changedProperties.has('type')) {
      if (this.type === 'radio') {
        document.addEventListener('dotbox-radio-change', this._handleRadioGroupChange);
        
        // If it's also checked, notify other radio buttons
        if (this.checked && this.name) {
          this._notifyRadioGroupChange();
        }
      } else if (changedProperties.get('type') === 'radio') {
        // If type changed from radio, remove event listener
        document.removeEventListener('dotbox-radio-change', this._handleRadioGroupChange);
      }
    }
    
    // If name changed and it's a radio button
    if (changedProperties.has('name') && this.type === 'radio') {
      // If it's checked, notify other radio buttons with the new name
      if (this.checked && this.name) {
        this._notifyRadioGroupChange();
      }
    }
    
    // If checked changed to true for a radio button, notify other radio buttons
    if (changedProperties.has('checked') && this.checked && this.type === 'radio' && this.name) {
      this._notifyRadioGroupChange();
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
    const wasChecked = this.checked;
    this.checked = e.target.checked;
    
    // For radio buttons, notify other radio buttons in the same group
    if (this.type === 'radio' && this.checked && !wasChecked && this.name) {
      this._notifyRadioGroupChange();
    }
    
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
   * Notify other radio buttons in the same group that this one is checked
   * @private
   */
  _notifyRadioGroupChange() {
    if (!this.name) return;
    
    // Create and dispatch a custom event
    const event = new CustomEvent('dotbox-radio-change', {
      bubbles: true,
      composed: true,
      detail: {
        name: this.name,
        value: this.value,
        source: this
      }
    });
    
    document.dispatchEvent(event);
  }
  
  /**
   * Handle radio group change events
   * @param {CustomEvent} e - The radio change event
   * @private
   */
  _handleRadioGroupChange(e) {
    // Only handle events for the same name
    if (e.detail.name !== this.name || e.detail.source === this) {
      return;
    }
    
    // If this is not the source of the event and has the same name, uncheck it
    if (this.checked) {
      this.checked = false;
      
      // Dispatch a change event
      this.dispatchEvent(new CustomEvent('change', {
        detail: {
          checked: false,
          value: this.value
        },
        bubbles: true,
        composed: true
      }));
    }
  }
}

customElements.define('dotbox-checkbox', DotboxCheckbox); 