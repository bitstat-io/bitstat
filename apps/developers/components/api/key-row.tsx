"use client";

import { type ApiKeyT } from "@/actions/api-keys";
import { TableCell, TableRow } from "@workspace/ui/components/table";
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
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { IconLoader2 } from "@tabler/icons-react";

function RevokeKeyButton({
  apiKey,
  revoking,
  onRevoke,
}: {
  apiKey: ApiKeyT;
  revoking: boolean;
  onRevoke: (keyId: string) => void;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" disabled={revoking}>
          {revoking && <IconLoader2 className="size-3.5 animate-spin" />}
          Revoke
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Revoke API Key</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently revoke the API key{" "}
            <span className="font-mono font-medium">
              {apiKey.key_prefix}...
            </span>
            . Any applications using this key will lose access immediately. This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onRevoke(apiKey.id)}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            Revoke Key
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function KeyRow({
  apiKey,
  revoking,
  onRevoke,
}: {
  apiKey: ApiKeyT;
  revoking: string | null;
  onRevoke: (keyId: string) => void;
}) {
  const isActive = !apiKey.revoked_at;

  return (
    <TableRow className={!isActive ? "text-muted-foreground" : undefined}>
      <TableCell className="font-mono text-sm">
        {apiKey.key_prefix}...
      </TableCell>
      <TableCell>
        <Badge variant="outline">{apiKey.env}</Badge>
      </TableCell>
      <TableCell>
        <div className="flex gap-1 flex-wrap">
          {apiKey.scopes.map((scope) => (
            <Badge key={scope} variant="secondary">
              {scope}
            </Badge>
          ))}
        </div>
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {new Date(apiKey.created_at).toLocaleDateString()}
      </TableCell>
      <TableCell>
        {isActive ? (
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-green-500" />
            <span className="text-sm">Active</span>
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">Revoked</span>
        )}
      </TableCell>
      <TableCell className="text-right">
        {isActive && (
          <RevokeKeyButton
            apiKey={apiKey}
            revoking={revoking === apiKey.id}
            onRevoke={onRevoke}
          />
        )}
      </TableCell>
    </TableRow>
  );
}
