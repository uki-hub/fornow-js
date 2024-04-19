import { useEffect, useRef, useState } from "react";
import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import EndpointContent from "./components/EndpointContent";
import LandingPage from "./pages/landing/LandingPage";

const App = () => {
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
      <LandingPage />
    </>
  );
};

export default App;
