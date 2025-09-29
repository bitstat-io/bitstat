export type Game = {
  id: string;
  name: string;
  description: string;
  category: string;
  playerCount: number;
  imageUrl: string;
  apiEndpoint?: string;
  hasRealApi: boolean;
};

export type NavItemsProps = {
  name: string;
  href: string;
  target: string;
  icon: React.ReactNode;
};

export type AxiePlayer = {
  avatar: string;
  name: string;
  rank: string;
  tier: number;
  topRank: number;
  userID: string;
  vstar: number;
  _etag: string;
};
