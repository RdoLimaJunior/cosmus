# Task Breakdown: User Manual Feature

### Core Development
- [x] Create new file: `screens/UserManual.tsx`.
- [x] Create new file: `components/icons/QuestionMarkCircleIcon.tsx`.
- [x] Implement the UI for the User Manual screen using `pixelated-panel`.
- [x] Add a header with title and icon.
- [x] Add a "Back" button with `useNavigate`.
- [x] Create distinct, styled sections for each part of the manual (Navigation, Study, etc.).
- [x] Add relevant icons to each section.

### Internationalization (i18n)
- [x] Update `i18n/index.ts` with keys for the manual's title.
- [x] Add i18n keys for each section's title and content paragraph in PT, EN, and ES.
- [x] Add i18n key for the "User Manual" link text (`navUserManual`).
- [x] Integrate the `t` function from `useAppContext` throughout the `UserManual.tsx` component.

### Integration
- [x] Modify `App.tsx` to add a new lazy-loaded route for `/manual`.
- [x] Ensure the new route is a child of the `ProtectedRoute`.
- [x] Modify `screens/Settings.tsx` to add a `Link` to `/manual`.
- [x] Use the new `QuestionMarkCircleIcon` in the settings link.

### Finalization
- [x] Perform a code review.
- [x] Test navigation flow on desktop and mobile.
- [x] Verify correct content rendering for all three languages.
