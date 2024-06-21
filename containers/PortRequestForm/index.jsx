import React, { useState, useRef, useMemo } from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { useOverlayContext } from "@/context/OverlayContext";
import { Country } from "country-state-city";
import { postNewPortRequest } from "@/redux/actions/portRequest.actions.js";

function PortRequestForm({ callback }) {
  const {
    closeBottomSheet,
    startLoading,
    stopLoading,
    openToastMessage,
    closeToastMessage,
  } = useOverlayContext();

  const [portName, setPortName] = useState("");
  const [portCode, setPortCode] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");

  const dispatch = useDispatch();

  // Assuming countryList is obtained from somewhere
  const countryList = useMemo(() => Country.getAllCountries(), []);

  return (
    <div className="inline-flex flex-col w-full h-auto px-5 py-4 pb-12">
      <h3 className="font-semibold text-base text-pwip-black-600">
        Tell us the port you want us to add
      </h3>
      <p className="text-pwip-gray-500 text-xs mt-1">
        Enter the Port name or port code along with the country that you would
        like to see on PWIP App.
      </p>

      <div className="w-full inline-flex flex-col mt-5 space-y-4">
        {[
          {
            type: "text",
            label: "Port name",
            optional: false,
            placeholder: "Enter port name",
            value: portName,
            onChange: setPortName,
          },
          {
            type: "text",
            label: "Port code",
            optional: true,
            placeholder: "Enter port code",
            value: portCode,
            onChange: setPortCode,
          },
          {
            type: "select",
            label: "Country",
            optional: false,
            placeholder: "Select a country",
            value: selectedCountry,
            onChange: setSelectedCountry,
          },
        ].map((m, i) => (
          <div
            key={m?.label + "_" + i}
            className="w-full inline-flex flex-col space-y-1"
          >
            <label className="text-sm text-pwip-black-500">
              {m?.label}{" "}
              {m?.optional ? (
                <span className="text-gray-400">(Optional)</span>
              ) : null}
            </label>
            {m?.type === "select" ? (
              <select
                className={`bg-white block w-full h-10 p-1 px-3 text-sm text-gray-900 border rounded-md appearance-none focus:outline-none focus:ring-2 focus:border-pwip-primary peer`}
                value={m.value}
                onChange={(e) => m.onChange(e.target.value)}
              >
                <option value="" className="text-sm text-gray-500"></option>
                {countryList?.map((country, index) => (
                  <option
                    key={country?.name + "_" + index}
                    value={country?.isoCode}
                    className="text-sm text-gray-500"
                  >
                    {country?.flag} {country?.name} ({country?.isoCode})
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={m.type}
                value={m.value}
                onChange={(e) => m.onChange(e.target.value)}
                className={`bg-white block w-full h-10 p-1 px-3 text-sm text-gray-900 border rounded-md appearance-none focus:outline-none focus:ring-2 focus:border-pwip-primary peer`}
                placeholder={m.placeholder}
              />
            )}
          </div>
        ))}
      </div>

      <div className="w-full mt-5">
        <button
          disabled={(!portName && !portCode) || !selectedCountry}
          onClick={async () => {
            if (!portName && !portCode) {
              return;
            }

            if (!selectedCountry) {
              return;
            }

            startLoading();
            const payload = {
              portName: portName,
              portCode: portCode,
              country: selectedCountry,
            };
            await dispatch(postNewPortRequest(payload));
            closeBottomSheet();
            stopLoading();

            callback();

            openToastMessage({
              type: "success",
              message: `We have recieved your request to add ${
                portName || portCode
              }, we will notify you once port is available for use.`,
              autoHide: true,
            });

            setTimeout(() => {
              closeToastMessage();
            }, 2500);
          }}
          className={`w-full outline-none border-none bg-pwip-v2-primary-600 text-center text-sm text-white py-3 px-5 rounded-lg mt-3 ${
            (!portName && !portCode) || !selectedCountry ? "opacity-[0.5]" : ""
          }`}
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default PortRequestForm;
