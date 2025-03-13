import { html, css } from 'lit';
import { DotboxBaseComponent } from '../base/base-component.js';

/**
 * @element dotbox-dropdown
 * 
 * @prop {String} label - Dropdown label text
 * @prop {String} labelPosition - Position of the label (before, above). Defaults to "above".
 * @prop {Boolean} disabled - Whether the dropdown is disabled
 * @prop {String} placeholder - Placeholder text
 * @prop {Array} options - Array of options to display in the dropdown
 * @prop {String|Array} value - Selected value(s)
 * @prop {Boolean} required - Whether selection is required
 * @prop {Boolean} multiple - Whether multiple selection is allowed
 * @prop {Boolean} searchable - Whether the dropdown allows typing to search/filter options
 * @prop {Boolean} creatable - Whether new options can be created by typing
 * @prop {Boolean} useCheckboxes - Whether to show checkboxes for multiple selection
 * @prop {Boolean} useTags - Whether to show selected items as tags/chips
 * @prop {String} errorMessage - Custom error message for validation
 * 
 * @csspart container - The container element
 * @csspart label - The label element
 * @csspart dropdown-wrapper - The wrapper around the dropdown
 * @csspart dropdown-input - The input element for the dropdown
 * @csspart dropdown-menu - The dropdown menu
 * @csspart dropdown-item - The dropdown item
 * @csspart dropdown-checkbox - The checkbox for multiple selection
 * @csspart dropdown-tag - The tag/chip for selected items
 * @csspart error - The error message element
 * 
 * @fires change - Dispatched when the selection changes
 * @fires input - Dispatched when the input value changes (for searchable dropdowns)
 * @fires focus - Dispatched when the dropdown gains focus
 * @fires blur - Dispatched when the dropdown loses focus
 * @fires tag-removed - Dispatched when a tag is removed
 */
export class DotboxDropdown extends DotboxBaseComponent {
  static get properties() {
    return {
      label: { type: String },
      labelPosition: { type: String },
      disabled: { type: Boolean },
      placeholder: { type: String },
      options: { type: Array },
      value: { type: String | Array },
      required: { type: Boolean },
      multiple: { type: Boolean },
      searchable: { type: Boolean },
      creatable: { type: Boolean },
      useCheckboxes: { type: Boolean },
      useTags: { type: Boolean },
      errorMessage: { type: String },
      _isOpen: { type: Boolean, state: true },
      _searchText: { type: String, state: true },
      _filteredOptions: { type: Array, state: true },
      _hasError: { type: Boolean, state: true },
      _errorText: { type: String, state: true }
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        /* Dropdown-specific styles will be loaded from dropdown.css */
      `
    ];
  }

  constructor() {
    super();
    this.label = '';
    this.labelPosition = 'above';
    this.disabled = false;
    this.placeholder = 'Select an option';
    this.options = [];
    this.value = '';
    this.required = false;
    this.multiple = false;
    this.searchable = false;
    this.creatable = false;
    this.useCheckboxes = false;
    this.useTags = false;
    this.errorMessage = '';
    this._isOpen = false;
    this._searchText = '';
    this._filteredOptions = [];
    this._hasError = false;
    this._errorText = '';
    
    // Bind methods
    this._handleClickOutside = this._handleClickOutside.bind(this);
    this._handleKeyDown = this._handleKeyDown.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadComponentStyles('dropdown');
    
    // Add event listeners for click outside and keyboard navigation
    document.addEventListener('click', this._handleClickOutside);
    document.addEventListener('keydown', this._handleKeyDown);
    
    // Initialize filtered options
    this._filteredOptions = [...this.options];
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    
    // Remove event listeners
    document.removeEventListener('click', this._handleClickOutside);
    document.removeEventListener('keydown', this._handleKeyDown);
  }

  updated(changedProperties) {
    if (changedProperties.has('options')) {
      this._filteredOptions = [...this.options];
    }
    
    if (changedProperties.has('value') && this.value !== undefined) {
      this.validate();
    }
  }

  render() {
    const containerClasses = {
      'dropdown-container': true,
      'has-error': this._hasError,
      'is-disabled': this.disabled,
      'label-before': this.labelPosition === 'before',
      'label-above': this.labelPosition === 'above' || !this.labelPosition,
      'no-transitions': this._noTransitions
    };

    const dropdownWrapperClasses = {
      'dropdown-wrapper': true,
      'is-open': this._isOpen,
      'is-multiple': this.multiple,
      'has-tags': this.useTags && this.multiple
    };

    return html`
      <div class=${this._classMap(containerClasses)} part="container">
        ${this.label ? html`<label part="label">${this.label}</label>` : ''}
        
        <div class=${this._classMap(dropdownWrapperClasses)} part="dropdown-wrapper">
          <div 
            class="dropdown-input-container" 
            @click=${this._toggleDropdown}
            ?disabled=${this.disabled}
          >
            ${this._renderSelectedValue()}
            <span class="dropdown-arrow">
              <i class="fa ${this._isOpen ? 'fa-chevron-up' : 'fa-chevron-down'}"></i>
            </span>
          </div>
          
          ${this._isOpen ? html`
            <div class="dropdown-menu" part="dropdown-menu">
              ${this.searchable ? html`
                <div class="dropdown-search">
                  <input
                    type="text"
                    placeholder="Search..."
                    .value=${this._searchText}
                    @input=${this._handleSearch}
                    @click=${(e) => e.stopPropagation()}
                    @keydown=${(e) => e.stopPropagation()}
                  >
                </div>
              ` : ''}
              
              <div class="dropdown-items">
                ${this._renderDropdownItems()}
              </div>
            </div>
          ` : ''}
        </div>
        
        ${this._hasError ? html`
          <div class="error-message visible" part="error">${this._errorText}</div>
        ` : ''}
      </div>
    `;
  }

  _renderSelectedValue() {
    if (this.multiple && this.useTags && Array.isArray(this.value) && this.value.length > 0) {
      return html`
        <div class="selected-tags" part="selected-tags">
          ${this.value.map(val => {
            const option = this.options.find(opt => opt.value === val || opt === val);
            const label = option ? (option.label || option) : val;
            
            return html`
              <span class="tag" part="dropdown-tag">
                ${label}
                <span class="tag-remove" @click=${(e) => this._removeTag(e, val)}>
                  <i class="fa fa-times"></i>
                </span>
              </span>
            `;
          })}
          ${this.searchable ? html`
            <input
              type="text"
              class="tag-input"
              placeholder=${this.value.length === 0 ? this.placeholder : ''}
              .value=${this._searchText}
              @input=${this._handleSearch}
              @focus=${this._handleFocus}
              @blur=${this._handleBlur}
              @click=${(e) => e.stopPropagation()}
            >
          ` : ''}
        </div>
      `;
    } else if (this.multiple && Array.isArray(this.value) && this.value.length > 0) {
      // For multiple selection without tags, show count or list
      const selectedCount = this.value.length;
      const selectedLabels = this.value.map(val => {
        const option = this.options.find(opt => opt.value === val || opt === val);
        return option ? (option.label || option) : val;
      }).join(', ');
      
      return html`
        <div class="selected-text" part="dropdown-input">
          ${selectedCount > 2 ? `${selectedCount} items selected` : selectedLabels}
        </div>
      `;
    } else if (!this.multiple && this.value) {
      // For single selection, show the selected value
      const selectedOption = this.options.find(opt => 
        opt.value === this.value || opt === this.value
      );
      const selectedLabel = selectedOption ? (selectedOption.label || selectedOption) : this.value;
      
      return html`
        <div class="selected-text" part="dropdown-input">
          ${selectedLabel}
        </div>
      `;
    } else {
      // No selection, show placeholder
      return html`
        <div class="placeholder" part="dropdown-input">
          ${this.placeholder}
        </div>
      `;
    }
  }

  _renderDropdownItems() {
    if (this._filteredOptions.length === 0) {
      if (this.creatable && this._searchText) {
        return html`
          <div 
            class="dropdown-item create-option" 
            @click=${() => this._createOption(this._searchText)}
            part="dropdown-item"
          >
            Create "${this._searchText}"
          </div>
        `;
      } else {
        return html`<div class="dropdown-item no-results">No options available</div>`;
      }
    }
    
    return this._filteredOptions.map(option => {
      const value = option.value !== undefined ? option.value : option;
      const label = option.label !== undefined ? option.label : option;
      const isSelected = this.multiple && Array.isArray(this.value) 
        ? this.value.includes(value)
        : this.value === value;
        
      const itemClasses = {
        'dropdown-item': true,
        'is-selected': isSelected
      };
      
      return html`
        <div 
          class=${this._classMap(itemClasses)} 
          @click=${(e) => this._selectOption(e, value)}
          part="dropdown-item"
        >
          ${this.multiple && this.useCheckboxes ? html`
            <span class="checkbox-wrapper" part="dropdown-checkbox">
              <input 
                type="checkbox" 
                ?checked=${isSelected}
                @click=${(e) => e.stopPropagation()}
                @change=${(e) => this._handleCheckboxChange(e, value)}
              >
            </span>
          ` : ''}
          ${label}
        </div>
      `;
    });
  }

  _classMap(classes) {
    return Object.entries(classes)
      .filter(([_, value]) => Boolean(value))
      .map(([key]) => key)
      .join(' ');
  }

  _toggleDropdown(e) {
    if (this.disabled) return;
    
    this._isOpen = !this._isOpen;
    
    if (this._isOpen) {
      // Reset search when opening
      this._searchText = '';
      this._filteredOptions = [...this.options];
      
      // Focus search input if searchable
      if (this.searchable) {
        setTimeout(() => {
          const searchInput = this.shadowRoot.querySelector('.dropdown-search input');
          if (searchInput) searchInput.focus();
        }, 0);
      }
    }
  }

  _handleClickOutside(e) {
    if (this._isOpen && !this.contains(e.target)) {
      this._isOpen = false;
    }
  }

  _handleKeyDown(e) {
    if (!this._isOpen) return;
    
    switch (e.key) {
      case 'Escape':
        this._isOpen = false;
        break;
      case 'ArrowDown':
        // Handle arrow navigation
        e.preventDefault();
        this._navigateOptions(1);
        break;
      case 'ArrowUp':
        // Handle arrow navigation
        e.preventDefault();
        this._navigateOptions(-1);
        break;
      case 'Enter':
        // Select the focused option
        const focusedOption = this.shadowRoot.querySelector('.dropdown-item.is-focused');
        if (focusedOption) {
          focusedOption.click();
        }
        break;
    }
  }

  _navigateOptions(direction) {
    const items = Array.from(this.shadowRoot.querySelectorAll('.dropdown-item'));
    const focusedIndex = items.findIndex(item => item.classList.contains('is-focused'));
    
    // Remove current focus
    items.forEach(item => item.classList.remove('is-focused'));
    
    // Calculate new index
    let newIndex;
    if (focusedIndex === -1) {
      newIndex = direction > 0 ? 0 : items.length - 1;
    } else {
      newIndex = (focusedIndex + direction + items.length) % items.length;
    }
    
    // Add focus to new item
    if (items[newIndex]) {
      items[newIndex].classList.add('is-focused');
      items[newIndex].scrollIntoView({ block: 'nearest' });
    }
  }

  _handleSearch(e) {
    this._searchText = e.target.value;
    
    // Filter options based on search text
    if (this._searchText) {
      this._filteredOptions = this.options.filter(option => {
        const label = option.label !== undefined ? option.label : option;
        return String(label).toLowerCase().includes(this._searchText.toLowerCase());
      });
    } else {
      this._filteredOptions = [...this.options];
    }
    
    // Dispatch input event
    this.dispatchEvent(new CustomEvent('input', {
      detail: { value: this._searchText },
      bubbles: true,
      composed: true
    }));
  }

  _selectOption(e, value) {
    e.stopPropagation();
    
    if (this.multiple) {
      // For multiple selection
      let newValue = Array.isArray(this.value) ? [...this.value] : [];
      
      if (newValue.includes(value)) {
        // Remove value if already selected
        newValue = newValue.filter(v => v !== value);
      } else {
        // Add value if not selected
        newValue.push(value);
      }
      
      this.value = newValue;
    } else {
      // For single selection
      this.value = value;
      this._isOpen = false;
    }
    
    this._dispatchChangeEvent();
    this.validate();
  }

  _handleCheckboxChange(e, value) {
    e.stopPropagation();
    
    let newValue = Array.isArray(this.value) ? [...this.value] : [];
    
    if (e.target.checked) {
      if (!newValue.includes(value)) {
        newValue.push(value);
      }
    } else {
      newValue = newValue.filter(v => v !== value);
    }
    
    this.value = newValue;
    this._dispatchChangeEvent();
    this.validate();
  }

  _removeTag(e, value) {
    e.stopPropagation();
    
    if (Array.isArray(this.value)) {
      this.value = this.value.filter(v => v !== value);
      this._dispatchChangeEvent();
      
      // Dispatch tag-removed event
      this.dispatchEvent(new CustomEvent('tag-removed', {
        detail: { value },
        bubbles: true,
        composed: true
      }));
      
      this.validate();
    }
  }

  _createOption(text) {
    if (!text || !this.creatable) return;
    
    // Add new option to options list
    const newOption = { value: text, label: text };
    this.options = [...this.options, newOption];
    this._filteredOptions = [...this.options];
    
    // Select the new option
    if (this.multiple) {
      this.value = Array.isArray(this.value) ? [...this.value, text] : [text];
    } else {
      this.value = text;
      this._isOpen = false;
    }
    
    // Reset search text
    this._searchText = '';
    
    this._dispatchChangeEvent();
    this.validate();
  }

  _handleFocus(e) {
    this.dispatchEvent(new CustomEvent('focus', {
      bubbles: true,
      composed: true
    }));
  }

  _handleBlur(e) {
    this.dispatchEvent(new CustomEvent('blur', {
      bubbles: true,
      composed: true
    }));
    
    this.validate();
  }

  _dispatchChangeEvent() {
    this.dispatchEvent(new CustomEvent('change', {
      detail: { value: this.value },
      bubbles: true,
      composed: true
    }));
  }

  validate() {
    if (this.required && (!this.value || (Array.isArray(this.value) && this.value.length === 0))) {
      this._hasError = true;
      this._errorText = this.errorMessage || 'This field is required';
      return false;
    }
    
    this._hasError = false;
    this._errorText = '';
    return true;
  }

  checkValidity() {
    return !this._hasError;
  }

  focus() {
    const input = this.shadowRoot.querySelector('.dropdown-input-container');
    if (input) {
      input.focus();
    }
  }

  reset() {
    this.value = this.multiple ? [] : '';
    this._searchText = '';
    this._hasError = false;
    this._errorText = '';
    this._isOpen = false;
  }
}

customElements.define('dotbox-dropdown', DotboxDropdown); 