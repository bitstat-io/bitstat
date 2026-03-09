"use client";

import { useState } from "react";
import { type CreatedApiKeyT } from "@/actions/api-keys";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import {
  IconAlertTriangle,
  IconCheck,
  IconCopy,
} from "@tabler/icons-react";

export function KeyRevealCard({ apiKey }: { apiKey: CreatedApiKeyT }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(apiKey.key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="border-green-600/30 bg-green-500/5">
      <CardContent className="flex flex-col gap-3 pt-6">
        <div className="flex items-center gap-2 text-sm font-medium">
          <IconAlertTriangle className="size-4 text-green-600" />
          Your new API key has been created. Copy it now — it won&apos;t be
          shown again.
        </div>
        <div className="flex items-center gap-2">
          <Input
            readOnly
            value={apiKey.key}
            className="font-mono text-sm"
          />
          <Button variant="outline" size="icon" onClick={handleCopy}>
            {copied ? (
              <IconCheck className="size-4 text-green-600" />
            ) : (
              <IconCopy className="size-4" />
            )}
          </Button>
        </div>
        <div className="flex gap-2 text-xs text-muted-foreground">
          <Badge variant="outline">{apiKey.env}</Badge>
          {apiKey.scopes.map((scope) => (
            <Badge key={scope} variant="secondary">
              {scope}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
