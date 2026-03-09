import { IconKey } from "@tabler/icons-react";

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <IconKey className="size-10 text-muted-foreground/50 mb-3" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
