# Poll Generation & News Monitoring Plan

## Objective
To accurately and extensively monitor latest Telugu movie news and automatically generate relevant polls.

## Data Sources (RSS Feeds)
We will aggregate news from the following high-quality RSS feeds:
1.  **TrackTollywood**: `https://tracktollywood.com/feed`
2.  **FilmiBeat Telugu**: `https://telugu.filmibeat.com/rss/news-fb.xml`
3.  **TeluguBulletin**: `https://telugubulletin.com/movies/feed`
4.  **CineJosh**: `http://www.cinejosh.com/rss-feed/1/news.html`
5.  **Gulte**: `https://www.gulte.com/feed` (Verified)
6.  **IndiaGlitz**: `https://www.indiaglitz.com/telugu-movies-rss`

## Architecture

### 1. News Aggregator Service
*   **Technology**: Node.js with `rss-parser`.
*   **Function**: Periodically (e.g., every 6 hours) fetches items from the list of RSS feeds.
*   **Deduplication**: Uses a hash of the article title/link to prevent processing the same news twice.

### 2. Content Analysis & Poll Generation (LLM Integration)
*   **Role**: To convert raw news articles into engaging poll questions.
*   **Prompt Engineering**:
    *   Input: News Headline + Description.
    *   Task: "Create a controversial or engaging poll question based on this news. Provide 3-4 options."
    *   Output Format: JSON `{ "question": "...", "options": ["...", "..."], "tags": ["..."] }`
*   **Model**: Gemini Pro (via Vertex AI) or OpenAI GPT-4o.

### 3. Filtering & Quality Control
*   **Keyword Filtering**: Prioritize news containing keywords like "Review", "Box Office", "Trailer", "Teaser", "Release Date", "Controversy".
*   **Time Window**: Only consider news from the last 24-48 hours to keep polls fresh.

### 4. Database Integration
*   Generated polls are inserted into the `polls` table with `status = 'pending'` and `source = 'auto_rss'`.
*   Admins review these in the Moderation Queue.

## Implementation Steps
1.  Install `rss-parser`.
2.  Create `scripts/fetch-news.js` to prototype the aggregator.
3.  Integrate with an LLM (mocked for now, or using a real key if available) to generate poll structures.
4.  Schedule the script (Cron job or Vercel Cron).
