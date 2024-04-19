interface GetModel {
  config: object;
  response: object;
}

interface PostModel {
  config: object;
  response: object;
}

interface EndpointDataModel {
  url: string;
  GET?: GetModel;
  POST?: PostModel;
}

export default interface ResponseGetEndpointsModel {
  endpoints: EndpointDataModel[];
}
