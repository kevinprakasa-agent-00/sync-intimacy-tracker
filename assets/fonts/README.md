# Fonts Required

This app uses the following custom fonts that need to be added to this folder:

## Quicksand (Headings)
- Quicksand-Light.ttf
- Quicksand-Regular.ttf
- Quicksand-Medium.ttf
- Quicksand-SemiBold.ttf
- Quicksand-Bold.ttf

Download from: https://fonts.google.com/specimen/Quicksand

## Inter (Body Text)
- Inter-Regular.ttf
- Inter-Medium.ttf
- Inter-Bold.ttf

Download from: https://fonts.google.com/specimen/Inter

## Caveat (Accent/Script)
- Caveat-Regular.ttf
- Caveat-Bold.ttf

Download from: https://fonts.google.com/specimen/Caveat

## Installation

1. Download the font files
2. Place them in this directory: `assets/fonts/`
3. Run `expo prebuild` or restart the dev server

## Alternative: Use System Fonts (Dev Mode)

If you don't have the custom fonts, you can temporarily modify `src/theme.js`:

```javascript
fonts: {
  heading: 'System',
  body: 'System', 
  accent: 'System',
}
```

And comment out the font loading in `App.js`.
