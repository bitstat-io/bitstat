export default async function GameId({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <div className="px-4 md:px-6 py-2 md:py-4">{id}</div>;
}
