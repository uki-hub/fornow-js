import { EndPointModel } from "../models/EndPointModel";
import EndpointDetail from "./EndpointDetail";
import CopyButton from "./CopyButton";

interface Props {
  endpoint?: EndPointModel;
}

const EndPointContent = ({ endpoint }: Props) => {
  if (!endpoint) return <></>;

  return (
    <div className="flex flex-col h-full w-[70%]">
      <div className="flex shrink-0 items-start gap-2 px-6 py-4 mb-4 shadow">
        <label>{endpoint?.url}</label>
        <CopyButton text={window.location.href.slice(0, -1) + endpoint.url} />
      </div>
      <div className="h-[40%] flex flex-col shrink-0 px-4 mb-4 overflow-hidden">
        <h2 className="font-semibold mb-1 text-gray-600">Response</h2>
        <div className="h-full text-sm px-2 py-2 overflow-y-auto text-gray-500 bg-gray-100 ">
          <pre>{JSON.stringify(endpoint!.POST!.response, null, 2)}</pre>
        </div>
      </div>
      <EndpointDetail path={endpoint.url} requests={endpoint!.POST!.requests} />
    </div>
  );
};

export default EndPointContent;
