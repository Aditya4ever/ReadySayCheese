const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'trendpoll.db');
const db = new Database(dbPath);

// 1. Create a dummy pending poll
const insert = db.prepare("INSERT INTO polls (title, category, status, source) VALUES ('Test Reject Poll', 'Tech', 'pending', 'auto')");
const info = insert.run();
const pollId = info.lastInsertRowid;

console.log(`Created pending poll with ID: ${pollId}`);

// 2. Verify it exists
const poll = db.prepare("SELECT * FROM polls WHERE id = ?").get(pollId);
if (poll && poll.status === 'pending') {
    console.log('Poll verified as pending.');
} else {
    console.error('Failed to create pending poll.');
    process.exit(1);
}

// 3. Simulate reject (delete)
db.prepare("DELETE FROM polls WHERE id = ?").run(pollId);
console.log('Executed delete command.');

// 4. Verify it's gone
const deletedPoll = db.prepare("SELECT * FROM polls WHERE id = ?").get(pollId);
if (!deletedPoll) {
    console.log('Poll successfully deleted from database.');
} else {
    console.error('Poll still exists!');
}
