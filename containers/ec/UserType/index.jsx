import React from "react";

export function UserTypeContainer(props) {
  const handleTypeSelection = props.handleTypeSelection;
  const userType = props.userType;

  return (
    <div className="inline-flex items-center justify-between space-x-6 w-full">
      {["Importer", "Exporter", "Miller"].map((type, index) => {
        return (
          <div
            key={index}
            onClick={() => handleTypeSelection(index)}
            className={`inline-flex flex-col justify-end items-center w-[calc(100%/3)] min-h-[100px] ring-1 ring-gray-200 rounded-md p-2 transition-all ${
              userType === index ? "scale-105 bg-white" : ""
            }`}
          >
            <span
              className={`text-sm ${
                userType === index ? "text-[#262727]" : "text-white"
              }`}
            >
              {type}
            </span>
          </div>
        );
      })}
    </div>
  );
}
