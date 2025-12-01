'use client';

import styles from './PollCard.module.css';
import { BarChart2 } from 'lucide-react';
import { vote } from '@/app/actions';
import { useState, useOptimistic } from 'react';
import { useXP } from '@/hooks/useXP';
import { BRAHMI_REACTIONS } from '@/lib/assets';

interface Option {
    id: number;
    text: string;
    vote_count: number;
}

interface Tag {
    id: number;
    name: string;
    slug: string;
}

interface Poll {
    id: number;
    title: string;
    category: string;
    total_votes: number;
    options: Option[];
    tags?: Tag[];
}

export default function PollCard({ poll }: { poll: Poll }) {
    const [hasVoted, setHasVoted] = useState(false);
    const { addXP } = useXP();
    const [reaction, setReaction] = useState<{ url: string, label: string } | null>(null);

    // Optimistic UI state
    const [optimisticPoll, addOptimisticVote] = useOptimistic(
        poll,
        (state: Poll, votedOptionId: number) => {
            const updatedOptions = state.options.map(opt =>
                opt.id === votedOptionId
                    ? { ...opt, vote_count: opt.vote_count + 1 }
                    : opt
            );
            return {
                ...state,
                total_votes: state.total_votes + 1,
                options: updatedOptions
            };
        }
    );

    const handleVote = async (optionId: number) => {
        if (hasVoted) return;

        // Show random reaction
        const randomReaction = BRAHMI_REACTIONS[Math.floor(Math.random() * BRAHMI_REACTIONS.length)];
        setReaction(randomReaction);

        addOptimisticVote(optionId);
        setHasVoted(true);
        addXP(10); // Gamification: +10 XP per vote

        try {
            await vote(poll.id, optionId);
        } catch (error) {
            console.error("Vote failed", error);
        }
    };

    const leadingOption = optimisticPoll.options.reduce((prev, current) =>
        (prev.vote_count > current.vote_count) ? prev : current
    );

    const percentage = optimisticPoll.total_votes > 0
        ? Math.round((leadingOption.vote_count / optimisticPoll.total_votes) * 100)
        : 0;

    return (
        <div className={`glass-panel ${styles.card} ${hasVoted ? styles.voted : ''}`}>
            <div className={styles.header}>
                <span className={`${styles.category} category-${poll.category.toLowerCase()}`}>
                    {poll.category}
                </span>
                <span className={styles.votes}>
                    <BarChart2 size={14} />
                    {optimisticPoll.total_votes} votes
                </span>
            </div>

            <h3 className={styles.title}>{poll.title}</h3>

            <div className={styles.optionsGrid}>
                {optimisticPoll.options.map((option) => {
                    const optPercentage = optimisticPoll.total_votes > 0
                        ? Math.round((option.vote_count / optimisticPoll.total_votes) * 100)
                        : 0;

                    return (
                        <button
                            key={option.id}
                            className={styles.optionBtn}
                            onClick={() => handleVote(option.id)}
                            disabled={hasVoted}
                        >
                            <div className={styles.optionBg} style={{ width: `${optPercentage}%` }} />
                            <span className={styles.optionText}>{option.text}</span>
                            {hasVoted && <span className={styles.optionPercent}>{optPercentage}%</span>}
                        </button>
                    );
                })}
            </div>

            <div className={styles.prediction}>
                <div className={styles.meta}>
                    <span className={styles.leadingText}>Leading: {leadingOption.text}</span>
                    <span className={styles.percentage}>{percentage}%</span>
                </div>
            </div>

            {poll.tags && poll.tags.length > 0 && (
                <div className={styles.tags}>
                    {poll.tags.map(tag => (
                        <a key={tag.id} href={`/tag/${tag.slug}`} className={styles.tag}>
                            #{tag.name}
                        </a>
                    ))}
                </div>
            )}

            {reaction && (
                <div className={styles.reactionOverlay}>
                    <img src={reaction.url} alt={reaction.label} className={styles.reactionGif} />
                    <span className={styles.reactionLabel}>{reaction.label}!</span>
                </div>
            )}
        </div>
    );
}
