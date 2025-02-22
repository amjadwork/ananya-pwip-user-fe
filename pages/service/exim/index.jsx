import React, {
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
} from "react";
import { useOverlayContext } from "@/context/OverlayContext";

import Head from "next/head";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

import withAuth from "@/hoc/withAuth";
import AppLayout from "@/layouts/appLayout.jsx";
import Lottie from "lottie-react";
import ServiceSplashLottie from "../../../theme/lottie/service-splash.json";
import {
  chevronDown,
  increaseUpIcon,
  decreaseDownIcon,
  eyePreviewIcon,
  checkIcon,
  filterIcon,
  closeXmark,
  expandIcon,
  collapseIcon,
} from "../../../theme/icon";

// Import Components
import { Header } from "@/components/Header";
import { Button } from "@/components/Button";

import {
  apiAnalyticsURL,
  openFullscreen,
  closeFullscreen,
  lockScreenOrientation,
  checkSubscription,
  eximServiceId,
} from "@/utils/helper";

import { fetchProductsRequest } from "@/redux/actions/products.actions";
import moment from "moment";

const yearList = [2021, 2022, 2023, 2024];
const filterOpt = [
  {
    label: "Country",
    key: "foreignCountry",
  },
  {
    label: "Foreign port",
    key: "foreignPortName",
  },
  {
    label: "Indian port",
    key: "indianPort",
  },
  {
    label: "Exporter",
    key: "exporter",
  },
  {
    label: "Mode",
    key: "mode",
  },
  {
    label: "IEC",
    key: "IEC",
  },
];

function objectToQueryString(params) {
  const queryString = Object.keys(params)
    .map(
      (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
    )
    .join("&");
  return queryString;
}

function FilterOptionList({
  selectedHSN,
  type,
  selectedYear,
  selectedMonth,
  handleApply,
  appliedFilterData,
}) {
  const { closeBottomSheet } = useOverlayContext();

  const authToken = useSelector((state) => state.auth?.token);

  const [filterData, setFilterData] = useState(null);
  const [activeFilterOpt, setActiveFilterOpt] = useState([]);
  const [selectedFilterOptKey, setSelectedFilterOptKey] =
    useState("foreignCountry");
  const [selectedFilterItem, setSelectedFilterItem] = useState(null);
  const [searchString, setSearchString] = useState("");

  function clearOrResetStats() {
    setFilterData(null);
    setActiveFilterOpt([]);
    setSelectedFilterOptKey("foreignCountry");
    setSelectedFilterItem(null);
  }

  async function getEximFilterOptions(hsnCode, valueType, year, month) {
    let url =
      apiAnalyticsURL +
      `api/service/rice-price/exim-table/filter-values?hsn_code=${hsnCode}`;

    if (valueType?.toLowerCase() === "all" && year) {
      url = url + `&year=${year}`;
    }

    if (
      valueType?.toLowerCase() === "all" &&
      month &&
      month?.toLowerCase() !== "full year"
    ) {
      url = url + `&month=${month}`;
    }

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response?.data) {
        setFilterData(response?.data);
      }
    } catch (err) {
      console.error("here err", err);
    }
  }

  useEffect(() => {
    if (selectedHSN && type?.value && selectedYear && selectedMonth) {
      getEximFilterOptions(
        selectedHSN,
        type?.value,
        selectedYear,
        selectedMonth
      );
    }
  }, [selectedHSN, type, selectedYear, selectedMonth]);

  useEffect(() => {
    if (selectedFilterOptKey && filterData && !searchString) {
      setActiveFilterOpt(filterData[selectedFilterOptKey]);
    }
  }, [selectedFilterOptKey, filterData, searchString]);

  useEffect(() => {
    if (searchString && filterData && selectedFilterOptKey) {
      let dataToFilter = filterData[selectedFilterOptKey];

      const searchLower = searchString.toLowerCase();
      let matchingData = [];

      for (const item of dataToFilter) {
        const itemName = item.toLowerCase();

        if (itemName.includes(searchLower)) {
          matchingData.push(item);
        }
      }

      setActiveFilterOpt(matchingData);
    }
  }, [searchString, filterData, selectedFilterOptKey]);

  useEffect(() => {
    if (appliedFilterData && Object?.keys(appliedFilterData)?.length) {
      setSelectedFilterItem(appliedFilterData);
    }
  }, [appliedFilterData]);

  return (
    <div
      className={`inline-flex w-full h-[calc(100vh-140px)] overflow-hidden flex-col`}
    >
      <div className="inline-flex w-full items-center justify-between px-5 border-b-gray-800 py-3">
        <h3 className="text-pwip-black-600 font-semibold text-base">Filter</h3>

        <div
          onClick={async () => {
            await clearOrResetStats();
            closeBottomSheet();
          }}
          className="inline-flex items-center justify-center w-auto h-auto"
        >
          {closeXmark}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-1 w-full h-full overflow-auto">
        <div className="h-full col-span-1 py-4 inline-flex flex-col overflow-y-auto hide-scroll-bar">
          {filterOpt?.map((d, i) => {
            return (
              <div
                key={d?.key + "_" + i}
                onClick={() => {
                  setActiveFilterOpt(filterData[d?.key]);
                  setSelectedFilterOptKey(d?.key);
                }}
                className={`px-5 inline-flex items-center relative w-full text-pwip-black-500 ${
                  i !== filterOpt?.length - 1
                    ? "border-b border-b-gray-200"
                    : ""
                } ${
                  selectedFilterOptKey === d?.key
                    ? "bg-pwip-v2-primary-100 !text-pwip-v2-primary-500"
                    : ""
                } py-3`}
              >
                {selectedFilterOptKey === d?.key ? (
                  <div className="h-full w-[4px] bg-pwip-v2-primary-500 absolute z-0 top-0 left-0" />
                ) : null}
                <span className="text-sm font-medium">{d?.label}</span>
              </div>
            );
          })}
        </div>
        <div className="pb-[92px] relative h-full col-span-2 inline-flex w-full flex-col overflow-y-scroll hide-scroll-bar">
          <div className="bg-white w-full py-4 px-5 mb-0 sticky top-0 left-0">
            <div className="inline-flex w-full border border-gray-200 rounded-md px-3 py-2">
              <input
                type="text"
                placeholder="Search"
                className="h-full w-full outline-none"
                value={searchString}
                onChange={(e) => {
                  setSearchString(e.target.value);
                }}
              />
            </div>
          </div>
          {activeFilterOpt.map((d, i) => {
            return (
              <div
                key={d + "_" + i}
                className={`px-5 w-full py-3 inline-flex items-center space-x-3`}
                onClick={() => {
                  const obj = {
                    [selectedFilterOptKey]: d,
                  };
                  if (!selectedFilterItem) {
                    setSelectedFilterItem(obj);
                  } else {
                    setSelectedFilterItem({
                      ...selectedFilterItem,
                      ...obj,
                    });
                  }
                }}
              >
                <input
                  checked={
                    selectedFilterItem &&
                    selectedFilterItem[selectedFilterOptKey] === d
                      ? "true"
                      : false
                  }
                  type="radio"
                  className=""
                  onChange={() => null}
                />
                <span className="text-sm font-medium text-pwip-black-500">
                  {d}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {selectedFilterItem ? (
        <div className="inline-flex items-center w-full fixed bottom-0 left-0 py-3 px-5 space-x-3 bg-white">
          <Button
            type="outline"
            label="Clear filters"
            minHeight="!min-h-[42px]"
            onClick={async () => {
              await clearOrResetStats();
              handleApply({});
              closeBottomSheet();
            }}
          />
          <Button
            type="primary"
            label="Apply filter"
            minHeight="!min-h-[42px]"
            onClick={async () => {
              handleApply(selectedFilterItem);
              // await clearOrResetStats();
              closeBottomSheet();
            }}
          />
        </div>
      ) : null}
    </div>
  );
}

function getMonthAbbreviation(month) {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const monthAbbreviations = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const index = monthNames.indexOf(month);
  if (index !== -1) {
    return monthAbbreviations[index];
  } else {
    return null; // or you can return an error message or handle it as needed
  }
}

function transformAnalysisData(input) {
  const output = [];

  // Mapping the input to the output structure
  if (input.MostExportedDestinationName) {
    output.push({
      title: "Most exported to port",
      value: input.MostExportedDestinationName.destinationName,
      key: "MostExportedDestinationName",
      icon: "/assets/images/services/exim/destination-port.png",
    });
  }

  // Placeholder values for "Most exported to country" since the input does not contain this key
  output.push({
    title: "Most exported to country",
    value: input?.MostExportedDestinationCountry?.destinationCountryName, // Default or placeholder value
    key: "MostExportedDestinationCountry",
    icon: "/assets/images/services/exim/countries.png",
  });

  if (input.MostExportedYear) {
    output.push({
      title: "Most exported in year",
      value: input.MostExportedYear.year,
      key: "MostExportedYear",
      icon: "/assets/images/services/exim/year.png",
    });
  }

  if (input.MostExportedOriginPortName) {
    output.push({
      title: "Most exported from port",
      value: input.MostExportedOriginPortName.OriginPortName,
      key: "MostExportedOriginPortName",
      icon: "/assets/images/services/exim/cargo-ship.png",
    });
  }

  if (input.lifetimeTotalVol !== undefined) {
    output.push({
      title: "Total volume exported",
      value: formatVolume(input.lifetimeTotalVol),
      key: "lifetimeTotalVol",
      icon: "/assets/images/services/exim/container-volume.png",
    });
  }

  if (input.lifetimeTotalExportPriceValue !== undefined) {
    output.push({
      title: "Total FOB exported",
      value: formatCurrency(input.lifetimeTotalExportPriceValue),
      key: "lifetimeTotalExportPriceValue",
      icon: "/assets/images/services/exim/money-fob.png",
    });
  }

  return output;
}

// Helper functions to format volume and currency values
function checkNumberSign(number) {
  if (number > 0) {
    return "positive";
  } else if (number < 0) {
    return "negative";
  } else {
    return "positive";
  }
}

function getVariantNamesString(items) {
  const variantNames = items.map((item) => item.variantName);
  const uniqueVariantNames = [...new Set(variantNames)]; // Ensure unique variant names

  let resultString = uniqueVariantNames.slice(0, 5).join(", ");
  if (uniqueVariantNames.length > 5) {
    resultString += ", etc";
  }

  return resultString;
}

function formatDateToDDMMYYYY(date) {
  return moment(date).format("DD-MM-YYYY");
}

function formatNumberWithCommas(number) {
  return (
    number
      // ?.toFixed(2)
      // .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  );
}

function formatVolume(value) {
  if (value >= 1e9) {
    return (value / 1e9).toFixed(1) + "B";
  } else if (value >= 1e6) {
    return (value / 1e6).toFixed(1) + "M";
  } else if (value >= 1e3) {
    return (value / 1e3).toFixed(1) + "K";
  }
  return value.toString();
}

function formatCurrency(value) {
  if (value >= 1e9) {
    return "$" + (value / 1e9).toFixed(1) + "B";
  } else if (value >= 1e6) {
    return "$" + (value / 1e6).toFixed(1) + "M";
  } else if (value >= 1e3) {
    return "$" + (value / 1e3).toFixed(1) + "K";
  }
  return "$" + value.toFixed(1);
}

const fullMonths = [
  "Full year",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function getMonthsForYear(year) {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // getMonth() returns 0-11

  if (year === currentYear) {
    return fullMonths.slice(0, currentMonth);
  }
  return fullMonths;
}

function MonthList({ handleSelect, selectedMonth, selectedYear }) {
  const { closeBottomSheet } = useOverlayContext();

  const [selectedOption, setSelectionOption] = useState(null);
  const [selectedYearOption, setSelectedYearOption] = useState(2024);
  const [months, setMonths] = useState(getMonthsForYear(selectedYearOption));

  useEffect(() => {
    if (selectedMonth && selectedYear) {
      setSelectionOption(selectedMonth);
      setSelectedYearOption(selectedYear);
    }
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    if (selectedYearOption) {
      setMonths(getMonthsForYear(selectedYearOption));
    }
  }, [selectedYearOption]);

  return (
    <div className="inline-flex w-full flex-col pb-[142px] relative top-0">
      <div className="w-full px-6 pt-4 pb-4 fixed top-[22px] z-10 left-0 bg-white">
        <span className="font-medium text-base">Filter by year and month</span>
      </div>
      <div className="fixed top-[78px] left-0 w-full z-10 py-4 px-5 bg-white">
        <div className="flex overflow-x-scroll hide-scroll-bar py-[1px] w-full">
          <div className="flex flex-nowrap space-x-3">
            {yearList
              .map((y, i) => {
                return (
                  <div
                    key={y + "_" + i}
                    onClick={() => {
                      setSelectedYearOption(y);
                      setSelectionOption("Full year");
                    }}
                    className={`inline-flex items-center px-3 py-2 rounded-lg border ${
                      selectedYearOption === y
                        ? "border-pwip-v2-primary-700 text-pwip-v2-primary-700"
                        : "border-pwip-v2-gray-350 text-pwip-gray-800"
                    }`}
                  >
                    <div className="inline-flex items-center justify-between space-x-10">
                      <span className="text-sm whitespace-nowrap">{y}</span>
                    </div>
                  </div>
                );
              })
              ?.reverse()}
          </div>
        </div>
      </div>
      <div className="relative w-full h-full pb-10 top-[130px] z-0">
        {months?.map((d, i) => {
          return (
            <div key={d + "_" + i} className="w-full h-auto">
              <div
                onClick={() => {
                  setSelectionOption(d);
                }}
                className={`w-full px-6 py-4 ${
                  i !== months.length - 1
                    ? "border-b border-b-pwip-v2-gray-350"
                    : ""
                } ${selectedOption === d ? "bg-pwip-v2-gray-100" : ""}`}
              >
                <div className="inline-flex items-center justify-between w-full">
                  <div className="inline-flex items-center space-x-2 text-pwip-v2-primary-700">
                    <span className="text-pwip-v2-primary-800 text-sm font-normal">
                      {d}
                    </span>
                  </div>

                  {selectedOption === d ? (
                    <span className="text-pwip-v2-primary-500">
                      {checkIcon}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="w-full fixed bottom-0 bg-white px-5 py-4">
        <button
          className={`bg-[#006EB4] ${
            !selectedOption || !selectedYearOption
              ? "opacity-50"
              : "opacity-100"
          } w-full text-white px-4 py-3 text-center font-medium text-[16px] rounded-lg`}
          disabled={!selectedOption || !selectedYearOption}
          onClick={async () => {
            if (selectedOption && selectedYearOption) {
              handleSelect(selectedOption, selectedYearOption);
              closeBottomSheet();
            }
          }}
        >
          Apply
        </button>
      </div>
    </div>
  );
}

function HSNList({ handleSelect, list = [], selectedHSN }) {
  const {
    openBottomSheet,
    closeBottomSheet,
    openToastMessage,
    closeToastMessage,
    isBottomSheetOpen,
  } = useOverlayContext();

  const [selectedOption, setSelectionOption] = useState(null);

  useEffect(() => {
    if (selectedHSN) setSelectionOption(selectedHSN);
  }, [selectedHSN]);

  return (
    <div className="inline-flex w-full flex-col pb-20">
      <div className="w-full px-6 pt-6 pb-4 mb-3">
        <span className="font-medium text-base">Choose an HSN code</span>
      </div>
      {list?.map((d, i) => {
        return (
          <div key={d?.HSNCode + "_" + i} className="w-full h-auto">
            <div
              onClick={() => {
                handleSelect(d);
                setSelectionOption(d?.HSNCode);
                closeBottomSheet();
              }}
              className={`w-full px-6 py-4 ${
                i !== list.length - 1
                  ? "border-b border-b-pwip-v2-gray-350"
                  : ""
              } ${selectedOption === d?.HSNCode ? "bg-pwip-v2-gray-100" : ""}`}
            >
              <div className="inline-flex items-center justify-between w-full">
                <div className="inline-flex items-center space-x-2 text-pwip-v2-primary-700">
                  <span className="text-pwip-v2-primary-800 text-sm font-semibold">
                    {d?.HSNCode}
                  </span>
                </div>

                {selectedOption === d?.HSNCode ? (
                  <span className="text-pwip-v2-primary-500">{checkIcon}</span>
                ) : null}
              </div>

              <div className="w-full h-auto !mt-3">
                <span className="text-xs text-gray-600">
                  <span className="font-semibold">Rice found: </span>
                  {getVariantNamesString(d?.items || [])}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ViewMode({ handleSelect, selectedViewMode }) {
  const {
    openBottomSheet,
    closeBottomSheet,
    openToastMessage,
    closeToastMessage,
    isBottomSheetOpen,
  } = useOverlayContext();

  const [selectedOption, setSelectionOption] = useState(null);

  const options = [
    {
      label: "See all data",
      value: "all",
    },
    {
      label: "Annual volume view",
      value: "volume",
    },
    {
      label: "Annual FOB view",
      value: "fob",
    },
  ];

  useEffect(() => {
    if (selectedViewMode) {
      setSelectionOption(selectedViewMode?.value);
    }
  }, [selectedViewMode]);
  return (
    <div className="inline-flex w-full flex-col pb-20">
      <div className="w-full px-6 pt-6 pb-4 mb-3">
        <span className="font-medium text-base">View modes</span>
      </div>
      {options?.map((d, i) => {
        return (
          <div
            key={d?.value + "_" + i}
            onClick={() => {
              handleSelect(d);
              setSelectionOption(d?.value);
              closeBottomSheet();
            }}
            className={`inline-flex items-center justify-between w-full px-6 py-4 ${
              i !== options.length - 1
                ? "border-b border-b-pwip-v2-gray-350"
                : ""
            } ${selectedOption === d?.value ? "bg-pwip-v2-gray-100" : ""}`}
          >
            <div className="inline-flex items-center space-x-2 text-pwip-v2-primary-700">
              <img
                className="h-4 w-4"
                src={"/assets/images/services/exim/" + d?.value + ".png"}
              />
              <span className="text-pwip-black-500 text-sm">{d?.label}</span>
            </div>

            {selectedOption === d?.value ? (
              <span className="text-pwip-v2-primary-500">{checkIcon}</span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function LocationViewMode({ handleSelect, selectedViewMode }) {
  const {
    openBottomSheet,
    closeBottomSheet,
    openToastMessage,
    closeToastMessage,
    isBottomSheetOpen,
  } = useOverlayContext();

  const [selectedOption, setSelectionOption] = useState(null);

  const options = [
    {
      label: "Foreign ports",
      value: "pod",
    },
    {
      label: "Indian ports",
      value: "pol",
    },
  ];

  useEffect(() => {
    if (selectedViewMode) {
      setSelectionOption(selectedViewMode?.value);
    }
  }, [selectedViewMode]);
  return (
    <div className="inline-flex w-full flex-col pb-20">
      <div className="w-full px-6 pt-6 pb-4 mb-3">
        <span className="font-medium text-base">Select a port type</span>
      </div>
      {options?.map((d, i) => {
        return (
          <div
            key={d?.value + "_" + i}
            onClick={() => {
              handleSelect(d);
              setSelectionOption(d?.value);
              closeBottomSheet();
            }}
            className={`inline-flex items-center justify-between w-full px-6 py-4 ${
              i !== options.length - 1
                ? "border-b border-b-pwip-v2-gray-350"
                : ""
            } ${selectedOption === d?.value ? "bg-pwip-v2-gray-100" : ""}`}
          >
            <div className="inline-flex items-center space-x-2 text-pwip-v2-primary-700">
              <img
                className="h-4 w-4"
                src={"/assets/images/services/exim/" + d?.value + ".png"}
              />
              <span className="text-pwip-black-500 text-sm">{d?.label}</span>
            </div>

            {selectedOption === d?.value ? (
              <span className="text-pwip-v2-primary-500">{checkIcon}</span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function DataTableForAllFilter({
  column,
  row,
  fetchRows,
  pageNumber,
  isLoading,
  applyingFilter,
  handleSettingApplyFilter,
}) {
  const observer = useRef();
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  // const [page, setPage] = useState(1);

  async function loadMoreRows(item = []) {
    setLoading(true);

    const newRows = [...item];
    if (newRows && newRows.length > 0) {
      if (applyingFilter) {
        setRows([...newRows]);
      } else {
        setRows((prevRows) => [...prevRows, ...newRows]);
      }
      handleSettingApplyFilter(false);
    } else {
      observer.current?.disconnect();
    }
    setLoading(false);
  }

  const lastRowRef = useCallback(
    (node) => {
      if (loading || isLoading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          let count = pageNumber + 1;
          fetchRows(count);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, isLoading]
  );

  useEffect(() => {
    loadMoreRows(row);
  }, [row]);

  return (
    <table className="table-auto w-full">
      <thead className="sticky top-0 z-10 text-xs font-semibold uppercase text-gray-400 bg-gray-50">
        <tr>
          {column?.map((th, i) => {
            return (
              <th
                key={th?.columnLabel + "_" + i}
                className={`p-2 whitespace-nowrap ${
                  i === 0 ? "sticky left-0 z-0 bg-gray-50" : ""
                }`}
                style={{
                  boxShadow: i === 0 ? `inset -1px 0px 0px #d2d2d2` : "unset",
                }}
              >
                <div className="font-semibold text-left">{th?.columnLabel}</div>
              </th>
            );
          })}
        </tr>
      </thead>

      <tbody className="text-xs divide-y divide-gray-100 text-gray-500">
        {rows?.map((tr, i) => (
          <tr key={i} ref={i === rows.length - 1 ? lastRowRef : null}>
            {column.map((col, j) => (
              <td
                key={col?.key + "_" + j}
                className={`p-2 ${
                  col?.key === "date"
                    ? "whitespace-nowrap"
                    : "whitespace-pre-wrap"
                } ${j === 0 ? "sticky left-0 z-0 bg-white" : ""}`}
                style={{
                  boxShadow: j === 0 ? `inset -1px 0px 0px #d2d2d2` : "unset",
                }}
              >
                <div
                  className={
                    j === 0 ? "font-medium text-gray-500" : "text-left"
                  }
                >
                  {tr[col.key]}
                </div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function DataTableForAnnualViewFilter({
  column = [],
  row = [],
  fetchRows,
  pageNumber,
  isLoading,
  applyingFilter,
  handleSettingApplyFilter,
}) {
  const observer = useRef();
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);

  async function loadMoreRows(item = []) {
    setLoading(true);

    const newRows = [...item];
    if (newRows && newRows.length > 0) {
      if (applyingFilter) {
        setRows([...newRows]);
      } else {
        setRows((prevRows) => [...prevRows, ...newRows]);
      }
      handleSettingApplyFilter(false);
    } else {
      observer.current?.disconnect();
    }
    setLoading(false);
  }

  const lastRowRef = useCallback(
    (node) => {
      if (loading || isLoading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          let count = pageNumber + 1;
          fetchRows(count);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, isLoading]
  );

  useEffect(() => {
    loadMoreRows(row);
  }, [row]);

  return (
    <table className="table-auto w-full">
      <thead className="sticky top-0 z-10 text-xs font-semibold uppercase text-gray-400 bg-gray-50">
        <tr>
          {column?.map((th, i) => {
            return (
              <th
                className={`text-xs p-2 whitespace-nowrap ${
                  i === 0 ? "sticky left-0 z-0 bg-gray-50" : ""
                }`}
                style={{
                  boxShadow: i === 0 ? `inset -1px 0px 0px #d2d2d2` : "unset",
                }}
              >
                <div className="font-semibold text-left">
                  {th?.columnLabel || ""}
                </div>
              </th>
            );
          })}
        </tr>
      </thead>

      <tbody className="text-xs divide-y divide-gray-100">
        {rows?.map((tr, i) => {
          return (
            <tr ref={i === rows.length - 1 ? lastRowRef : null}>
              <td
                className={`p-2 whitespace-nowrap sticky left-0 z-0 bg-white`}
                style={{
                  boxShadow: `inset -1px 0px 0px #d2d2d2`,
                }}
              >
                <div className="flex items-center">
                  <div className="font-medium text-gray-800">{tr?.label}</div>
                </div>
              </td>
              {column.slice(1).map((col, index) => (
                <td key={index} className="p-2 whitespace-nowrap">
                  <div className="text-left font-normal text-gray-500">
                    {tr[col.columnLabel] !== undefined
                      ? tr[col.columnLabel]
                      : 0}
                  </div>
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function transformData(input, compareData) {
  const { totalVolume, tableData } = input;
  const columns = [{ columnLabel: "Year" }];
  const rows = [];

  // Extract years from totalVolume
  const years = Object.keys(totalVolume);
  years.forEach((year) => columns.push({ columnLabel: year }));

  // Add totalVolume to rows
  if (
    !compareData &&
    !compareData?.rows?.find((f) => f?.label === "Total volume")
  ) {
    const totalVolumeRow = { label: "Total volume" };
    years.forEach((year) => {
      totalVolumeRow[year] = formatVolume(totalVolume[year]);
    });
    rows.push(totalVolumeRow);
  }

  // Transform tableData into rows
  for (const location in tableData) {
    if (location !== "Null") {
      const row = { label: location };
      years.forEach((year) => {
        row[year] =
          typeof tableData[location][year] === "number"
            ? formatNumberWithCommas(tableData[location][year]?.toFixed(2))
            : tableData[location][year]
            ? formatNumberWithCommas(tableData[location][year]?.toFixed(2))
            : null; // If year data is missing, set it to 0
      });
      rows.push(row);
    }
  }

  return { columns, rows };
}

function transformArrayToTableData(inputArray) {
  if (!inputArray.length) return { columns: [], rows: [] };

  // Specify the fields to include in the output, in the desired order
  const includedFields = [
    "productDescription",
    "exporter",
    "foreignPortName",
    "foreignCountry",
    "quantity",
    "unit",
    "value_fc",
    "indianPort",
    "mode",
    "date",
    "buyer",
    "rate_fc",
    "IEC",
    "exporterAddress_1",
    "exporterAddress_2",
    "exporterCity",
    "currency",
    "fob",
    "ratePerTonne",
  ];

  // Create columns based on the included fields
  const columns = includedFields.map((field) => {
    return {
      columnLabel: field
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase()),
      key: field,
    };
  });

  // Create rows by mapping each object in the input array
  const rows = inputArray.map((obj) => {
    const row = {};
    // columns.forEach((col) => {
    //   row[col.key] = obj[col.key];
    // });

    columns.forEach((col) => {
      let value = obj[col.key];
      if (col?.key === "date" && value) {
        value = formatDateToDDMMYYYY(value);
      }
      if (typeof value === "number" && value) {
        value = formatNumberWithCommas(value?.toFixed(2));
      }
      row[col.key] = value;
    });

    return row;
  });

  return { columns, rows };
}

function groupByHSNCode(data) {
  return data.reduce((acc, item) => {
    const { HSNCode } = item;
    if (HSNCode) {
      const existingGroup = acc.find(
        (group) => group.HSNCode.trim() === HSNCode.trim()
      );
      if (existingGroup) {
        existingGroup.items.push(item);
      } else {
        acc.push({ HSNCode, items: [item] });
      }
    }
    return acc;
  }, []);
}

function EXIMService() {
  const router = useRouter();
  const dispatch = useDispatch();

  const {
    openBottomSheet,
    startLoading,
    stopLoading,
    isLoading,
    openToastMessage,
    closeToastMessage,
    isBottomSheetOpen,
  } = useOverlayContext();

  const authToken = useSelector((state) => state.auth?.token);
  const products = useSelector((state) => state?.products?.products); // Use api reducer slice

  const [selectedViewMode, setSelectedViewMode] = useState({
    label: "See all data",
    value: "all",
  });

  const [selectedLocationViewMode, setSelectedLocationViewMode] = useState({
    label: "Foreign ports",
    value: "pod",
  });

  const [selectedYear, setSelectedYear] = useState(2024);
  const [selectedMonth, setSelectedMonth] = useState("Full year");
  const [modelBasedEximTableData, setModelBasedEximTableData] = useState(null);
  const [allEximTableData, setAllEximTableData] = useState(null);
  const [hsnListData, setHSNListData] = useState([]);
  const [activeHSN, setActiveHSN] = useState(null);
  const [topStats, setTopStats] = useState([]);
  const [demandStats, setDemandStats] = useState({});
  const [pageNumber, setPageNumber] = useState(1);

  const [applyingFilter, setApplyingFilter] = useState(false);

  const [appliedFilterData, setAppliedFilterData] = useState({});
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [splashScreen, setSplashScreen] = React.useState(false);
  const [progressValue, setProgressValue] = React.useState(0); // State for progress value

  async function getEximAnalyticsData(hsnCode) {
    let url =
      apiAnalyticsURL +
      `api/service/rice-price/exim-analysis?hsn_code=${hsnCode}`;

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      stopLoading();

      if (response?.data) {
        setDemandStats({
          inflationPercentage: response?.data?.inflationPercentage || 0,
          demandPercentage: response?.data?.demandPercentage || 0,
        });
        const formatedData = transformAnalysisData(response.data);
        if (formatedData?.length) {
          setTopStats(formatedData);
        }
      } else {
        openToastMessage({
          type: "error",
          message: "Something went wrong, please refresh",
        });

        setTimeout(() => {
          closeToastMessage();
        }, 2500);
      }
    } catch (err) {
      stopLoading();
      openToastMessage({
        type: "error",
        message: "Something went wrong, please refresh",
      });

      setTimeout(() => {
        closeToastMessage();
      }, 2500);
    }
  }

  async function getEximTableData(
    hsnCode,
    valueType,
    portType,
    year,
    month,
    page = 1,
    pageSize = 10,
    filters = null
  ) {
    let url =
      apiAnalyticsURL +
      `api/service/rice-price/exim-table?hsn_code=${hsnCode}&valueType=${valueType}&portType=${portType}&page=${page}&limit=${pageSize}`;

    if (valueType?.toLowerCase() === "all" && year) {
      url = url + `&year=${year}`;
    }

    if (
      valueType?.toLowerCase() === "all" &&
      month &&
      month?.toLowerCase() !== "full year"
    ) {
      url = url + `&month=${month}`;
    }

    if (filters && Object?.keys(filters)?.length) {
      url = url + `&` + objectToQueryString(filters);
    }

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      stopLoading();

      if (response?.data) {
        if (valueType?.toLowerCase() === "all") {
          const requiredColRowData = transformArrayToTableData(response?.data);

          setAllEximTableData(requiredColRowData);
          return;
        }

        const requiredColRowData = transformData(
          response?.data,
          modelBasedEximTableData
        );
        setModelBasedEximTableData(requiredColRowData);
      } else {
        openToastMessage({
          type: "error",
          message: "Something went wrong, please refresh",
        });

        setTimeout(() => {
          closeToastMessage();
        }, 2500);
      }
    } catch (err) {
      stopLoading();
      openToastMessage({
        type: "error",
        message: "Something went wrong, please refresh",
      });

      setTimeout(() => {
        closeToastMessage();
      }, 2500);
    }
  }

  useEffect(() => {
    if (authToken && activeHSN?.HSNCode) {
      if (isLoading === false) {
        startLoading();
      }

      getEximAnalyticsData(activeHSN?.HSNCode);
    }
  }, [authToken, activeHSN?.HSNCode]);

  useEffect(() => {
    if (
      authToken &&
      selectedLocationViewMode &&
      selectedViewMode &&
      selectedYear &&
      activeHSN &&
      !isBottomSheetOpen &&
      pageNumber
    ) {
      if (isLoading === false) {
        startLoading();
      }

      getEximTableData(
        activeHSN?.HSNCode,
        selectedViewMode?.value?.toUpperCase(),
        selectedLocationViewMode?.value?.toUpperCase(),
        selectedYear,
        selectedMonth?.toLowerCase(),
        pageNumber,
        20,
        appliedFilterData
      );
    }
  }, [
    authToken,
    selectedLocationViewMode,
    selectedViewMode,
    selectedYear,
    activeHSN,
    selectedMonth,
    pageNumber,
    appliedFilterData,
  ]);

  useEffect(() => {
    if (products) {
      const groupedByHSN = groupByHSNCode(products);

      if (groupedByHSN?.length) {
        if (router?.query?.hsnCode && router?.query?.hsnCode !== "undefined") {
          const hsnObject = groupedByHSN?.find(
            (f) => f?.HSNCode === router?.query?.hsnCode
          );
          setActiveHSN(hsnObject);
        } else {
          setActiveHSN(groupedByHSN[0]);
        }

        setHSNListData(groupedByHSN);
      }
    }
  }, [products]);

  async function initPage() {
    const details = await checkSubscription(eximServiceId, authToken);

    if (!details?.activeSubscription) {
      router.replace("/service/exim/lp");

      return;
    }
  }

  useLayoutEffect(() => {
    if (authToken) {
      initPage();
      dispatch(fetchProductsRequest());
    }
  }, [authToken]);

  useEffect(() => {
    const backThroughServicePage = sessionStorage.getItem(
      "backThroughServicePage"
    );

    if (backThroughServicePage || backThroughServicePage === "true") {
      setSplashScreen(false);
    } else {
      setSplashScreen(true);
    }

    stopLoading();
  }, []);

  React.useEffect(() => {
    // Update progress value using requestAnimationFrame
    const updateProgressValue = () => {
      const duration = 2000;
      const startTime = Date.now();
      const endTime = startTime + duration;

      const updateProgress = () => {
        const now = Date.now();
        const elapsedTime = now - startTime;
        const progress = (elapsedTime / duration) * 100;

        const currentValue = progress > 100 ? 100 : progress; // Limit progress to 100%
        setProgressValue(currentValue);

        if (now < endTime) {
          requestAnimationFrame(updateProgress);
        }
      };

      requestAnimationFrame(updateProgress);
    };

    if (splashScreen) {
      updateProgressValue();

      // Reset progress value after given seconds
      setTimeout(() => {
        stopLoading();
        setProgressValue(0);
        setSplashScreen(false);
      }, 2300);
    }
  }, [splashScreen]);

  const style = {
    height: 180,
  };

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  return (
    <React.Fragment>
      <Head>
        <meta charSet="utf-8" />

        <title>EXIM | PWIP</title>

        <meta name="EXIM data analytics" content="Export Import Data Bank" />
        <meta name="description" content="Generated by create next app" />

        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />

        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </Head>

      <AppLayout>
        <Header
          hideLogo={true}
          serviceBackRouteException={router?.query?.hsnCode ? true : false}
        />

        <div className={`h-full w-full bg-pwip-v2-gray-100 space-y-2 relative`}>
          {!isFullscreen ? (
            <>
              <div
                id="selectOptionHSN"
                className="sticky top-[56px] z-20 w-full h-auto pt-3 pb-4 bg-pwip-v2-gray-100"
              >
                <div className="flex flex-col w-full space-y-1 px-5">
                  <div
                    onClick={() => {
                      const content = (
                        <HSNList
                          handleSelect={(opt) => {
                            setActiveHSN(opt);
                            setApplyingFilter(true);
                            setPageNumber(1);
                          }}
                          list={hsnListData}
                          selectedHSN={activeHSN?.HSNCode}
                        />
                      );
                      openBottomSheet(content);
                    }}
                    style={{
                      filter: "drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.12))",
                    }}
                    className="h-[48px] mt-[10px] w-full rounded-md bg-white text-base font-sans inline-flex items-center px-[18px]"
                  >
                    <button className="outline-none border-none bg-transparent inline-flex items-center justify-center">
                      <svg
                        width="38"
                        height="17"
                        viewBox="0 0 38 17"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect width="38" height="17" rx="4" fill="#878D96" />
                        <path
                          d="M8.79901 12V4.72727H9.89631V7.88778H13.522V4.72727H14.6229V12H13.522V8.82884H9.89631V12H8.79901ZM20.1875 6.63778C20.1496 6.30161 19.9934 6.04119 19.7188 5.85653C19.4441 5.66951 19.0985 5.57599 18.6818 5.57599C18.3835 5.57599 18.1255 5.62334 17.9077 5.71804C17.6899 5.81037 17.5206 5.93821 17.3999 6.10156C17.2815 6.26255 17.2223 6.44602 17.2223 6.65199C17.2223 6.82481 17.2625 6.97396 17.343 7.09943C17.4259 7.22491 17.5336 7.33026 17.6662 7.41548C17.8011 7.49834 17.9455 7.56818 18.0994 7.625C18.2533 7.67945 18.4013 7.72443 18.5433 7.75994L19.2536 7.9446C19.4856 8.00142 19.7235 8.07836 19.9673 8.17543C20.2112 8.27249 20.4373 8.40033 20.6456 8.55895C20.8539 8.71757 21.022 8.91406 21.1499 9.14844C21.2801 9.38281 21.3452 9.66335 21.3452 9.99006C21.3452 10.402 21.2386 10.7678 21.0256 11.0874C20.8149 11.407 20.5083 11.6591 20.1058 11.8438C19.7057 12.0284 19.2216 12.1207 18.6534 12.1207C18.1089 12.1207 17.6378 12.0343 17.2401 11.8615C16.8423 11.6887 16.531 11.4437 16.3061 11.1264C16.0812 10.8068 15.9569 10.428 15.9332 9.99006H17.0341C17.0554 10.2528 17.1406 10.4718 17.2898 10.647C17.4413 10.8198 17.6342 10.9489 17.8686 11.0341C18.1054 11.117 18.3646 11.1584 18.6463 11.1584C18.9564 11.1584 19.2322 11.1098 19.4737 11.0128C19.7176 10.9134 19.9093 10.776 20.049 10.6009C20.1887 10.4233 20.2585 10.2161 20.2585 9.9794C20.2585 9.76397 20.197 9.58759 20.0739 9.45028C19.9531 9.31297 19.7886 9.19934 19.5803 9.10938C19.3743 9.01941 19.1411 8.9401 18.8807 8.87145L18.0213 8.63707C17.4389 8.47846 16.9773 8.24527 16.6364 7.9375C16.2978 7.62973 16.1286 7.22254 16.1286 6.71591C16.1286 6.29687 16.2422 5.93111 16.4695 5.61861C16.6967 5.30611 17.0045 5.06345 17.3928 4.89062C17.781 4.71544 18.219 4.62784 18.7067 4.62784C19.1991 4.62784 19.6335 4.71425 20.0099 4.88707C20.3887 5.0599 20.687 5.29782 20.9048 5.60085C21.1226 5.90151 21.2363 6.24716 21.2457 6.63778H20.1875ZM28.5265 4.72727V12H27.5179L23.8212 6.66619H23.7537V12H22.6564V4.72727H23.6721L27.3723 10.0682H27.4398V4.72727H28.5265Z"
                          fill="#F3F7F9"
                        />
                      </svg>
                    </button>

                    <span className="w-full bg-white pl-[18px] text-sm font-sans outline-none border-none text-pwip-v2-gray-500">
                      {activeHSN?.HSNCode || "Search for a HSN"}
                    </span>
                    <button className="outline-none border-none bg-transparent inline-flex items-center justify-center">
                      {chevronDown}
                    </button>
                  </div>

                  <div className="w-full h-auto !mt-3">
                    <span className="text-xs text-gray-600 line-clamp-2 leading-6">
                      <span className="font-semibold text-pwip-v2-primary-700">
                        Rice found:{" "}
                      </span>
                      {getVariantNamesString(activeHSN?.items || [])}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white w-full py-4 px-5 pt-[54px] space-y-9">
                <div className="w-full h-auto">
                  <div className="flex overflow-x-scroll hide-scroll-bar py-[1px] mt-3 w-full">
                    <div className="flex flex-nowrap space-x-3">
                      {topStats.map((d, i) => (
                        <div
                          key={d?.title + "_" + i}
                          className="px-4 py-3 rounded-lg border border-pwip-v2-gray-200 inline-flex w-full flex-col space-y-2"
                        >
                          <div className="h-8 w-8 min-h-8 min-w-8 inline-flex items-center justify-center rounded-full bg-gray-100">
                            <img src={d?.icon} className="h-4 w-4" />
                          </div>
                          <div className="inline-flex flex-col space-y-1">
                            <span className="font-medium text-pwip-black-600 text-sm whitespace-nowrap">
                              {d?.title}
                            </span>

                            <span className="font-normal text-pwip-gray-550 text-sm whitespace-nowrap">
                              {d?.value}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="w-full h-auto space-y-7">
                  {Object.keys(demandStats)?.map((d, i) => {
                    const sign = checkNumberSign(demandStats[d]);

                    return (
                      <div
                        key={d + "_" + i}
                        className="w-full inline-flex items-start justify-start space-x-4"
                      >
                        {sign === "positive" ? (
                          <div
                            className={`min-h-6 min-w-6 max-h-6 max-w-6 h-6 w-6 ${
                              sign === "positive"
                                ? "text-pwip-v2-green-600 bg-pwip-green-200"
                                : ""
                            } rounded-full inline-flex items-center justify-center`}
                          >
                            {increaseUpIcon}
                          </div>
                        ) : (
                          <div className="min-h-6 min-w-6 max-h-6 max-w-6 h-6 w-6 text-pwip-v2-red-600 bg-pwip-v2-red-200 rounded-full inline-flex items-center justify-center">
                            {decreaseDownIcon}
                          </div>
                        )}

                        <div className="inline-flex flex-col space-y-1">
                          <span className="font-medium text-pwip-black-600 text-sm whitespace-nowrap">
                            {sign === "positive" && d === "inflationPercentage"
                              ? "Increasing inflation"
                              : sign === "positive" && d === "demandPercentage"
                              ? "Increasing demand"
                              : sign === "negative" &&
                                d === "inflationPercentage"
                              ? "Decreasing demand"
                              : sign === "negative" && d === "demandPercentage"
                              ? "Decreasing demand"
                              : ""}
                          </span>
                          <p className="font-normal text-pwip-gray-550 text-sm max-w-[90%]">
                            {sign === "positive" && d === "inflationPercentage"
                              ? `Over the last 3 years, inflation has increased to
                        ${demandStats[d]?.toFixed(2)}%`
                              : sign === "negative" &&
                                d === "inflationPercentage"
                              ? `Over the last 3 years, inflation has decreaded to
                          ${demandStats[d]?.toFixed(2)}%`
                              : ""}

                            {sign === "positive" && d === "demandPercentage"
                              ? `Over the last 2 years, market demand has increased to
                        ${demandStats[d]?.toFixed(2)}%`
                              : sign === "negative" && d === "demandPercentage"
                              ? `Over the last 2 years, market demand has decreaded to
                          ${demandStats[d]?.toFixed(2)}%`
                              : ""}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : null}
          {/* table */}

          <div id="fullScreen">
            <div
              className={`w-full h-auto px-5 py-3 sticky bg-white z-20 ${
                isFullscreen ? "top-0" : "top-[202px]"
              } !mb-0 !mt-0`}
            >
              <div className="flex overflow-x-scroll hide-scroll-bar py-[1px] w-full">
                <div className="flex flex-nowrap space-x-3">
                  <div
                    onClick={() => {
                      const content = (
                        <ViewMode
                          handleSelect={(selectedMode) => {
                            setSelectedViewMode(selectedMode);
                            setApplyingFilter(true);
                            setPageNumber(1);
                          }}
                          selectedViewMode={selectedViewMode}
                        />
                      );
                      openBottomSheet(content);
                    }}
                    className="inline-flex items-center space-x-2 px-3 py-2 rounded-lg border border-pwip-v2-gray-350"
                  >
                    <span className="text-pwip-v2-primary-700">
                      {eyePreviewIcon}
                    </span>
                    <div className="inline-flex items-center justify-between space-x-10">
                      <span className="text-sm text-pwip-gray-800 whitespace-nowrap">
                        {selectedViewMode?.label}
                      </span>
                      {chevronDown}
                    </div>
                  </div>

                  {selectedViewMode?.value !== "all" ? (
                    <div
                      onClick={() => {
                        const content = (
                          <LocationViewMode
                            handleSelect={(selectedMode) => {
                              setSelectedLocationViewMode(selectedMode);
                              setApplyingFilter(true);
                              setPageNumber(1);
                            }}
                            selectedViewMode={selectedLocationViewMode}
                          />
                        );
                        openBottomSheet(content);
                      }}
                      className="inline-flex items-center px-3 py-2 rounded-lg border border-pwip-v2-gray-350"
                    >
                      <div className="inline-flex items-center justify-between space-x-10">
                        <span className="text-sm text-pwip-gray-800 whitespace-nowrap">
                          {selectedLocationViewMode?.label}
                        </span>
                        {chevronDown}
                      </div>
                    </div>
                  ) : null}

                  {selectedViewMode?.value === "all" ? (
                    <React.Fragment>
                      <div
                        onClick={() => {
                          const content = (
                            <MonthList
                              handleSelect={(mo, y) => {
                                setSelectedMonth(mo);
                                setSelectedYear(y);
                                setApplyingFilter(true);
                                setPageNumber(1);
                              }}
                              selectedMonth={selectedMonth}
                              selectedYear={selectedYear}
                            />
                          );

                          openBottomSheet(content);
                        }}
                        className={`inline-flex items-center px-3 py-2 rounded-lg border border-pwip-v2-gray-350 text-pwip-gray-800`}
                      >
                        <div className="inline-flex items-center justify-between space-x-10">
                          <span className="text-sm whitespace-nowrap">
                            {selectedMonth !== "Full year"
                              ? getMonthAbbreviation(selectedMonth)
                              : selectedMonth === "Full year"
                              ? "Year"
                              : ""}{" "}
                            {selectedYear}
                          </span>
                          {chevronDown}
                        </div>
                      </div>

                      <div
                        onClick={() => {
                          // selectedHSN, type, selectedYear, selectedMonth
                          const content = (
                            <FilterOptionList
                              selectedHSN={activeHSN?.HSNCode}
                              selectedMonth={selectedMonth}
                              selectedYear={selectedYear}
                              type={selectedViewMode}
                              appliedFilterData={appliedFilterData}
                              handleApply={(item) => {
                                startLoading();

                                setTimeout(() => {
                                  setAppliedFilterData(item);
                                  setApplyingFilter(true);
                                }, 1000);
                              }}
                            />
                          );

                          openBottomSheet(content);
                        }}
                        className={`inline-flex items-center space-x-2 px-3 py-2 rounded-lg border border-pwip-v2-gray-350 text-pwip-gray-800 ${
                          Object.keys(appliedFilterData)?.length
                            ? "!border-pwip-v2-primary-700 !text-pwip-v2-primary-700"
                            : ""
                        }`}
                      >
                        <span className="text-pwip-v2-primary-700">
                          {filterIcon}
                        </span>
                        <div className="inline-flex items-center justify-between space-x-10">
                          <span className="text-sm whitespace-nowrap">
                            Filter
                          </span>
                          {chevronDown}
                        </div>
                      </div>
                    </React.Fragment>
                  ) : null}
                </div>
              </div>
            </div>

            <div
              id="tableSection"
              className={`inline-flex w-full flex-col ${
                isFullscreen ? "h-[calc(100vh-64px)]" : "h-[calc(100vh-266px)]"
              } px-5 !mt-0 bg-white pb-6`}
            >
              {!isFullscreen ? (
                <button
                  onClick={() => {
                    setIsFullscreen(true);
                    if (isIOS) {
                      openToastMessage(
                        {
                          type: "info",
                          autoHide: false,
                          message:
                            "For best experience, rotate your screen to landscape mode",
                        },
                        "top"
                      );
                    }

                    lockScreenOrientation("landscape");
                  }}
                  className="inline-flex px-3 py-2 h-8 space-x-2 w-auto rounded-md border-[1px] border-pwip-v2-primary-500 text-pwip-v2-primary-500 backdrop-blur-[2px] text-center text-xs absolute bottom-8 right-4"
                >
                  {expandIcon} <span>See in full screen</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsFullscreen(false);
                    if (isIOS) {
                      openToastMessage(
                        {
                          type: "info",
                          autoHide: false,
                          message:
                            "For best experience, rotate your screen to portrait mode",
                        },
                        "top"
                      );
                    }

                    lockScreenOrientation("portrait");
                  }}
                  className="inline-flex items-center justify-center px-3 py-2 h-8 space-x-2 w-auto z-20 rounded-md border-[1px] border-pwip-v2-primary-500 backdrop-blur-[2px] text-pwip-v2-primary-500 text-center text-xs absolute bottom-4 right-2"
                >
                  {collapseIcon} <span>Close full screen</span>
                </button>
              )}

              <div className="w-full h-auto overflow-x-scroll hide-scroll-bar">
                {selectedViewMode?.value === "all" ? (
                  <DataTableForAllFilter
                    column={allEximTableData?.columns}
                    row={allEximTableData?.rows}
                    pageNumber={pageNumber}
                    isLoading={isLoading}
                    fetchRows={(num) => {
                      setPageNumber(num);
                    }}
                    applyingFilter={applyingFilter}
                    handleSettingApplyFilter={() => {
                      setApplyingFilter(false);
                    }}
                  />
                ) : (
                  <DataTableForAnnualViewFilter
                    column={modelBasedEximTableData?.columns}
                    row={modelBasedEximTableData?.rows}
                    // for infinite load
                    pageNumber={pageNumber}
                    isLoading={isLoading}
                    fetchRows={(num) => {
                      setPageNumber(num);
                    }}
                    applyingFilter={applyingFilter}
                    handleSettingApplyFilter={() => {
                      setApplyingFilter(false);
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <div
          className={`h-screen w-screen fixed top-0 left-0 transition-all bg-white inline-flex flex-col justify-between ${
            splashScreen ? "block opacity-1 z-50" : "hidden opacity-0"
          }`}
        >
          <div className="inline-flex space-y-3 items-center flex-col justify-center h-full w-full px-8 relative top-[-100px]">
            {/* Splash screen content */}
            <div className="min-w-[310px] h-auto relative inline-flex items-center justify-center">
              <img
                className="h-[32px] absolute z-10"
                src="/assets/images/services/exim-service-logo.png"
              />
              <div className="w-auto z-0">
                <Lottie animationData={ServiceSplashLottie} style={style} />
              </div>
            </div>

            <div className="inline-flex items-center flex-col justify-center">
              <span className="text-center text-sm text-pwip-black-500 font-semibold leading-5">
                Supercharge your Export strategy with trade trends at your
                fingertips
              </span>
            </div>

            {/* Progress bar */}
            <div className="px-5 w-full h-auto">
              <div className="w-full h-2 rounded-full bg-pwip-v2-gray-350 !mt-12">
                <div
                  style={{ width: `${progressValue}%` }}
                  className="h-2 rounded-full bg-pwip-v2-primary-500"
                ></div>
              </div>
            </div>
          </div>

          <div className="inline-flex items-center flex-col justify-center px-8 pb-8">
            <span className="text-center text-xs text-pwip-v2-gray-500 leading-5">
              EXIM data bank, right on your screen
            </span>
          </div>
        </div>
      </AppLayout>
    </React.Fragment>
  );
}

export default withAuth(EXIMService);
