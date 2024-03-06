interface EndPointModel {
  url: string;
  POST?: PostConfigModel;
  GET?: GetConfigModel;
}

interface PostConfigModel {
  config?: ApiConfigModel;
  response: any;
}

interface GetConfigModel {
  config?: ApiConfigModel;
  response: any;
}

interface ApiConfigModel {
  headers?: {};
  security?: {};
  delay?: 10000;
  statusCode?: 200;
}

export type { EndPointModel, PostConfigModel, GetConfigModel, ApiConfigModel };
