'use client';

import { useState, useEffect } from 'react';
import { getPollsByStatus, approvePoll, deletePoll } from '@/app/actions';
import { Check, X, Loader2 } from 'lucide-react';
import styles from './page.module.css';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<'pending' | 'active'>('pending');
    const [polls, setPolls] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPolls = async () => {
        setLoading(true);
        try {
            const data = await getPollsByStatus(activeTab);
            setPolls(data);
        } catch (error) {
            console.error("Failed to fetch polls:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPolls();
    }, [activeTab]);

    const handleApprove = async (id: number) => {
        await approvePoll(id);
        fetchPolls();
    };

    const handleDelete = async (id: number) => {
        await deletePoll(id);
        fetchPolls();
    };

    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Admin Dashboard</h1>
                <div className="glass-panel" style={{ padding: '4px', display: 'flex', gap: '4px', borderRadius: '8px' }}>
                    <button
                        onClick={() => setActiveTab('pending')}
                        className="btn"
                        style={{
                            background: activeTab === 'pending' ? 'rgba(255,255,255,0.1)' : 'transparent',
                            color: activeTab === 'pending' ? 'var(--text-primary)' : 'var(--text-secondary)',
                            border: 'none',
                            fontSize: '0.9rem'
                        }}
                    >
                        Moderation Queue
                    </button>
                    <button
                        onClick={() => setActiveTab('active')}
                        className="btn"
                        style={{
                            background: activeTab === 'active' ? 'rgba(255,255,255,0.1)' : 'transparent',
                            color: activeTab === 'active' ? 'var(--text-primary)' : 'var(--text-secondary)',
                            border: 'none',
                            fontSize: '0.9rem'
                        }}
                    >
                        Live Polls
                    </button>
                </div>
            </div>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center' }}><Loader2 className="spin" /></div>
            ) : polls.length === 0 ? (
                <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No {activeTab} polls found.
                </div>
            ) : (
                <div className={styles.grid}>
                    {polls.map(poll => (
                        <div key={poll.id} className={`glass-panel ${styles.card}`}>
                            <div className={styles.header}>
                                <span className={`category-${poll.category.toLowerCase()}`} style={{
                                    textTransform: 'uppercase',
                                    fontSize: '0.7rem',
                                    fontWeight: 800,
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    background: 'rgba(255,255,255,0.05)'
                                }}>
                                    {poll.category}
                                </span>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                    Source: {poll.source}
                                </span>
                            </div>

                            <h3 style={{ margin: '1rem 0', fontSize: '1.1rem' }}>{poll.title}</h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                                {poll.options.map((opt: any) => (
                                    <div key={opt.id} style={{
                                        padding: '8px',
                                        background: 'rgba(255,255,255,0.03)',
                                        borderRadius: '4px',
                                        fontSize: '0.9rem'
                                    }}>
                                        {opt.text}
                                    </div>
                                ))}
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto' }}>
                                {activeTab === 'pending' && (
                                    <button
                                        onClick={() => handleApprove(poll.id)}
                                        className="btn"
                                        style={{ flex: 1, background: 'rgba(0, 255, 100, 0.1)', color: '#4ade80', border: '1px solid rgba(0, 255, 100, 0.2)' }}
                                    >
                                        <Check size={16} style={{ marginRight: '6px' }} /> Approve
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDelete(poll.id)}
                                    className="btn"
                                    style={{ flex: 1, background: 'rgba(255, 50, 50, 0.1)', color: '#f87171', border: '1px solid rgba(255, 50, 50, 0.2)' }}
                                >
                                    <X size={16} style={{ marginRight: '6px' }} /> {activeTab === 'pending' ? 'Reject' : 'Delete'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
