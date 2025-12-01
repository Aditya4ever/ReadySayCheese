'use client';

import { useState, useEffect } from 'react';

export function useXP() {
    const [xp, setXp] = useState(0);

    useEffect(() => {
        const stored = localStorage.getItem('trendpoll_xp');
        if (stored) setXp(parseInt(stored));
        else {
            localStorage.setItem('trendpoll_xp', '0');
            setXp(0);
        }
    }, []);

    const addXP = (amount: number) => {
        const newXp = xp + amount;
        setXp(newXp);
        localStorage.setItem('trendpoll_xp', newXp.toString());

        // Dispatch event for other components to listen
        window.dispatchEvent(new Event('xp-updated'));
    };

    return { xp, addXP };
}
