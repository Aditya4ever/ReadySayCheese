# Implementation Plan - TrendPoll

TrendPoll is a modern, engaging polling platform focused on trending topics. It mimics the sleek, data-heavy feel of prediction markets (like Polymarket) but focuses on social engagement and "play" rather than real-money betting.

## Goal
Create a self-sufficient, visually stunning polling web app where users can vote on trending topics, track their "prediction accuracy," and explore categorized content.

## User Review Required
> [!IMPORTANT]
> **Gamification Strategy**: I am proposing an "Oracle Score" system. Users start with 0 points and gain points for:
> 1. Voting on the winning outcome (for factual polls).
> 2. Voting on the majority outcome (for opinion polls, rewarded after 24h).
> This adds a "game" element without monetary risk.

## Proposed Changes

### Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Vanilla CSS (CSS Modules + CSS Variables for theming)
- **Database**: SQLite (local file `trendpoll.db`) using `better-sqlite3`
- **Icons**: `lucide-react`

### 1. Design System (`/app/globals.css`)
- **Theme**: "Cyber-Minimal". Dark mode by default.
- **Colors**: Deep charcoals (`#0f172a`), vibrant accents (Neon Blue `#00f2ff` for tech, Sunset Orange `#ff4d00` for politics).
- **Typography**: `Inter` or `Outfit` (Google Fonts).
- **Components**: Glassmorphism cards, glowing borders for active elements.

### 2. Database Schema (`/lib/db.js`)
- `users`: id, username, oracle_score
- `polls`: id, title, description, category, status (pending/active/closed), created_at, ends_at
- `options`: id, poll_id, text, vote_count
- `votes`: id, user_id, poll_id, option_id

### 3. Core Components
#### [NEW] [PollCard.js](file:///app/components/PollCard.js)
- Displays title, total votes, and a dynamic progress bar for the leading option.
- "Sparkline" or mini-chart visualization.

#### [NEW] [CreatePollModal.js](file:///app/components/CreatePollModal.js)
- Simple form: Title, Description, Category, Options (2-4).
- Submits to "Pending" state.

#### [NEW] [CategoryFilter.js](file:///app/components/CategoryFilter.js)
- Pill-shaped scrollable list for categories (Politics, World, Cinema, Stocks).

### 4. Pages
#### [NEW] [page.js](file:///app/page.js) (Home)
- **Hero Section**: "Trending Now" - The #1 most active poll with a large visualization.
- **Grid**: Cards for other active polls.

#### [NEW] [poll/[id]/page.js](file:///app/poll/[id]/page.js) (Detail)
- Detailed view with full voting history (mocked chart for MVP).
- Comments/Reactions section.

## Clarification & Strategy

### Open Questions
1.  **Truth Resolution**: For factual polls (e.g., "Will X happen?"), who decides the winner? *Proposal: Moderator manually resolves it.*
2.  **Poll Duration**: Do polls close automatically? *Proposal: Default 7 days, or manual close.*
3.  **User Identity**: Do we need login? *Proposal: Simple "Guest" cookie-based identity for MVP to reduce friction.*

### Testing Strategy (No Real Users)
Since we don't have real traffic, we will simulate it to verify the "Trending" logic and UI performance.

1.  **Seed Script (`scripts/seed.js`)**:
    - Creates 50 fake users.
    - Creates 20 polls across categories (Politics, Cinema, etc.).
2.  **Simulation Script (`scripts/simulate_activity.js`)**:
    - Runs a loop that picks a random user and a random active poll.
    - Casts a vote.
    - This will populate the "Trending" dashboard with live-updating numbers.
3.  **Persona Testing**:
    - **The Moderator**: You login as admin, see "Pending" polls, approve/reject them.
    - **The Gamer**: You vote on 5 polls, run the "resolve" script, and check if your "Oracle Score" increased.
