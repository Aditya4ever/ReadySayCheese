'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Settings, Plus, ListChecks } from 'lucide-react';
import styles from './Navbar.module.css';

export default function SettingsMenu({ onAddCategory }: { onAddCategory: () => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={styles.settingsWrapper} ref={menuRef}>
            <button
                className="btn btn-ghost"
                onClick={() => setIsOpen(!isOpen)}
                title="Settings"
            >
                <Settings size={18} />
            </button>

            {isOpen && (
                <div className={styles.dropdown}>
                    <button onClick={() => { onAddCategory(); setIsOpen(false); }} className={styles.dropdownItem}>
                        <Plus size={16} /> Add Category
                    </button>
                    <Link href="/admin" className={styles.dropdownItem} onClick={() => setIsOpen(false)}>
                        <ListChecks size={16} /> Moderation Queue
                    </Link>
                </div>
            )}
        </div>
    );
}
