import React from "react";

export function CompanyContainer(props) {
  const setCompanyName = props.setCompanyName;
  const companyName = props.companyName;

  return (
    <div className="inline-flex items-center justify-between space-x-6 w-full">
      <div className="w-full rounded-full ring-1 ring-gray-200 py-2 px-3">
        <input
          placeholder="eg. Moguire Foods Pvt Ltd"
          className="w-full rounded-full outline-none bg-transparent text-white placeholder-gray-300"
          onChange={(e) => setCompanyName(e.target.value)}
          value={companyName}
        />
      </div>
    </div>
  );
}
