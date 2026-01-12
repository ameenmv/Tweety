# Quizify — Structural Summary, DB Design, Routes, Frontend Structure & V2 Plan 

> **Author:** Ameen Mohamed
> **Document purpose:** concise, well-organized reference containing the project structure, database design, API routes, frontend structure and tech choices (what's in v1) and the planned heavy features for v2 (front-end and back-end). Use this as the single-source-of-truth when implementing or reviewing the codebase.
 
---

## 1. Project high-level structure

Two repositories recommended: `quizify-backend` (Laravel) and `quizify-frontend` (Vue 3 + Vite).

### Backend (quizify-backend)

```
quizify-backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── AuthController.php
│   │   │   ├── QuizController.php
│   │   │   ├── QuestionController.php
│   │   │   ├── AnswerController.php
│   │   │   └── ResultController.php
│   │   └── Middleware/
│   ├── Models/
│   │   ├── User.php
│   │   ├── Quiz.php
│   │   ├── Question.php
│   │   ├── Answer.php
│   │   └── UserQuiz.php
│   └── Providers/
├── database/
│   ├── migrations/
│   └── seeders/
├── routes/
│   └── api.php
├── config/
└── composer.json
```

### Frontend (quizify-frontend)

```
quizify-frontend/
├── public/
├── src/
│   ├── assets/
│   ├── components/       # small reusable pieces (QuizCard, Timer, AnswerOption, Modal)
│   ├── layouts/          # MainLayout, AuthLayout, QuizLayout
│   ├── pages/            # Home, CreateQuiz, AddQuestions, QuizTake, Result, Profile
│   ├── router/           # route definitions
│   ├── store/            # Pinia stores (auth, quizzes, results)
│   ├── services/         # api.js (axios instance), quizService.js
│   ├── utils/            # helpers (timer, validation, score calc)
│   └── App.vue
├── index.html
└── package.json
```

---

## 2. Database design (concise ER)

**Entities:** users, quizzes, questions, answers, user_quizzes

### users

* `id` (PK)
* `name` (string)
* `email` (unique)
* `password` (hashed)
* `remember_token`
* `created_at`, `updated_at`

### quizzes

* `id` (PK)
* `title` (string)
* `description` (text, nullable)
* `duration` (int, minutes)
* `difficulty` (enum: easy, medium, hard)
* `user_id` (FK -> users.id) — owner/creator
* `is_published` (boolean, default false)
* `created_at`, `updated_at`

### questions

* `id` (PK)
* `quiz_id` (FK -> quizzes.id)
* `question_text` (text)
* `explanation` (text, nullable) — for post-quiz feedback
* `order` (int) — optional for custom ordering
* `created_at`, `updated_at`

### answers

* `id` (PK)
* `question_id` (FK -> questions.id)
* `answer_text` (text)
* `is_correct` (boolean)
* `created_at`, `updated_at`

### user_quizzes (attempts)

* `id` (PK)
* `user_id` (FK -> users.id)
* `quiz_id` (FK -> quizzes.id)
* `score` (integer 0-100)
* `duration_seconds` (int) — how long user took
* `completed_at` (timestamp)
* `metadata` (json, optional) — store per-question answers if needed
* `created_at`, `updated_at`

**Indexes & constraints**

* Foreign keys on `user_id`, `quiz_id`, `question_id` with `onDelete('cascade')`.
* Index `quiz_id` on `questions`, `question_id` on `answers`, `user_id` on `user_quizzes`.

---

## 3. API routes (v1) — `routes/api.php`

All routes under `auth:sanctum` where needed. Public read endpoints allowed for listing quizzes.

### Auth

* `POST /api/register` — register new user
* `POST /api/login` — login and get token
* `GET /api/me` — current user (auth)

### Quiz management (creator-owned)

* `GET /api/quizzes` — list quizzes (public; supports pagination, filters)
* `GET /api/quizzes/{id}` — quiz details (questions + answers)
* `POST /api/quizzes` — create new quiz (auth)
* `PUT /api/quizzes/{id}` — update quiz (auth & owner)
* `DELETE /api/quizzes/{id}` — delete quiz (auth & owner)

### Questions & answers (owner-only for modifications)

* `POST /api/quizzes/{id}/questions` — add question + answers (auth & owner)
* `PUT /api/questions/{id}` — edit question (auth & owner)
* `DELETE /api/questions/{id}` — delete question (auth & owner)
* `POST /api/questions/{id}/answers` — add answers (auth & owner)

### Attempts & results

* `POST /api/quizzes/{id}/submit` — submit answers, compute score (auth)

  * payload: `{ answers: [{ question_id, answer_id }, ...] }` or map `{ question_id: answer_id }`
* `GET /api/results` — user attempts history (auth)
* `GET /api/quizzes/{id}/results` — owner analytics (optional)

**Middleware**

* `auth:sanctum` for protected endpoints
* Owner-check inside controllers (only creators can modify their quizzes)

---

## 4. Frontend structure & key flows

### Pages (high level)

* `Home` — list quizzes, search, filter by difficulty
* `Login / Register` — auth flows
* `CreateQuiz` — create quiz meta (title, description, duration, difficulty)
* `AddQuestions` — UI to add questions & answers (multiple choices)
* `QuizTake` — take quiz: questions pagination, timer, progress
* `Result` — show score, per-question feedback, share
* `Profile` — user quizzes and attempts

### Components (examples)

* `QuizCard.vue` — shows quiz meta and CTA
* `QuestionForm.vue` — used in AddQuestions with dynamic answers inputs
* `Timer.vue` — countdown circular + numeric
* `AnswerOption.vue` — radio/checkbox UI
* `Pagination.vue` — for quiz list

### Stores (Pinia)

* `useAuthStore` — user, token, login/logout
* `useQuizStore` — current quiz, list, create/update flows
* `useResultStore` — saving last attempt, history

### Services

* `api.js` — axios instance with Bearer token interceptor.
* `quizService.js` — wrapper functions: `getQuizzes`, `getQuiz`, `createQuiz`, `addQuestion`, `submitQuiz`.

### UX details

* When creating quiz: create quiz metadata first, then redirect to AddQuestions with created quiz id.
* AddQuestions: allow adding multiple answers, mark correct answer(s), optional explanation.
* QuizTake: immutable question order by default; allow shuffle option; autosave answers locally in case of disconnect.
* Timer: stop on submit or when time expires, auto-submit if expired.

---

## 5. Security & validation (notes)

* Validate payloads in controllers (title required, question_text required, answers min 2, at least one correct).
* Rate-limit `POST /api/quizzes` and `POST /api/quizzes/{id}/questions` for spam protection.
* Sanitize stored text to avoid XSS in frontend display (use safe rendering).

---

## 6. What will be added in **Version 2** (V2) — heavy front & back features

Below are concrete features classified Frontend vs Backend with short descriptions and proposed endpoints / tables.

### Backend V2 (heavy)

1. **Quiz Versioning**

   * New tables: `quiz_versions` and `question_versions`.
   * Allow editing draft version while published version remains live.
   * Endpoint: `POST /api/quizzes/{id}/versions` — create version; `POST /api/quizzes/{id}/publish`.

2. **Per-question analytics & aggregated stats**

   * New table: `question_stats` (question_id, attempts, correct_count, avg_time_sec).
   * Endpoint: `GET /api/quizzes/{id}/analytics` — returns attempts, avg_score, question pass rates.

3. **Real-time multiplayer & live rooms**

   * Add websockets: Laravel Websockets or Pusher.
   * New endpoints: `POST /api/quizzes/{id}/rooms` (create room), `POST /api/rooms/{roomId}/join`.
   * Real-time messages: question broadcast, live leaderboard.

4. **Leaderboards & achievements**

   * Tables: `leaderboards`, `achievements`, `user_achievements`.
   * Endpoints: `GET /api/quizzes/{id}/leaderboard`.

5. **Advanced content moderation & reporting**

   * Tables: `reports` (reported_by, target_type, target_id, reason, status).
   * Admin endpoints (if reintroduce roles): `/api/admin/reports`.

6. **Paid & gated quizzes (payments)**

   * Add `price` field on quizzes and integration with Stripe endpoints.

7. **Export / import & webhooks**

   * Allow quiz export (JSON), import, and webhooks for external systems.

### Frontend V2 (heavy UX & features)

1. **Rich Builder UI (drag & drop)**

   * Drag/drop reorder questions, build complex question types (images, code blocks).
   * Use libraries: `vue-draggable-next`, `interactjs`.

2. **Realtime multiplayer UI**

   * Live room lobby, synchronized timer, live scoreboard with socket events.

3. **Analytics Dashboards**

   * Charts & tables for owners: attempts over time, question difficulty heatmaps.
   * Use charting libs: `recharts`, `chart.js`, or `apexcharts`.

4. **Progressive Web App (PWA) & offline support**

   * Cache quiz questions for offline attempts; sync attempts when back online.

5. **UX Polishing & Theming**

   * Theme system (dark/light), animations (GSAP), micro interactions, confetti on success.

6. **Social & Sharing**

   * Share results, social embeds, public leaderboards.

---

## 7. Migration / rollout strategy for V2

* Use feature flags and a `v2` branch.
* Deploy incremental endpoints behind flags.
* Backfill analytics data from `user_quizzes` into `question_stats` with a migration script.
* Introduce new DB tables via migrations; keep backward compatibility.

---

## 8. Implementation checklist (short)

* [ ] Migrations for v1 tables
* [ ] Controllers and endpoints (auth, quiz CRUD, question CRUD, submit)
* [ ] Pinia stores and axios service
* [ ] CreateQuiz + AddQuestions + QuizTake pages
* [ ] Validation and owner-checking middleware
* [ ] Seeders for demo data

---

## 9. Next actions I can do now (pick one)

* Generate the exact migration files and controllers (Laravel) ready to paste.
* Scaffold the full Vue components + Pinia stores (files ready to copy).
* Create a Postman collection JSON for v1 endpoints.

---

*End of structural summary & V2 plan.*
