import React from "react";
// import { useRouter } from "next/router";

export function Button(props) {
  //   const router = useRouter();

  const label = props.label;
  const onClick = props.onClick || null;
  const type = props.type || "primary";
  const buttonType = props.buttonType || "button";
  const disabled = props.disabled || false;

  let additionalClass = "";

  if (type === "primary") {
    additionalClass = "bg-pwip-primary text-white";
  }

  if (type === "outline") {
    additionalClass =
      "bg-white border-[1px] border-pwip-primary text-pwip-primary";
  }

  if (type === "subtle") {
    additionalClass =
      "bg-pwip-gray-650 border-[1px] border-pwip-gray-650 text-pwip-primary";
  }

  return (
    <button
      type={buttonType}
      className={`inline-flex items-center justify-center w-full px-3 py-2 rounded min-h-[50px] ${additionalClass}`}
      onClick={onClick}
      disabled={disabled}
    >
      <span className="text-xs font-sans text-center font-bold">{label}</span>
    </button>
  );
}
