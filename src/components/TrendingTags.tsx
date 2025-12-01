'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getTrendingTags } from '@/app/actions';
import { Hash } from 'lucide-react';

export default function TrendingTags() {
    const [tags, setTags] = useState<{ id: number, name: string, slug: string, count: number }[]>([]);

    useEffect(() => {
        getTrendingTags().then(setTags);
    }, []);

    if (tags.length === 0) return null;

    return (
        <div className="container" style={{
            display: 'flex',
            gap: '12px',
            overflowX: 'auto',
            padding: '1rem 0',
            scrollbarWidth: 'none',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            marginBottom: '2rem'
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: 'var(--accent-primary)',
                fontWeight: 600,
                fontSize: '0.9rem',
                whiteSpace: 'nowrap'
            }}>
                <Hash size={14} /> Trending:
            </div>
            {tags.map(tag => (
                <Link
                    key={tag.id}
                    href={`/tag/${tag.slug}`}
                    style={{
                        fontSize: '0.85rem',
                        color: 'var(--text-secondary)',
                        background: 'rgba(255,255,255,0.03)',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        textDecoration: 'none',
                        whiteSpace: 'nowrap',
                        transition: 'all 0.2s',
                        border: '1px solid transparent'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.background = 'rgba(0, 242, 255, 0.1)';
                        e.currentTarget.style.color = 'var(--accent-primary)';
                        e.currentTarget.style.borderColor = 'rgba(0, 242, 255, 0.2)';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                        e.currentTarget.style.color = 'var(--text-secondary)';
                        e.currentTarget.style.borderColor = 'transparent';
                    }}
                >
                    #{tag.name}
                </Link>
            ))}
        </div>
    );
}
