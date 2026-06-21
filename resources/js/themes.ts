export interface SiteTheme {
    key: 'classic' | 'modern' | 'minimal';
    label: string;
}

export const siteThemes: SiteTheme[] = [
    { key: 'classic', label: 'Classic' },
    { key: 'modern', label: 'Modern' },
    { key: 'minimal', label: 'Minimal' },
];

export const defaultSiteTheme: SiteTheme['key'] = 'classic';
