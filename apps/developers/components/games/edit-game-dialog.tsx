"use client";

import { useState } from "react";
import { type GameT } from "@/actions/games";
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
import { IconLoader2, IconPencil } from "@tabler/icons-react";

export function EditGameDialog({
  game,
  onUpdate,
}: {
  game: GameT;
  onUpdate: (updates: {
    name?: string;
    game_type?: string;
    image_url?: string;
  }) => Promise<boolean>;
}) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState(game.name);
  const [gameType, setGameType] = useState(game.game_type);
  const [imageUrl, setImageUrl] = useState<string | undefined>();

  const handleOpen = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      setName(game.name);
      setGameType(game.game_type);
      setImageUrl(undefined);
    }
  };

  const handleSubmit = async () => {
    if (!name.trim() || !gameType.trim()) return;

    const updates: { name?: string; game_type?: string; image_url?: string } =
      {};
    if (name !== game.name) updates.name = name;
    if (gameType !== game.game_type) updates.game_type = gameType;
    if (imageUrl) updates.image_url = imageUrl;

    if (Object.keys(updates).length === 0) {
      setOpen(false);
      return;
    }

    setSaving(true);
    const success = await onUpdate(updates);
    if (success) {
      setOpen(false);
    }
    setSaving(false);
  };

  const isValid = name.trim() && gameType.trim();

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <IconPencil className="size-4" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Game</DialogTitle>
          <DialogDescription>
            Update the details for{" "}
            <span className="font-medium text-foreground">{game.name}</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium">Cover Image</Label>
            <ImageUpload
              currentUrl={game.image_url}
              storagePath={`games/${game.slug}/cover`}
              onUploaded={setImageUrl}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-name" className="text-sm font-medium">
              Name
            </Label>
            <Input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium">Slug</Label>
            <Input value={game.slug} disabled className="font-mono" />
            <p className="text-xs text-muted-foreground">
              Slug cannot be changed after creation.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-type" className="text-sm font-medium">
              Game Type
            </Label>
            <Input
              id="edit-type"
              value={gameType}
              onChange={(e) => setGameType(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit} disabled={saving || !isValid}>
            {saving && <IconLoader2 className="size-4 animate-spin" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
