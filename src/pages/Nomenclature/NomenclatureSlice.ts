import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TableConfig } from "../../types/Common";

import { ApiItemResponse, NomenclatureStore } from "../../types/Nomenclature";

const initialState: NomenclatureStore = {
  tableConfig: {
    limit: 10,
    page: 1,
    sortKey: "name",
    sortOrder: "descend",
  },
  selectedItem: null,
};

export const nomenclatureSlice = createSlice({
  name: "nomenclature",
  initialState,
  reducers: {
    setTableConfig: (state, action: PayloadAction<TableConfig>) => {
      state.tableConfig = action.payload;
    },
    setSelectedItem: (state, action: PayloadAction<ApiItemResponse | null>) => {
      state.selectedItem = action.payload;
    },
    clearStore: (state) => {
      state = {
        ...initialState,
      };

      return state;
    },
  },
});

export const { setTableConfig, setSelectedItem, clearStore } =
  nomenclatureSlice.actions;

export default nomenclatureSlice.reducer;
