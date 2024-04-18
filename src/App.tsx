import { useEffect, useRef, useState } from "react";
import { EndpointModel } from "./models/EndpointModel";
import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import EndpointContent from "./components/EndpointContent";

const App = () => {
  const [data, setData] = useState<EndpointModel[]>();
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

  const selectedData: EndpointModel | undefined = !filteredData && index == -1 ? undefined : filteredData![index];

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
    </>
  );
};

export default App;
