import { useQuery } from "@tanstack/react-query";
import { fetchItemById } from "../api";

const USE_GET_ITEM_BY_ID_KEY = "getIdByIdKey";

export const useItemById = (id: number) => {
  return useQuery({
    queryKey: [USE_GET_ITEM_BY_ID_KEY, id],
    queryFn: () => fetchItemById(id),
    enabled: id > 0,
  });
};
