import { IconExternalLink } from "@tabler/icons-react";

export function PageHeader() {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">API Keys</h1>
        <a
          href="https://api.bitstat.io/docs/static/index.html"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          View API Documentation
          <IconExternalLink className="size-3.5" />
        </a>
      </div>
      <p className="text-sm text-muted-foreground">
        Create and manage API keys for your games. Keys are used to authenticate
        requests to the BitStat API.
      </p>
    </div>
  );
}
