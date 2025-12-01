'use client';
'use client';

import Link from 'next/link';
import styles from './Navbar.module.css';
import { Zap, Plus, Trophy, Settings } from 'lucide-react';
import { useState, useEffect } from 'react';
import CreatePollModal from './CreatePollModal';
import SettingsMenu from './SettingsMenu';
import AddCategoryModal from './AddCategoryModal';
import { useXP } from '@/hooks/useXP';
import { getCategories } from '@/app/actions';

export default function Navbar() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const { xp } = useXP();
    const [displayXp, setDisplayXp] = useState(0);
    const [categories, setCategories] = useState<{ id: number, name: string, slug: string }[]>([]);

    useEffect(() => {
        setDisplayXp(xp);

        const handleStorage = () => {
            const stored = localStorage.getItem('trendpoll_xp');
            if (stored) setDisplayXp(parseInt(stored));
        };

        window.addEventListener('xp-updated', handleStorage);

        // Fetch categories
        getCategories().then(setCategories);

        return () => window.removeEventListener('xp-updated', handleStorage);
    }, [xp]);

    return (
        <>
            <nav className={`container ${styles.navbar}`}>
                <Link href="/" className={styles.logo}>
                    <Zap size={24} color="var(--accent-primary)" fill="var(--accent-primary)" />
                    <span className="gradient-text">TrendPoll</span>
                </Link>

                <div className={styles.navLinks}>
                    <Link href="/" className={styles.navLink}>Home</Link>
                    {categories.map(cat => (
                        <Link key={cat.id} href={`/category/${cat.slug}`} className={styles.navLink}>
                            {cat.name}
                        </Link>
                    ))}
                </div>

                <div className={styles.actions}>
                    <div className={styles.oracleScore}>
                        <Trophy className={styles.scoreIcon} />
                        <span>{displayXp.toLocaleString()} XP</span>
                    </div>

                    <SettingsMenu onAddCategory={() => setIsCategoryModalOpen(true)} />

                    <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                        <Plus size={18} style={{ marginRight: '6px' }} />
                        Create Poll
                    </button>
                </div>
            </nav>
            <CreatePollModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            <AddCategoryModal isOpen={isCategoryModalOpen} onClose={() => {
                setIsCategoryModalOpen(false);
                getCategories().then(setCategories); // Refresh categories
            }} />
        </>
    );
}
