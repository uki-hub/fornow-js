interface PayloadEndpointDataModel {
  config?: object;
  response: object;
  logs?: object[];
}

interface PayloadEndpointModel {
  url: string;
  GET?: PayloadEndpointDataModel;
  POST?: PayloadEndpointDataModel;
}

export type { PayloadEndpointModel, PayloadEndpointDataModel };

export default interface PayloadGetEndpointsModel {
  endpoints: PayloadEndpointModel[];
}
