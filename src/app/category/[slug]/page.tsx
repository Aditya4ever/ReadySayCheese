import db from "@/lib/db";
import PollCard from "@/components/PollCard";
import { Hash } from "lucide-react";
import styles from "../../page.module.css";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const category = slug.charAt(0).toUpperCase() + slug.slice(1);

    const pollsData = db.prepare(`
    SELECT p.*, 
      (SELECT COUNT(*) FROM votes v WHERE v.poll_id = p.id) as total_votes 
    FROM polls p 
    WHERE p.status = 'active' AND p.category = ?
    ORDER BY total_votes DESC
  `).all(category);

    const polls = pollsData.map((poll: any) => {
        const options = db.prepare('SELECT * FROM options WHERE poll_id = ?').all(poll.id);
        const tags = db.prepare(`
      SELECT t.* FROM tags t
      JOIN poll_tags pt ON pt.tag_id = t.id
      WHERE pt.poll_id = ?
    `).all(poll.id);
        return { ...poll, options, tags };
    });

    return (
        <div className={styles.home}>
            <div className="glass-panel" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                    background: 'rgba(255,255,255,0.1)',
                    padding: '12px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Hash size={32} color="var(--accent-primary)" />
                </div>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>{category}</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        {polls.length} active polls in this category
                    </p>
                </div>
            </div>

            <div className={styles.grid}>
                {polls.length > 0 ? (
                    polls.map((poll: any) => (
                        <PollCard key={poll.id} poll={poll} />
                    ))
                ) : (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                        No polls found in {category}. Be the first to create one!
                    </div>
                )}
            </div>
        </div>
    );
}
