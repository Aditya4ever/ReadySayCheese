'use server';

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function createPoll(formData: FormData) {
  const title = formData.get('title') as string;
  const category = formData.get('category') as string;
  const optionsRaw = formData.getAll('options');
  const tagsRaw = formData.get('tags') as string; // Expecting comma separated string

  // Filter out empty options
  const options = optionsRaw.filter(opt => opt.toString().trim() !== '');

  if (!title || !category || options.length < 2) {
    throw new Error('Invalid poll data');
  }

  const insertPoll = db.prepare(`
    INSERT INTO polls (title, category, status, source) VALUES (@title, @category, 'pending', 'user')
  `);

  const insertOption = db.prepare(`
    INSERT INTO options (poll_id, text, vote_count) VALUES (@poll_id, @text, 0)
  `);

  const getTag = db.prepare('SELECT id FROM tags WHERE slug = ?');
  const insertTag = db.prepare('INSERT INTO tags (name, slug) VALUES (?, ?)');
  const linkTag = db.prepare('INSERT INTO poll_tags (poll_id, tag_id) VALUES (?, ?)');

  const transaction = db.transaction(() => {
    const res = insertPoll.run({ title, category });
    const pollId = res.lastInsertRowid;

    for (const option of options) {
      insertOption.run({ poll_id: pollId, text: option });
    }

    // Handle Tags
    if (tagsRaw) {
      const tags = tagsRaw.split(',').map(t => t.trim()).filter(t => t.length > 0);
      for (const tagName of tags) {
        const slug = tagName.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '');
        let tagId;

        const existing = getTag.get(slug) as { id: number } | undefined;
        if (existing) {
          tagId = existing.id;
        } else {
          try {
            const tagRes = insertTag.run(tagName, slug);
            tagId = tagRes.lastInsertRowid;
          } catch (e) {
            // Race condition or duplicate, try get again
            const existingRetry = getTag.get(slug) as { id: number } | undefined;
            if (existingRetry) tagId = existingRetry.id;
            else continue; // Should not happen
          }
        }

        try {
          linkTag.run(pollId, tagId);
        } catch (e) {
          // Ignore duplicate links
        }
      }
    }
  });

  transaction();

  revalidatePath('/');
  return { success: true };
}

export async function vote(pollId: number, optionId: number) {
  const insertVote = db.prepare(`
    INSERT INTO votes (poll_id, option_id) VALUES (@poll_id, @option_id)
  `);

  const updateOption = db.prepare(`
    UPDATE options SET vote_count = vote_count + 1 WHERE id = @optionId
  `);

  const transaction = db.transaction(() => {
    insertVote.run({ poll_id: pollId, option_id: optionId });
    updateOption.run({ optionId });
  });

  transaction();

  revalidatePath('/');
  return { success: true };
}

export async function addCategory(name: string) {
  const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '');

  try {
    const insert = db.prepare('INSERT INTO categories (name, slug) VALUES (?, ?)');
    insert.run(name, slug);
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Failed to add category:', error);
    throw new Error('Category already exists or invalid');
  }
}

export async function getCategories() {
  return db.prepare('SELECT * FROM categories ORDER BY name').all() as { id: number, name: string, slug: string }[];
}

export async function getTrendingTags() {
  return db.prepare(`
    SELECT t.*, COUNT(pt.poll_id) as count 
    FROM tags t
    JOIN poll_tags pt ON pt.tag_id = t.id
    GROUP BY t.id
    ORDER BY count DESC
    LIMIT 10
  `).all() as { id: number, name: string, slug: string, count: number }[];
}

export async function getPollsByStatus(status: string) {
  const polls = db.prepare("SELECT * FROM polls WHERE status = ? ORDER BY created_at DESC").all(status);
  return polls.map((poll: any) => {
    const options = db.prepare('SELECT * FROM options WHERE poll_id = ?').all(poll.id);
    return { ...poll, options };
  });
}

export async function approvePoll(pollId: number) {
  db.prepare("UPDATE polls SET status = 'active' WHERE id = ?").run(pollId);
  revalidatePath('/');
  revalidatePath('/admin');
  return { success: true };
}

export async function deletePoll(pollId: number) {
  db.prepare("DELETE FROM polls WHERE id = ?").run(pollId);
  revalidatePath('/');
  revalidatePath('/admin');
  return { success: true };
}
