# PROMPT 9: Polish UI + Responsive Design

## 🎯 Obiettivo
Rifinire UI/UX e assicurare responsive design perfetto.

## 🖥️ Desktop (Host)

### Breakpoints
- **1920x1080**: Base design
- **1366x768**: Scale 0.85, compact mode
- **2560x1440**: Scale 1.2, extra spacing

### Features
- Full-screen mode supportato (Fullscreen API)
- Keyboard shortcuts:
  - `Space`: start game / next question
  - `Esc`: exit fullscreen
  - `M`: toggle mute
- Prevent accidental tab close (beforeunload)

## 📱 Mobile (Player)

### Breakpoints
- **390x844**: Base (iPhone 14 Pro)
- **360x800**: Compact (Android small)
- **414x896**: Large (iPhone Pro Max)

### Mobile-Specific
- **Landscape disabled**: force portrait orientation
```css
@media (orientation: landscape) and (max-height: 500px) {
  /* Show "Rotate device" overlay */
}
```
- **Touch targets**: min 48x48px (Apple HIG)
- **Safe areas**: padding for iPhone notch
```css
padding-top: env(safe-area-inset-top);
padding-bottom: env(safe-area-inset-bottom);
```
- **60fps animations**: use `transform` and `opacity` only
- **No hover states**: use `:active` instead

## 🎨 Design Refinement

### Color Contrast (WCAG AA)
- Verifica tutti i testi hanno contrast ratio ≥ 4.5:1
- Use tools: WebAIM Contrast Checker

### Focus States
- Visible outline per keyboard navigation
```css
button:focus-visible {
  outline: 3px solid #2E3192;
  outline-offset: 2px;
}
```

### Loading Skeletons
- Shimmer effect per tutti gli stati loading
```javascript
<Skeleton count={5} height={120} />
```

### Error Boundaries
```javascript
class ErrorBoundary extends React.Component {
  componentDidCatch(error, info) {
    // Log to error service
    console.error(error, info);
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorScreen />;
    }
    return this.props.children;
  }
}
```

## 🌐 Cross-Browser Testing

### Target Browsers
- ✅ Chrome 120+ (Desktop + Android)
- ✅ Safari 17+ (macOS + iOS)
- ✅ Firefox 120+
- ✅ Edge 120+

### Polyfills Needed
- Vibration API (fallback gracefully)
- Fullscreen API (vendor prefixes)

### CSS Fallbacks
```css
.gradient {
  background: linear-gradient(45deg, #ff0000, #00ff00);
  background: -webkit-linear-gradient(45deg, #ff0000, #00ff00);
}
```

## ♿ Accessibility

### ARIA Labels
```jsx
<button aria-label="Select answer A">A</button>
<div role="timer" aria-live="polite">{time}</div>
```

### Screen Reader Support
- Announce score changes
- Announce leaderboard updates
- Skip links for keyboard users

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 🚀 Performance

### Code Splitting
```javascript
const HostPage = lazy(() => import('./pages/HostPage'));
const PlayerPage = lazy(() => import('./pages/PlayerPage'));
```

### Image Optimization
- WebP format with fallback
- Lazy loading images
- Responsive images with srcset

### Bundle Size
- Target: < 200KB gzipped for initial bundle
- Use `webpack-bundle-analyzer`

## 📦 Deliverable

- Responsive design funzionante su tutti i device
- Keyboard navigation completa
- Focus states visibili
- Loading skeletons
- Error boundaries
- Cross-browser testato
- Lighthouse score > 90
