import { ExternalLink, GitBranch, Heart } from 'lucide-react';

const repositoryUrl = 'https://github.com/zntb/github-profile-readme-builder';

export function SiteFooter() {
  return (
    <footer className="shrink-0 border-t border-border/70 bg-card/80 px-4 py-3 backdrop-blur-md sm:px-6">
      <div className="mx-auto flex max-w-screen-2xl flex-col items-center justify-between gap-2 text-xs text-muted-foreground sm:flex-row">
        <div className="flex items-center gap-1.5">
          <GitBranch className="size-3.5 text-primary" aria-hidden="true" />
          <span>Build a profile that stands out.</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span>Made with</span>
          <Heart className="size-3.5 fill-primary text-primary" aria-label="love" />
          <span>for the GitHub community.</span>
          <a
            href={repositoryUrl}
            target="_blank"
            rel="noreferrer"
            className="ml-2 inline-flex items-center gap-1 font-medium text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
          >
            <ExternalLink className="size-3.5" aria-hidden="true" />
            View source
          </a>
        </div>
      </div>
    </footer>
  );
}
