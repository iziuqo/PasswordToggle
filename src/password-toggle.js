// password-toggle.js

/**
 * PasswordToggle - A lightweight, customizable password visibility toggle library
 * @param {Object} config - Configuration options
 * @param {string} config.keyCombo - Key combination (default: 'ctrl+8' on Windows/Linux, 'cmd+8' on Mac)
 * @param {string} config.toggleAttribute - Data attribute to identify password fields (default: 'data-pw-toggle')
 * @param {boolean} config.toggleAllFields - Whether to toggle all fields or only focused field (default: false)
 * @param {boolean} config.showToggleButton - Whether to show the toggle button (default: true)
 * @param {string} config.toggleButtonClass - CSS class for the toggle button (default: 'password-toggle-btn')
 * @param {string} config.activeClass - CSS class for active state (default: 'password-toggle-active')
 * @param {string} config.eyeOpenIcon - SVG for visible password (default: eye icon)
 * @param {string} config.eyeClosedIcon - SVG for hidden password (default: eye-off icon)
 * @param {string} config.wrapperClass - CSS class for the wrapper (default: 'password-toggle-wrapper')
 * @param {string} config.tooltipClass - CSS class for the tooltip (default: 'password-toggle-tooltip')
 */
class PasswordToggle {
  constructor(config = {}) {
    // Platform detection
    this.isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    
    // Default SVG icons
    const defaultEyeOpen = `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
    const defaultEyeClosed = `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;

    // Configuration with defaults
    this.config = {
      keyCombo: config.keyCombo || (this.isMac ? 'cmd+8' : 'ctrl+8'),
      toggleAttribute: config.toggleAttribute || 'data-pw-toggle',
      toggleAllFields: config.toggleAllFields || false,
      showToggleButton: config.showToggleButton !== false,
      toggleButtonClass: config.toggleButtonClass || 'password-toggle-btn',
      activeClass: config.activeClass || 'password-toggle-active',
      eyeOpenIcon: config.eyeOpenIcon || defaultEyeOpen,
      eyeClosedIcon: config.eyeClosedIcon || defaultEyeClosed,
      wrapperClass: config.wrapperClass || 'password-toggle-wrapper',
      tooltipClass: config.tooltipClass || 'password-toggle-tooltip'
    };
    
    // Parse key combination
    this.keyConfig = this.parseKeyCombo(this.config.keyCombo);

    // Bind event handlers
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);

    // Initialize
    this.init();
  }

  /**
   * Parse key combination string into modifier and key
   * @private
   */
  parseKeyCombo(keyCombo) {
    const parts = keyCombo.toLowerCase().split('+');
    if (parts.length !== 2) {
      throw new Error('Invalid key combination format. Use format like "ctrl+8" or "cmd+8"');
    }
    
    const modifier = parts[0];
    const key = parts[1];
    
    const modifierMap = {
      ctrl: 'ctrlKey',
      cmd: 'metaKey',
      command: 'metaKey',
      meta: 'metaKey',
      alt: 'altKey',
      shift: 'shiftKey'
    };

    const modifierKey = modifierMap[modifier];
    if (!modifierKey) {
      throw new Error(`Unsupported modifier key: ${modifier}`);
    }

    return { modifier: modifierKey, key };
  }

  /**
   * Create toggle button element
   * @private
   */
  createToggleButton() {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = this.config.toggleButtonClass;
    button.innerHTML = this.config.eyeClosedIcon;
    button.setAttribute('aria-label', 'Toggle password visibility');
    return button;
  }

  /**
   * Create tooltip element
   * @private
   */
  createTooltip(field) {
    const tooltip = document.createElement('div');
    const modifierDisplay = this.isMac ? '⌘' : 'Ctrl';
    tooltip.className = this.config.tooltipClass;
    tooltip.textContent = `Show password (${modifierDisplay} + 8)`;
    field.parentElement.appendChild(tooltip);
  }

  /**
   * Initialize the library
   * @private
   */
  init() {
    document.addEventListener('keydown', this.handleKeyPress);
    this.setupPasswordFields();
    this.injectStyles();
  }

  /**
   * Inject required styles
   * @private
   */
  injectStyles() {
    if (!document.getElementById('password-toggle-styles')) {
      const styles = document.createElement('style');
      styles.id = 'password-toggle-styles';
      styles.textContent = `
        .${this.config.wrapperClass} {
          position: relative;
          display: inline-block;
        }
        .${this.config.toggleButtonClass} {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          border: none;
          background: none;
          cursor: pointer;
          padding: 4px;
          color: #666;
          display: flex;
          align-items: center;
          z-index: 1;
          transition: color 0.2s;
        }
        .${this.config.toggleButtonClass}:hover {
          color: #333;
        }
        .${this.config.toggleButtonClass}.${this.config.activeClass} {
          color: #000;
        }
        .${this.config.tooltipClass} {
          position: absolute;
          top: -30px;
          right: 0;
          background: #1a2e3b;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.2s;
          z-index: 2;
          white-space: nowrap;
        }
        .${this.config.wrapperClass}:hover .${this.config.tooltipClass} {
          opacity: 1;
        }
      `;
      document.head.appendChild(styles);
    }
  }

  /**
   * Setup password fields with wrapper and button
   * @private
   */
  setupPasswordFields() {
    const fields = document.querySelectorAll(`[${this.config.toggleAttribute}]`);
    fields.forEach(field => {
      if (field.type !== 'password' && field.type !== 'text') {
        console.warn('PasswordToggle: Field must be of type password or text');
        return;
      }

      // Create wrapper if not exists
      if (!field.parentElement.classList.contains(this.config.wrapperClass)) {
        const wrapper = document.createElement('div');
        wrapper.className = this.config.wrapperClass;
        field.parentNode.insertBefore(wrapper, field);
        wrapper.appendChild(field);

        // Add toggle button
        if (this.config.showToggleButton) {
          const button = this.createToggleButton();
          wrapper.appendChild(button);
          button.addEventListener('click', (e) => this.handleButtonClick(e, field));
        }

        // Add tooltip
        this.createTooltip(field);
      }
    });
  }

  /**
   * Handle button click event
   * @private
   */
  handleButtonClick(event, field) {
    event.preventDefault();
    if (this.config.toggleAllFields) {
      this.togglePasswordVisibility();
    } else {
      this.togglePasswordVisibility(field);
    }
  }

  /**
   * Handle keypress event
   * @private
   */
  handleKeyPress(event) {
    if (event[this.keyConfig.modifier] && event.key === this.keyConfig.key) {
      event.preventDefault();
      if (this.config.toggleAllFields) {
        this.togglePasswordVisibility();
      } else {
        const activeElement = document.activeElement;
        if (activeElement?.hasAttribute(this.config.toggleAttribute)) {
          this.togglePasswordVisibility(activeElement);
        }
      }
    }
  }

  /**
   * Toggle password field visibility
   * @private
   */
  togglePasswordVisibility(specificField = null) {
    const fields = specificField ? [specificField] : 
      document.querySelectorAll(`[${this.config.toggleAttribute}]`);
    
    fields.forEach(field => {
      const wasPassword = field.type === 'password';
      field.type = wasPassword ? 'text' : 'password';
      
      // Update button icon and state
      const button = field.parentElement.querySelector(`.${this.config.toggleButtonClass}`);
      if (button) {
        button.innerHTML = wasPassword ? this.config.eyeOpenIcon : this.config.eyeClosedIcon;
        button.classList.toggle(this.config.activeClass, !wasPassword);
      }
      
      // Dispatch custom event
      field.dispatchEvent(new CustomEvent('passwordToggle', {
        bubbles: true,
        detail: { 
          isVisible: !wasPassword,
          field: field.id || 'anonymous',
          mode: this.config.toggleAllFields ? 'all' : 'focused'
        }
      }));
    });
  }

  /**
   * Set toggle mode (all fields or focused only)
   * @public
   */
  setMode(mode) {
    this.config.toggleAllFields = mode === 'all';
    return this;
  }

  /**
   * Set keyboard shortcut
   * @public
   */
  setKeyCombo(keyCombo) {
    this.config.keyCombo = keyCombo;
    this.keyConfig = this.parseKeyCombo(keyCombo);
    return this;
  }

  /**
   * Update configuration
   * @public
   */
  updateConfig(newConfig) {
    Object.assign(this.config, newConfig);
    this.keyConfig = this.parseKeyCombo(this.config.keyCombo);
    return this;
  }

  /**
   * Refresh all password fields
   * @public
   */
  refresh() {
    this.setupPasswordFields();
    return this;
  }

  /**
   * Clean up event listeners and DOM changes
   * @public
   */
  destroy() {
    document.removeEventListener('keydown', this.handleKeyPress);
    document.querySelectorAll(`.${this.config.toggleButtonClass}`).forEach(button => {
      button.removeEventListener('click', this.handleButtonClick);
    });

    // Remove injected styles
    const styles = document.getElementById('password-toggle-styles');
    if (styles) {
      styles.remove();
    }

    // Unwrap fields
    document.querySelectorAll(`.${this.config.wrapperClass}`).forEach(wrapper => {
      const field = wrapper.querySelector(`[${this.config.toggleAttribute}]`);
      if (field) {
        wrapper.parentNode.insertBefore(field, wrapper);
        wrapper.remove();
      }
    });
  }
}

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PasswordToggle;
} else if (typeof define === 'function' && define.amd) {
  define([], () => PasswordToggle);
} else {
  window.PasswordToggle = PasswordToggle;
}
