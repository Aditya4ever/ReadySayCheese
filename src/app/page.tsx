import styles from "./page.module.css";
import { TrendingUp, Activity } from "lucide-react";
import db from "@/lib/db";
import PollCard from "@/components/PollCard";

// Server Component
export default function Home() {
  // Fetch active polls
  const pollsData = db.prepare(`
    SELECT p.*, 
      (SELECT COUNT(*) FROM votes v WHERE v.poll_id = p.id) as total_votes 
    FROM polls p 
    WHERE p.status = 'active'
    ORDER BY total_votes DESC
  `).all();

  // Fetch options and tags for each poll
  const polls = pollsData.map((poll: any) => {
    const options = db.prepare('SELECT * FROM options WHERE poll_id = ?').all(poll.id);
    const tags = db.prepare(`
      SELECT t.* FROM tags t
      JOIN poll_tags pt ON pt.tag_id = t.id
      WHERE pt.poll_id = ?
    `).all(poll.id);
    return { ...poll, options, tags };
  });

  const topPoll = polls[0];

  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          {/* Background Glow Effect */}
          <div style={{ position: 'absolute', top: '-50%', left: '50%', transform: 'translateX(-50%)', width: '60%', height: '200%', background: 'radial-gradient(circle, rgba(0,242,255,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

          <h1 className="gradient-text" style={{ fontSize: '3.5rem', marginBottom: '1rem', fontWeight: 800 }}>
            The Pulse of Now
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
            Vote on the hottest topics in Politics, Tech, and Culture.
            Build your Oracle Score by predicting the future.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', position: 'relative', zIndex: 10 }}>
            <button className="btn btn-primary">
              <TrendingUp size={20} style={{ marginRight: '8px' }} />
              Start Voting
            </button>
            <button className="btn btn-ghost">
              <Activity size={20} style={{ marginRight: '8px' }} />
              View Leaderboard
            </button>
          </div>
        </div>
      </section>

      <section>
        <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <TrendingUp size={24} color="var(--accent-primary)" />
          Trending Polls
        </h2>
        <div className={styles.grid}>
          {polls.map((poll: any) => (
            <PollCard key={poll.id} poll={poll} />
          ))}
        </div>
      </section>
    </div>
  );
}
