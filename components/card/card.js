import { html, css } from 'lit';
import { DotboxBaseComponent } from '../base/base-component.js';

/**
 * @element dotbox-card
 * 
 * @prop {String} variant - Card variant (primary, success, danger, info, default)
 * @prop {String} title - Card title
 * @prop {String} icon - FontAwesome icon name for the card header (e.g., 'fa-info-circle')
 * 
 * @csspart card - The card element
 * @csspart header - The card header
 * @csspart body - The card body
 * @csspart footer - The card footer
 * 
 * @slot - Default slot for card content
 * @slot header - Slot for custom header content
 * @slot footer - Slot for footer content
 */
export class DotboxCard extends DotboxBaseComponent {
  static get properties() {
    return {
      variant: { type: String },
      title: { type: String },
      icon: { type: String }
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          margin-bottom: 1rem;
        }
      `
    ];
  }

  constructor() {
    super();
    this.variant = 'default';
    this.title = '';
    this.icon = '';
  }

  connectedCallback() {
    super.connectedCallback();
    const cssPath = new URL('./card.css', import.meta.url).href;
    console.log('Loading card CSS from:', cssPath);
    this.loadComponentStyles(cssPath);
  }

  render() {
    const cardClasses = `card ${this.variant ? `card-${this.variant}` : ''} ${this._noTransitions ? 'no-transitions' : ''}`;
    
    return html`
      <div class="${cardClasses}" part="card">
        ${this.renderHeader()}
        <div class="card-body" part="body">
          <slot></slot>
        </div>
        ${this.renderFooter()}
      </div>
    `;
  }

  renderHeader() {
    // Only render header if there's a title or icon or header slot content
    if (!this.title && !this.icon && !this.querySelector('[slot="header"]')) {
      return '';
    }

    return html`
      <div class="card-header" part="header">
        ${this.icon ? html`<i class="fa ${this.icon}"></i>` : ''}
        ${this.title ? html`<span class="card-title">${this.title}</span>` : ''}
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
      <div class="card-footer" part="footer">
        <slot name="footer"></slot>
      </div>
    `;
  }
}

customElements.define('dotbox-card', DotboxCard); 