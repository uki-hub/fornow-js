import { useEffect, useRef, useState } from "react";
import { EndPointModel } from "./models/EndPointModel";
import style from "./App.module.css";
import { Bounce, Slide, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import ViewToggle from "./components/ViewToggle";

const App = () => {
  const [data, setData] = useState<EndPointModel[]>();
  const [index, setIndex] = useState(-1);
  const [filter, setFilter] = useState("");
  const [show, setShow] = useState(true);

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
        <div className="flex flex-col h-full border-r lg:w-1/3 md:w-1/2 md:shrink-0">
          <div className="flex flex-col gap-1 shadow border-b py-4 px-4">
            <h1 className="text-lg font-mono text-gray-300">fornow-js</h1>
            <input ref={searchRef} placeholder="Search..." className="px-3 py-2 rounded border outline-none" />
          </div>
          <div className="py-4 px-4 flex flex-col gap-4 h-full overflow-y-auto">
            {filteredData?.map((d, i) => {
              let rowClass = style["api-row"];

              if (i == index) rowClass += " " + style["row-active"];

              return (
                <div
                  key={i}
                  onClick={() => {
                    setIndex(i);
                    setShow(true);
                  }}
                  className={rowClass}
                >
                  {d.url}
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col w-full">
          {selectedData && (
            <>
              <div className="flex items-start gap-2 px-6 py-4 shadow">
                <label>{selectedData?.url}</label>
                <div
                  onClick={cilpboardUrl}
                  className="px-2 py-1 rounded-full text-xs h-min cursor-pointer text-gray-600 bg-gray-300 hover:bg-gray-400 hover:text-white"
                >
                  Copy
                </div>
              </div>
              <hr />
            </>
          )}
          <div className="h-full flex flex-col gap-6 py-4 px-6   overflow-y-auto">
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
                <div className="flex gap-2 items-center">
                  <h2 className="font-semibold mb-1 text-gray-600">Response</h2>
                  <div onClick={() => setShow(!show)} className="font-semibold text-sm h-min cursor-pointer text-gray-400 hover:text-gray-600">
                    {show ? "Hide" : "Show"}
                  </div>
                </div>
                {show && (
                  <div className="text-sm px-2 py-2 text-gray-500 bg-gray-100">
                    <pre>{JSON.stringify(selectedData.POST.response, null, 2)}</pre>
                  </div>
                )}
                {selectedData.POST.requests.length > 0 && (
                  <div className="mt-3">
                    <h2 className="font-semibold mb-1 text-gray-600">Received request</h2>
                    <div className="h-full flex flex-col gap-4 text-sm">
                      {selectedData.POST.requests.map((r, i) => (
                        <ViewToggle key={i} name={r.fileName} content={r.body} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
