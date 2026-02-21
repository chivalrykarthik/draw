import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Reusable hook for dropdown toggle with outside-click-to-close behavior.
 * Returns [isOpen, toggle, close, ref] where ref must be attached to the dropdown container.
 */
export function useDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const toggle = useCallback(() => setIsOpen(prev => !prev), []);
    const close = useCallback(() => setIsOpen(false), []);

    useEffect(() => {
        if (!isOpen) return;

        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    return { isOpen, toggle, close, ref } as const;
}
