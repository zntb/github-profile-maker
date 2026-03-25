import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import {
  calculateRank,
  calculateStreakStats,
  fetchContributionCalendar,
  fetchLanguageStats,
  fetchUserProfile,
  fetchUserRepos,
  fetchUserStats,
  type ContributionCalendar,
  type GitHubStats,
} from './github';

// Mock global fetch
(global.fetch as jest.Mock) = jest.fn();

describe('calculateStreakStats', () => {
  // TE-ITEM-2.1: calculateStreakStats - Consecutive Days
  it('should calculate current streak correctly for consecutive days including today', () => {
    const calendar: ContributionCalendar = {
      totalContributions: 5,
      weeks: [
        {
          contributionDays: [
            { date: '2024-01-01', contributionCount: 1 },
            { date: '2024-01-02', contributionCount: 1 },
            { date: '2024-01-03', contributionCount: 1 },
            { date: '2024-01-04', contributionCount: 1 },
            { date: '2024-01-05', contributionCount: 1 },
            { date: '2024-01-06', contributionCount: 0 },
            { date: '2024-01-07', contributionCount: 0 },
          ],
        },
      ],
    };

    // Mock today's date to be 2024-01-05
    const mockToday = new Date('2024-01-05');
    jest.useFakeTimers();
    jest.setSystemTime(mockToday);

    const result = calculateStreakStats(calendar);

    expect(result.currentStreak).toBe(5);
    expect(result.longestStreak).toBe(5);

    jest.useRealTimers();
  });

  // TE-ITEM-2.2: calculateStreakStats - No Recent Activity
  it('should return 0 current streak when last contribution was 5 days ago', () => {
    const calendar: ContributionCalendar = {
      totalContributions: 3,
      weeks: [
        {
          contributionDays: [
            { date: '2024-01-01', contributionCount: 1 },
            { date: '2024-01-02', contributionCount: 1 },
            { date: '2024-01-03', contributionCount: 1 },
            { date: '2024-01-04', contributionCount: 0 },
            { date: '2024-01-05', contributionCount: 0 },
            { date: '2024-01-06', contributionCount: 0 },
            { date: '2024-01-07', contributionCount: 0 },
          ],
        },
      ],
    };

    // Mock today's date to be 2024-01-08 (5 days after last contribution)
    const mockToday = new Date('2024-01-08');
    jest.useFakeTimers();
    jest.setSystemTime(mockToday);

    const result = calculateStreakStats(calendar);

    expect(result.currentStreak).toBe(0);

    jest.useRealTimers();
  });

  // TE-ITEM-2.3: calculateStreakStats - Longest Streak
  it('should identify longest streak correctly', () => {
    const calendar: ContributionCalendar = {
      totalContributions: 10,
      weeks: [
        {
          contributionDays: [
            { date: '2024-01-01', contributionCount: 1 },
            { date: '2024-01-02', contributionCount: 1 },
            { date: '2024-01-03', contributionCount: 1 },
            { date: '2024-01-04', contributionCount: 0 },
            { date: '2024-01-05', contributionCount: 0 },
            { date: '2024-01-06', contributionCount: 1 },
            { date: '2024-01-07', contributionCount: 1 },
            { date: '2024-01-08', contributionCount: 1 },
            { date: '2024-01-09', contributionCount: 1 },
            { date: '2024-01-10', contributionCount: 1 },
          ],
        },
      ],
    };

    const result = calculateStreakStats(calendar);

    expect(result.longestStreak).toBe(5); // The second streak of 5 is longer
  });

  // TE-ITEM-2.4: calculateStreakStats - Empty Calendar
  it('should handle empty contribution calendar', () => {
    const calendar: ContributionCalendar = {
      totalContributions: 0,
      weeks: [],
    };

    const result = calculateStreakStats(calendar);

    expect(result.currentStreak).toBe(0);
    expect(result.longestStreak).toBe(0);
    expect(result.totalContributions).toBe(0);
  });

  // TE-ITEM-2.5: calculateStreakStats - Single Day
  it('should handle single day contribution', () => {
    const calendar: ContributionCalendar = {
      totalContributions: 1,
      weeks: [
        {
          contributionDays: [{ date: '2024-01-01', contributionCount: 1 }],
        },
      ],
    };

    const mockToday = new Date('2024-01-01');
    jest.useFakeTimers();
    jest.setSystemTime(mockToday);

    const result = calculateStreakStats(calendar);

    expect(result.currentStreak).toBe(1);
    expect(result.longestStreak).toBe(1);

    jest.useRealTimers();
  });
});

describe('calculateRank', () => {
  // TE-ITEM-2.6: calculateRank - S+ Rank
  it('should return S+ for score >= 10000', () => {
    const stats: GitHubStats = {
      totalStars: 10000,
      totalForks: 0,
      totalCommits: 0,
      totalPRs: 0,
      totalIssues: 0,
      totalReviews: 0,
      contributedTo: 0,
      followers: 0,
      publicRepos: 0,
    };
    expect(calculateRank(stats)).toBe('S+');
  });

  // TE-ITEM-2.7: calculateRank - S Rank
  it('should return S for score >= 5000 and < 10000', () => {
    const stats: GitHubStats = {
      totalStars: 5000,
      totalForks: 0,
      totalCommits: 0,
      totalPRs: 0,
      totalIssues: 0,
      totalReviews: 0,
      contributedTo: 0,
      followers: 0,
      publicRepos: 0,
    };
    expect(calculateRank(stats)).toBe('S');
  });

  // TE-ITEM-2.8: calculateRank - A++ Rank
  it('should return A++ for score >= 2500 and < 5000', () => {
    const stats: GitHubStats = {
      totalStars: 2500,
      totalForks: 0,
      totalCommits: 0,
      totalPRs: 0,
      totalIssues: 0,
      totalReviews: 0,
      contributedTo: 0,
      followers: 0,
      publicRepos: 0,
    };
    expect(calculateRank(stats)).toBe('A++');
  });

  // TE-ITEM-2.9: calculateRank - A+ Rank
  it('should return A+ for score >= 1000 and < 2500', () => {
    const stats: GitHubStats = {
      totalStars: 1000,
      totalForks: 0,
      totalCommits: 0,
      totalPRs: 0,
      totalIssues: 0,
      totalReviews: 0,
      contributedTo: 0,
      followers: 0,
      publicRepos: 0,
    };
    expect(calculateRank(stats)).toBe('A+');
  });

  // TE-ITEM-2.10: calculateRank - A Rank
  it('should return A for score >= 500 and < 1000', () => {
    const stats: GitHubStats = {
      totalStars: 500,
      totalForks: 0,
      totalCommits: 0,
      totalPRs: 0,
      totalIssues: 0,
      totalReviews: 0,
      contributedTo: 0,
      followers: 0,
      publicRepos: 0,
    };
    expect(calculateRank(stats)).toBe('A');
  });

  // TE-ITEM-2.11: calculateRank - B+ Rank
  it('should return B+ for score >= 250 and < 500', () => {
    const stats: GitHubStats = {
      totalStars: 250,
      totalForks: 0,
      totalCommits: 0,
      totalPRs: 0,
      totalIssues: 0,
      totalReviews: 0,
      contributedTo: 0,
      followers: 0,
      publicRepos: 0,
    };
    expect(calculateRank(stats)).toBe('B+');
  });

  // TE-ITEM-2.12: calculateRank - B Rank
  it('should return B for score >= 100 and < 250', () => {
    const stats: GitHubStats = {
      totalStars: 100,
      totalForks: 0,
      totalCommits: 0,
      totalPRs: 0,
      totalIssues: 0,
      totalReviews: 0,
      contributedTo: 0,
      followers: 0,
      publicRepos: 0,
    };
    expect(calculateRank(stats)).toBe('B');
  });

  // TE-ITEM-2.13: calculateRank - C Rank
  it('should return C for score < 100', () => {
    const stats: GitHubStats = {
      totalStars: 0,
      totalForks: 0,
      totalCommits: 0,
      totalPRs: 0,
      totalIssues: 0,
      totalReviews: 0,
      contributedTo: 0,
      followers: 0,
      publicRepos: 0,
    };
    expect(calculateRank(stats)).toBe('C');
  });
});

describe('fetchUserProfile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // TE-ITEM-2.14: fetchUserProfile - Success
  it('should fetch user profile from GitHub API', async () => {
    const mockUser = {
      login: 'testuser',
      name: 'Test User',
      avatar_url: 'https://github.com/testuser.png',
      public_repos: 10,
      followers: 100,
      following: 50,
      created_at: '2020-01-01',
    };

    (global.fetch as jest.Mock<(...args: unknown[]) => Promise<Response>>).mockResolvedValueOnce({
      ok: true,
      json: async () => mockUser,
    } as unknown as Response);

    const result = await fetchUserProfile('testuser');

    expect(result).toEqual(mockUser);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.github.com/users/testuser',
      expect.objectContaining({
        headers: expect.objectContaining({
          Accept: 'application/vnd.github.v3+json',
        }),
      }),
    );
  });

  // TE-ITEM-2.15: fetchUserProfile - Not Found
  it('should throw error for non-existent user', async () => {
    (global.fetch as jest.Mock<(...args: unknown[]) => Promise<Response>>).mockResolvedValueOnce({
      ok: false,
      status: 404,
    } as unknown as Response);

    await expect(fetchUserProfile('nonexistent')).rejects.toThrow('Failed to fetch user: 404');
  });
});

describe('fetchUserRepos', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // TE-ITEM-2.16: fetchUserRepos - Pagination
  it('should fetch all pages of repositories', async () => {
    const mockRepos = Array.from({ length: 100 }, (_, i) => ({
      name: `repo-${i}`,
      full_name: `testuser/repo-${i}`,
      stargazers_count: i,
      forks_count: i,
      language: 'TypeScript',
      size: 1000,
    }));

    jest
      .mocked(global.fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockRepos,
      } as unknown as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      } as unknown as Response);

    const result = await fetchUserRepos('testuser');

    expect(result).toHaveLength(100);
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });
});

describe('fetchUserStats', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // TE-ITEM-2.17: fetchUserStats - GraphQL Query
  it('should fetch stats via GraphQL', async () => {
    const mockGraphQLResponse = {
      user: {
        followers: { totalCount: 100 },
        repositories: {
          totalCount: 50,
          nodes: Array.from({ length: 10 }, (_, i) => ({
            stargazerCount: i * 10,
            forkCount: i * 5,
          })),
        },
        pullRequests: { totalCount: 20 },
        issues: { totalCount: 10 },
        repositoriesContributedTo: { totalCount: 15 },
        contributionsCollection: {
          totalCommitContributions: 100,
          restrictedContributionsCount: 50,
          totalPullRequestReviewContributions: 5,
        },
      },
    };

    jest.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockGraphQLResponse }),
    } as unknown as Response);

    const result = await fetchUserStats('testuser', 'fake-token');

    expect(result.followers).toBe(100);
    expect(result.totalStars).toBe(450); // 0+10+20+...+90
    expect(result.totalCommits).toBe(150);
    expect(result.totalPRs).toBe(20);
    expect(result.totalIssues).toBe(10);
    expect(result.totalReviews).toBe(5);
  });
});

describe('fetchLanguageStats', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // TE-ITEM-2.18: fetchLanguageStats - Aggregates Languages
  it('should aggregate language sizes across repos', async () => {
    const mockGraphQLResponse = {
      user: {
        repositories: {
          nodes: [
            {
              languages: {
                edges: [
                  { size: 1000, node: { name: 'TypeScript', color: '#3178c6' } },
                  { size: 500, node: { name: 'JavaScript', color: '#f1e05a' } },
                ],
              },
            },
            {
              languages: {
                edges: [
                  { size: 800, node: { name: 'TypeScript', color: '#3178c6' } },
                  { size: 300, node: { name: 'Python', color: '#3572A5' } },
                ],
              },
            },
          ],
        },
      },
    };

    jest.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockGraphQLResponse }),
    } as unknown as Response);

    const result = await fetchLanguageStats('testuser', 'fake-token');

    expect(result.TypeScript).toBe(1800); // 1000 + 800
    expect(result.JavaScript).toBe(500);
    expect(result.Python).toBe(300);
  });
});

describe('fetchContributionCalendar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // TE-ITEM-2.19: fetchContributionCalendar - Returns Calendar
  it('should fetch contribution calendar', async () => {
    const mockCalendar: ContributionCalendar = {
      totalContributions: 365,
      weeks: [
        {
          contributionDays: [
            { date: '2024-01-01', contributionCount: 5 },
            { date: '2024-01-02', contributionCount: 3 },
          ],
        },
      ],
    };

    const mockGraphQLResponse = {
      user: {
        contributionsCollection: {
          contributionCalendar: mockCalendar,
        },
      },
    };

    jest.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockGraphQLResponse }),
    } as unknown as Response);

    const result = await fetchContributionCalendar('testuser', 'fake-token');

    expect(result).toEqual(mockCalendar);
    expect(result.totalContributions).toBe(365);
  });
});
