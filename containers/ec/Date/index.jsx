import React from "react";
import DatePicker from "react-date-picker/dist/entry.nostyle";

export function DateContainer(props) {
  const choosenDate = props.choosenDate;
  const setChoosenDate = props.setChoosenDate;

  return (
    <div className="inline-flex items-center justify-between space-x-6 w-full">
      <DatePicker
        onChange={setChoosenDate}
        value={choosenDate}
        autoFocus={false}
        className="w-full inline-flex ring-1 ring-gray-200 rounded-md"
        calendarClassName="px-3 py-2"
        calendarIcon={null}
        required={true}
        format="dd MMM y"
        showLeadingZeros={true}
      />
    </div>
  );
}
