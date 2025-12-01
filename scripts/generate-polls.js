const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'trendpoll.db');
const db = new Database(dbPath);

// Real-world simulated news based on recent search
const newsTopics = [
    {
        topic: "Mass Jathara",
        headline: "Mass Jathara on Netflix: Hit or Flop?",
        options: ["Super Hit", "Average Watch", "Flop", "Better in Theaters"]
    },
    {
        topic: "Akhanda 2",
        headline: "Akhanda 2 Trailer: Does it match the hype?",
        options: ["Exceeded Expectations", "Just Okay", "Disappointing", "Jai Balayya!"]
    },
    {
        topic: "Andhra King Taluka",
        headline: "Andhra King Taluka Box Office Prediction",
        options: ["Blockbuster", "Hit", "Average", "Flop"]
    },
    {
        topic: "Bigg Boss 9",
        headline: "Bigg Boss 9 Telugu: Who will be eliminated this week?",
        options: ["Contestant A", "Contestant B", "Contestant C", "No Elimination"]
    },
    {
        topic: "Game Changer",
        headline: "Game Changer Sankranti Release: Good decision?",
        options: ["Yes, perfect timing", "No, too much competition", "Should release earlier"]
    }
];

function generateDailyPolls() {
    console.log('Starting daily poll generation...');

    const insertPoll = db.prepare(`
    INSERT INTO polls (title, category, status, source) VALUES (@title, @category, 'pending', 'auto')
  `);

    const insertOption = db.prepare(`
    INSERT INTO options (poll_id, text, vote_count) VALUES (@poll_id, @text, 0)
  `);

    const insertTag = db.prepare('INSERT OR IGNORE INTO tags (name, slug) VALUES (?, ?)');
    const getTag = db.prepare('SELECT id FROM tags WHERE slug = ?');
    const linkTag = db.prepare('INSERT OR IGNORE INTO poll_tags (poll_id, tag_id) VALUES (?, ?)');

    let count = 0;

    const transaction = db.transaction(() => {
        for (const news of newsTopics) {
            // Check if similar poll exists to avoid duplicates (simple check)
            const existing = db.prepare('SELECT id FROM polls WHERE title = ?').get(news.headline);
            if (existing) continue;

            const res = insertPoll.run({ title: news.headline, category: 'Cinema' });
            const pollId = res.lastInsertRowid;

            for (const opt of news.options) {
                insertOption.run({ poll_id: pollId, text: opt });
            }

            // Add Tag
            const tagName = news.topic;
            const slug = tagName.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '');
            insertTag.run(tagName, slug);
            const tagId = getTag.get(slug).id;
            linkTag.run(pollId, tagId);

            count++;
        }
    });

    transaction();
    console.log(`Generated ${count} new polls.`);
}

generateDailyPolls();
