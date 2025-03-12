import { html, css } from 'lit';
import { DotboxCard } from '../card/card.js';

/**
 * @element dotbox-dialog
 * 
 * @prop {String} variant - Dialog variant (primary, success, danger, info, default)
 * @prop {String} title - Dialog title
 * @prop {String} icon - FontAwesome icon name for the dialog header (e.g., 'fa-info-circle')
 * @prop {Boolean} open - Whether the dialog is open
 * @prop {Boolean} modal - Whether the dialog is modal (shows overlay and prevents background interaction)
 * @prop {String} size - Dialog size (small, medium, large)
 * 
 * @csspart dialog - The dialog element
 * @csspart overlay - The overlay element (when modal)
 * @csspart header - The dialog header
 * @csspart body - The dialog body
 * @csspart footer - The dialog footer
 * @csspart close-button - The close button
 * 
 * @slot - Default slot for dialog content
 * @slot header - Slot for custom header content
 * @slot footer - Slot for footer content
 * 
 * @fires open - When the dialog opens
 * @fires close - When the dialog closes
 */
export class DotboxDialog extends DotboxCard {
  static get properties() {
    return {
      ...super.properties,
      open: { type: Boolean, reflect: true },
      modal: { type: Boolean },
      size: { type: String }
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: none;
          position: fixed;
          z-index: 1000;
        }
        
        :host([open]) {
          display: block;
        }
        
        .dialog-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        
        .dialog-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 999;
        }
        
        .close-button {
          position: absolute;
          top: 10px;
          right: 10px;
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: inherit;
          padding: 0;
          margin: 0;
          line-height: 1;
        }
      `
    ];
  }

  constructor() {
    super();
    this.open = false;
    this.modal = true; // Modal by default
    this.size = 'medium';
    
    // Bind methods
    this._handleKeyDown = this._handleKeyDown.bind(this);
    this._handleOverlayClick = this._handleOverlayClick.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    
    // Load component-specific CSS
    this.loadComponentStyles('dialog');
    
    // Add event listeners
    document.addEventListener('keydown', this._handleKeyDown);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    // Remove event listeners
    document.removeEventListener('keydown', this._handleKeyDown);
  }

  render() {
    console.log('Dialog render method called, open state:', this.open);
    
    if (!this.open) {
      return html``;
    }

    const dialogClasses = `dialog dialog-${this.size} ${this.variant ? `dialog-${this.variant}` : ''} ${this._noTransitions ? 'no-transitions' : ''}`;
    console.log('Dialog classes:', dialogClasses);
    
    return html`
      <div class="dialog-container" part="container">
        ${this.modal ? html`<div class="dialog-overlay" part="overlay" @click="${this._handleOverlayClick}"></div>` : ''}
        <div class="${dialogClasses}" part="dialog">
          ${this.renderHeader()}
          <div class="dialog-body" part="body">
            <slot></slot>
          </div>
          ${this.renderFooter()}
          <button class="close-button" part="close-button" @click="${this.close}" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      </div>
    `;
  }

  renderHeader() {
    // Only render header if there's a title or icon or header slot content
    if (!this.title && !this.icon && !this.querySelector('[slot="header"]')) {
      return '';
    }

    return html`
      <div class="dialog-header" part="header">
        ${this.icon ? html`<i class="fa ${this.icon}"></i>` : ''}
        ${this.title ? html`<span class="dialog-title">${this.title}</span>` : ''}
        <slot name="header"></slot>
      </div>
    `;
  }

  renderFooter() {
    // Only render footer if there's footer slot content
    if (!this.querySelector('[slot="footer"]')) {
      return '';
    }

    return html`
      <div class="dialog-footer" part="footer">
        <slot name="footer"></slot>
      </div>
    `;
  }

  /**
   * Open the dialog
   */
  show() {
    console.log('Dialog show() method called');
    this.open = true;
    console.log('Dialog open state set to:', this.open);
    this.dispatchEvent(new CustomEvent('open', {
      bubbles: true,
      composed: true
    }));
  }

  /**
   * Close the dialog
   */
  close() {
    console.log('Dialog close() method called');
    this.open = false;
    console.log('Dialog open state set to:', this.open);
    this.dispatchEvent(new CustomEvent('close', {
      bubbles: true,
      composed: true
    }));
  }

  /**
   * Toggle the dialog
   */
  toggle() {
    if (this.open) {
      this.close();
    } else {
      this.show();
    }
  }

  /**
   * Handle keydown events (close on Escape)
   * @private
   */
  _handleKeyDown(event) {
    if (this.open && event.key === 'Escape') {
      this.close();
    }
  }

  /**
   * Handle overlay click (close if clicked outside dialog)
   * @private
   */
  _handleOverlayClick(event) {
    if (this.open && this.modal) {
      this.close();
    }
  }
}

customElements.define('dotbox-dialog', DotboxDialog);
console.log('DotboxDialog component defined as <dotbox-dialog>'); 