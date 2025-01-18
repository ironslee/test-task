export interface TableConfig {
  limit: number;
  page: number;
  sortKey: string;
  sortOrder: "ascend" | "descend" | "";
}
