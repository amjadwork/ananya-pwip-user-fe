import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { inrToUsd } from "@/utils/helper";
import { breakupArr } from "@/constants/breakupStructure";

const BreakupForm = ({ values, handleChange, handleBlur, activeTab }) => {
  const forexRate = useSelector((state) => state.utils.forexRate);
  const [breakupFormData, setBreakupFormData] = useState([]);

  useEffect(() => {
    if (activeTab === 1) {
      let breakupFormArr = [];

      breakupFormArr = [...breakupArr].map((d) => {
        let obj = { ...d };

        if (!values?.exportDuty) {
          let rowItems = [...obj?.rowItems];

          const exportDutyField = obj?.rowItems?.find(
            (d) => d.name === "exportDutyValue"
          );

          if (exportDutyField) {
            const arrayIndex = obj?.rowItems.indexOf(exportDutyField);

            if (arrayIndex > -1) {
              rowItems.splice(arrayIndex, 1);
            }
          }

          obj.rowItems = rowItems;

          return obj;
        }

        if (values?.exportDuty) {
          return obj;
        }
      });

      setBreakupFormData([...breakupFormArr]);
    }
  }, [activeTab]);

  return (
    <div
      style={{
        display: activeTab === 1 ? "block" : "none",
      }}
      key="breakup"
    >
      <div className="inline-flex flex-col w-full">
        {breakupFormData.map((item, index) => {
          return (
            <React.Fragment key={item.title + index}>
              <div className="rounded-md bg-pwip-gray-45 border-[1px] border-pwip-gray-40">
                <div className="inline-flex items-center justify-between w-full p-3 border-[1px] border-pwip-gray-40">
                  <div className="inline-flex items-center space-x-2 w-full">
                    {item.icon}
                    <span className="text-pwip-gray-1000 text-base font-medium">
                      {item.title}
                    </span>
                  </div>
                </div>

                <div className="inline-flex items-center w-full">
                  <div className="w-[60%] pt-4 pb-2 px-4 inline-flex items-center">
                    <span className="text-pwip-gray-750 text-sm font-normal">
                      Details
                    </span>
                  </div>
                  <div className="w-[20%] pt-4 pb-2 px-4 inline-flex items-center justify-end">
                    <span className="text-pwip-gray-750 text-sm font-normal">
                      ₹INR
                    </span>
                  </div>
                  <div className="w-[20%] pt-4 pb-2 px-4 inline-flex items-center justify-end">
                    <span className="text-pwip-gray-750 text-sm font-normal">
                      $USD
                    </span>
                  </div>
                </div>

                {item.rowItems.map((row, rowIndex) => {
                  let paddingBottom = "pb-2";
                  if (rowIndex === item.rowItems.length - 1) {
                    paddingBottom = "pb-4";
                  }

                  return (
                    <div
                      key={row.label + rowIndex}
                      className="inline-flex items-center w-full"
                    >
                      <div
                        className={`w-[60%] pt-4 ${paddingBottom} px-4 inline-flex items-center`}
                      >
                        <span className="text-pwip-gray-850 text-sm font-normal">
                          {row.label}
                        </span>
                      </div>
                      <div
                        className={`w-[20%] text-right pt-4 ${paddingBottom} px-4 inline-flex items-center justify-end`}
                      >
                        <input
                          className="text-pwip-gray-850 text-sm font-normal text-right border-b-[1px] border-b-pwip-gray-650 w-full"
                          name={row.name}
                          value={values[row.name]}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          pattern="[0-9]*"
                          inputMode="numeric"
                        />
                      </div>
                      <div
                        className={`w-[20%] text-right pt-4 ${paddingBottom} px-4 inline-flex items-center justify-end`}
                      >
                        <input
                          className="text-pwip-gray-850 text-sm font-normal text-right border-b-[1px] border-b-pwip-gray-650 w-full"
                          readOnly={true}
                          value={parseFloat(
                            inrToUsd(values[row.name], forexRate.USD)
                          )}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              {item.afterIcon && (
                <div className="w-full inline-flex items-center justify-center">
                  <img
                    src={item.afterIcon}
                    className="h-[40px] w-[22px] bg-cover"
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* <div className="rounded-md bg-pwip-gray-45 border-[1px] border-pwip-gray-40">
              <div className="inline-flex items-center w-full">
                <div className={`w-[60%] py-4 px-4 inline-flex items-center`}>
                  <span className="text-pwip-gray-1000 text-base font-bold">
                    Grand Total
                  </span>
                </div>
                <div
                  className={`w-[20%] text-right py-4 px-4 inline-flex items-center justify-end`}
                >
                  <span className="text-pwip-gray-1000 text-base font-bold">
                    ₹42000
                  </span>
                </div>
                <div
                  className={`w-[20%] text-right py-4 px-4 inline-flex items-center justify-end`}
                >
                  <span className="text-pwip-gray-1000 text-base font-bold">
                    $345
                  </span>
                </div>
              </div>
            </div> */}
    </div>
  );
};

export default BreakupForm;
