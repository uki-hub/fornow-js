import { useState } from "react";
import BaseEndpointModel from "../../../models/BaseEndpointModel";

interface Props {
  endpoint: BaseEndpointModel;
}

const EndpointListItem = ({ endpoint }: Props) => {
  const [show, setShow] = useState(false);

  // let rowClass =
  //   "w-full flex justify-between break-words px-3 py-2 rounded border font-semibold cursor-pointer text-gray-700 border-gray-300 bg-white hover:bg-gray-100";

  // if (i == index) rowClass += " " + "!bg-gray-500 !text-white";

  // const hasGET = d.GET != undefined;
  // const hasPOST = d.POST != undefined;

  // let chips: JSX.Element[] = [];

  // let chipClass = "rounded-sm";

  // if (i == index) chipClass = "text-white";

  // if (hasGET) chips.push(<div className={chipClass}>GET</div>);
  // if (hasPOST) chips.push(<div className={chipClass}>POST</div>);

  // if (hasGET && hasPOST) chips.splice(1, 0, <div>|</div>);

  return (
    <div className={""}>
      <label>{endpoint.url}</label>
      <div className="flex flex-col">
        <div>GET</div>
        <div>POST</div>
      </div>
    </div>
  );
};

export default EndpointListItem;
