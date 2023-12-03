import React from "react";
// import { useRouter } from "next/router";

export function Button(props) {
  //   const router = useRouter();

  const label = props.label;
  const onClick = props.onClick || null;
  const type = props.type || "primary";
  const buttonType = props.buttonType || "button";
  const disabled = props.disabled || false;
  const labelAsIcon = props.labelAsIcon || false;
  const rounded = props.rounded || null;
  const minHeight = props.minHeight || null;

  let additionalclassName = "";

  if (type === "disabled") {
    additionalclassName = "bg-pwip-v2-primary-500 text-white opacity-[0.5]";
  }

  if (type === "primary") {
    additionalclassName = "bg-pwip-v2-primary-500 text-white";
  }

  if (type === "outline") {
    additionalclassName =
      "bg-white border-[1px] border-pwip-v2-primary-500 text-pwip-v2-primary-500";
  }

  if (type === "subtle") {
    additionalclassName =
      "bg-pwip-gray-650 border-[1px] border-pwip-gray-650 text-pwip-v2-primary-500";
  }

  if (type === "white") {
    additionalclassName = "bg-white text-pwip-black-600";
  }

  if (rounded) {
    additionalclassName = additionalclassName + " " + rounded;
  }

  if (labelAsIcon) {
    additionalclassName =
      additionalclassName +
      " " +
      "min-w-[50px] max-w-[50px] min-h-[50px] max-h-[50px]";
  }

  if (minHeight) {
    additionalclassName = additionalclassName + " " + minHeight;
  }

  return (
    <button
      type={buttonType}
      className={`inline-flex items-center justify-center w-full px-3 py-2 rounded-lg min-h-[50px] ${additionalclassName}`}
      onClick={onClick}
      disabled={disabled}
    >
      <span className="text-sm font-sans text-center font-[400]">{label}</span>
    </button>
  );
}
