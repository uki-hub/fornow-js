import { useEffect, useRef, useState } from "react";
import { EndPointModel } from "./models/EndPointModel";
import style from "./App.module.css";
import { Bounce, Slide, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

const App = () => {
  const [data, setData] = useState<EndPointModel[]>();
  const [index, setIndex] = useState<number>(-1);
  const [filter, setFilter] = useState<string>("");

  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    searchRef.current?.addEventListener("input", () => {
      setIndex(-1);
      setFilter(searchRef.current?.value!);
    });

    fetch("/api")
      .then((r) => r.json())
      .then((json) => {
        setData(json);
        console.log("fetching...");
      });
  }, []);

  const selectedData: EndPointModel | undefined = !data && index == -1 ? undefined : data![index];

  function cilpboardUrl() {
    var textArea = document.createElement("textarea");
    textArea.value = window.location.href.slice(0, -1) + selectedData!.url;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand("copy");
    } catch (err) {}

    document.body.removeChild(textArea);

    toast("Copied!", {
      transition: Slide,
    });
  }

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
        <div className="flex flex-col gap-4 h-full p-4 overflow-y-auto bg-gray-200 lg:w-1/3 md:w-1/2 md:shrink-0">
          <input ref={searchRef} placeholder="Search..." className="px-3 py-2 rounded border outline-none" />
          {data
            ?.filter((d) => d.url.includes(filter))
            ?.map((d, i) => {
              let rowClass = style["api-row"];

              if (i == index) rowClass += " " + style["row-active"];

              return (
                <div key={i} onClick={() => setIndex(i)} className={rowClass}>
                  {d.url}
                </div>
              );
            })}
        </div>
        <div className="flex flex-col w-full p-4 overflow-y-auto">
          {selectedData && (
            <>
              <div className="flex items-start gap-2">
                <label>{selectedData?.url}</label>
                <div
                  onClick={cilpboardUrl}
                  className="px-2 py-1 rounded-full text-xs h-min cursor-pointer text-gray-600 bg-gray-300 hover:bg-gray-400 hover:text-white"
                >
                  Copy
                </div>
              </div>
              <hr className="mb-4 mt-2" />
            </>
          )}
          <div className="flex flex-col gap-6">
            {selectedData?.GET && (
              <div className="flex flex-col">
                <h1 className="text-xl font-bold text-gray-600">GET</h1>
                {selectedData.GET.config && (
                  <>
                    <h2 className="font-semibold mb-1 text-gray-600">Config</h2>
                    <div className="mb-3 text-sm px-2 py-2 text-gray-500 bg-gray-100">{JSON.stringify(selectedData.GET.config)}</div>
                  </>
                )}

                <h2 className="font-semibold mb-1 text-gray-600">Response</h2>
                <div className="text-sm px-2 py-2 text-gray-500 bg-gray-100">{JSON.stringify(selectedData.GET.response)}</div>
              </div>
            )}
            {selectedData?.POST && (
              <div className="flex flex-col">
                <h1 className="text-xl font-bold text-gray-600">POST</h1>
                {selectedData.POST.config && (
                  <>
                    <h2 className="font-semibold mb-1 text-gray-600">Config</h2>
                    <div className="mb-3 text-sm px-2 py-2 text-gray-500 bg-gray-100">{JSON.stringify(selectedData.POST.config)}</div>
                  </>
                )}
                <h2 className="font-semibold mb-1 text-gray-600">Response</h2>
                <div className="text-sm px-2 py-2 text-gray-500 bg-gray-100">{JSON.stringify(selectedData.POST.response)}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
