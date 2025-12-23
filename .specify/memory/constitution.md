<!--
---
version_change: "0.0.0 → 1.0.0"
modified_principles: []
added_sections:
  - Core Principles
  - Technology Stack
  - Development Phases
  - Governance
removed_sections: []
templates_updated:
  - path: .specify/memory/constitution.md
    status: ✅ updated
todos: []
---
-->
# Meetra AI Constitution

## Core Principles

### I. User-Centric and Minimalist Design
The user interface and experience are paramount. All design must be minimal, clean, and intuitive. Features should be implemented with a "1-click action" philosophy to minimize user effort and cognitive load. The UI must be lightweight and web-first.

### II. Agentic AI as a Core Assistant
The platform is AI-native, not just AI-assisted. The AI agent acts independently to provide proactive assistance, such as live meeting summaries and action item extraction. All AI features must be strictly opt-in to respect user privacy and control.

### III. Performance and Scalability First
The system must be engineered for high performance and reliability. This includes maintaining a latency of < 300ms, ensuring 99.9% uptime, and being architected to scale to 10,000 concurrent users.

### IV. Security and Privacy by Design
Security is a foundational requirement. The system must implement JWT authentication, encrypted signaling, and secure WebRTC channels. End-to-end encryption is a goal for future implementation. User privacy is critical; do not auto-record without explicit consent.

### V. Modular and Maintainable Codebase
The codebase must be modular to promote separation of concerns and long-term maintainability. Employ feature flags for new functionality. AI logic must be decoupled from the core video logic to allow for independent development and updates. Avoid hardcoding sensitive information like AI keys.

## Technology Stack
- **Frontend:** Next.js (App Router), Tailwind CSS, Shadcn UI, WebRTC, Zustand/Redux
- **Backend:** Node.js (NestJS/Express), WebSockets, REST + WebRTC Signaling
- **AI Layer:** Gemini/OpenAI/DeepSeek, Whisper/AssemblyAI (Speech-to-text), LangGraph/Custom (Agent Framework)
- **Database:** Neon PostgreSQL (primary managed Postgres provider, optionally Supabase), Redis
- **Infrastructure:** AWS/GCP/Fly.io, TURN/STUN servers

## Development Phases
1.  **Planning:** Finalize PRD, Wireframes, Architecture
2.  **Core Video:** WebRTC, Calls, Chat
3.  **AI Agent:** Speech to text, Summary agent, Action extractor
4.  **UI Polish:** Animations, Branding, Performance
5.  **Testing & Launch:** Load testing, Security testing, Beta release

## Governance
- All development must adhere to the principles outlined in this constitution.
- Changes to this constitution require a documented proposal, review, and approval from the project leads.
- A formal review of compliance will be conducted before each major release.

**Version**: 1.0.0 | **Ratified**: 2025-12-21 | **Last Amended**: 2025-12-21