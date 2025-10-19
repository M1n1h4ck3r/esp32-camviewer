# Testing Guide - FASE 10
## ESP32 CamViewer - Comprehensive Testing Strategy

Generated: 2025-10-19

---

## 📋 Testing Checklist

### ✅ Manual Testing

#### 1. **Authentication Flow**
- [ ] Login with correct credentials (admin/admin123)
- [ ] Login with incorrect credentials (should show error)
- [ ] Session persistence (refresh page, should stay logged in)
- [ ] Session expiry after 30 minutes
- [ ] Logout functionality
- [ ] Redirect to login when not authenticated

#### 2. **Camera Management**
- [ ] Add new camera with valid URL
- [ ] Add camera with invalid URL (should show validation error)
- [ ] Edit existing camera
- [ ] Delete camera with confirmation
- [ ] Cancel delete operation
- [ ] Add 20 cameras (maximum limit)

#### 3. **Privacy & Unlocking**
- [ ] Mark camera as private
- [ ] Unlock private camera with correct password (privacy123)
- [ ] Unlock with incorrect password (should fail)
- [ ] Private camera shows blurred with lock overlay
- [ ] Unlocked camera shows clear feed

#### 4. **Fullscreen Viewer**
- [ ] Expand camera to fullscreen
- [ ] Close with ESC key
- [ ] Close with X button
- [ ] Refresh button updates image
- [ ] Browser fullscreen toggle (F key)
- [ ] Auto-refresh based on settings interval

#### 5. **Settings Page**
- [ ] Change privacy password successfully
- [ ] Verify old password before changing
- [ ] Password confirmation must match
- [ ] Change grid layout (2x2, 3x3, 4x4, auto)
- [ ] Update refresh interval (1-60 seconds)
- [ ] Settings persist after page refresh

#### 6. **Keyboard Shortcuts**
- [ ] Press `?` to open shortcuts dialog
- [ ] ESC to close dialogs
- [ ] Navigate with Tab key
- [ ] Enter to submit forms

#### 7. **Responsive Design**
- [ ] Test on mobile (< 768px)
- [ ] Test on tablet (768px - 1024px)
- [ ] Test on desktop (> 1024px)
- [ ] Mobile navigation appears below header
- [ ] FAB appears on mobile only
- [ ] Touch interactions work (tap, swipe)

#### 8. **Performance**
- [ ] Initial page load < 2 seconds
- [ ] Camera images lazy load when scrolled
- [ ] Animations run at 60fps
- [ ] No layout shift during loading
- [ ] Dialogs load without delay

#### 9. **Error Handling**
- [ ] Offline camera shows "Câmera offline" state
- [ ] Network error shows error message
- [ ] Invalid camera URL rejected
- [ ] Toast notifications for all actions

#### 10. **Data Persistence**
- [ ] Cameras saved to localStorage
- [ ] Settings saved to localStorage
- [ ] Session persists across tabs
- [ ] Data survives browser restart

---

## 🧪 Automated Testing (Future Implementation)

### Unit Tests (Jest + React Testing Library)

**Priority Components:**

```typescript
// src/lib/auth.test.ts
describe('Authentication', () => {
  test('hashPassword creates valid bcrypt hash', () => {
    const hash = hashPassword('test123');
    expect(hash).toMatch(/^\$2[aby]\$\d{2}\$/);
  });

  test('comparePassword validates correct password', () => {
    const hash = hashPassword('test123');
    expect(comparePassword('test123', hash)).toBe(true);
    expect(comparePassword('wrong', hash)).toBe(false);
  });
});

// src/lib/cameraUtils.test.ts
describe('Camera Utilities', () => {
  test('validateCameraUrl accepts valid URLs', () => {
    expect(validateCameraUrl('http://192.168.1.100').isValid).toBe(true);
    expect(validateCameraUrl('http://camera.local').isValid).toBe(true);
  });

  test('validateCameraUrl rejects invalid URLs', () => {
    expect(validateCameraUrl('not-a-url').isValid).toBe(false);
    expect(validateCameraUrl('').isValid).toBe(false);
  });

  test('getSnapshotUrl formats correctly', () => {
    const camera = { streamUrl: 'http://192.168.1.100' };
    expect(getSnapshotUrl(camera)).toBe('http://192.168.1.100/snapshot');
  });
});

// src/store/useStore.test.ts
describe('Zustand Store', () => {
  test('addCamera adds camera to state', () => {
    const { addCamera, cameras } = useStore.getState();
    const newCamera = { name: 'Test', streamUrl: 'http://test.local' };
    addCamera(newCamera);
    expect(cameras).toHaveLength(1);
  });

  test('removeCamera removes by id', () => {
    const { addCamera, removeCamera, cameras } = useStore.getState();
    addCamera({ name: 'Test', streamUrl: 'http://test.local' });
    const cameraId = cameras[0].id;
    removeCamera(cameraId);
    expect(cameras).toHaveLength(0);
  });
});
```

### Integration Tests

```typescript
// src/components/LoginForm.test.tsx
describe('LoginForm Integration', () => {
  test('successful login redirects to dashboard', async () => {
    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText('Username'), {
      target: { value: 'admin' }
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'admin123' }
    });

    fireEvent.click(screen.getByText('Entrar'));

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/dashboard');
    });
  });
});
```

### E2E Tests (Playwright)

```typescript
// e2e/camera-flow.spec.ts
test('complete camera management flow', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Login
  await page.fill('[name="username"]', 'admin');
  await page.fill('[name="password"]', 'admin123');
  await page.click('button[type="submit"]');

  // Add camera
  await page.click('text=Adicionar Câmera');
  await page.fill('[name="name"]', 'Test Camera');
  await page.fill('[name="streamUrl"]', 'http://192.168.1.100');
  await page.click('text=Adicionar');

  // Verify camera appears
  await expect(page.locator('text=Test Camera')).toBeVisible();

  // Edit camera
  await page.click('[aria-label="Menu"]');
  await page.click('text=Editar');
  await page.fill('[name="name"]', 'Updated Camera');
  await page.click('text=Salvar');

  // Delete camera
  await page.click('[aria-label="Menu"]');
  await page.click('text=Remover');
  await page.click('text=Sim, Remover');

  // Verify camera removed
  await expect(page.locator('text=Updated Camera')).not.toBeVisible();
});
```

---

## 🔍 Browser Testing Matrix

| Browser | Version | OS | Status |
|---------|---------|-----|--------|
| Chrome | 120+ | Windows/Mac/Linux | ✅ Primary |
| Firefox | 115+ | Windows/Mac/Linux | ✅ Tested |
| Safari | 16+ | macOS/iOS | ⚠️ To Test |
| Edge | 120+ | Windows | ✅ Tested |
| Mobile Chrome | Latest | Android | ⚠️ To Test |
| Mobile Safari | Latest | iOS | ⚠️ To Test |

---

## 📱 Device Testing

### Mobile Devices:
- [ ] iPhone 12/13/14 (iOS 15+)
- [ ] Samsung Galaxy S21/S22
- [ ] Google Pixel 6/7
- [ ] iPad Pro

### Screen Sizes:
- [ ] 320px (iPhone SE)
- [ ] 375px (iPhone 12)
- [ ] 768px (iPad)
- [ ] 1024px (iPad Pro)
- [ ] 1920px (Desktop)

---

## 🐛 Known Issues & Limitations

### Current Limitations:
1. **Camera Stream Format**: Only MJPEG supported (ESP32 default)
2. **Maximum Cameras**: 20 cameras (browser memory limit)
3. **Refresh Rate**: Minimum 1 second (browser performance)
4. **Offline Mode**: No offline caching yet (requires PWA)

### Browser-Specific Issues:
- **Safari iOS**: Some Framer Motion animations may stutter on older devices
- **Firefox**: localStorage limit 10MB (affects 20 cameras with large metadata)

---

## 🔒 Security Testing

### Manual Security Checks:
- [ ] XSS prevention (all user inputs sanitized)
- [ ] CSRF protection (same-origin policy)
- [ ] SQL injection (N/A - no database, localStorage only)
- [ ] Password hashing (bcrypt with salt)
- [ ] Session management (30min timeout)
- [ ] Secure localStorage (no sensitive data exposed)

### Recommended Tools:
- **OWASP ZAP**: Automated security scanning
- **Burp Suite**: Manual penetration testing
- **npm audit**: Dependency vulnerability check

```bash
npm audit
npm audit fix
```

---

## 📊 Performance Testing

### Lighthouse Audit Targets:
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 95
- SEO: > 90

### Run Lighthouse:
```bash
npm run build
npm run start
# Open Chrome DevTools > Lighthouse > Generate Report
```

### Core Web Vitals:
- FCP: < 1.8s ✅
- LCP: < 2.5s ✅
- CLS: < 0.1 ✅
- FID: < 100ms ✅

---

## 🚀 Pre-Deployment Checklist

### Code Quality:
- [ ] No console.logs in production
- [ ] No TypeScript errors (`npx tsc --noEmit`)
- [ ] No ESLint errors (`npm run lint`)
- [ ] All TODOs resolved
- [ ] Code comments updated

### Documentation:
- [ ] README.md complete
- [ ] API documentation (if applicable)
- [ ] Environment variables documented
- [ ] Deployment guide ready

### Build & Deploy:
- [ ] Production build successful (`npm run build`)
- [ ] Build size within budget (< 500KB)
- [ ] Environment variables set
- [ ] Domain configured
- [ ] SSL certificate installed

---

## 📝 Test Reports

### Template for Test Results:

```markdown
## Test Report - [Date]

**Tester**: [Name]
**Build**: [Version/Commit]
**Environment**: [Browser/Device]

### Results:
- Total Tests: 45
- Passed: 43 ✅
- Failed: 2 ❌
- Skipped: 0

### Failed Tests:
1. **Safari iOS - Fullscreen Animation**
   - Expected: Smooth transition
   - Actual: Slight stutter on iPhone 8
   - Priority: Low
   - Fix: Reduce animation complexity for older devices

2. **Firefox - localStorage Limit**
   - Expected: Save 20 cameras
   - Actual: Fails at 18 cameras with large metadata
   - Priority: Medium
   - Fix: Compress data before saving

### Recommendations:
- Implement virtual scrolling for 20+ cameras
- Add offline mode with Service Worker
- Optimize images for mobile devices
```

---

## 🎯 Acceptance Criteria

### Must Have (MVP):
- [x] User can login/logout
- [x] User can add/edit/delete cameras
- [x] Camera feeds display in real-time
- [x] Private cameras require unlock
- [x] Settings persist across sessions
- [x] Mobile responsive
- [x] Works on Chrome/Firefox/Edge

### Nice to Have (Future):
- [ ] Unit test coverage > 80%
- [ ] E2E test suite
- [ ] PWA with offline mode
- [ ] Multi-user support
- [ ] Camera grouping/tags
- [ ] Motion detection alerts

---

**Status**: FASE 10 - Testing Documentation Complete ✅
**Next**: Deployment Guide & Production Build
