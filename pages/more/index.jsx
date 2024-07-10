/** @format */

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
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

const InstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIos, setIsIos] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [isChrome, setIsChrome] = useState(false);
  const [isSafari, setIsSafari] = useState(false);

  const { openBottomSheet } = useOverlayContext();

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    // Check if the browser is Safari on iOS
    const isSafariBrowser =
      isIosDevice &&
      userAgent.includes("safari") &&
      !userAgent.includes("crios");
    setIsSafari(isSafariBrowser);

    // Check if the browser is Chrome on iOS or other platforms
    const isChromeBrowser =
      userAgent.includes("crios") || userAgent.includes("chrome");
    setIsChrome(isChromeBrowser);

    if (!isIosDevice) {
      const handler = (e) => {
        e?.preventDefault();
        setDeferredPrompt(e);

        setIsSupported(true);
      };

      window.addEventListener("beforeinstallprompt", handler);

      return () => {
        window.removeEventListener("beforeinstallprompt", handler);
      };
    }

    if (!("beforeinstallprompt" in window)) {
      setIsSupported(false);
    }
  }, [window?.navigator?.userAgent]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
    }
  };

  const HowToIframe = useCallback(
    ({ isChromeBrowser, isSafariBrowser }) => {
      return (
        <div className="px-5 py-8">
          <iframe
            className="h-screen w-full relative"
            src={
              isSafariBrowser
                ? "/safari-install/How to Install PWIP Exports App on iOS Using Safar 39c467c19e7e4de98e82ec9934f16cc2.html"
                : isChromeBrowser
                ? "/chrome-install/How to Install PWIP Exports App on iOS Using Chrom 39c467c19e7e4de98e82ec9934f16cc2.html"
                : ""
            }
          />
        </div>
      );
    },
    [isChrome, isSafari]
  );

  const handleKnowMoreClick = async () => {
    const content = (
      <HowToIframe isSafariBrowser={isSafari} isChromeBrowser={isChrome} />
    );

    openBottomSheet(content);
  };

  return (
    <div className="mt-6 w-full bg-[#E7F1FE] rounded-lg relative text-xs inline-flex items-center border-[1px] border-[#CBE0FE]">
      <div className="inline-flex flex-col max-w-[65%] py-5 pl-5">
        <h3 className="font-semibold text-sm text-[#052E6A]">PWIP Exports</h3>
        <p className="!mt-1 text-[#0C326D]">
          Get PWIP Exports app on your phone, install the app now.
        </p>
        {isIos || !isSupported ? (
          <button
            className="bg-white rounded-md outline-none border-none text-center text-pwip-black-600 px-2 py-2 mt-3 w-auto max-w-[55%] whitespace-nowrap"
            onClick={handleKnowMoreClick}
          >
            Know more
          </button>
        ) : (
          <button
            className="bg-white rounded-md outline-none border-none text-center text-pwip-black-600 px-2 py-2 mt-3 w-auto max-w-[55%] whitespace-nowrap"
            onClick={handleInstallClick}
            disabled={!deferredPrompt}
          >
            Install App
          </button>
        )}
      </div>

      <div className="cols-span-3 absolute bottom-0 right-4 inline-flex justify-end min-w-[35%] max-w-[35%]">
        <img
          className="h-auto w-[90%]"
          src="/assets/images/install-app-3d.png"
        />
      </div>
    </div>
  );
};

function More() {
  const router = useRouter();
  const {
    openBottomSheet,
    closeBottomSheet,
    startLoading,
    stopLoading,
    // openToastMessage,
    // closeToastMessage,
  } = useOverlayContext();
  const userDetails = useSelector((state) => state.auth.user);

  const [mainContainerHeight, setMainContainerHeight] = React.useState(0);
  const [userData, setUserData] = React.useState(null);
  const [isInstalled, setIsInstalled] = useState(false); // State to track if app is installed

  React.useEffect(() => {
    const checkInstallationStatus = () => {
      // Check if app is installed by querying the PWA installation status
      if (window.matchMedia("(display-mode: standalone)").matches) {
        setIsInstalled(true);
      } else {
        setIsInstalled(false);
      }

      // Listen for appinstalled event to update installation status
      window.addEventListener("appinstalled", () => {
        setIsInstalled(true);
      });
    };

    checkInstallationStatus();
  }, []);

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

          {!isInstalled ? <InstallButton /> : null}

          <hr
            className={`${
              isInstalled ? "mt-[20px]" : "mt-[60px]"
            } mb-[20px] bg-pwip-gray-50 text-pwip-gray-50`}
          />
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
