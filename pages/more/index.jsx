/** @format */

import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/react";
import { useSelector } from "react-redux";

import withAuth from "@/hoc/withAuth";
import AppLayout from "@/layouts/appLayout.jsx";

// Import Components
import { Header } from "@/components/Header";
import { chevronRight } from "theme/icon";
import { moreSettingOptions } from "@/constants/moreSettingOptions";
import { universalLogoutUrl } from "@/utils/helper";
import PortRequestForm from "@/containers/PortRequestForm";
import { useOverlayContext } from "@/context/OverlayContext";

// Import Containers

// Import Layouts

function More() {
  const router = useRouter();
  const {
    openBottomSheet,
    closeBottomSheet,
    startLoading,
    stopLoading,
    openToastMessage,
    closeToastMessage,
  } = useOverlayContext();
  const userDetails = useSelector((state) => state.auth.user);

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
    if (userDetails) {
      setUserData(userDetails);
    }
  }, [userDetails]);

  return (
    <React.Fragment>
      <Head>
        <meta charSet="utf-8" />

        <title>More | PWIP</title>

        <meta name="PWIP Exports" content="PWIP Exports" />
        <meta name="description" content="Generated by create next app" />

        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        {/*<meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
*/}
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />

        {/* <link rel="manifest" href="/manifest.json" /> */}
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>

      <AppLayout>
        <Header />

        <div
          className={`h-[auto] mt-[56px] w-full bg-pwip-v2-primary-100 z-10 pt-6 pb-8 px-5`}
        >
          <div className="inline-flex items-center space-x-5">
            <div className="h-[5.125rem] w-[5.125rem] rounded-full ring-1 ring-white p-[1.5px]">
              <img
                src={
                  userData?.profile_pic ||
                  userData?.picture ||
                  "/assets/images/no-profile.png"
                }
                className="h-full w-full rounded-full object-cover"
              />
            </div>
            <div className="inline-flex flex-col space-y-1 text-pwip-v2-primary">
              <span className="text-base font-medium">
                {userData?.first_name ||
                  userData?.full_name ||
                  userData?.name ||
                  "User"}
              </span>
              <span className="text-sm font-normal">
                {userData?.email || ""}
              </span>
            </div>
          </div>
        </div>

        <div
          className={`min-h-screen inline-flex flex-col w-full bg-white overflow-auto px-5 pt-[30px] hide-scroll-bar relative`}
          style={{
            paddingBottom: mainContainerHeight - 52 + "px",
          }}
        >
          {moreSettingOptions.map((items, index) => {
            return (
              <div
                key={items?.label + index}
                onClick={() => {
                  if (items?.type === "in-app") {
                    startLoading();
                    closeBottomSheet();

                    const content = (
                      <PortRequestForm
                        callback={() => {
                          //
                        }}
                      />
                    );

                    setTimeout(() => {
                      openBottomSheet(content);
                      stopLoading();
                    }, 500);

                    return;
                  }

                  router.push(items?.path);
                }}
                className="inline-flex items-center justify-between pb-6 cursor-pointer"
              >
                <div className="inline-flex items-center space-x-4">
                  <div
                    className="h-[36px] w-[36px] inline-flex items-center justify-center p-2 rounded-md bg-opacity-[0.4]"
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
            onClick={async () => {
              localStorage.removeItem("persist:root");
              // Cookies.set("lastVisitedPage", "/export-costing", { expires: 7 }); // Set expiry as needed

              await signOut({
                redirect: false,
                callbackUrl: window.location.origin,
              });

              window.location.href = universalLogoutUrl;
            }}
            className="inline-flex items-center justify-between pb-6 cursor-pointer"
          >
            <div className="inline-flex items-center space-x-4">
              <span className="text-base font-sans font-normal text-pwip-gray-1000">
                Logout
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
