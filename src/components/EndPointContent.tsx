import { EndpointModel } from "../models/EndpointModel";
import EndpointDetail from "./EndpointDetail";
import CopyButton from "./CopyButton";

interface Props {
  endpoint?: EndpointModel;
}

const EndpointContent = ({ endpoint }: Props) => {
  if (!endpoint) return <></>;

  return (
    <div className="flex flex-col h-full w-[70%]">
      <div className="flex items-center shrink-0 gap-2 px-6 py-4 mb-4 shadow">
        <span className="font-bold px-1.5 rounded-sm text-gray-100 bg-gray-600">POST</span>
        <span>{endpoint?.url}</span>
        <CopyButton text={window.location.href.slice(0, -1) + endpoint.url} />
      </div>
      <div className=" w-full flex gap-2 px-4 text-sm mb-1 select-none text-gray-400">
        <label className="cursor-pointer hover:font-semibold hover:text-gray-500 font-semibold text-gray-500">Overview</label>
        <span>•</span>
        <label className="cursor-pointer hover:font-semibold hover:text-gray-500">Response</label>
        <span>•</span>
        <label className="cursor-pointer hover:font-semibold hover:text-gray-500">Logs</label>
        <span>•</span>
        <label className="cursor-pointer hover:font-semibold hover:text-gray-500">Setting</label>
      </div>
      <div className="h-full flex flex-col px-4 mb-4 overflow-hidden">
        <h2 className="font-semibold mb-1 text-gray-600">Response</h2>
        <div className="h-full text-sm px-2 py-2 overflow-y-auto text-gray-500 bg-gray-100 ">
          <pre>{JSON.stringify(endpoint!.POST!.response, null, 2)}</pre>
        </div>
      </div>
      <EndpointDetail path={endpoint.url} requests={endpoint!.POST!.requests} />
    </div>
  );
};

export default EndpointContent;
