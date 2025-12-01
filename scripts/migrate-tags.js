const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'trendpoll.db');
const db = new Database(dbPath);

const schema = `
  CREATE TABLE IF NOT EXISTS tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL
  );

  CREATE TABLE IF NOT EXISTS poll_tags (
    poll_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,
    PRIMARY KEY (poll_id, tag_id),
    FOREIGN KEY (poll_id) REFERENCES polls(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
  );
`;

try {
    db.exec(schema);
    console.log('Tags tables created successfully.');

    // Seed some initial tags for existing polls (optional, but good for testing)
    // Let's just leave it empty for now and test via creation
} catch (error) {
    console.error('Failed to migrate tags:', error);
}
