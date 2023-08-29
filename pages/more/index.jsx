import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/react";

import withAuth from "@/hoc/withAuth";
import AppLayout from "@/layouts/appLayout.jsx";

// Import Components
import { Header } from "@/components/Header";
import { chevronRight } from "theme/icon";
import { moreSettingOptions } from "@/constants/moreSettingOptions";

// Import Containers

// Import Layouts

function More() {
  const router = useRouter();
  const { data: session } = useSession();

  const [mainContainerHeight, setMainContainerHeight] = React.useState(0);
  const [userData, setUserData] = React.useState(null);

  React.useEffect(() => {
    const element = document.getElementById("fixedMenuSection");
    if (element) {
      const height = element.offsetHeight;
      setMainContainerHeight(height);
    }
  }, []);

  React.useEffect(() => {
    if (session) {
      setUserData(session?.user);
    }
  }, [session]);

  return (
    <React.Fragment>
      <Head>
        <meta charSet="utf-8" />

        <title>Export Costing by pwip</title>

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

      <AppLayout>
        <Header />

        <div
          id="fixedMenuSection"
          className={`h-[auto] mt-[72px] w-full bg-pwip-primary z-10 py-6 px-5`}
        >
          <div className="inline-flex items-center space-x-5">
            <div className="h-[5.125rem] w-[5.125rem] rounded-full ring-1 ring-white p-[1.5px]">
              <img
                src={userData?.picture || "/assets/images/no-profile.png"}
                className="h-full w-full rounded-full object-cover"
              />
            </div>
            <div className="inline-flex flex-col space-y-1">
              <span className="text-white text-base font-medium">
                {userData?.name || ""}
              </span>
              <span className="text-white text-sm font-normal">
                {userData?.email || ""}
              </span>
            </div>
          </div>
        </div>

        <div
          className={`inline-flex flex-col w-full bg-white pb-0 overflow-auto px-5 pt-7 hide-scroll-bar relative rounded-t-2xl`}
          style={{
            // top: mainContainerHeight + 73 + "px",
            paddingBottom: mainContainerHeight - 10 + "px",
            minHeight: `calc(100vh - ${mainContainerHeight + 72 + "px"})`,
          }}
        >
          {moreSettingOptions.map((items, index) => {
            return (
              <div
                key={items?.label + index}
                onClick={() => {
                  router.push(items?.path);
                }}
                className="inline-flex items-center justify-between pb-6 cursor-pointer"
              >
                <div className="inline-flex items-center space-x-4">
                  <div
                    className="inline-flex items-center justify-center p-2 rounded-md bg-opacity-[0.4]"
                    style={{
                      backgroundColor: items?.backgroundColor,
                    }}
                  >
                    {items?.icon}
                  </div>
                  <span className="text-base font-sans font-normal text-pwip-gray-1000">
                    {items?.label || ""}
                  </span>
                </div>
                <span className="text-pwip-primary-50">{chevronRight}</span>
              </div>
            );
          })}

          <hr className="mt-[60px] mb-[20px] bg-pwip-gray-50 text-pwip-gray-50" />

          <div
            onClick={() => {
              window.open("https://pwip.co", "_blank");
            }}
            className="inline-flex items-center justify-between pb-6 cursor-pointer"
          >
            <div className="inline-flex items-center space-x-4">
              <span className="text-base font-sans font-normal text-pwip-gray-1000">
                Legal, Terms and Conditions
              </span>
            </div>
          </div>
          <div
            onClick={() => {
              window.open("https://pwip.co", "_blank");
            }}
            className="inline-flex items-center justify-between pb-6 cursor-pointer"
          >
            <div className="inline-flex items-center space-x-4">
              <span className="text-base font-sans font-normal text-pwip-gray-1000">
                About us
              </span>
            </div>
          </div>
          <div
            onClick={() => {
              localStorage.removeItem("persist:root");
              signOut();
            }}
            className="inline-flex items-center justify-between pb-6 cursor-pointer"
          >
            <div className="inline-flex items-center space-x-4">
              <span className="text-base font-sans font-normal text-pwip-gray-1000">
                Logut
              </span>
            </div>
          </div>

          <div className="inline-flex flex-col w-full items-center justify-center pb-6 cursor-pointer mt-[60px]">
            <img src="/assets/images/logo-blue.png" className="h-[55px]" />
            <span className="text-sm font-sans font-normal text-pwip-gray-1000">
              Made in India, Made for rice!
            </span>
          </div>
        </div>
      </AppLayout>
    </React.Fragment>
  );
}

export default withAuth(More);
