# Implementation Plan: User Manual Feature

This document outlines the step-by-step plan to develop and integrate the User Manual feature into the Cosmus application.

### Phase 1: Asset and Component Creation

1.  **Create Icon**: Develop the `QuestionMarkCircleIcon.tsx` component. This will be used in both the settings link and the manual's header.
2.  **Create Screen Component**: Build the basic structure of the `UserManual.tsx` screen component. It will include the main layout (`pixelated-panel`), title, and a back button.

### Phase 2: Content and Internationalization

1.  **Add Translations**: Update `i18n/index.ts` to include all new text keys for the User Manual screen and the new link in Settings. This includes titles, section content, and button text for all supported languages (pt, en, es).
2.  **Populate Content**: Implement the sectioned layout within `UserManual.tsx`, using the new i18n keys to display the content dynamically. Each section will be built as a reusable sub-component or a styled block.

### Phase 3: Integration and Routing

1.  **Update Settings Screen**: Modify `screens/Settings.tsx` to add a new `Link` component pointing to the `/manual` route. Place this link within the "General" section.
2.  **Update App Router**: Modify `App.tsx` to include the new route. The route will be `/manual`, and it will lazy-load the `UserManual` component to optimize performance. Ensure it is placed within the `ProtectedRoute` to restrict access to authenticated users.

### Phase 4: Review and Testing

1.  **Component Testing**: Verify that the `UserManual` screen renders correctly with all its content.
2.  **Navigation Testing**:
    - Test the link from the Settings screen to the User Manual screen.
    - Test the "Back" button on the User Manual screen.
    - Test deep linking by navigating directly to `/#/manual` while logged in.
3.  **Responsiveness Testing**: Ensure the layout is responsive and looks good on both mobile and desktop views.
4.  **i18n Testing**: Switch languages in the Settings and verify that all text on the User Manual screen and the settings link updates correctly.
