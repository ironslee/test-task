import {
  ApiItemPageResponse,
  ApiItemRequest,
  ApiItemResponse,
  FetchItemsParams,
} from "../types/Nomenclature";
import api from "../utils/axiosMiddleware";

export const fetchItems = async (
  params?: FetchItemsParams
): Promise<ApiItemPageResponse> => {
  const response = await api.get<ApiItemPageResponse>("/api/wh/items", {
    params,
  });
  return response.data;
};

export const createItem = async (
  item: ApiItemRequest
): Promise<ApiItemResponse> => {
  try {
    const response = await api.post<ApiItemResponse>("/api/wh/items", item);
    return response.data;
  } catch (error) {
    console.error("Ошибка при создании элемента:", error);
    throw error;
  }
};

export const updateItem = async (
  id: string,
  item: ApiItemRequest
): Promise<ApiItemResponse> => {
  try {
    const response = await api.patch<ApiItemResponse>(
      `api/wh/items/${id}`,
      item
    );
    return response.data;
  } catch (error) {
    console.error("Ошибка при обновлении элемента:", error);
    throw error;
  }
};
