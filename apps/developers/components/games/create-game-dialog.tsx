"use client";

import { useState } from "react";
import { ImageUpload } from "@/components/games/image-upload";
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
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { IconLoader2, IconPlus } from "@tabler/icons-react";

export function CreateGameDialog({
  onCreate,
}: {
  onCreate: (
    slug: string,
    name: string,
    gameType: string,
    imageUrl?: string
  ) => Promise<boolean>;
}) {
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [gameType, setGameType] = useState("");
  const [imageUrl, setImageUrl] = useState<string | undefined>();

  const handleNameChange = (value: string) => {
    setName(value);
    setSlug(
      value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
    );
  };

  const handleSubmit = async () => {
    if (!name.trim() || !slug.trim() || !gameType.trim()) return;

    setCreating(true);
    const success = await onCreate(slug, name, gameType, imageUrl);
    if (success) {
      setOpen(false);
      setName("");
      setSlug("");
      setGameType("");
      setImageUrl(undefined);
    }
    setCreating(false);
  };

  const isValid = name.trim() && slug.trim() && gameType.trim();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <IconPlus className="size-4" />
          New Game
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Game</DialogTitle>
          <DialogDescription>
            Add a new game to start tracking analytics and managing API keys.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium">Cover Image</Label>
            <ImageUpload
              storagePath={`games/${slug || "new"}/cover`}
              onUploaded={setImageUrl}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="game-name" className="text-sm font-medium">
              Name
            </Label>
            <Input
              id="game-name"
              placeholder="My Awesome Game"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="game-slug" className="text-sm font-medium">
              Slug
            </Label>
            <Input
              id="game-slug"
              placeholder="my-awesome-game"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="font-mono"
            />
            <p className="text-xs text-muted-foreground">
              URL-friendly identifier. Auto-generated from name.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="game-type" className="text-sm font-medium">
              Game Type
            </Label>
            <Input
              id="game-type"
              placeholder="e.g. fps, rpg, moba"
              value={gameType}
              onChange={(e) => setGameType(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit} disabled={creating || !isValid}>
            {creating && <IconLoader2 className="size-4 animate-spin" />}
            Create Game
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
