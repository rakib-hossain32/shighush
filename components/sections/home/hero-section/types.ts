export interface CategoryStat {
  category: string;
  labelBn: string;
  count: number;
  trend: string;
  status: string;
}

export interface AreaHotspot {
  area: string;
  count: number;
  percentage: number;
  level: string;
}

export type TabType = "latest" | "categories" | "hotspots";
