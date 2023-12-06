import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSession, signIn } from "next-auth/react";
import { useDispatch } from "react-redux";

import { handleSettingAuthDataRequest } from "redux/actions/auth.actions";

export default function Home() {
  const router = useRouter();
  const { data: session } = useSession();
  const dispatch = useDispatch();

  const [active, setActive] = useState(0);

  const handleNavigation = (path) => {
    router.push(path);
  };

  const handleLogin = async () => {
    try {
      const callbackUrl = process.env.AUTH0_ISSUER_BASE_URL; //"dev-342qasi42nz80wtj.us.auth0.com";
      await signIn("auth0", { callbackUrl });
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const redirectToApp = async () => {
    try {
      handleNavigation("/export-costing");
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  useEffect(() => {
    if (session && session.accessToken && session.user) {
      dispatch(handleSettingAuthDataRequest(session.user, session.accessToken));
      redirectToApp();
    }
  }, [session]);

  const onboardingIndex = [0, 1, 2];

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prevActive) => (prevActive + 1) % onboardingIndex.length);
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <React.Fragment>
      <Head>
        <meta charSet="utf-8" />
        <title>Home | pwip - Export Costing </title>

        <meta name="Reciplay" content="Reciplay" />
        <meta name="description" content="Generated by create next app" />

        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        {/*<meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
*/}
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />

        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen flex flex-col items-center bg-white pb-[94px] hide-scroll-bar">
        <div className="inline-flex flex-col items-center h-full w-full">
          <div className="inline-flex justify-start items-center w-full px-5 py-3">
            <img
              src="/assets/images/logo-blue.png"
              className="h-[38px] w-[38px]"
            />
          </div>

          <div className="relative w-full h-full mt-[24px] px-5">
            <div className="inline-flex w-full items-center justify-center">
              <div
                className={`mb-0 font-sans font-bold text-lg text-pwip-black-600 text-left inline-flex w-full flex-col space-y-2 ${
                  active === 0 ? "block" : "hidden"
                }`}
              >
                <h2>Costings made easy.</h2>
                <p className="text-sm font-[400]">
                  We have simplified generating costings for your export
                  business, it just takes 2 clicks.
                </p>
              </div>

              <div
                className={`mb-0 font-sans font-bold text-lg text-pwip-black-600 text-left inline-flex w-full flex-col space-y-2 ${
                  active === 1 ? "block" : "hidden"
                }`}
              >
                <h2>Customize as you need.</h2>
                <p className="text-sm font-[400]">
                  We have simplified generating costings for your export
                  business, it just takes 2 clicks.
                </p>
              </div>

              <div
                className={`mb-0 font-sans font-bold text-lg text-pwip-black-600 text-left inline-flex w-full flex-col space-y-2 ${
                  active === 2 ? "block" : "hidden"
                }`}
              >
                <h2>Experience designed for you.</h2>
                <p className="text-sm font-[400]">
                  We have simplified generating costings for your export
                  business, it just takes 2 clicks.
                </p>
              </div>
            </div>
            <div className="relative h-full overflow-hidden mt-[32px] bg-[#F8F3EA] rounded-lg py-[24px]">
              <div className="duration-700 ease-in-out h-[332px]">
                <img
                  src="/assets/images/onboarding/one.svg"
                  className={`absolute block -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 h-[332px] w-full ${
                    active === 0 ? "block" : "hidden"
                  }`}
                  alt="onboarding 1 image"
                />

                <img
                  src="/assets/images/onboarding/two.svg"
                  className={`absolute block -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 h-[332px] w-full ${
                    active === 1 ? "block" : "hidden"
                  }`}
                  alt="onboarding 2 image"
                />

                <img
                  src="/assets/images/onboarding/three.svg"
                  className={`absolute block -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 h-[332px] w-full ${
                    active === 2 ? "block" : "hidden"
                  }`}
                  alt="onboarding 3 image"
                />
              </div>
            </div>
            <div className="flex items-center justify-center space-x-[4px] w-full mt-[24px]">
              <button
                type="button"
                onClick={() => setActive(0)}
                className={`w-5 h-2 rounded-full bg-pwip-v2-primary-600 transition-all duration-500 ${
                  active !== 0 ? "bg-pwip-v2-gray-200 !w-2" : ""
                }`}
              ></button>

              <button
                type="button"
                onClick={() => setActive(1)}
                className={`w-5 h-2 rounded-full bg-pwip-v2-primary-600 transition-all duration-500 ${
                  active !== 1 ? "bg-pwip-v2-gray-200 !w-2" : ""
                }`}
              ></button>

              <button
                type="button"
                onClick={() => setActive(2)}
                className={`w-5 h-2 rounded-full bg-pwip-v2-primary-600 transition-all duration-500 ${
                  active !== 2 ? "bg-pwip-v2-gray-200 !w-2" : ""
                }`}
              ></button>
            </div>
          </div>
        </div>

        <div className="px-5 w-full inline-flex flex-col items-center justify-center space-y-[24px] mt-[42px] bg-white">
          <button
            onClick={() => handleLogin()}
            className="w-full rounded-md py-3 px-4 bg-pwip-v2-primary-600 text-pwip-white-100 text-center text-sm font-bold"
          >
            Get started
          </button>
          <div className="w-full max-w-[85%]">
            <p className="text-center font-[400] text-sm">
              By logging in you accept our terms of uses and privacy policy
            </p>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
