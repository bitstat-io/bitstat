"use client";

import { type AxiePlayer } from "@workspace/ui/lib/types";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@workspace/ui/components/card";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { IconLoader2 } from "@tabler/icons-react";
import Link from "next/link";

export default function AxieLeaderboard() {
  const [data, setData] = useState<AxiePlayer[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async () => {
    setData([]);
    const response = await fetch(`/api/axie-infinity`);
    setLoading(true);
    if (!response.ok) {
      throw new Error(`Failed to fetch leaderboard: ${response.statusText}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Failed to fetch leaderboard");
    }

    setData(result.data._items);

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  console.log(data);

  // const bg =
  //   "https://www.google.com/search?q=axie+art+dark&sca_esv=9594ada01a48a169&udm=2&biw=1920&bih=915&sxsrf=AE3TifOJ3wBoTWXc_zdROV84K_xneVJ9tg%3A1758559390646&ei=nnzRaNeaJ5ze2roP1sfimQg&ved=0ahUKEwjX4a6e6OyPAxUcr1YBHdajOIMQ4dUDCBE&uact=5&oq=axie+art+dark&gs_lp=Egtnd3Mtd2l6LWltZyINYXhpZSBhcnQgZGFya0iLBlCbAljIBHACeACQAQCYAVqgAecCqgEBNLgBA8gBAPgBAZgCAqACBcICBxAjGCcYyQKYAwCIBgGSBwEyoAe0AbIHALgHAMIHAzAuMsgHBA&sclient=gws-wiz-img#vhid=EaqfJX8xsh1CoM&vssid=mosaic";

  return (
    <div className="container mx-auto px-4 space-y-20 p-4 lg:p-6 min-h-screen">
      <div className="animate-in fade-in duration-500">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button
              variant="ghost"
              className="mb-4 hover:translate-x-1 transition-transform"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Games
            </Button>
          </Link>

          <div className="flex flex-col lg:flex-row gap-6 items-start">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-3xl font-bold text-foreground text-balance">
                  Axie Infinity Leaderboard
                </h1>
                <Button
                  onClick={fetchData}
                  disabled={loading}
                  variant="outline"
                  size="sm"
                  className="hover:rotate-180 transition-transform duration-300"
                >
                  {loading ? (
                    <IconLoader2 className="animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-muted-foreground mb-4 text-pretty">
                Axie Infinity is a virtual world filled with cute, formidable
                creatures known as Axies.
              </p>
            </div>
          </div>
        </div>

        {/* Full Leaderboard */}
        <Card className="overflow-hidden p-0">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border bg-muted/30">
                  <tr className="text-left">
                    <th className="px-6 py-3 text-sm font-medium text-muted-foreground">
                      Rank
                    </th>
                    <th className="px-6 py-3 text-sm font-medium text-muted-foreground">
                      Player
                    </th>
                    <th className="px-6 py-3 text-sm font-medium text-muted-foreground">
                      VSTAR
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((player, index) => (
                    <tr
                      key={player.userID}
                      className={`border-b border-border hover:bg-muted/50 transition-all duration-200 ${
                        index < 3 ? "bg-muted/20" : ""
                      }`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {player.topRank}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-foreground hover:text-primary transition-colors cursor-pointer">
                          {player.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-foreground hover:text-primary transition-colors cursor-pointer">
                          {player.vstar}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
