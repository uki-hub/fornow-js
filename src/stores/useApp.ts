import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import BaseEndpointModel from "../models/BaseEndpointModel";
import ResponseGetEndpointsModel from "../models/responses/ResponseGetEndpointsModel";

interface AppState {
  endpoints?: BaseEndpointModel[];
  endpointId?: string;
  filter: string;
  getEndpoints: () => Promise<void>;
  changeFilter: (q: string) => void;
  changeEndpoint: (id: string) => void;
}

const useApp = create(
  immer<AppState>((set, get) => ({
    endpoints: undefined,
    endpointId: undefined,
    filter: "",

    getEndpoints: async () => {
      const response = await fetch("/api");

      const endpointData = (await response.json()) as ResponseGetEndpointsModel;

      const mappedEndpoints: BaseEndpointModel[] = [];

      for (let i = 0; i < endpointData.endpoints.length; i++) {
        const endpoint = endpointData.endpoints[i];

        const hasGet = endpoint.GET != undefined;
        const hasPost = endpoint.POST != undefined;

        if (hasGet) {
          mappedEndpoints.push({
            url: endpoint.url,
            method: "GET",
            id: crypto.randomUUID().toString(),
            response: JSON.stringify(endpoint.GET?.response),
            logs: [],
          });
        }

        if (hasPost) {
          mappedEndpoints.push({
            url: endpoint.url,
            method: "POST",
            id: crypto.randomUUID().toString(),
            response: JSON.stringify(endpoint.POST?.response),
            logs: [],
          });
        }
      }

      set((state) => {
        state.endpoints = mappedEndpoints;
      });
    },

    changeFilter: (q) => set((state) => (state.filter = q)),
    
    changeEndpoint: (id: string) => set((state) => (state.endpointId = id)),
  }))
);

export default useApp;
