"use client";

import { Button } from "@workspace/ui/components/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@workspace/ui/components/alert-dialog";
import { IconLoader2, IconRocket, IconPlayerStop } from "@tabler/icons-react";

const ENVIRONMENTS = ["dev", "prod"] as const;

export function PublishControls({
  publishing,
  onPublish,
  onUnpublish,
}: {
  publishing: string | null;
  onPublish: (env: string) => Promise<boolean>;
  onUnpublish: (env: string) => Promise<boolean>;
}) {
  return (
    <div className="flex flex-col gap-4">
      {ENVIRONMENTS.map((env) => (
        <div
          key={env}
          className="flex items-center justify-between rounded-md border p-4"
        >
          <div>
            <p className="text-sm font-medium capitalize">{env}</p>
            <p className="text-xs text-muted-foreground">
              {env === "dev"
                ? "Development environment for testing"
                : "Production environment for live traffic"}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => onPublish(env)}
              disabled={publishing !== null}
            >
              {publishing === `publish-${env}` && (
                <IconLoader2 className="size-3.5 animate-spin" />
              )}
              <IconRocket className="size-3.5" />
              Publish
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={publishing !== null}
                >
                  {publishing === `unpublish-${env}` && (
                    <IconLoader2 className="size-3.5 animate-spin" />
                  )}
                  <IconPlayerStop className="size-3.5" />
                  Unpublish
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Unpublish from {env}?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This will take the game offline in the{" "}
                    <span className="font-medium">{env}</span> environment.
                    {env === "prod" &&
                      " Live users will lose access immediately."}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onUnpublish(env)}>
                    Unpublish
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      ))}
    </div>
  );
}
