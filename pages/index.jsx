import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  const handleNavigation = (path) => {
    router.push(path);
  };

  return (
    <React.Fragment>
      <Head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />

        <title>Home | pwip - Export Costing </title>

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

      <div
        className="h-screen w-screen relative overflow-hidden"
        style={{ background: `linear-gradient(180deg, #60baf7, #2373bf)` }}
      >
        <div className="onboarding bg-no-repeat bg-cover inline-flex flex-col justify-end transition-all absolute top-0 left-0 h-full w-full px-5 py-8">
          <div className="inline-flex flex-col space-y-12">
            <div className="inline-flex flex-col space-y-3">
              <h1 className="text-[36px] text-gray-50">
                Export costing
                <br />
                by pwip
              </h1>
              <span className="text-md text-gray-200">
                A team driven towards solving daily rice trade problems. Lorem
                Ipsum
              </span>
            </div>

            <div className="inline-flex flex-col space-y-3">
              <button
                onClick={() => handleNavigation("signup")}
                className="w-full rounded-full py-3 px-4 bg-white text-[#2373bf] text-center text-md font-semibold"
              >
                Sign up
              </button>
              <button
                onClick={() => handleNavigation("login")}
                className="w-full rounded-full py-3 px-4 bg-transparent text-white tex text-md font-regular"
              >
                Already a member?{" "}
                <span className="text-underline font-semibold">Login now</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
