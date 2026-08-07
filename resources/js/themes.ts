export interface SiteTheme {
    key: string;
    label: string;
}

export const siteThemes: SiteTheme[] = [
    { key: 'classic', label: 'Classic' },
    { key: 'modern', label: 'Modern' },
    { key: 'minimal', label: 'Minimal' },
    { key: 'shutki-ocean', label: 'শুটকি ওশেন প্রিমিয়াম' },
];

export const defaultSiteTheme: string = 'classic';

