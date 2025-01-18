import NomenclatureAsync from "./Nomenclature.async";
import nomenclatureReducer, {
  clearStore,
  setSelectedItem,
  setTableConfig,
} from "./NomenclatureSlice";

export { NomenclatureAsync as Nomenclature };
export { nomenclatureReducer, setTableConfig, setSelectedItem, clearStore };
