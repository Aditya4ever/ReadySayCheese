# TrendPoll Future Roadmap & To-Do List

## High Priority (Production Readiness)
- [ ] **Database Migration**: Migrate from SQLite to PostgreSQL.
    - **Reasoning**:
        1.  **Ephemeral Filesystems**: SQLite files are lost on deployments to platforms like Vercel/AWS ECS. Postgres persists data independently.
        2.  **Concurrency**: Postgres handles thousands of concurrent writes (votes) via MVCC, whereas SQLite locks the DB on writes.
        3.  **Data Integrity**: Strict typing and advanced features (JSONB, etc.) in Postgres prevent data corruption.
    - **Action Plan**:
        - Set up a Postgres instance (Supabase/Neon).
        - Replace `better-sqlite3` with an ORM like Drizzle or Prisma.
        - Update data access layer to use the new client.

- [ ] **Authentication & Security**: Secure the `/admin` route.
    - Implement NextAuth.js (Auth.js) or basic middleware protection.
    - Ensure only authorized users can access moderation tools.

## Medium Priority (Enhancements)
- [ ] **Testing Suite**:
    - Add Unit Tests for server actions.
    - Add E2E tests with Playwright for voting and poll creation flows.
- [ ] **Code Refactoring**:
    - Split `src/app/actions.ts` into domain-specific files (`polls.ts`, `admin.ts`, etc.).

## Low Priority (Features)
- [ ] **Advanced Analytics**: Show voting trends over time.
- [ ] **User Profiles**: Allow users to see their voting history and earned XP.
