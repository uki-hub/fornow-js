import { useState } from "react";

interface ViewToggleProps {
  name: string;
  content: string;
}

const ViewToggle = (props: ViewToggleProps) => {
  const [show, setShow] = useState(false);

  return (
    <div className={`border cursor-pointer rounded`}>
      <div onClick={() => setShow(!show)} className="px-2 py-2 text-gray-700 hover:bg-gray-200">
        {props.name}
      </div>
      {show && (
        <div className="px-2 py-2 border-t pt-2 text-gray-500 bg-gray-100">
          <pre>{JSON.stringify(props.content, null, 2 )}</pre>
        </div>
      )}
    </div>
  );
};

export default ViewToggle;
