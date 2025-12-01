const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'trendpoll.db');
const db = new Database(dbPath);

const polls = [
    {
        title: "Will Bitcoin hit $100k by end of 2025?",
        category: "Stocks",
        options: ["Yes", "No", "Maybe"]
    },
    {
        title: "Best Picture Oscar 2026 Prediction",
        category: "Cinema",
        options: ["Oppenheimer 2", "Barbie 2", "Dune: Messiah", "Other"]
    },
    {
        title: "Next US President Party Affiliation?",
        category: "Politics",
        options: ["Democrat", "Republican", "Independent"]
    },
    {
        title: "Will AI replace Junior Developers by 2027?",
        category: "Tech",
        options: ["Yes, completely", "No, just assist", "Unlikely"]
    },
    {
        title: "Global Temperature Rise > 1.5C in 2026?",
        category: "World",
        options: ["Yes", "No"]
    }
];

const insertPoll = db.prepare(`
  INSERT INTO polls (title, category, status) VALUES (@title, @category, 'active')
`);

const insertOption = db.prepare(`
  INSERT INTO options (poll_id, text, vote_count) VALUES (@poll_id, @text, @vote_count)
`);

const insertUser = db.prepare(`
  INSERT INTO users (username, oracle_score) VALUES (@username, @oracle_score)
`);

const insertVote = db.prepare(`
  INSERT INTO votes (user_id, poll_id, option_id) VALUES (@user_id, @poll_id, @option_id)
`);

const transaction = db.transaction(() => {
    // Clear existing
    db.prepare('DELETE FROM votes').run();
    db.prepare('DELETE FROM options').run();
    db.prepare('DELETE FROM polls').run();
    db.prepare('DELETE FROM users').run();

    // Create Users
    const userIds = [];
    for (let i = 0; i < 50; i++) {
        const res = insertUser.run({ username: `user_${i}`, oracle_score: Math.floor(Math.random() * 1000) });
        userIds.push(res.lastInsertRowid);
    }

    // Create Polls
    for (const poll of polls) {
        const res = insertPoll.run({ title: poll.title, category: poll.category });
        const pollId = res.lastInsertRowid;

        const optionIds = [];
        for (const text of poll.options) {
            const optRes = insertOption.run({ poll_id: pollId, text, vote_count: 0 });
            optionIds.push(optRes.lastInsertRowid);
        }

        // Simulate Votes
        const numVotes = Math.floor(Math.random() * 200) + 20; // 20-220 votes
        for (let i = 0; i < numVotes; i++) {
            const randomUser = userIds[Math.floor(Math.random() * userIds.length)];
            const randomOption = optionIds[Math.floor(Math.random() * optionIds.length)];

            insertVote.run({ user_id: randomUser, poll_id: pollId, option_id: randomOption });

            // Update vote count
            db.prepare('UPDATE options SET vote_count = vote_count + 1 WHERE id = ?').run(randomOption);
        }
    }
});

try {
    transaction();
    console.log('Database seeded successfully with fake data.');
} catch (error) {
    console.error('Failed to seed database:', error);
}
