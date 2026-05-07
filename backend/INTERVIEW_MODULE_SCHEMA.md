# AI Mock Interview & Preparation Hub Schema

This module uses the existing Express + MongoDB architecture.

## Collections

- `Users`: existing auth users with `applicant` and `recruiter` roles.
- `InterviewCompanies`: company overview, hiring process, eligibility, package range, job locations, rounds, and preparation links.
- `InterviewRoles`: role roadmaps, required skills, tools, questions, challenges, and mini quizzes.
- `InterviewQuestions`: objective, subjective, coding, HR, aptitude, and system design questions with company, role, category, difficulty, tags, answer, explanation, and time limit.
- `InterviewSessions`: generated mock interview sessions, answers, transcripts, per-question feedback, and final scorecard.
- `InterviewAnalytics`: streaks, accuracy, time spent, weak topics, recommendations, charts, saved questions, and recent attempts.
- `InterviewExperiences`: student experiences with likes, dislikes, comments, and moderation status.
- `InterviewResources`: videos, PDFs, articles, and coding practice links.

## API Surface

- `GET /api/v1/interview/company/get`
- `POST /api/v1/interview/company/create`
- `GET /api/v1/interview/roles`
- `POST /api/v1/interview/roles`
- `GET /api/v1/interview/questions/all`
- `POST /api/v1/interview/question/create`
- `POST /api/v1/interview/mock/start`
- `POST /api/v1/interview/mock/evaluate`
- `GET /api/v1/interview/history`
- `GET /api/v1/interview/analytics`
- `GET|POST /api/v1/interview/experiences`
- `GET|POST /api/v1/interview/resources`
- `POST /api/v1/interview/code-review`
- `POST /api/v1/interview/seed`

## AI Integration Hook

The controller currently provides deterministic AI-style fallback feedback. To connect OpenAI or Gemini, replace `buildFeedback`, `generateFallbackQuestions`, and `runCodeReview` internals with provider calls while keeping the same response contract.
