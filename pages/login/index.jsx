import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";

import { Header } from "@/components/Header";
// Import Layouts

export default function Login() {
  const router = useRouter();

  const [activeTab, setActiveTab] = React.useState(0);
  const [phone, setPhone] = React.useState("");

  const handleTabChange = (index) => {
    setActiveTab(index);
  };

  return (
    <React.Fragment>
      <Head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />

        <title>Login | pwip - Export Costing </title>

        <meta name="Reciplay" content="Reciplay" />
        <meta name="description" content="Generated by create next app" />

        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />

        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="h-screen w-screen inline-flex flex-col relative bg-white">
        <Header />
        <div className="inline-flex flex-col relative w-full h-full px-5 py-10">
          <div className="inline-flex flex-col justify-start space-y-1 relative">
            <span className="line-clamp-1 font-bold text-[#262727] text-xl">
              Login to Account
            </span>
            <span className="line-clamp-1 font-regular text-[#77787b] text-md">
              Hello, login and start using our EC tool
            </span>
          </div>

          <div className="inline-flex flex-row items-center relative bg-gray-100 rounded-full py-2 px-3 mt-8">
            {["Buyer", "Miller"].map((data, index) => {
              let background = "transparent";
              let shadow = "";

              if (activeTab === index) {
                background = "bg-white";
                shadow = "shadow-sm";
              }

              return (
                <div
                  key={index}
                  className={`inline-flex w-full items-center justify-center relative rounded-full py-2 px-4 transition-all ${background} ${shadow}`}
                  onClick={() => handleTabChange(index)}
                >
                  <span className="line-clamp-1 font-regular text-[#77787b] text-md">
                    {data}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="w-full inline-flex flex-col space-y-8 relative py-2 px-3 mt-10">
            <div className="w=full inline-flex flex-col space-y-3 relative">
              <label className="text-md text-[#77787b] font-semibold">
                Phone Number
              </label>
              <div className="w-full rounded-full ring-1 ring-[#77787b] py-2 px-3">
                <PhoneInput
                  country={"in"}
                  placeholder="91********"
                  className="w-full rounded-full outline-none"
                  enableSearch={false}
                  countryCodeEditable={false}
                  value={phone}
                  onChange={(ph) => setPhone(ph)}
                />
              </div>
            </div>

            <button
              onClick={() => router.push("export-costing")}
              className="w-full rounded-full py-3 px-4 bg-[#2475c0] text-white text-center text-md font-semibold"
            >
              Request OTP
            </button>
          </div>
          <div
            onClick={() => router.push("signup")}
            className="inline-flex w-full items-center justify-start relative rounded-full mt-6 px-4 transition-all bg-transparent"
          >
            <span className="line-clamp-1 font-regular text-[#77787b] text-md">
              Not registered yet?{" "}
              <span className="text-[#4fb28b] cursor-pointer">Sign up.</span>
            </span>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
