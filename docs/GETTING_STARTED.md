# GitHub Profile Maker - Getting Started Guide

Welcome to the GitHub Profile Maker documentation. This guide will help you get started with creating beautiful GitHub profile READMEs.

## Table of Contents

- [Quick Start](#quick-start)
- [Understanding the Interface](#understanding-the-interface)
- [Creating Your First Profile](#creating-your-first-profile)
- [Using Blocks](#using-blocks)
- [Customizing Themes](#customizing-themes)
- [Exporting Your Profile](#exporting-your-profile)
- [Saving and Loading Profiles](#saving-and-loading-profiles)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Troubleshooting](#troubleshooting)

---

## Quick Start

### Prerequisites

- **Node.js** ≥ 18
- A package manager: `npm`, `pnpm`, `yarn`, or `bun`
- _(Optional)_ A GitHub Personal Access Token for live stats

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/zntb/github-profile-maker.git
cd github-profile-maker

# 2. Install dependencies
npm install

# 3. Copy environment variables
cp .env.example .env.local
```

### Running the Application

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Understanding the Interface

The GitHub Profile Maker features a three-panel layout:

### 1. Block Sidebar (Left Panel)

The Block Sidebar contains all available blocks organized into categories:

| Category         | Description                                                                  |
| ---------------- | ---------------------------------------------------------------------------- |
| **Layout**       | Container, Divider, Spacer                                                   |
| **Hero**         | Capsule Header, Avatar, Greeting, Typing Animation                           |
| **Content**      | Heading, Paragraph, Collapsible, Code Block                                  |
| **Media**        | Image, GIF                                                                   |
| **Social**       | Social Badges, Custom Badge                                                  |
| **Tech Stack**   | Skill Icons                                                                  |
| **GitHub Stats** | Stats Row, Stats Card, Top Languages, Streak Stats, Activity Graph, Trophies |
| **Advanced**     | Visitor Counter, Quote, Footer Banner, Support Link                          |

### 2. Canvas (Center Panel)

The Canvas is your workspace where you:

- Drag and drop blocks to add them
- Reorder blocks by dragging
- Click to select and configure blocks
- See live previews of your profile
- **Lock blocks** to prevent accidental modifications

### Block Locking

When working on complex profiles, you may want to protect certain blocks from accidental changes. The block locking feature allows you to:

- **Lock a block** by clicking the lock icon in the quick actions (right side of block)
- **Prevent reordering** - Locked blocks cannot be dragged
- **Prevent editing** - Configuration panel is hidden for locked blocks
- **Prevent deletion** - Delete and duplicate buttons are hidden
- **Visual indicator** - Locked blocks show a lock icon in the drag handle area
- **Unlock** - Click the unlock icon to restore editing capabilities

Locked blocks are ideal for:

- Finalized sections you don't want to change
- Header/footer blocks that are complete
- Complex configurations you've carefully tuned

### 3. Configuration Panel (Right Panel)

When you select a block, the Configuration Panel shows all available options for customizing that block.

---

## Creating Your First Profile

### Step 1: Add Blocks

1. Browse the Block Sidebar to find blocks you want to use
2. Click on a block to add it to the canvas
3. Or drag and drop blocks to position them

### Step 2: Configure Blocks

1. Click on a block in the canvas to select it
2. Modify properties in the Configuration Panel
3. Changes are reflected in real-time

### Step 3: Preview Your Profile

The Live Preview panel shows exactly how your README will look on GitHub.

### Step 4: Export

1. Click the **Export** button in the header
2. Choose to **Copy to Clipboard** or **Download**
3. Paste the content into your GitHub profile README

---

## Using Blocks

### Layout Blocks

#### Container

Flex wrapper supporting row/column direction, alignment, and gap.

```typescript
interface ContainerProps {
  alignment: 'left' | 'center' | 'right';
  direction: 'row' | 'column';
  gap: number;
}
```

#### Divider

Horizontal rule or custom animated GIF divider.

```typescript
interface DividerProps {
  type: 'line' | 'gif';
  gifUrl?: string;
  color?: string;
}
```

#### Spacer

Configurable height gap (10–100 px).

```typescript
interface SpacerProps {
  height: number;
}
```

### Hero Blocks

#### Capsule Header

Animated banner via capsule-render with multiple animation types.

```typescript
interface CapsuleHeaderProps {
  text: string;
  type: 'waving' | 'typing' | 'static';
  color: string;
  height: number;
  section: string;
}
```

#### Avatar

Circular or rounded profile image.

```typescript
interface AvatarProps {
  imageUrl: string;
  size: number;
  borderRadius: number;
  borderColor?: string;
}
```

#### Greeting

Large heading with optional emoji.

```typescript
interface GreetingProps {
  text: string;
  emoji?: string;
  alignment: 'left' | 'center' | 'right';
}
```

#### Typing Animation

Animated typing SVG via readme-typing-svg.

```typescript
interface TypingAnimationProps {
  lines: string[];
  color: string;
  width: number;
  height: number;
  speed: number;
}
```

### Content Blocks

#### Heading

H1–H3 with alignment and emoji prefix.

```typescript
interface HeadingProps {
  text: string;
  level: 1 | 2 | 3;
  alignment: 'left' | 'center' | 'right';
  emoji?: string;
}
```

#### Paragraph

Freeform text with alignment control.

```typescript
interface ParagraphProps {
  text: string;
  alignment: 'left' | 'center' | 'right';
}
```

#### Collapsible

GitHub `<details>` block with nested children.

```typescript
interface CollapsibleProps {
  title: string;
  defaultOpen: boolean;
}
```

#### Code Block

Syntax-highlighted fenced code.

```typescript
interface CodeBlockProps {
  code: string;
  language: string;
}
```

### Media Blocks

#### Image

External image with size, alignment, and border-radius.

```typescript
interface ImageProps {
  url: string;
  alt: string;
  width?: number;
  height?: number;
  alignment: 'left' | 'center' | 'right';
  borderRadius: number;
}
```

#### GIF

Lightweight GIF embed with width control.

```typescript
interface GifProps {
  url: string;
  alt: string;
  width?: number;
  alignment: 'left' | 'center' | 'right';
}
```

### Social Blocks

#### Social Badges

One-click shields.io badges for various platforms.

```typescript
interface SocialBadgesProps {
  linkedin?: string;
  twitter?: string;
  email?: string;
  portfolio?: string;
  github?: string;
  youtube?: string;
  instagram?: string;
  discord?: string;
  style: 'flat' | 'flat-square' | 'for-the-badge' | 'plastic' | 'social';
}
```

#### Custom Badge

Fully custom label/message/color/logo badge.

```typescript
interface CustomBadgeProps {
  label: string;
  message: string;
  color: string;
  labelColor?: string;
  style: 'flat' | 'flat-square' | 'for-the-badge' | 'plastic';
  logo?: string;
  logoColor?: string;
}
```

### Tech Stack Blocks

#### Skill Icons

Grid of tech icons via skillicons.dev.

```typescript
interface SkillIconsProps {
  icons: string[];
  perLine: number;
  theme: 'light' | 'dark';
}
```

### GitHub Stats Blocks

#### Stats Row

Flexible row/column layout for multiple stat cards.

```typescript
interface StatsRowProps {
  direction: 'row' | 'column';
  gap: number;
  cardWidth?: string;
  cardHeight?: string;
}
```

#### Stats Card

Stars, commits, PRs, issues, and rank ring.

```typescript
interface StatsCardProps {
  username: string;
  theme: string;
  layoutStyle?: 'standard' | 'compact';
  layoutWidth?: 'half' | 'full';
  cardWidth?: string;
  cardHeight?: string;
  showIcons: boolean;
  hideBorder: boolean;
  hideTitle: boolean;
  hideRank: boolean;
  bgColor?: string;
  textColor?: string;
  titleColor?: string;
  iconColor?: string;
  borderRadius: number;
}
```

#### Top Languages

Multiple layout options available.

```typescript
interface TopLanguagesProps {
  username: string;
  theme: string;
  layoutWidth?: 'half' | 'full';
  cardWidth?: string;
  cardHeight?: string;
  layout: 'compact' | 'normal' | 'donut' | 'donut-vertical' | 'pie';
  hideBorder: boolean;
  hideProgress: boolean;
  langs_count: number;
  bgColor?: string;
  textColor?: string;
  titleColor?: string;
  borderRadius: number;
}
```

#### Streak Stats

Current streak, longest streak, and total contributions.

```typescript
interface StreakStatsProps {
  username: string;
  theme: string;
  layoutWidth?: 'half' | 'full';
  cardWidth?: string;
  cardHeight?: string;
  hideBorder: boolean;
  borderRadius: number;
  bgColor?: string;
  textColor?: string;
  fireColor?: string;
  ringColor?: string;
  currStreakColor?: string;
  sideNumColor?: string;
  sideLabelColor?: string;
  datesColor?: string;
}
```

#### Activity Graph

30-day contribution line chart.

```typescript
interface ActivityGraphProps {
  username: string;
  theme: string;
  hideBorder: boolean;
  bgColor?: string;
  color?: string;
  lineColor?: string;
  pointColor?: string;
  areaColor?: string;
}
```

#### Trophies

Trophy grid with configurable columns/rows.

```typescript
interface TrophiesProps {
  username: string;
  theme: string;
  column: number;
  row: number;
  margin_w: number;
  margin_h: number;
  noFrame: boolean;
  noBg: boolean;
}
```

### Advanced Blocks

#### Visitor Counter

komarev.com page-view badge.

```typescript
interface VisitorCounterProps {
  username: string;
  color: string;
  style: 'flat' | 'flat-square' | 'plastic';
  label: string;
}
```

#### Quote

Static custom quote or random dev quote from API.

```typescript
interface QuoteProps {
  quote?: string;
  author?: string;
  theme: string;
  type: 'default' | 'horizontal' | 'vertical';
}
```

#### Footer Banner

Waving capsule-render footer.

```typescript
interface FooterBannerProps {
  text: string;
  waveColor: string;
  fontColor: string;
  height: number;
}
```

---

## Customizing Themes

### Available Themes

The GitHub Profile Maker supports **65+ themes** for stats cards:

| Theme Name         | Description          |
| ------------------ | -------------------- |
| `default`          | Default GitHub theme |
| `dark`             | Dark theme           |
| `radical`          | Radical theme        |
| `tokyonight`       | Tokyo Night theme    |
| `dracula`          | Dracula theme        |
| `onedark`          | One Dark theme       |
| `nord`             | Nord theme           |
| `github_dark`      | GitHub Dark theme    |
| `catppuccin_mocha` | Catppuccin Mocha     |
| `gruvbox`          | Gruvbox theme        |
| `merko`            | Merko theme          |
| `react`            | React theme          |
| `midnight-purple`  | Midnight Purple      |
| `rose_pine`        | Rose Pine theme      |

### Using Themes

1. Select a stats block (Stats Card, Top Languages, Streak Stats, etc.)
2. In the Configuration Panel, find the **Theme** dropdown
3. Choose your preferred theme
4. The preview updates automatically

---

## Exporting Your Profile

### Export Options

1. **Copy to Clipboard**: Copies the generated Markdown to your clipboard
2. **Download**: Downloads the README.md file

### Generated Markdown

The exported Markdown includes:

- All configured blocks
- Proper GitHub-flavored Markdown syntax
- Embedded SVG images for stats
- Proper alignment and formatting

---

## Saving and Loading Profiles

### Auto-Save

The application automatically saves your progress:

- Saves last 20 states
- Enables undo/redo functionality
- Persists across browser sessions

### Profile Management

1. Click the **Profile** button in the header
2. Create new profiles or switch between existing ones
3. Save current state as a new profile

### Keyboard Shortcuts for Profiles

| Shortcut           | Action                            |
| ------------------ | --------------------------------- |
| `Ctrl + 1-9`       | Switch to profile 1-9             |
| `Ctrl + Shift + S` | Save current state as new profile |

---

## Keyboard Shortcuts

### Navigation

| Shortcut               | Action                        |
| ---------------------- | ----------------------------- |
| `↑` / `↓`              | Select previous/next block    |
| `Escape`               | Deselect block / Close dialog |
| `Delete` / `Backspace` | Delete selected block         |

### Editing

| Shortcut         | Action                   |
| ---------------- | ------------------------ |
| `Ctrl + D`       | Duplicate selected block |
| `Ctrl + ↑` / `↓` | Move block up/down       |
| `Ctrl + Z`       | Undo last change         |
| `Ctrl + Y`       | Redo last change         |

### Help

| Shortcut    | Action                       |
| ----------- | ---------------------------- |
| `Shift + /` | Show keyboard shortcuts help |

---

## Troubleshooting

### GitHub Token Not Working

If you're seeing "GitHub Token Required" placeholders:

1. Create a Personal Access Token at https://github.com/settings/tokens
2. Required scopes: `read:user`
3. Add to your `.env.local` file:
   ```
   GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
   ```

### Stats Not Loading

- Ensure your GitHub username is correct in the block configuration
- Check that your GITHUB_TOKEN has the correct permissions
- Verify the token hasn't expired

### Export Issues

- Make sure all required fields are filled in
- Check that image URLs are valid and accessible
- Verify no special characters are causing issues

### Performance Issues

- Close unused browser tabs
- Reduce the number of complex blocks (stats, graphs)
- Use skeleton loaders while loading

---

## Next Steps

- Explore the [API Reference](./API_REFERENCE.md) for detailed endpoint documentation
- Check the [Block Reference](./BLOCKS_REFERENCE.md) for all block configurations
- Read the [Development Guide](./DEVELOPMENT.md) if you want to contribute
- Browse the [Themes Guide](./THEMES.md) for theme customization options
