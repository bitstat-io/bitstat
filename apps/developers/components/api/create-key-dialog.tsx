"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Button } from "@workspace/ui/components/button";
import { Label } from "@workspace/ui/components/label";
import { IconLoader2, IconPlus } from "@tabler/icons-react";

const SCOPES = ["ingest", "read", "admin"] as const;
const ENVIRONMENTS = ["dev", "prod"] as const;

export function CreateKeyDialog({
  gameName,
  disabled,
  onCreate,
}: {
  gameName: string;
  disabled: boolean;
  onCreate: (env: string, scopes: string[]) => Promise<boolean>;
}) {
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [env, setEnv] = useState<string>("dev");
  const [scopes, setScopes] = useState<string[]>(["ingest"]);

  const toggleScope = (scope: string) => {
    setScopes((prev) =>
      prev.includes(scope) ? prev.filter((s) => s !== scope) : [...prev, scope]
    );
  };

  const handleSubmit = async () => {
    setCreating(true);
    const success = await onCreate(env, scopes);
    if (success) {
      setOpen(false);
      setEnv("dev");
      setScopes(["ingest"]);
    }
    setCreating(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" disabled={disabled}>
          <IconPlus className="size-4" />
          Create API Key
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create API Key</DialogTitle>
          <DialogDescription>
            Create a new API key for{" "}
            <span className="font-medium text-foreground">{gameName}</span>. The
            key will only be shown once after creation.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium">Environment</Label>
            <div className="flex gap-2">
              {ENVIRONMENTS.map((e) => (
                <Button
                  key={e}
                  type="button"
                  variant={env === e ? "default" : "outline"}
                  size="sm"
                  onClick={() => setEnv(e)}
                >
                  {e}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium">Scopes</Label>
            <div className="flex gap-2">
              {SCOPES.map((scope) => (
                <Button
                  key={scope}
                  type="button"
                  variant={scopes.includes(scope) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleScope(scope)}
                >
                  {scope}
                </Button>
              ))}
            </div>
            {scopes.length === 0 && (
              <p className="text-xs text-destructive">
                Select at least one scope
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={creating || scopes.length === 0}
          >
            {creating && <IconLoader2 className="size-4 animate-spin" />}
            Create Key
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
