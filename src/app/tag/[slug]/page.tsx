import db from "@/lib/db";
import PollCard from "@/components/PollCard";
import { Tag as TagIcon } from "lucide-react";
import styles from "../../page.module.css";

export default async function TagPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    // Get tag name
    const tag = db.prepare('SELECT name FROM tags WHERE slug = ?').get(slug) as { name: string } | undefined;
    const tagName = tag ? tag.name : slug;

    const pollsData = db.prepare(`
    SELECT p.*, 
      (SELECT COUNT(*) FROM votes v WHERE v.poll_id = p.id) as total_votes 
    FROM polls p 
    JOIN poll_tags pt ON pt.poll_id = p.id
    JOIN tags t ON t.id = pt.tag_id
    WHERE p.status = 'active' AND t.slug = ?
    ORDER BY total_votes DESC
  `).all(slug);

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
                    <TagIcon size={32} color="var(--accent-primary)" />
                </div>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>#{tagName}</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        {polls.length} active polls with this tag
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
                        No polls found with tag #{tagName}.
                    </div>
                )}
            </div>
        </div>
    );
}
