export type Game = {
  href: string;
  name: string;
  description: string;
  category: string;
  imageUrl: string;
};

export type NavItemsProps = {
  name: string;
  href: string;
  target: string;
  icon?: React.ReactNode;
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

export type AxieLeaderboardState = {
  data: AxiePlayer[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  offset: number;
  total: number | null;
};
