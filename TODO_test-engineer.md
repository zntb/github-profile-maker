# Test Engineer - Comprehensive Test Strategy

## Project Overview

**Project**: GitHub Profile README Builder  
**Tech Stack**: Next.js 16.2.1, React 19, TypeScript, Tailwind CSS, Zustand  
**Current Test Status**: No test framework installed  
**Testing Framework to Use**: Vitest (recommended for Next.js projects)

---

## Context

### Module Analysis

| Module                                       | Purpose                             | Test Level  | Priority |
| -------------------------------------------- | ----------------------------------- | ----------- | -------- |
| [`lib/markdown.ts`](lib/markdown.ts)         | Block-to-markdown rendering         | Unit        | High     |
| [`lib/github.ts`](lib/github.ts)             | GitHub API utilities & calculations | Unit        | High     |
| [`lib/store.ts`](lib/store.ts)               | Zustand state management            | Unit        | High     |
| [`lib/types.ts`](lib/types.ts)               | Type definitions                    | N/A         | Low      |
| [`lib/templates.ts`](lib/templates.ts)       | Template definitions                | Unit        | Medium   |
| [`app/api/*/route.ts`](app/api)              | API routes                          | Integration | High     |
| [`components/builder/*`](components/builder) | Builder UI components               | Component   | Medium   |
| [`components/ui/*`](components/ui)           | UI component library                | Component   | Low      |

### Current Gaps

- No test framework installed
- No existing test files in the project
- No CI pipeline configured for tests
- Coverage target: 80%+ for critical paths

---

## Test Strategy Plan

### TE-PLAN-1.1: Test Pyramid Design

- **Unit Tests (70%)**: Core utility functions in `lib/` - pure functions with no side effects
- **Integration Tests (20%)**: API routes and GitHub API integration
- **Component Tests (10%)**: Critical UI components (builder canvas, block preview)

### TE-PLAN-1.2: Framework Selection

| Purpose           | Framework             | Rationale                                  |
| ----------------- | --------------------- | ------------------------------------------ |
| Unit Testing      | Vitest                | Native ESM, fast, compatible with Jest API |
| Component Testing | React Testing Library | Accessible queries, user-centric testing   |
| API Testing       | Vitest + MSW          | Mock service worker for API mocking        |
| Assertions        | @vitest/expect        | Built into Vitest                          |

### TE-PLAN-1.3: Dependencies to Add

```json
{
  "devDependencies": {
    "vitest": "^4.1.1",
    "@vitest/ui": "^4.1.1",
    "@vitest/coverage-v8": "^4.1.1",
    "@testing-library/react": "^16.3.2",
    "@testing-library/dom": "^10.4.1",
    "@testing-library/user-event": "^14.6.1",
    "jsdom": "^29.0.1",
    "msw": "^2.12.14"
  }
}
```

---

## Test Cases

### Unit Tests - lib/markdown.ts

#### TE-ITEM-1.1: renderBlock - Container Block

- **Behavior**: Renders container block with center alignment
- **Setup**: Block with type 'container', alignment 'center', children
- **Assertions**: Returns `<div align="center">` with children markdown

#### TE-ITEM-1.2: renderBlock - Divider Block (Line)

- **Behavior**: Renders line divider
- **Setup**: Block with type 'divider', props.type = 'line'
- **Assertions**: Returns '---'

#### TE-ITEM-1.3: renderBlock - Divider Block (GIF)

- **Behavior**: Renders GIF divider
- **Setup**: Block with type 'divider', props.type = 'gif', props.gifUrl
- **Assertions**: Returns `<img>` tag with gifUrl

#### TE-ITEM-1.4: renderBlock - Spacer Block

- **Behavior**: Renders spacer with correct number of `<br/>` tags
- **Setup**: Block with type 'spacer', props.height = 40
- **Assertions**: Returns 2 `<br/>` tags (height/20 = 2)

#### TE-ITEM-1.5: renderBlock - Capsule Header Block

- **Behavior**: Generates correct Capsule Render URL
- **Setup**: Block with type 'capsule-header', sample props
- **Assertions**: URL contains encoded parameters

#### TE-ITEM-1.6: renderBlock - Avatar Block

- **Behavior**: Renders avatar with correct styling
- **Setup**: Block with type 'avatar', borderRadius = 50
- **Assertions**: Returns circular border-radius style

#### TE-ITEM-1.7: renderBlock - Greeting Block (Center)

- **Behavior**: Renders centered greeting with h1
- **Setup**: Block with type 'greeting', alignment 'center'
- **Assertions**: Returns `<h1 align="center">`

#### TE-ITEM-1.8: renderBlock - Greeting Block (Left)

- **Behavior**: Renders left-aligned greeting with markdown heading
- **Setup**: Block with type 'greeting', alignment 'left'
- **Assertions**: Returns `# ` prefix

#### TE-ITEM-1.9: renderBlock - Typing Animation Block

- **Behavior**: Generates typing SVG URL with encoded lines
- **Setup**: Block with type 'typing-animation', multiple lines
- **Assertions**: URL contains encoded lines parameter

#### TE-ITEM-1.10: renderBlock - Heading Block

- **Behavior**: Renders correct heading level
- **Setup**: Block with type 'heading', level 2
- **Assertions**: Returns `## ` prefix

#### TE-ITEM-1.11: renderBlock - Paragraph Block

- **Behavior**: Renders paragraph with alignment
- **Setup**: Block with type 'paragraph', alignment 'center'
- **Assertions**: Returns `<p align="center">`

#### TE-ITEM-1.12: renderBlock - Collapsible Block

- **Behavior**: Renders collapsible details with children
- **Setup**: Block with type 'collapsible', defaultOpen=true, children
- **Assertions**: Returns `<details open>` with summary and children

#### TE-ITEM-1.13: renderBlock - Code Block

- **Behavior**: Renders fenced code block
- **Setup**: Block with type 'code-block', language 'javascript'
- **Assertions**: Returns `javascript\n...\n`

#### TE-ITEM-1.14: renderBlock - Image Block

- **Behavior**: Renders image with alignment
- **Setup**: Block with type 'image', alignment 'center'
- **Assertions**: Returns wrapped in `<div align="center">`

#### TE-ITEM-1.15: renderBlock - Social Badges Block

- **Behavior**: Generates badge markdown for each social link
- **Setup**: Block with type 'social-badges', linkedin and twitter props
- **Assertions**: Contains LinkedIn and Twitter badge markdown

#### TE-ITEM-1.16: renderBlock - Social Badges (Empty)

- **Behavior**: Returns empty string when no social links
- **Setup**: Block with type 'social-badges', no props
- **Assertions**: Returns ''

#### TE-ITEM-1.17: renderBlock - Custom Badge Block

- **Behavior**: Generates shields.io badge URL
- **Setup**: Block with type 'custom-badge', label, message, color
- **Assertions**: URL contains encoded label and message

#### TE-ITEM-1.18: renderBlock - Skill Icons Block

- **Behavior**: Generates skillicons.dev URL
- **Setup**: Block with type 'skill-icons', icons array
- **Assertions**: URL contains icons and perline parameters

#### TE-ITEM-1.19: renderBlock - Stats Card Block (Internal URL)

- **Behavior**: Generates internal API URL when origin not provided
- **Setup**: Block with type 'stats-card', no origin
- **Assertions**: URL starts with `/api/stats`

#### TE-ITEM-1.20: renderBlock - Stats Card Block (External URL)

- **Behavior**: Generates external URL when origin provided
- **Setup**: Block with type 'stats-card', origin='https://example.com'
- **Assertions**: URL starts with origin

#### TE-ITEM-1.21: renderBlock - Top Languages Block

- **Behavior**: Generates top-langs API URL
- **Setup**: Block with type 'top-languages'
- **Assertions**: URL contains layout and langs_count params

#### TE-ITEM-1.22: renderBlock - Streak Stats Block

- **Behavior**: Generates streak API URL
- **Setup**: Block with type 'streak-stats'
- **Assertions**: URL contains username and theme params

#### TE-ITEM-1.23: renderBlock - Activity Graph Block

- **Behavior**: Generates activity API URL
- **Setup**: Block with type 'activity-graph'
- **Assertions**: URL contains username and theme params

#### TE-ITEM-1.24: renderBlock - Trophies Block

- **Behavior**: Generates trophies API URL
- **Setup**: Block with type 'trophies'
- **Assertions**: URL contains column, row, margin params

#### TE-ITEM-1.25: renderBlock - Visitor Counter Block

- **Behavior**: Generates komarev.com visitor counter URL
- **Setup**: Block with type 'visitor-counter'
- **Assertions**: URL contains username and color params

#### TE-ITEM-1.26: renderBlock - Quote Block (Custom)

- **Behavior**: Renders custom quote with author
- **Setup**: Block with type 'quote', quote and author props
- **Assertions**: Returns blockquote format

#### TE-ITEM-1.27: renderBlock - Quote Block (API)

- **Behavior**: Generates random quote API URL
- **Setup**: Block with type 'quote', no custom quote
- **Assertions**: URL contains theme and type params

#### TE-ITEM-1.28: renderBlock - Footer Banner Block

- **Behavior**: Generates footer banner URL
- **Setup**: Block with type 'footer-banner'
- **Assertions**: URL contains section=footer

#### TE-ITEM-1.29: renderBlock - Unknown Block Type

- **Behavior**: Returns empty string for unknown types
- **Setup**: Block with unknown type
- **Assertions**: Returns ''

#### TE-ITEM-1.30: renderMarkdown - Multiple Blocks

- **Behavior**: Renders multiple blocks joined by newlines
- **Setup**: Array of blocks
- **Assertions**: Each block rendered, joined by '\n\n'

#### TE-ITEM-1.31: buildInternalUrl - Filters Empty Params

- **Behavior**: Excludes undefined, null, and empty string params
- **Setup**: Params object with mixed values
- **Assertions**: Only non-empty params in query string

#### TE-ITEM-1.32: buildExternalUrl - Includes Origin

- **Behavior**: Prefixes URL with origin
- **Setup**: Endpoint, params, origin
- **Assertions**: URL starts with origin

---

### Unit Tests - lib/github.ts

#### TE-ITEM-2.1: calculateStreakStats - Consecutive Days

- **Behavior**: Calculates current streak correctly
- **Setup**: Calendar with contributions on consecutive days including today
- **Assertions**: currentStreak equals number of consecutive days

#### TE-ITEM-2.2: calculateStreakStats - No Recent Activity

- **Behavior**: Returns 0 current streak when no recent activity
- **Setup**: Calendar with last contribution 5 days ago
- **Assertions**: currentStreak equals 0

#### TE-ITEM-2.3: calculateStreakStats - Longest Streak

- **Behavior**: Identifies longest streak
- **Setup**: Calendar with varying streak lengths
- **Assertions**: longestStreak equals max consecutive days

#### TE-ITEM-2.4: calculateStreakStats - Empty Calendar

- **Behavior**: Handles empty contribution calendar
- **Setup**: Calendar with no contributions
- **Assertions**: All streak values are 0

#### TE-ITEM-2.5: calculateStreakStats - Single Day

- **Behavior**: Handles single day contribution
- **Setup**: Calendar with one contribution day
- **Assertions**: Both current and longest streak equal 1

#### TE-ITEM-2.6: calculateRank - S+ Rank

- **Behavior**: Returns S+ for score >= 10000
- **Setup**: Stats with score >= 10000
- **Assertions**: Returns "S+"

#### TE-ITEM-2.7: calculateRank - S Rank

- **Behavior**: Returns S for score >= 5000
- **Setup**: Stats with score >= 5000 and < 10000
- **Assertions**: Returns "S"

#### TE-ITEM-2.8: calculateRank - A++ Rank

- **Behavior**: Returns A++ for score >= 2500
- **Setup**: Stats with score >= 2500 and < 5000
- **Assertions**: Returns "A++"

#### TE-ITEM-2.9: calculateRank - A+ Rank

- **Behavior**: Returns A+ for score >= 1000
- **Setup**: Stats with score >= 1000 and < 2500
- **Assertions**: Returns "A+"

#### TE-ITEM-2.10: calculateRank - A Rank

- **Behavior**: Returns A for score >= 500
- **Setup**: Stats with score >= 500 and < 1000
- **Assertions**: Returns "A"

#### TE-ITEM-2.11: calculateRank - B+ Rank

- **Behavior**: Returns B+ for score >= 250
- **Setup**: Stats with score >= 250 and < 500
- **Assertions**: Returns "B+"

#### TE-ITEM-2.12: calculateRank - B Rank

- **Behavior**: Returns B for score >= 100
- **Setup**: Stats with score >= 100 and < 250
- **Assertions**: Returns "B"

#### TE-ITEM-2.13: calculateRank - C Rank

- **Behavior**: Returns C for score < 100
- **Setup**: Stats with score < 100
- **Assertions**: Returns "C"

#### TE-ITEM-2.14: fetchUserProfile - Success

- **Behavior**: Fetches user profile from GitHub API
- **Setup**: Mock fetch, valid username
- **Assertions**: Returns GitHubUser object

#### TE-ITEM-2.15: fetchUserProfile - Not Found

- **Behavior**: Throws error for non-existent user
- **Setup**: Mock fetch returning 404
- **Assertions**: Throws Error with status

#### TE-ITEM-2.16: fetchUserRepos - Pagination

- **Behavior**: Fetches all pages of repositories
- **Setup**: Mock fetch returning 100 repos per page
- **Assertions**: All pages fetched, combined results

#### TE-ITEM-2.17: fetchUserStats - GraphQL Query

- **Behavior**: Fetches stats via GraphQL
- **Setup**: Mock GraphQL response
- **Assertions**: Returns calculated GitHubStats

#### TE-ITEM-2.18: fetchLanguageStats - Aggregates Languages

- **Behavior**: Aggregates language sizes across repos
- **Setup**: Mock GraphQL with multiple repos
- **Assertions**: Language totals are summed

#### TE-ITEM-2.19: fetchContributionCalendar - Returns Calendar

- **Behavior**: Fetches contribution calendar
- **Setup**: Mock GraphQL response
- **Assertions**: Returns ContributionCalendar structure

---

### Unit Tests - lib/store.ts

#### TE-ITEM-3.1: addBlock - Append to End

- **Behavior**: Adds block to end when no index provided
- **Setup**: Store with existing blocks, add new block
- **Assertions**: Block added at end, selectedBlockId set

#### TE-ITEM-3.2: addBlock - Insert at Index

- **Behavior**: Inserts block at specific index
- **Setup**: Store with 3 blocks, add at index 1
- **Assertions**: Block inserted at position 1

#### TE-ITEM-3.3: removeBlock - Removes Block

- **Behavior**: Removes block by ID
- **Setup**: Store with blocks, remove middle block
- **Assertions**: Block removed, selectedBlockId cleared if removed

#### TE-ITEM-3.4: removeBlock - Removes Nested Block

- **Behavior**: Removes block from nested children
- **Setup**: Block with children, remove child
- **Assertions**: Child removed from parent

#### TE-ITEM-3.5: updateBlock - Updates Props

- **Behavior**: Updates block properties
- **Setup**: Block with existing props
- **Assertions**: Props merged, existing preserved

#### TE-ITEM-3.6: updateBlock - Updates Nested Block

- **Behavior**: Updates nested block props
- **Setup**: Block with children, update child
- **Assertions**: Child props updated

#### TE-ITEM-3.7: moveBlock - Reorders Blocks

- **Behavior**: Moves block from one index to another
- **Setup**: Blocks at indices 0,1,2, move 0 to 2
- **Assertions**: Block order changed

#### TE-ITEM-3.8: selectBlock - Sets Selection

- **Behavior**: Sets selectedBlockId
- **Setup**: Store with blocks
- **Assertions**: selectedBlockId matches

#### TE-ITEM-3.9: selectBlock - Clears Selection

- **Behavior**: Clears selection with null
- **Setup**: Block selected
- **Assertions**: selectedBlockId is null

#### TE-ITEM-3.10: setBlocks - Replaces All Blocks

- **Behavior**: Replaces all blocks
- **Setup**: Store with existing blocks
- **Assertions**: Blocks replaced with new array

#### TE-ITEM-3.11: duplicateBlock - Duplicates Block

- **Behavior**: Creates copy of block with new ID
- **Setup**: Block with ID
- **Assertions**: New block with different ID, same props

#### TE-ITEM-3.12: clearBlocks - Removes All

- **Behavior**: Removes all blocks
- **Setup**: Store with blocks
- **Assertions**: blocks array empty

#### TE-ITEM-3.13: loadTemplate - Loads Template Blocks

- **Behavior**: Loads template blocks
- **Setup**: Template with blocks
- **Assertions**: Blocks replaced with template

#### TE-ITEM-3.14: addChildBlock - Adds to Parent

- **Behavior**: Adds child block to parent
- **Setup**: Parent block without children
- **Assertions**: Parent has children array with new block

#### TE-ITEM-3.15: generateId - Unique IDs

- **Behavior**: Generates unique IDs
- **Setup**: Call generateId multiple times
- **Assertions**: All IDs unique

---

### Integration Tests - API Routes

#### TE-ITEM-4.1: GET /api/stats - Valid Username

- **Behavior**: Returns SVG stats image
- **Setup**: Valid username parameter
- **Assertions**: Returns 200, content-type image/svg+xml

#### TE-ITEM-4.2: GET /api/stats - Missing Username

- **Behavior**: Returns 400 for missing username
- **Setup**: No username parameter
- **Assertions**: Returns 400 status

#### TE-ITEM-4.3: GET /api/stats - Invalid Theme

- **Behavior**: Falls back to default theme
- **Setup**: Invalid theme parameter
- **Assertions**: Uses default theme colors

#### TE-ITEM-4.4: GET /api/top-langs - Valid Username

- **Behavior**: Returns SVG top languages
- **Setup**: Valid username
- **Assertions**: Returns 200, SVG content

#### TE-ITEM-4.5: GET /api/streak - Valid Username

- **Behavior**: Returns SVG streak stats
- **Setup**: Valid username
- **Assertions**: Returns 200, SVG content

#### TE-ITEM-4.6: GET /api/activity - Valid Username

- **Behavior**: Returns SVG activity graph
- **Setup**: Valid username
- **Assertions**: Returns 200, SVG content

#### TE-ITEM-4.7: GET /api/trophies - Valid Username

- **Behavior**: Returns SVG trophies
- **Setup**: Valid username
- **Assertions**: Returns 200, SVG content

---

### Component Tests

#### TE-ITEM-5.1: BlockPreview - Renders Block Type

- **Behavior**: Renders preview for block type
- **Setup**: Block with type 'heading'
- **Assertions**: Shows heading preview

#### TE-ITEM-5.2: Canvas - Renders Blocks

- **Behavior**: Renders all blocks in canvas
- **Setup**: Multiple blocks in store
- **Assertions**: All blocks rendered

#### TE-ITEM-5.3: ConfigPanel - Shows Props

- **Behavior**: Shows configuration panel for selected block
- **Setup**: Block selected
- **Assertions**: Panel displays block props

---

## Proposed Code Changes

### Package.json Additions

```diff
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
-   "lint": "eslint"
+   "lint": "eslint",
+   "test": "vitest",
+   "test:ui": "vitest --ui",
+   "test:coverage": "vitest --coverage",
+   "test:run": "vitest run"
  },
```

### vitest.config.ts (New File)

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./test/setup.ts'],
    include: ['**/*.test.ts', '**/*.test.tsx'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['lib/**', 'app/api/**'],
      exclude: ['**/*.d.ts'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
```

### test/setup.ts (New File)

```typescript
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock navigator.clipboard
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: vi.fn().mockResolvedValue(undefined),
    readText: vi.fn().mockResolvedValue(''),
  },
});
```

### lib/markdown.test.ts (New File)

````typescript
import { describe, it, expect } from 'vitest';
import { renderBlock, renderMarkdown, buildInternalUrl, buildExternalUrl } from './markdown';
import type { Block } from './types';

describe('renderBlock', () => {
  describe('container', () => {
    it('should render center-aligned container', () => {
      const block: Block = {
        id: 'test',
        type: 'container',
        props: { alignment: 'center' },
        children: [{ id: 'child', type: 'paragraph', props: { text: 'Hello', alignment: 'left' } }],
      };
      const result = renderBlock(block);
      expect(result).toContain('<div align="center">');
      expect(result).toContain('Hello');
    });

    it('should render left-aligned container without wrapper', () => {
      const block: Block = {
        id: 'test',
        type: 'container',
        props: { alignment: 'left' },
        children: [{ id: 'child', type: 'paragraph', props: { text: 'Hello', alignment: 'left' } }],
      };
      const result = renderBlock(block);
      expect(result).not.toContain('<div align="center">');
    });
  });

  describe('divider', () => {
    it('should render line divider', () => {
      const block: Block = {
        id: 'test',
        type: 'divider',
        props: { type: 'line' },
      };
      const result = renderBlock(block);
      expect(result).toBe('---');
    });

    it('should render gif divider', () => {
      const block: Block = {
        id: 'test',
        type: 'divider',
        props: { type: 'gif', gifUrl: 'https://example.com/divider.gif' },
      };
      const result = renderBlock(block);
      expect(result).toContain('<img src="https://example.com/divider.gif"');
    });
  });

  describe('spacer', () => {
    it('should render correct number of br tags', () => {
      const block: Block = {
        id: 'test',
        type: 'spacer',
        props: { height: 40 },
      };
      const result = renderBlock(block);
      expect(result).toBe('<br/>\n'.repeat(2));
    });
  });
});

---

## Commands

### Local Development

```bash
# Install test dependencies
npm install --save-dev vitest @vitest/ui @vitest/coverage-v8 @testing-library/react @testing-library/dom @testing-library/user-event jsdom msw

# Run tests in watch mode
npm test

# Run tests once
npm run test:run

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
````

### CI Integration

```yaml
# .github/workflows/test.yml
name: Test

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'
      - run: npm ci
      - run: npm run test:run
      - run: npm run test:coverage
        with:
          directory: ./coverage
      - uses: codecov/codecov-action@v4
        with:
          files: ./coverage/coverage.json
          fail_ci_if_error: false
```

### Coverage Thresholds

| Metric            | Target | Description                              |
| ----------------- | ------ | ---------------------------------------- |
| Line Coverage     | 80%    | Minimum line coverage for critical paths |
| Branch Coverage   | 75%    | Minimum branch coverage                  |
| Function Coverage | 80%    | Minimum function coverage                |

---

## Quality Assurance Checklist

- [ ] All tests follow AAA pattern with clear arrange, act, and assert sections
- [ ] Test names describe the behavior and condition being validated
- [ ] Edge cases, boundary values, null inputs, and error paths are covered
- [ ] Mocking strategy is appropriate; no over-mocking of internals
- [ ] Tests are deterministic and pass reliably across environments
- [ ] Performance assertions exist for time-sensitive operations
- [ ] Test data is generated via factories or builders, not hardcoded
- [ ] CI integration is configured with proper test commands and thresholds

---

## Test Execution Order

1. **Unit Tests First** - Run `lib/*.test.ts` for fast feedback
2. **Integration Tests** - Run `app/api/**/*.test.ts`
3. **Component Tests** - Run `components/**/*.test.tsx`
4. **Full Coverage** - Run `npm run test:coverage`

---

## Notes

- Use `test.each` for parameterized tests with multiple input variations
- Mock external APIs (GitHub) using MSW for integration tests
- Test file naming: `*.test.ts` for unit tests, `*.integration.test.ts` for integration tests
- Keep test files co-located with the modules they test
- Use descriptive test names: `should [behavior] when [condition]`
