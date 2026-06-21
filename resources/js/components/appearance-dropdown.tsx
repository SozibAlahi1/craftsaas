import { Button } from '@/components/ui/button';
import { useAppearance } from '@/hooks/use-appearance';
import { Sun } from 'lucide-react';
import { HTMLAttributes } from 'react';

export default function AppearanceToggleDropdown({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
    const { appearance, updateAppearance } = useAppearance();

    return (
        <div className={className} {...props}>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-md" onClick={updateAppearance}>
                <Sun className="h-5 w-5" />
                <span className="sr-only">Light theme</span>
            </Button>
            <span className="sr-only">Current theme: {appearance}</span>
        </div>
    );
}
