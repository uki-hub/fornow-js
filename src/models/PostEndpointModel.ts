import BaseEndpointModel from "./BaseEndpointModel";
import PostEndpointLogModel from "./PostEndpointLogModel";

export default interface PostEndpointModel extends BaseEndpointModel {
  logs: PostEndpointLogModel[];
}
