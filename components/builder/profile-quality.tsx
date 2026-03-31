'use client';

import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  LayoutGrid,
  Sparkles,
  TextCursor,
  Type,
} from 'lucide-react';
import { useMemo, useState } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { calculateProfileQuality, getGradeBgColor, getGradeColor } from '@/lib/profile-quality';
import { useBuilderStore } from '@/lib/store';
import { cn } from '@/lib/utils';

const priorityColors = {
  high: 'text-red-500 bg-red-500/10',
  medium: 'text-yellow-500 bg-yellow-500/10',
  low: 'text-muted-foreground bg-muted',
};

export function ProfileQuality() {
  const blocks = useBuilderStore((s) => s.blocks);
  const username = useBuilderStore((s) => s.username);
  const [expanded, setExpanded] = useState(true);

  const quality = useMemo(() => {
    return calculateProfileQuality(blocks, username);
  }, [blocks, username]);

  if (blocks.length === 0) {
    return null;
  }

  return (
    <Card className="overflow-hidden border-border/50 bg-gradient-to-br from-card/80 to-card/40 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={cn('p-1.5 rounded-lg', getGradeBgColor(quality.grade))}>
              <Sparkles className={cn('w-4 h-4', getGradeColor(quality.grade))} />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold">Profile Quality</CardTitle>
              <CardDescription className="text-xs">Completeness score</CardDescription>
            </div>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 hover:bg-muted rounded-md transition-colors"
            aria-label={expanded ? 'Collapse' : 'Expand'}
          >
            {expanded ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
        </div>

        {expanded && (
          <div className="flex items-center gap-3 mt-2">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className="text-2xl font-bold"
                  style={{ color: getScoreColor(quality.percentage) }}
                >
                  {quality.percentage}%
                </span>
                <span className={cn('text-lg font-bold', getGradeColor(quality.grade))}>
                  {quality.grade}
                </span>
              </div>
              {/* Progress Bar */}
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-500 ease-out',
                    getProgressBarColor(quality.percentage),
                  )}
                  style={{ width: `${quality.percentage}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </CardHeader>

      {expanded && (
        <CardContent className="space-y-4 pt-0">
          {/* Breakdown */}
          <div className="grid grid-cols-2 gap-2">
            <QualityBreakdownItem
              label="Blocks"
              value={quality.breakdown.blocks}
              maxValue={25}
              icon={LayoutGrid}
              percentage={Math.round((quality.stats.totalBlocks / 15) * 100)}
            />
            <QualityBreakdownItem
              label="Content"
              value={quality.breakdown.content}
              maxValue={30}
              icon={TextCursor}
              percentage={Math.round(
                quality.stats.totalContentFields > 0
                  ? (quality.stats.filledContentFields / quality.stats.totalContentFields) * 100
                  : 0,
              )}
            />
            <QualityBreakdownItem
              label="Variety"
              value={quality.breakdown.variety}
              maxValue={25}
              icon={Sparkles}
              percentage={Math.round((quality.stats.uniqueCategories / 6) * 100)}
            />
            <QualityBreakdownItem
              label="Balance"
              value={quality.breakdown.visualBalance}
              maxValue={20}
              icon={Type}
              percentage={Math.round(
                ((quality.stats.hasGitHubStats ? 1 : 0) +
                  (quality.stats.hasSocialLinks ? 1 : 0) +
                  (quality.stats.hasAvatar ? 1 : 0)) *
                  33,
              )}
            />
          </div>

          {/* Suggestions */}
          {quality.suggestions.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Suggestions
              </h4>
              <div className="space-y-2">
                {quality.suggestions.slice(0, 3).map((suggestion, index) => (
                  <div
                    key={index}
                    className={cn(
                      'flex items-start gap-2 p-2 rounded-lg text-xs',
                      priorityColors[suggestion.priority],
                    )}
                  >
                    {suggestion.priority === 'high' ? (
                      <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                    ) : (
                      <ArrowRight className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                    )}
                    <div>
                      <p className="font-medium">{suggestion.title}</p>
                      <p className="text-muted-foreground opacity-80">{suggestion.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stats Summary */}
          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border/50">
            {quality.stats.hasUsername && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 text-[10px] font-medium">
                <CheckCircle2 className="w-3 h-3" /> Username
              </span>
            )}
            {quality.stats.hasAvatar && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 text-[10px] font-medium">
                <CheckCircle2 className="w-3 h-3" /> Avatar
              </span>
            )}
            {quality.stats.hasSocialLinks && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 text-[10px] font-medium">
                <CheckCircle2 className="w-3 h-3" /> Social
              </span>
            )}
            {quality.stats.hasGitHubStats && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 text-[10px] font-medium">
                <CheckCircle2 className="w-3 h-3" /> Stats
              </span>
            )}
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-[10px] font-medium">
              {quality.stats.totalBlocks} blocks
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-[10px] font-medium">
              {quality.stats.uniqueCategories} categories
            </span>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

interface QualityBreakdownItemProps {
  label: string;
  value: number;
  maxValue: number;
  icon: React.ComponentType<{ className?: string }>;
  percentage: number;
}

function QualityBreakdownItem({
  label,
  value,
  maxValue,
  icon: Icon,
  percentage,
}: QualityBreakdownItemProps) {
  return (
    <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
      <div className="p-1 rounded bg-background/50">
        <Icon className="w-3 h-3 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-[10px] font-medium text-muted-foreground">{label}</span>
          <span className="text-[10px] font-semibold">
            {value}/{maxValue}
          </span>
        </div>
        <div className="h-1 w-full bg-background rounded-full overflow-hidden">
          <div
            className={cn('h-full rounded-full', getProgressBarColor(percentage))}
            style={{ width: `${Math.min(100, percentage)}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function getScoreColor(percentage: number): string {
  if (percentage >= 80) return '#22c55e'; // green-500
  if (percentage >= 60) return '#84cc16'; // lime-500
  if (percentage >= 40) return '#eab308'; // yellow-500
  if (percentage >= 20) return '#f97316'; // orange-500
  return '#ef4444'; // red-500
}

function getProgressBarColor(percentage: number): string {
  if (percentage >= 80) return 'bg-green-500';
  if (percentage >= 60) return 'bg-lime-500';
  if (percentage >= 40) return 'bg-yellow-500';
  if (percentage >= 20) return 'bg-orange-500';
  return 'bg-red-500';
}
