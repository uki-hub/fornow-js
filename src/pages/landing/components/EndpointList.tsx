import { useShallow } from "zustand/react/shallow";
import useApp from "../../../stores/useApp";

const EndpointList = () => {
  const { endpoints, filter } = useApp(
    useShallow((state) => ({
      endpoints: state.endpoints,
      filter: state.filter,
    }))
  );

  const filteredEndpoints = endpoints.filter((e) => e.url.includes(filter));

  return (
    <div className="py-4 px-4 flex flex-col gap-4 h-full overflow-y-auto">
      {filteredEndpoints?.map((d, i) => {
        let rowClass =
          "w-full flex justify-between break-words px-3 py-2 rounded border font-semibold cursor-pointer text-gray-700 border-gray-300 bg-white hover:bg-gray-100";

        if (i == index) rowClass += " " + "!bg-gray-500 !text-white";

        const hasGET = d.GET != undefined;
        const hasPOST = d.POST != undefined;

        let chips: JSX.Element[] = [];

        let chipClass = "rounded-sm";

        if (i == index) chipClass = "text-white";

        if (hasGET) chips.push(<div className={chipClass}>GET</div>);
        if (hasPOST) chips.push(<div className={chipClass}>POST</div>);

        if (hasGET && hasPOST) chips.splice(1, 0, <div>|</div>);

        return (
          <div key={i} onClick={() => setIndex(i)} className={rowClass}>
            {d.url}
            <div className="flex gap-2 text-gray-500">{chips}</div>
          </div>
        );
      })}
    </div>
  );
};

export default EndpointList;
