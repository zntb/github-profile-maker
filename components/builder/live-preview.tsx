/* eslint-disable @next/next/no-img-element */
'use client';

import { Eye } from 'lucide-react';
import { JSX, useMemo, type CSSProperties } from 'react';

import {
  buildActivityUrl,
  buildQuotesUrl,
  buildStatsUrl,
  buildStreakUrl,
  buildTopLangsUrl,
  buildTrophiesUrl,
} from '@/lib/api-urls';
import { SOCIAL_BADGES } from '@/lib/social-badges';
import { useBuilderStore } from '@/lib/store';
import type { Block } from '@/lib/types';

interface LivePreviewProps {
  blocks: Block[];
}

function isHalfWidthGithubCard(block: Block): boolean {
  if (!['stats-card', 'top-languages', 'streak-stats'].includes(block.type)) return false;
  const layoutWidth = block.props.layoutWidth as string | undefined;
  if (layoutWidth === 'half') return true;
  if (layoutWidth === 'full') return false;
  return false;
}

export function LivePreview({ blocks }: LivePreviewProps) {
  if (blocks.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-4 sm:p-8 relative">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
        </div>
        <div className="relative text-center animate-in">
          <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
            <Eye className="w-8 h-8 text-muted-foreground/50" />
          </div>
          <p className="text-muted-foreground">Add blocks to see a live preview of your README</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto overflow-x-hidden">
      <div className="p-3 sm:p-6">
        <div className="mx-auto max-w-3xl rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-3 sm:p-6 shadow-lg shadow-muted/10 github-preview">
          {(() => {
            const items: JSX.Element[] = [];
            for (let i = 0; i < blocks.length; i += 1) {
              const block = blocks[i];
              const nextBlock = blocks[i + 1];

              // Render two adjacent half-width cards side by side, matching GitHub layout
              if (isHalfWidthGithubCard(block) && nextBlock && isHalfWidthGithubCard(nextBlock)) {
                items.push(
                  <div
                    key={`${block.id}-${nextBlock.id}`}
                    className="mb-4 animate-in"
                    style={{ display: 'flex', gap: '8px', animationDelay: `${i * 30}ms` }}
                  >
                    <div style={{ flex: '1 1 0', minWidth: 0 }}>
                      <PreviewBlock block={block} wrapperClassName="mb-0" />
                    </div>
                    <div style={{ flex: '1 1 0', minWidth: 0 }}>
                      <PreviewBlock block={nextBlock} wrapperClassName="mb-0" />
                    </div>
                  </div>,
                );
                i += 1;
                continue;
              }

              items.push(
                <div
                  key={block.id}
                  className="animate-in"
                  style={{ animationDelay: `${i * 30}ms` }}
                >
                  <PreviewBlock block={block} />
                </div>,
              );
            }
            return items;
          })()}
        </div>
      </div>
    </div>
  );
}

/**
 * Resolve the img style for a stats card block.
 * Default: fill the container width and let the SVG maintain its natural aspect ratio.
 * An explicit imageStyleOverride (e.g. from stats-row) takes precedence.
 */
function resolvePreviewImageSize(block: Block): CSSProperties {
  const cardHeight = block.props.cardHeight as string | number | undefined;
  const heightValue =
    cardHeight === undefined
      ? 'auto'
      : typeof cardHeight === 'number'
        ? `${cardHeight}px`
        : cardHeight;
  return {
    width: '100%',
    height: heightValue,
    display: 'block',
  };
}

function PreviewBlock({
  block,
  wrapperClassName = 'mb-4',
  imageStyleOverride,
}: {
  block: Block;
  wrapperClassName?: string;
  imageStyleOverride?: CSSProperties;
}) {
  const { type, props, children } = block;
  const globalUsername = useBuilderStore((state) => state.username);
  const imageSizeStyle = imageStyleOverride ?? resolvePreviewImageSize(block);

  const renderBlock = useMemo(() => {
    const getUsername = (blockUsername: string) => {
      return (!blockUsername || blockUsername === 'github') && globalUsername
        ? globalUsername
        : blockUsername;
    };

    switch (type) {
      case 'container':
        return (
          <div
            style={{
              display: 'flex',
              flexDirection: props.direction as 'row' | 'column',
              alignItems:
                props.alignment === 'center'
                  ? 'center'
                  : props.alignment === 'right'
                    ? 'flex-end'
                    : 'flex-start',
              gap: `${props.gap}px`,
              width: '100%',
              justifyContent: 'center',
            }}
          >
            {children?.map((child) => (
              <PreviewBlock key={child.id} block={child} />
            ))}
          </div>
        );

      case 'stats-row': {
        const direction = (props.direction as 'row' | 'column') ?? 'row';
        const gap = Number(props.gap ?? 12);
        const cardWidth = (props.cardWidth as string) || '49%';
        // For the preview, let images maintain natural aspect ratio (height: auto).
        // Forcing an explicit pixel height on SVG <img> can cause letterboxing.
        return (
          <div
            style={{
              display: 'flex',
              flexDirection: direction,
              gap: `${gap}px`,
              justifyContent: 'center',
              alignItems: 'flex-start',
              width: '100%',
            }}
          >
            {children?.map((child) => (
              <div
                key={child.id}
                style={{
                  width: direction === 'row' ? cardWidth : '100%',
                  minWidth: 0,
                  flex: direction === 'row' ? `0 0 ${cardWidth}` : undefined,
                }}
              >
                <PreviewBlock
                  block={child}
                  wrapperClassName="mb-0"
                  imageStyleOverride={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </div>
            ))}
          </div>
        );
      }

      case 'divider':
        return props.type === 'gif' && props.gifUrl ? (
          <img
            src={props.gifUrl as string}
            alt="Divider"
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        ) : (
          <hr className="my-4" />
        );

      case 'spacer':
        return <div style={{ height: `${props.height}px` }} />;

      case 'capsule-header': {
        const capsuleUrl = `https://capsule-render.vercel.app/api?type=${props.type}&color=${encodeURIComponent(String(props.color))}&height=${props.height}&section=${props.section}&text=${encodeURIComponent(String(props.text))}&fontSize=50&animation=fadeIn&fontColor=ffffff`;
        return (
          <img
            src={capsuleUrl}
            alt="Header"
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        );
      }

      case 'avatar':
        return (
          <div className="text-center">
            <img
              src={props.imageUrl as string}
              alt="Avatar"
              style={{
                width: `${props.size}px`,
                height: `${props.size}px`,
                borderRadius: `${props.borderRadius}%`,
                display: 'inline-block',
              }}
            />
          </div>
        );

      case 'greeting':
        return (
          <h1
            style={{
              textAlign: props.alignment as 'left' | 'center' | 'right',
              marginBottom: '1rem',
            }}
          >
            {props.text as string}{' '}
            {Boolean(props.emoji) ? <span>{props.emoji as string}</span> : null}
          </h1>
        );

      case 'typing-animation': {
        const lines = props.lines as string[];
        const typingUrl = `https://readme-typing-svg.demolab.com?font=Fira+Code&size=22&duration=3000&pause=1000&color=${props.color}&center=true&vCenter=true&width=${props.width}&height=${props.height}&lines=${encodeURIComponent(lines.join(';'))}`;
        return (
          <div className="text-center">
            <img src={typingUrl} alt="Typing Animation" style={{ height: 'auto' }} />
          </div>
        );
      }

      case 'heading': {
        const HeadingTag = `h${props.level}` as keyof JSX.IntrinsicElements;
        return (
          <HeadingTag style={{ textAlign: props.alignment as 'left' | 'center' | 'right' }}>
            {Boolean(props.emoji) ? <span>{props.emoji as string} </span> : null}
            {props.text as string}
          </HeadingTag>
        );
      }

      case 'paragraph':
        return (
          <p style={{ textAlign: props.alignment as 'left' | 'center' | 'right' }}>
            {props.text as string}
          </p>
        );

      case 'collapsible':
        return (
          <details open={Boolean(props.defaultOpen)}>
            <summary>{props.title as string}</summary>
            <div className="pl-4 mt-2">
              {children?.map((child) => (
                <PreviewBlock key={child.id} block={child} />
              ))}
            </div>
          </details>
        );

      case 'code-block':
        return (
          <pre className="rounded-lg bg-muted p-4 overflow-x-auto">
            <code>{props.code as string}</code>
          </pre>
        );

      case 'image':
        return (
          <div style={{ textAlign: props.alignment as 'left' | 'center' | 'right' }}>
            <img
              src={props.url as string}
              alt={props.alt as string}
              style={{
                maxWidth: '100%',
                width: props.width ? `${props.width}px` : 'auto',
                height: props.height ? `${props.height}px` : 'auto',
                borderRadius: `${props.borderRadius}px`,
                display: 'inline-block',
              }}
            />
          </div>
        );

      case 'gif':
        return (
          <div style={{ textAlign: props.alignment as 'left' | 'center' | 'right' }}>
            <img
              src={props.url as string}
              alt={props.alt as string}
              style={{ width: props.width ? `${props.width}px` : 'auto', height: 'auto' }}
            />
          </div>
        );

      case 'social-badges': {
        const badgeStyle = props.style as string;
        const badges: JSX.Element[] = [];

        for (const [key, def] of Object.entries(SOCIAL_BADGES)) {
          const value = props[key];
          if (!value) continue;
          const isExternal = key !== 'email' && key !== 'portfolio';
          badges.push(
            <a
              key={key}
              href={def.url(String(value))}
              {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              <img
                src={`https://img.shields.io/badge/${encodeURIComponent(def.label)}-${def.color}?style=${badgeStyle}&logo=${def.logo}&logoColor=white`}
                alt={def.label}
                style={{ height: 'auto' }}
              />
            </a>,
          );
        }

        return badges.length > 0 ? (
          <div className="flex flex-wrap gap-2 justify-center">{badges}</div>
        ) : null;
      }

      case 'custom-badge': {
        const badgeUrl = `https://img.shields.io/badge/${encodeURIComponent(props.label as string)}-${encodeURIComponent(props.message as string)}-${props.color}?style=${props.style}${props.logo ? `&logo=${props.logo}` : ''}`;
        return (
          <div className="text-center">
            <img
              src={badgeUrl}
              alt={`${props.label}: ${props.message}`}
              style={{ height: 'auto' }}
            />
          </div>
        );
      }

      case 'skill-icons': {
        const icons = props.icons as string[];
        const skillUrl = `https://skillicons.dev/icons?i=${icons.join(',')}&perline=${props.perLine}&theme=${props.theme}`;
        return (
          <div className="text-center">
            <img src={skillUrl} alt="Skills" style={{ maxWidth: '100%', height: 'auto' }} />
          </div>
        );
      }

      /**
       * Stats card — uses <img> so the browser respects the SVG viewBox aspect ratio.
       * The previous StatsCardInline approach (fetch + dangerouslySetInnerHTML) stripped
       * the height attribute from the SVG, causing distorted proportions.
       */
      case 'stats-card': {
        const layoutStyle = (props.layoutStyle as string | undefined) ?? 'standard';
        const username = getUsername(props.username as string);

        if (!username || username === 'github') {
          return (
            <div className="p-4 border border-dashed border-muted-foreground/30 rounded-lg bg-muted/20 text-center">
              <p className="text-muted-foreground text-sm">Enter a GitHub username to see stats</p>
            </div>
          );
        }

        const statsUrl = buildStatsUrl({
          username,
          theme: props.theme as string,
          layout: layoutStyle,
          showIcons: Boolean(props.showIcons),
          hideBorder: Boolean(props.hideBorder),
          hideTitle: Boolean(props.hideTitle),
          hideRank: Boolean(props.hideRank),
          borderRadius: props.borderRadius,
        });

        return <img src={statsUrl} alt="GitHub Stats" style={imageSizeStyle} />;
      }

      case 'top-languages': {
        const langsUrl = buildTopLangsUrl({
          username: getUsername(props.username as string),
          theme: props.theme as string,
          layout: props.layout as string,
          hideBorder: Boolean(props.hideBorder),
          hideProgress: Boolean(props.hideProgress),
          langs_count: props.langs_count,
          borderRadius: props.borderRadius,
        });
        return <img src={langsUrl} alt="Top Languages" style={imageSizeStyle} />;
      }

      case 'streak-stats': {
        const streakUrl = buildStreakUrl({
          username: getUsername(props.username as string),
          theme: props.theme as string,
          hideBorder: Boolean(props.hideBorder),
          borderRadius: props.borderRadius,
        });
        return <img src={streakUrl} alt="GitHub Streak" style={imageSizeStyle} />;
      }

      case 'activity-graph': {
        const activityUrl = buildActivityUrl({
          username: getUsername(props.username as string),
          theme: props.theme as string,
          hideBorder: Boolean(props.hideBorder),
        });
        return (
          // Activity graph SVG is 850 px wide — always fill the full container width
          <img
            src={activityUrl}
            alt="Activity Graph"
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        );
      }

      case 'trophies': {
        const trophiesUrl = buildTrophiesUrl({
          username: getUsername(props.username as string),
          theme: props.theme as string,
          column: props.column,
          row: props.row,
          margin_w: props.margin_w,
          margin_h: props.margin_h,
          noFrame: Boolean(props.noFrame),
          noBg: Boolean(props.noBg),
        });
        return (
          <div className="text-center">
            <img
              src={trophiesUrl}
              alt="GitHub Trophies"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </div>
        );
      }

      case 'visitor-counter': {
        const visitorUrl = `https://komarev.com/ghpvc/?username=${getUsername(props.username as string)}&color=${props.color}&style=${props.style}&label=${encodeURIComponent(props.label as string)}`;
        return (
          <div className="text-center">
            <img src={visitorUrl} alt="Profile Views" style={{ height: 'auto' }} />
          </div>
        );
      }

      case 'quote': {
        if (props.quote && props.author) {
          return (
            <blockquote className="border-l-4 border-primary pl-4 italic my-4">
              <p>&ldquo;{props.quote as string}&rdquo;</p>
              <cite className="text-muted-foreground">— {props.author as string}</cite>
            </blockquote>
          );
        }
        const quotesUrl = buildQuotesUrl({
          type: props.type as string,
          theme: props.theme as string,
        });
        return (
          <div className="text-center">
            <img src={quotesUrl} alt="Quote" style={{ maxWidth: '100%', height: 'auto' }} />
          </div>
        );
      }

      case 'footer-banner': {
        const footerUrl = `https://capsule-render.vercel.app/api?type=waving&color=${encodeURIComponent(String(props.waveColor))}&height=${props.height}&section=footer&text=${encodeURIComponent(String(props.text))}&fontSize=24&fontColor=${props.fontColor}`;
        return (
          <img
            src={footerUrl}
            alt="Footer"
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        );
      }

      default:
        return null;
    }
  }, [type, props, children, globalUsername, imageSizeStyle]);

  return <div className={wrapperClassName}>{renderBlock}</div>;
}
