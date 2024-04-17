import { Slide, toast } from "react-toastify";

const CopyButton = ({ text }: { text: string }) => {
  function cilpboardUrl() {
    var textArea = document.createElement("textarea");

    textArea.value = text;

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
    <div
      onClick={cilpboardUrl}
      className="px-2 py-1 rounded-full text-xs h-min cursor-pointer text-gray-600 bg-gray-300 hover:bg-gray-400 hover:text-white"
    >
      Copy
    </div>
  );
};

export default CopyButton;
