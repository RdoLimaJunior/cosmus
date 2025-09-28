# Specification: User Manual Feature

## 1. Feature Overview

To improve user onboarding and provide ongoing support, a "User Manual" screen will be added to the application. This screen will offer clear, concise explanations of the app's main features and navigation. It will be accessible from the Settings screen.

## 2. Requirements

- **New Screen**: A dedicated, scrollable screen for the user manual content.
- **Accessibility**: The manual must be easy to find. The primary entry point will be a link in the "General" section of the Settings screen.
- **Content**: The manual must explain the core functionalities:
    - Navigation (Top/Bottom bars)
    - Study (Sector Map)
    - Practice
    - Performance
    - Settings
- **Internationalization (i18n)**: All text content must be translatable and available in Portuguese, English, and Spanish.
- **Routing**: The new screen must be integrated into the app's routing system as a protected route, accessible only to logged-in users.

## 3. UI/UX Design

- **Layout**: The screen will use the existing `pixelated-panel` component for a consistent look and feel.
- **Header**: A prominent title, "User Manual", accompanied by a `QuestionMarkCircleIcon`.
- **Navigation**: A "Back" button will be present at the top to allow users to easily return to the previous screen (Settings).
- **Content Sections**: Each feature explanation will be a distinct section with:
    - A relevant icon (e.g., `MapIcon` for Navigation, `TargetIcon` for Practice).
    - A clear, uppercase title.
    - A descriptive paragraph explaining the feature.
- **Settings Link**: A new entry in the Settings screen will link to the manual. It will feature the `QuestionMarkCircleIcon` and the text "User Manual".

## 4. Technical Details

- **Component**: Create a new React component `UserManual.tsx` in the `/screens` directory.
- **Icon**: Create a new icon component `QuestionMarkCircleIcon.tsx` in `/components/icons`.
- **Routing**: Add a new lazy-loaded route `/manual` in `App.tsx` within the `ProtectedRoute` layout.
- **State Management**: The component will primarily use the `useAppContext` hook for translations (`t`) and `useNavigate` for the back button functionality.
- **Styling**: Utilize Tailwind CSS and existing custom classes like `pixelated-panel`.


# Cosmus Specify

## C1. Revisão de Conteúdo Acadêmico
**Input:** Texto acadêmico sobre astronomia.  
**Output:** Revisão com pontos fortes, melhorias e adequações metodológicas.

## C2. Simplificação de Conceitos
**Input:** Teoria da Relatividade.  
**Output:** Explicação acessível para estudantes do ensino médio, mantendo precisão.

## C3. Suporte em UX Research
**Input:** Wireframe inicial de interface gamificada.  
**Output:** Sugestões de melhoria baseadas em usabilidade, clareza e engajamento.

## C4. Documentação Técnica
**Input:** Especificação de feature de quiz interativo.  
**Output:** Documento detalhado em formato técnico claro e padronizado.

## C5. Atividades Educacionais
**Input:** Pedido de exercício sobre química para 1º ano.  
**Output:** Lista de exercícios práticos com feedback automático.



