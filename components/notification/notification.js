import { html, css } from 'lit';
import { DotboxBaseComponent } from '../base/base-component.js';

/**
 * @element dotbox-notification
 * 
 * @prop {String} variant - Notification variant (default, success, warning, info, danger)
 * @prop {String} title - Notification title
 * @prop {String} message - Notification message
 * @prop {Boolean} stacking - Whether notifications should stack or replace previous ones
 * @prop {Number} duration - Duration in milliseconds before auto-closing (0 for no auto-close)
 * @prop {String} position - Position of the notification (top-right, top-left, bottom-right, bottom-left, top-center, bottom-center)
 * @prop {Boolean} closable - Whether the notification can be closed by the user
 * @prop {String} icon - FontAwesome icon name (e.g., 'fa-check', 'fa-warning')
 * 
 * @csspart container - The notification container
 * @csspart header - The notification header
 * @csspart title - The notification title
 * @csspart close-button - The close button
 * @csspart content - The notification content
 * @csspart icon - The notification icon
 * 
 * @fires close - Dispatched when the notification is closed
 */
export class DotboxNotification extends DotboxBaseComponent {
  static get properties() {
    return {
      variant: { type: String, reflect: true },
      title: { type: String },
      message: { type: String },
      stacking: { type: Boolean },
      duration: { type: Number },
      position: { type: String, reflect: true },
      closable: { type: Boolean },
      icon: { type: String },
      _visible: { type: Boolean, state: true }
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          pointer-events: none;
        }
        
        .notification-container {
          position: fixed;
          z-index: 9999;
          pointer-events: auto;
          max-width: 350px;
          min-width: 250px;
          background-color: #fff;
          border-radius: 4px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          overflow: hidden;
          margin: 10px;
          transition: all 0.3s ease;
          opacity: 0;
          transform: translateY(20px);
        }
        
        .notification-container.visible {
          opacity: 1;
          transform: translateY(0);
        }
        
        .notification-container.default {
          border-left: 4px solid #6c757d;
        }
        
        .notification-container.success {
          border-left: 4px solid #28a745;
        }
        
        .notification-container.warning {
          border-left: 4px solid #ffc107;
        }
        
        .notification-container.danger {
          border-left: 4px solid #dc3545;
        }
        
        .notification-container.info {
          border-left: 4px solid #17a2b8;
        }
        
        .notification-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 15px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        }
        
        .notification-title {
          font-weight: 600;
          margin: 0;
          font-size: 1rem;
        }
        
        .notification-close {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1rem;
          color: #6c757d;
          padding: 0;
          margin-left: 10px;
        }
        
        .notification-close:hover {
          color: #343a40;
        }
        
        .notification-content {
          padding: 15px;
          display: flex;
          align-items: flex-start;
        }
        
        .notification-icon {
          margin-right: 10px;
          font-size: 1.2rem;
        }
        
        .notification-icon.default {
          color: #6c757d;
        }
        
        .notification-icon.success {
          color: #28a745;
        }
        
        .notification-icon.warning {
          color: #ffc107;
        }
        
        .notification-icon.danger {
          color: #dc3545;
        }
        
        .notification-icon.info {
          color: #17a2b8;
        }
        
        .notification-message {
          flex: 1;
          word-break: break-word;
        }
        
        /* Positions */
        :host([position="top-right"]) .notification-container {
          top: 0;
          right: 0;
        }
        
        :host([position="top-left"]) .notification-container {
          top: 0;
          left: 0;
        }
        
        :host([position="bottom-right"]) .notification-container {
          bottom: 0;
          right: 0;
        }
        
        :host([position="bottom-left"]) .notification-container {
          bottom: 0;
          left: 0;
        }
        
        :host([position="top-center"]) .notification-container {
          top: 0;
          left: 50%;
          transform: translateX(-50%) translateY(20px);
        }
        
        :host([position="top-center"]) .notification-container.visible {
          transform: translateX(-50%) translateY(0);
        }
        
        :host([position="bottom-center"]) .notification-container {
          bottom: 0;
          left: 50%;
          transform: translateX(-50%) translateY(20px);
        }
        
        :host([position="bottom-center"]) .notification-container.visible {
          transform: translateX(-50%) translateY(0);
        }
      `
    ];
  }

  // Static notification container for managing stacking
  static activeNotifications = {
    'top-right': [],
    'top-left': [],
    'bottom-right': [],
    'bottom-left': [],
    'top-center': [],
    'bottom-center': []
  };

  constructor() {
    super();
    this.variant = 'default';
    this.title = '';
    this.message = '';
    this.stacking = true;
    this.duration = 5000; // 5 seconds by default
    this.position = 'bottom-right';
    this.closable = true;
    this.icon = '';
    this._visible = false;
    this._timerId = null;
  }

  firstUpdated() {
    super.firstUpdated();
    
    // Force a reflow to ensure styles are applied
    this.shadowRoot.querySelector('.notification-container').offsetHeight;
    
    // Show the notification with a slight delay to ensure styles are applied
    setTimeout(() => {
      this._visible = true;
      this.requestUpdate();
    }, 10);
  }

  connectedCallback() {
    super.connectedCallback();
    
    // Register this notification with the static manager
    DotboxNotification.registerNotification(this);
    
    // Set auto-close timer if duration is greater than 0
    if (this.duration > 0) {
      this._timerId = setTimeout(() => {
        this.close();
      }, this.duration);
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    
    // Clear any existing timer
    if (this._timerId) {
      clearTimeout(this._timerId);
    }
    
    // Unregister this notification
    DotboxNotification.unregisterNotification(this);
  }

  render() {
    // Determine icon based on variant if not explicitly set
    const iconClass = this.icon || this._getDefaultIcon();
    
    return html`
      <div class="notification-container ${this.variant} ${this._visible ? 'visible' : ''}" part="container">
        ${this.title || this.closable ? html`
          <div class="notification-header" part="header">
            <h5 class="notification-title" part="title">${this.title}</h5>
            ${this.closable ? html`
              <button class="notification-close" part="close-button" @click="${this.close}">
                <i class="fa fa-times"></i>
              </button>
            ` : ''}
          </div>
        ` : ''}
        
        <div class="notification-content" part="content">
          ${iconClass ? html`
            <div class="notification-icon ${this.variant}" part="icon">
              <i class="fa ${iconClass}"></i>
            </div>
          ` : ''}
          <div class="notification-message">${this.message}</div>
        </div>
      </div>
    `;
  }

  _getDefaultIcon() {
    switch (this.variant) {
      case 'success':
        return 'fa-check-circle';
      case 'warning':
        return 'fa-exclamation-triangle';
      case 'danger':
        return 'fa-exclamation-circle';
      case 'info':
        return 'fa-info-circle';
      default:
        return 'fa-bell';
    }
  }

  /**
   * Close the notification
   */
  close() {
    // Clear any existing timer
    if (this._timerId) {
      clearTimeout(this._timerId);
    }
    
    // Hide the notification
    this._visible = false;
    this.requestUpdate();
    
    // Dispatch close event
    this.dispatchEvent(new CustomEvent('close', {
      bubbles: true,
      composed: true
    }));
    
    // Remove from DOM after animation
    setTimeout(() => {
      if (this.parentNode) {
        this.parentNode.removeChild(this);
      }
    }, 300);
  }

  /**
   * Register a notification with the manager
   */
  static registerNotification(notification) {
    const position = notification.position;
    
    // Add to active notifications
    DotboxNotification.activeNotifications[position].push(notification);
    
    // Update positions if stacking is enabled
    if (notification.stacking) {
      DotboxNotification.updatePositions(position);
    } else {
      // If not stacking, remove previous notifications in this position
      const previousNotifications = [...DotboxNotification.activeNotifications[position]];
      previousNotifications.forEach(prevNotification => {
        if (prevNotification !== notification) {
          prevNotification.close();
        }
      });
    }
  }

  /**
   * Unregister a notification from the manager
   */
  static unregisterNotification(notification) {
    const position = notification.position;
    const index = DotboxNotification.activeNotifications[position].indexOf(notification);
    
    if (index !== -1) {
      DotboxNotification.activeNotifications[position].splice(index, 1);
      
      // Update positions of remaining notifications if stacking is enabled
      if (notification.stacking) {
        DotboxNotification.updatePositions(position);
      }
    }
  }

  /**
   * Update positions of notifications for stacking effect
   */
  static updatePositions(position) {
    const notifications = DotboxNotification.activeNotifications[position];
    let offset = 0;
    
    notifications.forEach(notification => {
      const container = notification.shadowRoot?.querySelector('.notification-container');
      if (container) {
        const height = container.offsetHeight;
        
        if (position.startsWith('top')) {
          container.style.top = `${offset}px`;
        } else if (position.startsWith('bottom')) {
          container.style.bottom = `${offset}px`;
        }
        
        offset += height + 10; // 10px margin
      }
    });
  }

  /**
   * Create and show a notification
   */
  static show(options = {}) {
    console.log('Creating notification with options:', options);
    
    // Create a new notification element
    const notification = document.createElement('dotbox-notification');
    
    // Set default position to bottom-right if not specified
    if (!options.position) {
      options.position = 'bottom-right';
    }
    
    // Set properties from options
    Object.keys(options).forEach(key => {
      notification[key] = options[key];
    });
    
    // Handle non-stacking notifications
    if (options.stacking === false) {
      const position = options.position;
      
      // Close existing notifications in this position
      const existingNotifications = [...DotboxNotification.activeNotifications[position]];
      existingNotifications.forEach(prevNotification => {
        if (prevNotification !== notification) {
          if (prevNotification.parentNode) {
            prevNotification.parentNode.removeChild(prevNotification);
          }
        }
      });
      
      // Clear the active notifications array for this position
      DotboxNotification.activeNotifications[position] = [];
    }
    
    // Append to body
    document.body.appendChild(notification);
    console.log('Notification added to DOM');
    
    return Promise.resolve(notification);
  }
}

customElements.define('dotbox-notification', DotboxNotification);
console.log('DotboxNotification component defined as <dotbox-notification>');

// Expose DotboxNotification to the global scope
window.DotboxNotification = DotboxNotification; 