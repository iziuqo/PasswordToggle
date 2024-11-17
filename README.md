# Password Toggle

A lightweight, platform-agnostic JavaScript library for toggling password field visibility using keyboard shortcuts. Automatically adapts to Mac (⌘) and Windows/Linux (Ctrl) keyboard shortcuts.

## Features

- 🚀 Zero dependencies
- 🌐 Works in all modern browsers
- ⌨️ Platform-aware keyboard shortcuts (⌘ on Mac, Ctrl on Windows/Linux)
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

That's it! Press Ctrl+8 (Windows/Linux) or ⌘+8 (Mac) to toggle password visibility.

## Configuration

### Options

```javascript
const passwordToggle = new PasswordToggle({
    keyCombo: 'alt+p',              // Custom key combination
    toggleAttribute: 'data-custom'   // Custom data attribute
});
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| keyCombo | string | 'ctrl+8' or 'cmd+8' | Keyboard shortcut for toggling visibility (platform-dependent) |
| toggleAttribute | string | 'data-pw-toggle' | Data attribute to identify password fields |

### Supported Modifier Keys
- Windows/Linux: `ctrl`, `alt`, `shift`
- Mac: `cmd` (or `command`), `ctrl`, `alt`, `shift`

### Events

Listen for visibility changes:

```javascript
passwordField.addEventListener('passwordToggle', (e) => {
    console.log('Password visibility:', e.detail.isVisible);
    console.log('Platform:', e.detail.platform); // 'mac' or 'other'
});
```

### Cleanup

To remove event listeners:

```javascript
passwordToggle.destroy();
```

## Browser Support

- Chrome (Mac/Windows/Linux)
- Firefox (Mac/Windows/Linux)
- Safari (Mac/iOS)
- Edge
- Opera

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Submit a pull request

## License

MIT License - feel free to use this in your projects!
