'use client';

import { useState, useRef, useEffect } from 'react';
import { createPoll, getCategories } from '@/app/actions';
import { X, Plus, Loader2 } from 'lucide-react';
import styles from './CreatePollModal.module.css';

export default function CreatePollModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [options, setOptions] = useState(['', '']);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [categories, setCategories] = useState<{ id: number, name: string }[]>([]);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (isOpen) {
            getCategories().then(setCategories);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const addOption = () => {
        if (options.length < 4) {
            setOptions([...options, '']);
        }
    };

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const handleSubmit = async (formData: FormData) => {
        setIsSubmitting(true);

        try {
            await createPoll(formData);
            onClose();
            setOptions(['', '']); // Reset
            alert('Poll submitted for review! It will be visible after moderation.');
        } catch (e) {
            console.error(e);
            alert('Failed to create poll');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={`glass-panel ${styles.modal}`}>
                <div className={styles.header}>
                    <h2>Create New Poll</h2>
                    <button onClick={onClose} className="btn btn-ghost" style={{ padding: '8px' }}>
                        <X size={20} />
                    </button>
                </div>

                <form ref={formRef} action={handleSubmit} className={styles.form}>
                    <div className={styles.field}>
                        <label>Question</label>
                        <input
                            name="title"
                            type="text"
                            placeholder="What do you want to ask?"
                            required
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.field}>
                        <label>Category</label>
                        <select name="category" className={styles.select} required defaultValue="">
                            <option value="" disabled>Select a category</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.field}>
                        <label>Options</label>
                        <div className={styles.optionsList}>
                            {options.map((opt, idx) => (
                                <input
                                    key={idx}
                                    name="options"
                                    type="text"
                                    value={opt}
                                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                                    placeholder={`Option ${idx + 1}`}
                                    required
                                    className={styles.input}
                                />
                            ))}
                        </div>
                        {options.length < 4 && (
                            <button type="button" onClick={addOption} className={styles.addOptionBtn}>
                                <Plus size={14} /> Add Option
                            </button>
                        )}
                    </div>

                    <div className={styles.field}>
                        <label>Tags (comma separated)</label>
                        <input
                            name="tags"
                            type="text"
                            placeholder="e.g. Avatar, Box Office, James Cameron"
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.footer}>
                        <button type="button" onClick={onClose} className="btn btn-ghost">Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="spin" size={18} /> : 'Create Poll'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
