import React, { useEffect, useState } from "react";
import Head from "next/head";
// import { useRouter } from "next/router";
import { getSession, signIn } from "next-auth/react";
// import { useDispatch } from "react-redux";
import Slider from "react-slick";

// import { handleSettingAuthDataRequest } from "redux/actions/auth.actions";

export default function Home() {
  // const router = useRouter();
  // const { data: session } = useSession();
  // const dispatch = useDispatch();

  const [activeSlide, setActiveSlide] = useState(0);

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 600,
    arrows: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    initialSlide: 0,
    autoplay: true,
    autoplaySpeed: 3000,
    beforeChange: function (prev, next) {
      setActiveSlide(next);
    },
  };

  // const handleNavigation = (path) => {
  //   router.push(path);
  // };

  const handleLogin = async () => {
    try {
      const callbackUrl = process.env.AUTH0_ISSUER_BASE_URL; //"dev-342qasi42nz80wtj.us.auth0.com";
      await signIn("auth0", { callbackUrl });
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  // const redirectToApp = async () => {
  //   try {
  //     handleNavigation("/export-costing");
  //   } catch (error) {
  //     console.error("Error during login:", error);
  //   }
  // };

  // const checkForAuth = async () => {
  //   const res = await dispatch(
  //     handleSettingAuthDataRequest(session.user, session.accessToken)
  //   );
  //   if (res?.payload?.token) {
  //     redirectToApp();
  //   }
  // };

  // useEffect(() => {
  //   if (session && session.accessToken && session.user) {
  //     console.log("here currentPlan", currentPlan);
  //     dispatch(handleSettingAuthDataRequest(session.user, session.accessToken));
  //   }
  // }, [session]);

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

        {/* <link rel="manifest" href="/manifest.json" /> */}
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>

      <div className="min-h-screen flex flex-col items-center bg-white pb-[82px] hide-scroll-bar">
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
                className={`mb-0 font-sans font-bold text-lg text-pwip-black-600 text-left inline-flex w-full flex-col space-y-2 transition-all ${
                  activeSlide === 0 ? "block" : "hidden"
                }`}
              >
                <h2>Multiple varieties to choose.</h2>
                <p className="text-sm font-[400]">
                  Discover 100+ Indian varieties, elevating your exports with
                  diverse choices from regions across India.
                </p>
              </div>

              <div
                className={`mb-0 font-sans font-bold text-lg text-pwip-black-600 text-left inline-flex w-full flex-col space-y-2 transition-all ${
                  activeSlide === 1 ? "block" : "hidden"
                }`}
              >
                <h2>No limits on shipment.</h2>
                <p className="text-sm font-[400]">
                  Select your destination port with ease for seamless and
                  efficient management of your shipments.
                </p>
              </div>

              <div
                className={`mb-0 font-sans font-bold text-lg text-pwip-black-600 text-left inline-flex w-full flex-col space-y-2 transition-all ${
                  activeSlide === 2 ? "block" : "hidden"
                }`}
              >
                <h2>Costing made simple.</h2>
                <p className="text-sm font-[400]">
                  Generate costings effortlessly – just 2 clicks away.
                  Streamline your global business journey.
                </p>
              </div>
            </div>
            <div
              // id="swipeElement"
              className="relative h-full overflow-hidden mt-[32px] bg-[#F8F3EA] rounded-lg pt-[24px]"
              // onTouchStart={handleTouchStart}
              // onTouchMove={handleTouchMove}
              // onTouchEnd={handleTouchEnd}
            >
              <div className="duration-700 ease-in-out h-auto inlin-flex items-end">
                <Slider {...sliderSettings}>
                  <img
                    src="/assets/images/onboarding/one.svg"
                    className={`h-[320px] w-full`}
                    alt="onboarding 1 image"
                  />

                  <img
                    src="/assets/images/onboarding/two.svg"
                    className={`h-[320px] w-full`}
                    alt="onboarding 2 image"
                  />

                  <img
                    src="/assets/images/onboarding/three.svg"
                    className={`h-[320px] w-full`}
                    alt="onboarding 3 image"
                  />
                </Slider>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-[4px] w-full mt-[24px]">
              <button
                type="button"
                onClick={() => {
                  // window.clearInterval(timeoutId);
                  // setActive(0);
                }}
                className={`w-5 h-2 rounded-full bg-pwip-v2-primary-600 transition-all duration-500 ${
                  activeSlide !== 0 ? "!bg-pwip-v2-gray-200 !w-2" : ""
                }`}
              ></button>

              <button
                type="button"
                onClick={() => {
                  // window.clearInterval(timeoutId);
                  // setActive(1);
                }}
                className={`w-5 h-2 rounded-full bg-pwip-v2-primary-600 transition-all duration-500 ${
                  activeSlide !== 1 ? "!bg-pwip-v2-gray-200 !w-2" : ""
                }`}
              ></button>

              <button
                type="button"
                onClick={() => {
                  // window.clearInterval(timeoutId);
                  // setActive(2);
                }}
                className={`w-5 h-2 rounded-full bg-pwip-v2-primary-600 transition-all duration-500 ${
                  activeSlide !== 2 ? "!bg-pwip-v2-gray-200 !w-2" : ""
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

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (session?.accessToken) {
    return {
      props: {
        session: session || null,
      },
      redirect: {
        destination: "/export-costing",
        permanent: true, // Set to true if /export-costing is a permanent redirect
      },
    };
  }
  if (!session?.accessToken) {
    return {
      props: {
        session: null,
      },
    };
  }
}
