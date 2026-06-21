import { useEffect, useState } from 'react';

export type Appearance = 'light' | 'dark' | 'system';

const applyTheme = () => {
    document.documentElement.classList.remove('dark');
};

export function initializeTheme() {
    applyTheme();
}

export function useAppearance() {
    const [appearance] = useState<Appearance>('light');

    const updateAppearance = () => {
        localStorage.setItem('appearance', 'light');
        applyTheme();
    };

    useEffect(() => {
        updateAppearance();
    }, []);

    return { appearance, updateAppearance };
}
