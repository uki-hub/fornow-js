import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import BaseEndpointModel from "../models/BaseEndpointModel";
import PostEndpointModel from "../models/PostEndpointModel";
import GetEndpointModel from "../models/GetEndpointModel";

interface AppState {
  endpoints: BaseEndpointModel[];
  endpointId?: string;
  filter: string;
  changeFilter: (q: string) => void;
  changeEndpoint: (id: string) => void;
}

const useApp = create(
  immer<AppState>((set, get) => ({
    endpoints: [],
    endpointId: undefined,
    filter: "",
    changeFilter: (q) => set((state) => (state.filter = q)),
    changeEndpoint: (id: string) => set((state) => (state.endpointId = id)),
  }))
);

export default useApp;
