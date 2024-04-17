import { useEffect, useRef, useState } from "react";
import { EndPointModel } from "./models/EndPointModel";
import style from "./App.module.css";
import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import EndPointContent from "./components/EndPointContent";

const App = () => {
  const [data, setData] = useState<EndPointModel[]>();
  const [index, setIndex] = useState(-1);
  const [filter, setFilter] = useState("");

  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    searchRef.current?.addEventListener("input", () => {
      setIndex(-1);
      setFilter(searchRef.current?.value!);
    });

    fetch("/api")
      .then((r) => r.json())
      .then(setData);

    setInterval(() => {
      fetch("/api")
        .then((r) => r.json())
        .then(setData);
    }, 2000);
  }, []);

  const filteredData = data?.filter((d) => d.url.includes(filter));

  const selectedData: EndPointModel | undefined = !filteredData && index == -1 ? undefined : filteredData![index];

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
      <div className="flex w-full h-screen">
        <div className="flex flex-col h-full border-r w-[30%] shrink-0">
          <div className="flex flex-col gap-1 shadow border-b py-4 px-4">
            <h1 className="text-lg font-mono text-gray-300">fornow-js</h1>
            <input ref={searchRef} placeholder="Search..." className="px-3 py-2 rounded border outline-none" />
          </div>
          <div className="py-4 px-4 flex flex-col gap-4 h-full overflow-y-auto">
            {filteredData?.map((d, i) => {
              let rowClass = style["api-row"];

              if (i == index) rowClass += " " + style["row-active"];

              return (
                <div key={i} onClick={() => setIndex(i)} className={rowClass}>
                  {d.url}
                </div>
              );
            })}
          </div>
        </div>

        <EndPointContent endpoint={selectedData} />
      </div>
    </>
  );
};

export default App;
