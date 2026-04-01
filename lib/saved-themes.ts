// Saved themes management for local storage and file export/import

import { CustomThemeColors } from '@/components/builder/config/custom-theme-builder';

export interface SavedTheme {
  id: string;
  name: string;
  colors: CustomThemeColors;
  createdAt: string;
  updatedAt: string;
}

export interface SavedThemesData {
  version: number;
  themes: SavedTheme[];
}

// Local storage key for saved themes
const SAVED_THEMES_KEY = 'github-profile-maker-saved-themes';

// Current version for future migrations
const CURRENT_VERSION = 1;

// Generate unique ID for saved theme
function generateThemeId(): string {
  return `theme-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Get all saved themes from local storage
export function getSavedThemes(): SavedTheme[] {
  if (typeof window === 'undefined') return [];

  try {
    const data = localStorage.getItem(SAVED_THEMES_KEY);
    if (!data) return [];

    const parsed: SavedThemesData = JSON.parse(data);
    if (parsed.version !== CURRENT_VERSION) {
      // Handle migrations if needed
      return migrateThemes(parsed);
    }

    return parsed.themes;
  } catch {
    return [];
  }
}

// Migrate themes data (for future versions)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function migrateThemes(data: SavedThemesData): SavedTheme[] {
  // For now, just return empty array if version mismatch
  // In future, implement migration logic
  return [];
}

// Save a theme to local storage
export function saveThemeToLocalStorage(name: string, colors: CustomThemeColors): SavedTheme {
  const themes = getSavedThemes();
  const now = new Date().toISOString();

  // Check if theme with same name exists
  const existingIndex = themes.findIndex((t) => t.name === name);

  const newTheme: SavedTheme = {
    id: existingIndex >= 0 ? themes[existingIndex].id : generateThemeId(),
    name,
    colors,
    createdAt: existingIndex >= 0 ? themes[existingIndex].createdAt : now,
    updatedAt: now,
  };

  if (existingIndex >= 0) {
    themes[existingIndex] = newTheme;
  } else {
    themes.push(newTheme);
  }

  const data: SavedThemesData = {
    version: CURRENT_VERSION,
    themes,
  };

  localStorage.setItem(SAVED_THEMES_KEY, JSON.stringify(data));

  return newTheme;
}

// Delete a theme from local storage
export function deleteThemeFromLocalStorage(id: string): boolean {
  const themes = getSavedThemes();
  const filtered = themes.filter((t) => t.id !== id);

  if (filtered.length === themes.length) return false;

  const data: SavedThemesData = {
    version: CURRENT_VERSION,
    themes: filtered,
  };

  localStorage.setItem(SAVED_THEMES_KEY, JSON.stringify(data));

  return true;
}

// Export themes to file (JSON download)
export function exportThemesToFile(themes: SavedTheme[]): void {
  const data: SavedThemesData = {
    version: CURRENT_VERSION,
    themes,
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `github-profile-maker-themes-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Import themes from file
export async function importThemesFromFile(file: File): Promise<SavedTheme[]> {
  const text = await file.text();

  try {
    const data: SavedThemesData = JSON.parse(text);

    if (!data.themes || !Array.isArray(data.themes)) {
      throw new Error('Invalid theme file format');
    }

    // Validate each theme
    const validThemes: SavedTheme[] = data.themes.map((theme: SavedTheme) => ({
      id: generateThemeId(), // Generate new IDs to avoid conflicts
      name: theme.name,
      colors: {
        bg: theme.colors.bg || '1a1b27',
        title: theme.colors.title || '70a5fd',
        text: theme.colors.text || 'c9d1d9',
        icon: theme.colors.icon || 'bf91f3',
        border: theme.colors.border || '30363d',
      },
      createdAt: theme.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    // Merge with existing themes
    const existingThemes = getSavedThemes();
    const existingNames = new Set(existingThemes.map((t) => t.name));

    // Add non-duplicate themes to local storage
    const themesToAdd = validThemes.filter((t) => !existingNames.has(t.name));

    if (themesToAdd.length > 0) {
      const allThemes = [...existingThemes, ...themesToAdd];
      const dataToSave: SavedThemesData = {
        version: CURRENT_VERSION,
        themes: allThemes,
      };
      localStorage.setItem(SAVED_THEMES_KEY, JSON.stringify(dataToSave));
    }

    return validThemes;
  } catch {
    throw new Error('Failed to parse theme file. Please ensure it is a valid JSON file.');
  }
}

// Export single theme to JSON string
export function themeToJson(theme: SavedTheme): string {
  return JSON.stringify(
    {
      version: CURRENT_VERSION,
      themes: [theme],
    },
    null,
    2,
  );
}

// Import single theme from JSON string
export function themeFromJson(json: string): SavedTheme | null {
  try {
    const data: SavedThemesData = JSON.parse(json);
    if (data.themes && data.themes.length > 0) {
      return {
        ...data.themes[0],
        id: generateThemeId(),
        updatedAt: new Date().toISOString(),
      };
    }
    return null;
  } catch {
    return null;
  }
}
