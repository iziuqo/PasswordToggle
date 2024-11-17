# Password Toggle

A lightweight, platform-agnostic JavaScript library for toggling password field visibility using keyboard shortcuts or visual controls. Automatically adapts to Mac (⌘) and Windows/Linux (Ctrl) keyboard shortcuts.

## Features

- 🚀 Zero dependencies
- 🌐 Works in all modern browsers
- ⌨️ Platform-aware keyboard shortcuts (⌘ on Mac, Ctrl on Windows/Linux)
- 👁️ Customizable visual toggle buttons
- 🎯 Focus mode and toggle-all mode support
- 💡 Helpful tooltips
- ♿ Accessible by default
- 📱 Mobile-friendly
- 🔌 Easy integration with existing projects

## Installation

### NPM
```bash
npm install password-toggle
```

### CDN
```html
<script src="https://unpkg.com/password-toggle@latest/dist/password-toggle.min.js"></script>
```

### Direct Download
Download `password-toggle.js` from this repository and include it in your project.

## Quick Start

1. Add the script to your page:
```html
<script src="password-toggle.js"></script>
```

2. Add the `data-pw-toggle` attribute to your password fields:
```html
<input type="password" data-pw-toggle>
```

3. Initialize the library:
```javascript
const passwordToggle = new PasswordToggle();
```

That's it! Press Ctrl+8 (Windows/Linux) or ⌘+8 (Mac) to toggle password visibility, or use the eye icon button.

## Configuration

### Options

```javascript
const passwordToggle = new PasswordToggle({
    // Key combination for toggling
    keyCombo: 'alt+p',              
    
    // Custom data attribute
    toggleAttribute: 'data-custom',  
    
    // Toggle all fields or just focused field
    toggleAllFields: false,          
    
    // Show/hide the toggle button
    showToggleButton: true,         
    
    // Custom class for the toggle button
    toggleButtonClass: 'custom-toggle-btn',
    
    // Custom class for active state
    activeClass: 'custom-active',
    
    // Custom SVG icons
    eyeOpenIcon: '<your-svg-here>',
    eyeClosedIcon: '<your-svg-here>'
});
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| keyCombo | string | 'ctrl+8' or 'cmd+8' | Keyboard shortcut for toggling visibility |
| toggleAttribute | string | 'data-pw-toggle' | Data attribute to identify password fields |
| toggleAllFields | boolean | false | Whether to toggle all fields or only focused field |
| showToggleButton | boolean | true | Whether to show the visual toggle button |
| toggleButtonClass | string | 'password-toggle-btn' | CSS class for the toggle button |
| activeClass | string | 'password-toggle-active' | CSS class for active state |
| eyeOpenIcon | string | `<default-svg>` | SVG markup for visible password state |
| eyeClosedIcon | string | `<default-svg>` | SVG markup for hidden password state |

### Dynamic Configuration

You can change settings after initialization:

```javascript
// Switch between focus and toggle-all modes
passwordToggle.setMode('all');    // Toggle all fields
passwordToggle.setMode('focus');  // Toggle only focused field

// Change keyboard shortcut
passwordToggle.setKeyCombo('alt+p');
```

### Events

Listen for visibility changes:

```javascript
passwordField.addEventListener('passwordToggle', (e) => {
    console.log('Field:', e.detail.field);           // Field identifier
    console.log('Visible:', e.detail.isVisible);     // Visibility state
    console.log('Mode:', e.detail.mode);             // 'all' or 'focused'
});
```

### Styling

The library adds these CSS classes that you can customize:

```css
/* Toggle button wrapper */
.password-toggle-wrapper {
    position: relative;
}

/* Toggle button */
.password-toggle-btn {
    /* Your custom styles */
}

/* Active state */
.password-toggle-btn.password-toggle-active {
    /* Your custom styles */
}

/* Tooltip */
.password-toggle-tooltip {
    /* Your custom styles */
}
```

### Cleanup

To remove event listeners and cleanup:

```javascript
passwordToggle.destroy();
```

## Accessibility

The library includes these accessibility features:
- ARIA labels for password fields
- Keyboard support
- Screen reader friendly tooltips
- Focus management
- High contrast visual indicators

## Browser Support

- Chrome (Mac/Windows/Linux)
- Firefox (Mac/Windows/Linux)
- Safari (Mac/iOS)
- Edge
- Opera

## Examples

### Basic Usage
```html
<input type="password" data-pw-toggle>
```

### Custom Toggle Button
```javascript
const passwordToggle = new PasswordToggle({
    eyeOpenIcon: '<svg>...</svg>',
    eyeClosedIcon: '<svg>...</svg>',
    toggleButtonClass: 'custom-toggle'
});
```

### Toggle All Mode
```javascript
const passwordToggle = new PasswordToggle({
    toggleAllFields: true
});
```

### Custom Keyboard Shortcut
```javascript
const passwordToggle = new PasswordToggle({
    keyCombo: 'alt+p'
});
```

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Submit a pull request

## License

MIT License - feel free to use this in your projects!

## Changelog

### 1.1.0
- Added visual toggle button with eye icon
- Added tooltip showing keyboard shortcut
- Added dynamic mode switching
- Added more configuration options
- Enhanced styling and visual feedback
- Improved event handling
- Added proper cleanup methods

### 1.0.0
- Initial release
- Basic password toggle functionality
- Platform-aware keyboard shortcuts
