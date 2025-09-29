import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
import { Plus, ExternalLink } from "lucide-react";
import Image from "next/image";

export default function Games() {
  const games = [
    {
      name: "Axie Infinity",
      logo: "/placeholder.svg",
    },
    {
      name: "The Sandbox",
      logo: "/placeholder.svg?height=60&width=60&text=SAND",
    },
    {
      name: "Decentraland",
      logo: "/placeholder.svg?height=60&width=60&text=MANA",
    },
    {
      name: "Gods Unchained",
      logo: "/placeholder.svg?height=60&width=60&text=GODS",
    },
    {
      name: "Splinterlands",
      logo: "/placeholder.svg?height=60&width=60&text=SPS",
    },
    {
      name: "Alien Worlds",
      logo: "/placeholder.svg?height=60&width=60&text=TLM",
    },
    {
      name: "My Neighbor Alice",
      logo: "/placeholder.svg?height=60&width=60&text=ALICE",
    },
    {
      name: "Star Atlas",
      logo: "/placeholder.svg?height=60&width=60&text=ATLAS",
    },
    { name: "Illuvium", logo: "/placeholder.svg?height=60&width=60&text=ILV" },
    {
      name: "Gala Games",
      logo: "/placeholder.svg?height=60&width=60&text=GALA",
    },
    { name: "Enjin", logo: "/placeholder.svg?height=60&width=60&text=ENJ" },
    {
      name: "Immutable X",
      logo: "/placeholder.svg?height=60&width=60&text=IMX",
    },
  ];

  const categories = [
    {
      title: "Battle & Strategy",
      count: 45,
      examples: ["Gods Unchained", "Splinterlands", "Star Atlas"],
    },
    {
      title: "Virtual Worlds",
      count: 28,
      examples: ["The Sandbox", "Decentraland", "My Neighbor Alice"],
    },
    {
      title: "Collectibles & Trading",
      count: 67,
      examples: ["Axie Infinity", "Illuvium", "Alien Worlds"],
    },
    {
      title: "DeFi Gaming",
      count: 34,
      examples: ["Gala Games", "Enjin", "Immutable X"],
    },
  ];

  return (
    <section id="games" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-balance">
            200+ Supported Web3 Games
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Connect your favorite Web3 games and get unified analytics across
            your entire gaming portfolio.
          </p>
        </div>

        {/* Featured Games Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-16">
          {games.map((game) => (
            <Card
              key={game.name}
              className="p-4 hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group"
            >
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <Image
                    src={"/placeholder.svg"}
                    alt={game.name}
                    width={32}
                    height={32}
                    className="rounded"
                  />
                </div>
                <h3 className="font-medium text-sm text-center">{game.name}</h3>
              </div>
            </Card>
          ))}
        </div>

        {/* Game Categories */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8">
            Game Categories
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Card
                key={category.title}
                className="p-6 text-center hover:shadow-lg transition-shadow"
              >
                <div className="text-3xl font-bold text-primary mb-2">
                  {category.count}
                </div>
                <h4 className="font-semibold mb-3">{category.title}</h4>
                <div className="space-y-1">
                  {category.examples.map((example, exampleIndex) => (
                    <div
                      key={exampleIndex}
                      className="text-sm text-muted-foreground"
                    >
                      {example}
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Integration Request */}
        <div className="text-center">
          <Card className="p-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Plus className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">Don&apos;t See Your Game?</h3>
            </div>
            <p className="text-muted-foreground mb-6">
              We&apos;re constantly adding new Web3 games to our platform.
              Request an integration for your favorite game and we&apos;ll
              prioritize it based on community demand.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gradient-primary">
                Request Integration
              </Button>
              <Button size="lg" variant="outline">
                <ExternalLink className="w-4 h-4 mr-2" />
                View All Games
              </Button>
            </div>
          </Card>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">200+</div>
            <div className="text-muted-foreground">Supported Games</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">15+</div>
            <div className="text-muted-foreground">Blockchain Networks</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">24/7</div>
            <div className="text-muted-foreground">Real-time Sync</div>
          </div>
        </div>
      </div>
    </section>
  );
}
