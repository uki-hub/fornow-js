import { useShallow } from "zustand/react/shallow";
import useApp from "../../../stores/useApp";
import EndpointListItem from "./EndpointListItem";

const EndpointList = () => {
  const { getEndpoints, endpoints, filter } = useApp(
    useShallow((state) => ({
      getEndpoints: state.getEndpoints,
      endpoints: state.endpoints,
      filter: state.filter,
    }))
  );

  if (endpoints == undefined) {
    getEndpoints();

    return <div>Loading...</div>;
  }

  const filteredEndpoints = endpoints.filter((e) => e.url.includes(filter));

  return (
    <div className="py-4 px-4 flex flex-col gap-4 h-full overflow-y-auto">
      {filteredEndpoints?.map((d, i) => (
        <EndpointListItem key={i} endpoint={d} />
      ))}
    </div>
  );
};

export default EndpointList;
