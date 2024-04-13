import React, { useEffect, useState } from "react";
import {
  contactFields,
  contactFieldsHeading,
} from "@/constants/profileFormFields";

import Head from "next/head";
import { useOverlayContext } from "@/context/OverlayContext";
import { useSession, signIn } from "next-auth/react";
import { useSelector, useDispatch } from "react-redux";
// import Slider from "react-slick";
import { useRouter } from "next/router";

import {
  handleSettingAuthDataRequest,
  handleSettingAuthDataSuccess,
} from "redux/actions/auth.actions";
import { fetchProfileRequest } from "@/redux/actions/profileEdit.actions";
import { fetchUserRequest } from "@/redux/actions/userEdit.actions";

import axios from "axios";
import {
  apiBaseURL,
  apiStagePaymentBeUrl,
  formatNumberWithCommas,
  pwipPrimeServiceId,
  razorpayKey,
} from "utils/helper";

import Lottie from "lottie-react";
import ContainerShip from "../theme/lottie/container-ship.json";

//  import ProfileDetailForm from "@/components/ProfileDetailForm";

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const dispatch = useDispatch();

  const authToken = useSelector((state) => state.auth.token);
  const authUser = useSelector((state) => state.auth.user);
  const profileObject = useSelector((state) => state.profile);
  const userObject = useSelector((state) => state.user);

  const [eximTrendsData, setEximTrendsData] = React.useState(null);

  const fetchEXIMTrend = async () => {
    try {
      const response = await axios.get(
        apiBaseURL +
          "api" +
          "/service/rice-price/exim-trend?ToDate=01-04-2024&rangeInMonths=6",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const eximDataFromResponse = response?.data;

      let eximData = transformData(eximDataFromResponse?.chart);

      const eximTrends = {
        ...response?.data,
        chart: eximData || [],
      };

      localStorage.setItem("eximTrends", JSON.stringify(eximTrends));

      setEximTrendsData(eximTrends);
    } catch (err) {
      console.log(err);
    }
  };

  const {
    openBottomSheet,
    closeBottomSheet,
    startLoading,
    stopLoading,
    isLoading,
  } = useOverlayContext();

  // const [activeSlide, setActiveSlide] = useState(0);
  // const [showUserDetailForm, setShowUserDetailForm] = useState(false);

  // const handleFormFieldBottomSheet = (fields, fieldHeading, token) => {
  //   const content = (
  //     <React.Fragment>
  //       <ProfileDetailForm
  //         token={token}
  //         fields={fields}
  //         fieldHeading={{
  //           heading: fieldHeading,
  //         }}
  //         professionOptions={[]}
  //         userObject={{ userData: userDetails }}
  //         profileObject={{}}
  //         isStandalone={true}
  //       />
  //     </React.Fragment>
  //   );
  //   openBottomSheet(content, () => null, true, true);
  // };

  const handleNavigation = (path) => {
    router.push(path);
  };

  async function getUserProfileDetails() {
    await dispatch(fetchUserRequest());
    await dispatch(fetchProfileRequest());
  }

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
      stopLoading();
      handleNavigation("/home");
    } catch (error) {
      stopLoading();
      console.error("Error during login:", error);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && session?.accessToken) {
      startLoading();
      dispatch(handleSettingAuthDataRequest(session.user, session.accessToken));
    }
  }, [status, session?.accessToken]);

  useEffect(() => {
    if (
      authUser?.apiMessage === "success" &&
      !profileObject?.profileData &&
      !userObject?.userData
    ) {
      getUserProfileDetails();
    }
  }, [authUser?.apiMessage]);

  useEffect(() => {
    if (profileObject?.profileData && userObject?.userData && authToken) {
      const userPayload = {
        ...authUser,
        ...profileObject?.profileData,
        ...userObject?.userData,
      };
      dispatch(handleSettingAuthDataSuccess(userPayload, authToken));
      if (userPayload?.newUser) {
        stopLoading();
        handleNavigation("/onboarding");
      } else {
        stopLoading();

        // const eximTrends = localStorage.getItem("eximTrends");

        // if (eximTrends) {
        //   setEximTrendsData(JSON.parse(eximTrends));
        // } else {
        //   fetchEXIMTrend();
        // }

        redirectToApp();
      }
    }
  }, [profileObject, userObject]);

  // useEffect(() => {
  //   if (session) {
  //     if (
  //       (userDetails && !userDetails.phone) ||
  //       (userDetails && !userDetails.email)
  //     ) {
  //       stopLoading();

  //       let fields = [...contactFields];

  //       if (!userDetails?.email) {
  //         fields = [...contactFields].filter((f) => f.type !== "phone");
  //       }

  //       if (!userDetails?.phone) {
  //         fields = [...contactFields].filter((f) => f.type !== "email");
  //       }

  //       handleFormFieldBottomSheet(
  //         fields,
  //         "We need a few details",
  //         session?.accessToken
  //       );
  //     }

  //     if (userDetails?.phone && userDetails?.email) {
  //       closeBottomSheet();
  //       redirectToApp();
  //     }
  //   }
  // }, [userDetails]);
  // const style = {
  //   height: 180,
  // };

  return (
    <React.Fragment>
      <Head>
        <meta charSet="utf-8" />
        <title>Home | pwip - Export Costing </title>

        <meta name="PWIP App" content="PWIP App" />
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

      <div className="min-h-screen flex flex-col items-center bg-white pb-[82px] hide-scroll-bar justify-around">
        <div className="inline-flex flex-col items-center h-full w-full">
          <div className="inline-flex justify-center items-center w-full px-5 py-3">
            <img
              src="/assets/images/logo-blue.png"
              className="h-[38px] w-[38px]"
            />
          </div>

          <div className="relative w-full h-full mt-[8px] px-5 space-y-8">
            <div className="inline-flex w-full items-center justify-center">
              <div
                className={`mb-0 font-sans font-bold text-lg text-pwip-black-600 text-center inline-flex w-full flex-col space-y-2 transition-all`}
              >
                <p className="text-base font-semibold text-pwip-v2-primary">
                  Your export partner
                </p>
                <h2 className="text-2xl">
                  Let’s get your Export <br /> Business Journey Started
                </h2>
              </div>
            </div>

            <div className="w-auto z-0">
              <Lottie animationData={ContainerShip} />
            </div>
          </div>
        </div>

        <div className="px-5 w-full inline-flex flex-col items-center justify-center space-y-[24px] mt-[42px] bg-white">
          <button
            onClick={() => {
              startLoading();
              handleLogin();
            }}
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

// export async function getServerSideProps(context) {
//   const session = await getSession(context);

//   // const cookies = parse(context.req.headers.cookie || "");
//   // const lastVisitedPage = cookies?.lastVisitedPage || "/export-costing";

//   if (session?.accessToken) {
//     return {
//       props: {
//         session: session || null,
//       },
//       redirect: {
//         destination: "/export-costing",
//       },
//     };
//   }
//   if (!session?.accessToken) {
//     return {
//       props: {
//         session: null,
//       },
//     };
//   }
// }
