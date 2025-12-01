const Database = require('better-sqlite3');
const db = new Database('trendpoll.db');
const poll = db.prepare("SELECT * FROM polls WHERE title LIKE '%Mass Jathara%'").get();
console.log(poll ? 'Poll exists' : 'Poll deleted');
