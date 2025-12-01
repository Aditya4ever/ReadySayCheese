'use client';

import { useState } from 'react';
import { addCategory } from '@/app/actions';
import { X, Loader2, Plus } from 'lucide-react';
import styles from './CreatePollModal.module.css'; // Reusing styles

export default function AddCategoryModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [name, setName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await addCategory(name);
            onClose();
            setName('');
        } catch (error) {
            console.error(error);
            alert('Failed to add category');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={`glass-panel ${styles.modal}`}>
                <div className={styles.header}>
                    <h2>Add New Category</h2>
                    <button onClick={onClose} className="btn btn-ghost" style={{ padding: '8px' }}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.field}>
                        <label>Category Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Sports, Music"
                            required
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.footer}>
                        <button type="button" onClick={onClose} className="btn btn-ghost">Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="spin" size={18} /> : (
                                <>
                                    <Plus size={18} style={{ marginRight: '6px' }} />
                                    Add Category
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
