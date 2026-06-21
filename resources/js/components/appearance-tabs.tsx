import { useAppearance } from '@/hooks/use-appearance';
import { Sun } from 'lucide-react';
import { HTMLAttributes } from 'react';

export default function AppearanceToggleTab({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
    const { appearance } = useAppearance();

    return (
        <div className={className} {...props}>
            <div className="inline-flex items-center gap-2 rounded-lg bg-neutral-100 px-4 py-3 text-sm text-neutral-700 shadow-sm">
                <Sun className="h-4 w-4 text-yellow-500" />
                <span>Light mode only</span>
                <span className="rounded-full bg-neutral-200 px-2 py-0.5 text-xs font-semibold text-neutral-600">{appearance}</span>
            </div>
        </div>
    );
}
