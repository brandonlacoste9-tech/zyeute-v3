# Button Component Audit - Phase 2 Skeleton

**Status:** 🟡 Scaffolded (Ready for Phase 2)  
**Priority:** High  
**Estimated Time:** 8-12 hours  
**Target Date:** Phase 2 Launch

---

## 🎯 Purpose

This audit will standardize all button components across Zyeuté v3 to ensure:

1. **Consistent Design:** Quebec heritage luxury aesthetic with beaver leather texture and gold accents
2. **Accessibility:** WCAG 2.1 AA compliance (color contrast, keyboard navigation, screen readers)
3. **Performance:** Optimized press effects, hover states, and animations
4. **Reusability:** Shared button components with clear prop APIs

---

## 📋 Audit Checklist (Template)

### Discovery Phase

- [ ] **Scan Codebase for Buttons**
  - Find all `<button>` elements in `.tsx` files
  - Find all Button components (custom/library)
  - Identify inline button styles vs. component usage
  - Document button patterns in each major page

- [ ] **Categorize Button Types**
  - Primary buttons (CTAs, login, submit)
  - Secondary buttons (cancel, back, etc.)
  - Tertiary buttons (text links styled as buttons)
  - Icon buttons (no text, icon only)
  - Toggle buttons (active/inactive states)
  - Social auth buttons (Google, Facebook, etc.)
  - Guest mode button

- [ ] **Inventory Button Variants**
  - Color schemes (gold, white, transparent)
  - Sizes (small, medium, large)
  - States (default, hover, active, disabled, loading)
  - Animations (press effect, glow, ripple)

### Analysis Phase

- [ ] **Design Consistency Check**
  - Compare button styles across pages
  - Document style variations and inconsistencies
  - Identify design system gaps
  - Screenshot examples of each variant

- [ ] **Accessibility Audit**
  - Check color contrast ratios (WCAG AA: 4.5:1 for text)
  - Verify keyboard navigation (Tab, Enter, Space)
  - Test screen reader announcements (ARIA labels)
  - Validate focus indicators (visible focus ring)
  - Check disabled state semantics

- [ ] **Performance Review**
  - Measure animation frame rates (target: 60fps)
  - Check for layout thrashing in hover/press effects
  - Validate event handler efficiency
  - Test on low-end devices (mobile throttling)

- [ ] **Code Quality Assessment**
  - Check for code duplication (DRY violations)
  - Review prop consistency across button components
  - Identify missing type definitions
  - Document technical debt

### Documentation Phase

- [ ] **Create Button Component Specification**
  - Define canonical button component API
  - Document all props and variants
  - Provide usage examples for each button type
  - Include do's and don'ts

- [ ] **Design System Integration**
  - Add button components to design system docs
  - Create Storybook stories for each variant
  - Document spacing, sizing, and color tokens
  - Provide Figma/design tool exports

- [ ] **Accessibility Guidelines**
  - Document ARIA requirements for each button type
  - Provide keyboard interaction examples
  - Include screen reader testing results
  - Add accessibility testing checklist

### Remediation Phase

- [ ] **Implement Standardized Button Component**
  - Create `Button.tsx` component in `client/src/components/ui/`
  - Support all identified variants (primary, secondary, etc.)
  - Implement consistent press/hover/glow effects
  - Add loading state with spinner
  - Include disabled state with reduced opacity

- [ ] **Migrate Existing Buttons**
  - Replace inline button styles with component
  - Update all pages to use standardized Button
  - Maintain backward compatibility during migration
  - Test each page after migration

- [ ] **Add Tests**
  - Unit tests for Button component (render, props, states)
  - Accessibility tests (jest-axe or similar)
  - Visual regression tests (Percy or Chromatic)
  - E2E tests for critical button interactions

---

## 🔍 Button Inventory (To Be Completed in Phase 2)

### Login Page (`client/src/pages/Login.tsx`)

**Buttons Found:**

1. **Login Submit Button** (Line 360-376)
   - Type: Primary CTA
   - Style: Gold gradient (`#FFD700` to `#DAA520`)
   - States: Default, hover (glow), loading, disabled
   - Effects: `press-effect`, `hover-glow`
   - Text: "Se connecter" (French)
   - Accessibility: ✅ Proper `type="submit"`, disabled when loading

2. **Google OAuth Button** (Line 390-403)
   - Type: Secondary OAuth
   - Style: Transparent with gold border
   - Icon: Google logo SVG
   - States: Default, hover, disabled
   - Text: "Continuer avec Google"
   - Accessibility: ✅ SVG has proper viewBox, button type specified

3. **Guest Mode Button** (Line 406-427)
   - Type: Tertiary alternative
   - Style: White border with low opacity background
   - Icon: 🎭 emoji
   - States: Default, hover (border color change), disabled
   - Text: "Mode Invité (Accès Rapide)"
   - Accessibility: ✅ Proper type, hover states, clear labeling

4. **Password Visibility Toggle** (Line 318-340)
   - Type: Icon button (utility)
   - Style: Transparent, icon only (👁️ emoji)
   - Function: Toggles password visibility
   - States: Two icons (visible/hidden)
   - Accessibility: ✅ `aria-label` provided, title attribute

**Observations:**
- Consistent "beaver leather" aesthetic with gold accents
- Good use of inline styles for precise design control
- All buttons have proper loading/disabled states
- Strong accessibility baseline (ARIA, keyboard support)

**Issues:**
- Inline styles make reusability difficult
- No shared Button component used
- Emoji icons could be replaced with SVGs for consistency

---

### Feed Page (`client/src/pages/Feed.tsx`)

*(To be documented in Phase 2)*

---

### Profile Page

*(To be documented in Phase 2)*

---

### Admin Dashboard

*(To be documented in Phase 2)*

---

## 🎨 Design System Tokens (Draft)

### Button Colors (Quebec Heritage Palette)

```scss
// Primary (Gold)
$button-primary-bg: linear-gradient(135deg, #FFD700 0%, #FFC125 50%, #DAA520 100%);
$button-primary-text: #1a1a1a;
$button-primary-shadow: 0 4px 20px rgba(255,191,0,0.4);

// Secondary (Transparent Gold)
$button-secondary-bg: rgba(0,0,0,0.3);
$button-secondary-border: 2px solid rgba(255,191,0,0.3);
$button-secondary-text: #DAA520;

// Tertiary (White Outline)
$button-tertiary-bg: rgba(255,255,255,0.05);
$button-tertiary-border: 1px solid rgba(255,255,255,0.2);
$button-tertiary-text: #E8DCC4;

// Disabled State
$button-disabled-opacity: 0.5;
$button-disabled-cursor: not-allowed;
```

### Button Sizes

```scss
$button-sm-height: 36px;
$button-sm-padding: 8px 16px;
$button-sm-font-size: 14px;

$button-md-height: 48px;
$button-md-padding: 12px 24px;
$button-md-font-size: 16px;

$button-lg-height: 56px;
$button-lg-padding: 16px 32px;
$button-lg-font-size: 18px;
```

### Button Effects

```scss
// Press Effect (scale down on click)
.press-effect:active {
  transform: scale(0.97);
  transition: transform 0.1s ease;
}

// Hover Glow (gold glow on hover)
.hover-glow:hover {
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.6);
  transition: box-shadow 0.3s ease;
}

// Loading Spinner
.button-loading {
  position: relative;
  color: transparent;
}
.button-loading::after {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}
```

---

## 🧪 Testing Plan (Phase 2)

### Unit Tests

```typescript
// Example test structure (to be implemented)
describe('Button Component', () => {
  it('renders with text', () => {});
  it('handles click events', () => {});
  it('shows loading state', () => {});
  it('respects disabled prop', () => {});
  it('applies variant styles correctly', () => {});
});
```

### Accessibility Tests

```typescript
describe('Button Accessibility', () => {
  it('has proper ARIA attributes', () => {});
  it('is keyboard navigable', () => {});
  it('announces to screen readers', () => {});
  it('has sufficient color contrast', () => {});
});
```

### Visual Regression Tests

- Capture screenshots of all button variants
- Test hover, active, and focus states
- Validate across different screen sizes
- Check dark/light mode compatibility

---

## 📊 Success Metrics

### Code Quality

- [ ] All buttons use standardized component
- [ ] Zero inline button styles (except overrides)
- [ ] 100% TypeScript type coverage
- [ ] <5% code duplication in button logic

### Accessibility

- [ ] 100% WCAG 2.1 AA compliance
- [ ] All buttons keyboard navigable
- [ ] All buttons screen reader friendly
- [ ] Proper focus indicators on all buttons

### Performance

- [ ] Button animations maintain 60fps
- [ ] <50ms event handler execution time
- [ ] No layout thrashing on hover/press
- [ ] Lighthouse accessibility score: 100

### Design Consistency

- [ ] All button variants documented
- [ ] Design system tokens defined
- [ ] Storybook stories for all variants
- [ ] Designer approval obtained

---

## 🚀 Next Steps (Phase 2 Launch)

1. **Discovery Sprint (2 hours)**
   - Scan all `.tsx` files for button elements
   - Create button inventory spreadsheet
   - Take screenshots of current buttons

2. **Analysis Sprint (3 hours)**
   - Run accessibility audit with axe DevTools
   - Measure performance with Chrome DevTools
   - Document inconsistencies

3. **Implementation Sprint (6 hours)**
   - Build standardized Button component
   - Migrate Login page as proof of concept
   - Write component tests

4. **Migration Sprint (4 hours)**
   - Update remaining pages
   - Run full test suite
   - Deploy to staging for validation

---

## 📝 Notes

- This is a **skeleton document** for Phase 2 planning
- Actual button audit will be completed during Phase 2 sprint
- Priority pages: Login → Feed → Profile → Admin
- Design approval required before migration

---

**Document Status:** 🟡 Scaffolded  
**Ready for Phase 2:** ✅ Yes  
**Blocking Issues:** None  
**Dependencies:** None
