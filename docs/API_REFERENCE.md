# API Reference

This document provides detailed information about all API routes in the GitHub Profile Maker. These routes are used internally to generate SVG images for GitHub stats widgets.

## Base URL

```
https://github-profile-maker.vercel.app/api
```

When running locally:

```
http://localhost:3000/api
```

---

## Table of Contents

- [Quotes API](#quotes-api)
- [Stats API](#stats-api)
- [Streak API](#streak-api)
- [Top Languages API](#top-languages-api)
- [Activity Graph API](#activity-graph-api)
- [Trophies API](#trophies-api)
- [Error Handling](#error-handling)

---

## Quotes API

Get a random developer quote.

### Endpoint

```
GET /api/quotes
```

### Parameters

None required.

### Response

```json
{
  "text": "Code is like humor. When you have to explain it, it's bad.",
  "author": "Cory House",
  "type": "programming"
}
```

### Example Usage

```markdown
<!-- Static quote -->

![Quote](https://github-profile-maker.vercel.app/api/quotes)

<!-- In your README.md -->

> "Code is like humor. When you have to explain it, it's bad."
> — Cory House
```

---

## Stats API

Generate a GitHub stats card SVG showing user statistics.

### Endpoint

```
GET /api/stats
```

### Parameters

| Parameter       | Type    | Default      | Description                               |
| --------------- | ------- | ------------ | ----------------------------------------- |
| `username`      | string  | required     | GitHub username                           |
| `theme`         | string  | `'default'`  | Theme name (see [Themes](../THEMES.md))   |
| `show_icons`    | boolean | `false`      | Show icons for each stat                  |
| `hide_border`   | boolean | `false`      | Hide the card border                      |
| `hide_title`    | boolean | `false`      | Hide the card title                       |
| `hide_rank`     | boolean | `false`      | Hide the rank circle                      |
| `border_radius` | number  | `4.5`        | Border radius (0-100)                     |
| `bg_color`      | string  | -            | Custom background color (hex)             |
| `text_color`    | string  | -            | Custom text color (hex)                   |
| `title_color`   | string  | -            | Custom title color (hex)                  |
| `icon_color`    | string  | -            | Custom icon color (hex)                   |
| `layout`        | string  | `'standard'` | Layout style: `'standard'` or `'compact'` |

### Example Request

```
GET /api/stats?username=octocat&theme=dracula&show_icons=true
```

### Example Response

Returns an SVG image with the user's GitHub stats.

### Markdown Usage

```markdown
![GitHub Stats](https://github-profile-maker.vercel.app/api/stats?username=yourusername&theme=tokyonight)
```

### Layout Styles

#### Standard Layout (default)

Shows a list-style card with all stats in a single column (195px height).

#### Compact Layout

Shows a grid-style card with stats in two columns (80px height).

```markdown
![GitHub Stats](https://github-profile-maker.vercel.app/api/stats?username=yourusername&layout=compact)
```

---

## Streak API

Generate a GitHub streak stats card showing contribution streaks.

### Endpoint

```
GET /api/streak
```

### Parameters

| Parameter         | Type    | Default     | Description                       |
| ----------------- | ------- | ----------- | --------------------------------- |
| `username`        | string  | required    | GitHub username                   |
| `theme`           | string  | `'default'` | Theme name                        |
| `hide_border`     | boolean | `false`     | Hide the card border              |
| `border_radius`   | number  | `4.5`       | Border radius (0-100)             |
| `bg_color`        | string  | -           | Custom background color (hex)     |
| `text_color`      | string  | -           | Custom text color (hex)           |
| `fire_color`      | string  | -           | Fire/streak icon color (hex)      |
| `ring_color`      | string  | -           | Ring color (hex)                  |
| `currStreakColor` | string  | -           | Current streak number color (hex) |
| `sideNumColor`    | string  | -           | Side numbers color (hex)          |
| `sideLabelColor`  | string  | -           | Side labels color (hex)           |
| `datesColor`      | string  | -           | Dates color (hex)                 |

### Example Request

```
GET /api/streak?username=octocat&theme=dracula
```

### Markdown Usage

```markdown
![Streak Stats](https://github-profile-maker.vercel.app/api/streak?username=yourusername&theme=tokyonight)
```

### Displayed Information

- **Current Streak**: Days of continuous contributions
- **Longest Streak**: Maximum streak achieved
- **Total Contributions**: All-time contribution count

---

## Top Languages API

Generate a top programming languages card.

### Endpoint

```
GET /api/top-langs
```

### Parameters

| Parameter       | Type    | Default     | Description                                                             |
| --------------- | ------- | ----------- | ----------------------------------------------------------------------- |
| `username`      | string  | required    | GitHub username                                                         |
| `theme`         | string  | `'default'` | Theme name                                                              |
| `layout`        | string  | `'normal'`  | Layout: `'compact'`, `'normal'`, `'donut'`, `'donut-vertical'`, `'pie'` |
| `hide_border`   | boolean | `false`     | Hide the card border                                                    |
| `hide_progress` | boolean | `false`     | Hide the progress bars                                                  |
| `langs_count`   | number  | `5`         | Number of languages to show (1-10)                                      |
| `border_radius` | number  | `4.5`       | Border radius (0-100)                                                   |
| `bg_color`      | string  | -           | Custom background color (hex)                                           |
| `text_color`    | string  | -           | Custom text color (hex)                                                 |
| `title_color`   | string  | -           | Custom title color (hex)                                                |

### Layout Options

| Layout           | Description                           |
| ---------------- | ------------------------------------- |
| `compact`        | Two-column list without progress bars |
| `normal`         | Full width with progress bars         |
| `donut`          | Donut chart with legend               |
| `donut-vertical` | Vertical donut chart                  |
| `pie`            | Pie chart                             |

### Example Request

```
GET /api/top-langs?username=octocat&theme=dracula&layout=donut&langs_count=5
```

### Markdown Usage

```markdown
![Top Languages](https://github-profile-maker.vercel.app/api/top-langs?username=yourusername&theme=tokyonight&layout=donut)
```

---

## Activity Graph API

Generate a 30-day contribution activity graph.

### Endpoint

```
GET /api/activity
```

### Parameters

| Parameter     | Type    | Default     | Description                        |
| ------------- | ------- | ----------- | ---------------------------------- |
| `username`    | string  | required    | GitHub username                    |
| `theme`       | string  | `'default'` | Theme name                         |
| `hide_border` | boolean | `false`     | Hide the border                    |
| `bg_color`    | string  | -           | Custom background color (hex)      |
| `color`       | string  | -           | Main color (hex)                   |
| `line`        | string  | -           | Line color (hex)                   |
| `point`       | string  | -           | Point color (hex)                  |
| `area_color`  | string  | -           | Area fill color (hex with opacity) |

### Example Request

```
GET /api/activity?username=octocat&theme=dracula
```

### Markdown Usage

```markdown
![Activity Graph](https://github-profile-maker.vercel.app/api/activity?username=yourusername&theme=tokyonight)
```

---

## Trophies API

Generate a trophy case showing GitHub achievements.

### Endpoint

```
GET /api/trophies
```

### Parameters

| Parameter  | Type    | Default     | Description                        |
| ---------- | ------- | ----------- | ---------------------------------- |
| `username` | string  | required    | GitHub username                    |
| `theme`    | string  | `'default'` | Theme name                         |
| `column`   | number  | `1`         | Number of columns (1-6)            |
| `row`      | number  | `1`         | Number of rows (1-3)               |
| `margin_w` | number  | `4`         | Horizontal margin between trophies |
| `margin_h` | number  | `4`         | Vertical margin between trophies   |
| `no_frame` | boolean | `false`     | Remove frame around trophies       |
| `no_bg`    | boolean | `false`     | Remove background                  |

### Example Request

```
GET /api/trophies?username=octocat&theme=dracula&column=3&row=1
```

### Markdown Usage

```markdown
![Trophies](https://github-profile-maker.vercel.app/api/trophies?username=yourusername&theme=tokyonight&column=3)
```

---

## Error Handling

All API routes include error state SVGs that display when:

- The GitHub user doesn't exist
- API rate limits are exceeded
- Required parameters are missing
- Network errors occur

### Error State Format

```svg
<svg width="495" height="195" xmlns="http://www.w3.org/2000/svg">
  <rect width="495" height="195" fill="#..." rx="10"/>
  <text x="247.5" y="89.5" text-anchor="middle" fill="#..." font-family="..." font-size="12">
    Error fetching stats for @username
  </text>
  <text x="247.5" y="109.5" text-anchor="middle" fill="#..." font-family="..." font-size="10" opacity="0.7">
    User may not exist or API rate limit exceeded
  </text>
</svg>
```

### Rate Limiting

Without a `GITHUB_TOKEN`, the APIs rely on the unauthenticated GitHub API which has stricter rate limits. For production use, consider:

1. Setting up your own GitHub Personal Access Token
2. Adding it to your environment variables:
   ```
   GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
   ```

### Security

All API routes include:

- Input validation and sanitization
- XSS protection via SVG escaping
- Hex color validation
- XML entity escaping

---

## Using with GitHub Profile

To use these APIs in your GitHub profile README:

1. Copy the URL for the desired stat
2. Add it as an image in your README:
   ```markdown
   ![GitHub Stats](https://github-profile-maker.vercel.app/api/stats?username=YOUR_USERNAME&theme=THEME_NAME)
   ```

### Complete Example

```markdown
# Hi there! I'm Your Name 👋

## 📊 GitHub Stats

![Stats](https://github-profile-maker.vercel.app/api/stats?username=yourusername&theme=dracula&show_icons=true)

## 🔥 Streak Stats

![Streak](https://github-profile-maker.vercel.app/api/streak?username=yourusername&theme=dracula)

## 🌍 Top Languages

![Languages](https://github-profile-maker.vercel.app/api/top-langs?username=yourusername&theme=dracula&layout=donut)

## 📈 Activity Graph

![Activity](https://github-profile-maker.vercel.app/api/activity?username=yourusername&theme=dracula)

## 🏆 Trophies

![Trophies](https://github-profile-maker.vercel.app/api/trophies?username=yourusername&theme=dracula&column=3)
```

---

## Self-Hosting

If you self-host the GitHub Profile Maker, update the URLs in your README to point to your instance:

```markdown
![Stats](https://your-domain.com/api/stats?username=yourusername)
```

### Environment Variables

For self-hosted instances, you can configure:

```env
# .env.local
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
```

This enables authenticated GitHub API requests with higher rate limits.
