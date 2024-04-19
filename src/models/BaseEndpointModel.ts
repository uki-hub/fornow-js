import EndpointConfigModel from "./EndpointConfigModel";
import EndpointLogModel from "./EndpointLogModel";

export default interface BaseEndpointModel {
  id: string;
  url: string;
  method: "GET" | "POST";
  response: string;
  config?: EndpointConfigModel;
  logs: EndpointLogModel[];
}
