import { useState } from "react";
import { PostRequestModel } from "../models/EndPointModel";
import CopyButton from "./CopyButton";

interface Props {
  path: string;
  requests: PostRequestModel[];
}

const EndpointDetail = ({ path, requests }: Props) => {
  const [requestIndex, setRequestIndex] = useState(-1);

  if (requestIndex != -1 && requests[requestIndex] == undefined) setRequestIndex(-1);

  let requestList: JSX.Element;
  if (requests.length <= 0) {
    requestList = <div className="h-full flex justify-center items-center text-3xl font-semibold text-gray-300">. . .</div>;
  } else {
    requestList = (
      <div className="flex flex-col gap-3 py-2 pl-3 pr-2 text-sm overflow-y-auto">
        {requests.map((r, i) => (
          <div
            onClick={() => setRequestIndex(i)}
            key={i}
            className={`px-3 py-2 border rounded cursor-pointer text-gray-800 ${i == requestIndex ? "font-semibold !bg-gray-500 !text-white" : ""}`}
          >
            {r.fileName}
          </div>
        ))}
      </div>
    );
  }

  const request = requests[requestIndex]!;

  let requestBody: JSX.Element;
  if (requestIndex == -1 || request == undefined) {
    requestBody = <div className="flex justify-center items-center h-full text-4xl font-semibold text-gray-300">. . .</div>;
  } else {
    requestBody = (
      <>
        <div className="flex justify-between items-center border-b p-2 ">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700">{request.fileName}</span>
            <CopyButton text={JSON.stringify(request.body, null, 2)} />
          </div>
          <div
            onClick={() => deleteHandler(request.fileName)}
            className="px-2 py-0.5 rounded cursor-pointer text-white bg-red-400 hover:bg-red-500 active:bg-red-600"
          >
            Delete
          </div>
        </div>
        <pre className=" px-2 py-2 pt-2 text-gray-500 bg-gray-100 overflow-y-scroll">{JSON.stringify(request.body, null, 2)}</pre>
      </>
    );
  }

  const deleteHandler = (fileName: string) => {
    const body = JSON.stringify({
      path: path,
      reqFile: fileName,
    });

    console.log(body);

    fetch("/del", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: body,
    })
      .then((r) => r.json())
      .then((r) => {
        if (r?.status) setRequestIndex(-1);
      });
  };

  const clearHandler = () => {
    fetch("/clear", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        path: path,
      }),
    })
      .then((r) => r.json())
      .then((r) => {
        if (r?.status) setRequestIndex(-1);
      });
  };

  return (
    <div className="w-full h-full flex gap-4 px-4 pb-4 overflow-y-auto">
      <div className="relative w-[30%] flex flex-col pb-3 border ">
        <div className="flex justify-between items-center py-2 pl-3 pr-2 border-b shadow-sm text-gray-600 bg-white">
          <span className="font-semibold ">Received request</span>
          {requests.length > 0 && (
            <div onClick={clearHandler} className="px-2 py-0.5 rounded cursor-pointer text-white bg-red-400 hover:bg-red-500 active:bg-red-600">
              Clear
            </div>
          )}
        </div>
        {requestList}
      </div>

      <div className="w-[70%] flex flex-col border">{requestBody}</div>
    </div>
  );
};

export default EndpointDetail;
