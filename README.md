# Cosmus: Guia de Estudos Galáctico

Cosmus is a gamified educational application designed to help students prepare for the Vanda International Science Competition. It features study materials presented as a journey through the solar system, practice tests, performance tracking, and an AI-powered tutor chatbot.

# Cosmus: Jornada Científica — Spec-Driven Development

Este projeto utiliza o **Spec-Driven Development (SDD)** para guiar a criação e evolução de uma experiência imersiva de aprendizado em Física, Química, Biologia e Astronomia, combinando **IA (Gemini API)**, gamificação e narrativa sci-fi retrô.

O repositório está organizado para funcionar com o **AI Studio**, permitindo que o agente cognitivo ajude na revisão de conteúdo, UX research, documentação técnica e criação de atividades educacionais.

---

## Estrutura do Kit SDD

| Arquivo | Função |
|---------|--------|
| `spec/constitution.md` | Define princípios e fundamentos do projeto. |
| `spec/specify.md` | Lista casos de uso, jornadas do usuário e restrições. |
| `spec/plan.md` | Plano técnico e roadmap de implementação. |
| `spec/system_instruction.yaml` | Configuração do agente AI Studio (System Instruction). |

---

## Como usar no AI Studio

1. **Importe o `system_instruction.yaml`** como system prompt no AI Studio.  
2. **Carregue os specs** (`constitution.md` e `specify.md`) como **contexto inicial** para o agente.  
3. **Fluxo de trabalho recomendado**:
   - **/specify:** gerar refinamentos ou novos casos de uso.
   - **/plan:** gerar plano técnico detalhado a partir das especificações.
   - **/tasks:** criar backlog ou lista de tarefas.
   - **/implement:** gerar snippets de código ou sugestões alinhadas às specs.
4. **Integre com sua UI/UX existente**:
   - A interface já criada continua intacta.
   - O AI Studio fornece dados, sugestões e snippets que sua UI consome via API ou endpoints locais.

---

## Benefícios

- Mantém consistência entre UX, conteúdo educacional e backend cognitivo.
- Permite experimentação segura com IA sem perder a identidade visual.
- Facilita colaboração entre desenvolvedores, designers e educadores.

---

## Links Úteis

- [Behance — Cosmus: Jornada Científica](https://www.behance.net/gallery/235175727/Cosmus-Jornada-Cientifica)
- [Spec-Kit GitHub](https://github.com/LinkedInLearning/spec-driven-development-with-github-spec-kit-4641001)

---

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
