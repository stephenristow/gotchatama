export type Theme = 'Light' | 'Dark';
export type ViewMode = 'list' | 'grid';

export interface Settings {
    theme: Theme;
    viewMode: ViewMode;
    itemsPerRow: number;
}
