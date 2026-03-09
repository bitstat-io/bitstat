import { GameDetail } from "@/components/games/game-detail";

export default async function GameDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <GameDetail gameSlug={id} />;
}
