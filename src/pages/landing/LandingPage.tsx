import { useShallow } from "zustand/react/shallow";
import useApp from "../../stores/useApp";
import EndpointList from "./components/EndpointList";
import { ChangeEvent } from "react";

const LandingPage = () => {
  const { changeFilter } = useApp(
    useShallow((state) => ({
      changeFilter: state.changeFilter,
    }))
  );

  const filterChangeHandler = (e: ChangeEvent<HTMLInputElement>) => changeFilter(e.target.value);

  return (
    <div className="flex w-full h-screen">
      <div className="flex flex-col h-full border-r w-[30%] shrink-0">
        <div className="flex flex-col gap-1 shadow border-b py-4 px-4">
          <h1 className="text-lg font-mono text-gray-300">fornow-js</h1>
          <input placeholder="Search..." className="px-3 py-2 rounded border outline-none" onChange={filterChangeHandler} />
          <EndpointList />
        </div>
      </div>

      {/* <EndpointContent /> */}
    </div>
  );
};

export default LandingPage;
