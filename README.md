# Cosmus: Guia de Estudos Galáctico

Cosmus is a gamified educational application designed to help students prepare for the Vanda International Science Competition. It features study materials presented as a journey through the solar system, practice tests, performance tracking, and an AI-powered tutor chatbot.

## ✨ Features

- **Sector Map (Study):** Explore the solar system to learn. Unlock new celestial bodies by completing modules with lessons and quizzes.
- **Practice:** Test your knowledge in Biology, Chemistry, and Physics with multiple-choice questions.
- **Performance:** Track your progress with an AI-generated performance summary, progress charts, and unlockable badges.
- **AI Tutor:** Ask questions anytime with an integrated Gemini-powered chatbot.
- **Gamification:** Earn XP, level up, and achieve new ranks on your learning journey.
- **PWA Ready:** Installable on your device for a native-like experience.

## 🚀 Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS
- **AI:** Google Gemini API (`@google/genai`)
- **Routing:** React Router
- **State Management:** React Context API

## 🏛️ Spec-Driven Development (SDD)

This project follows a Spec-Driven Development methodology. The heart of this process lives in the `/spec` directory, which contains:

- `constitution.md`: The core principles and identity of the AI agent.
- `specify.md`: Feature specifications, requirements, and use cases.
- `plan.md`: The architectural and implementation plan for features.
- `tasks.md`: A detailed backlog and breakdown of development tasks.
- `implement.md`: Technical details and examples of the final implementation.

## 🤖 Integração AI Studio

Este projeto utiliza o AI Studio como copiloto SDD:
- `Constitution` e `Specify` são carregados como contexto inicial.
- `Plan`, `Tasks` e `Implement` são gerados e refinados dentro do AI Studio.
- O AI Studio atua como "motor de especs", enquanto o GitHub guarda a documentação e versão final.

## 💻 Running the Application

This web application is built with modern web technologies and runs directly in the browser.

1.  No build step is required for local development.
2.  Simply serve the project's root directory using a local web server.
3.  **Important:** The application requires a valid Google Gemini API key. This key must be set in the `index.html` file, replacing the `API_KEY_PLACEHOLDER` value.

```html
<!-- in index.html -->
<script>
  window.process = {
    env: {
      API_KEY: 'YOUR_REAL_API_KEY_HERE' // Replace placeholder
    }
  };
</script>
```
