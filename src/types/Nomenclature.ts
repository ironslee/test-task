import { TableConfig } from "./Common";

export interface ApiItemResponse {
  id: string;
  name: string;
  description: string;
  measurement_units: string;
  code: string;
}

export interface ApiItemRequest {
  name: string;
  description: string;
  measurement_units: string;
  code: string;
}

export interface ApiItemPageResponse {
  result: ApiItemResponse[];
  total: number;
}

export interface FetchItemsParams {
  page: number;
  pageSize: number;
  itemName?: string;
  code?: string;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC" | null;
}

export interface NomenclatureStore {
  tableConfig: TableConfig;
  selectedItem: null | ApiItemResponse;
}
