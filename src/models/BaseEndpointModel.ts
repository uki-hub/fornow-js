import EndpointConfigModel from "./EndpointConfigModel";

export default interface BaseEndpointModel {
  id: string;
  url: string;
  method: "GET" | "POST";
  response: string;
  config?: EndpointConfigModel;
}
