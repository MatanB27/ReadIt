export interface HNItem {
  id: number;
  by?: string;
  descendants?: number;
  score?: number;
  time?: number;
  title?: string;
  type?: string;
  url?: string;
}

export interface Article {
  id: number;
  title: string;
  author: string;
  score: number;
  commentCount: number;
  time: number;
  url: string | null;
  domain: string;
}
