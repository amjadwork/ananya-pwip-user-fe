/** @format */

import React, { useEffect, useState } from "react";
import OtpInput from "react-otp-input";
import { useOverlayContext } from "@/context/OverlayContext";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";

import ProfileDetailForm from "@/components/ProfileDetailForm";
import { Button } from "@/components/Button";

import { updateUserRequest } from "@/redux/actions/userEdit.actions";

import {
  sendOTPRequest,
  verifyOTPResponseRequest,
  verifyOTPResponseFailure,
  otpRecievedFailure,
} from "@/redux/actions/utils.actions";

import { arrowLeftBackIcon } from "../../theme/icon";

const ResendButton = ({ verifyOTPDetails }) => {
  const dispatch = useDispatch();
  const [isButtonVisible, setIsButtonVisible] = useState(false);
  const [timerCount, setTimerCount] = useState(30);
  const [resentText, setResentText] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      if (timerCount > 0) {
        setTimerCount(timerCount - 1);
      } else {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timerCount]);

  useEffect(() => {
    if (resentText) {
      setTimeout(() => {
        setResentText(false);
        setTimerCount(30);
      }, 2000);
    }
  }, [resentText]);

  const handleResendClick = async () => {
    if (verifyOTPDetails?.phone) {
      await dispatch(
        sendOTPRequest(verifyOTPDetails?.phone, verifyOTPDetails?.country_code)
      );
      setResentText(true);
      setTimeout(() => setIsButtonVisible(false), 30000);
    }
  };

  if (resentText) {
    return (
      <div className="inline-flex items-center text-sm space-x-2 w-full mt-3">
        <span className="text-left text-pwip-green-600">
          OTP has been resent!
        </span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center text-sm space-x-2 w-full mt-3">
      <span className="text-left text-pwip-gray-800">
        Didn't receive the code?{" "}
      </span>
      {timerCount ? (
        <span className="text-pwip-v2-primary-700">Resend in {timerCount}</span>
      ) : (
        <button onClick={handleResendClick} className="">
          <span className="text-pwip-v2-primary-700">Resend code</span>
        </button>
      )}
    </div>
  );
};

const PhoneVerificationWithOTP = ({ token, fields, fieldHeading }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.auth.user);
  const otpDetails = useSelector((state) => state.utils.otpDetails);
  const verifyOTPResponse = useSelector(
    (state) => state.utils.verifyOTPResponse
  );

  const {
    closeToastMessage,
    closeBottomSheet,
    startLoading,
    stopLoading,
    openToastMessage,
  } = useOverlayContext();

  const [showOTPVerifyScreen, setShowOTPVerifyScreen] = useState(false);
  const [verifyOTPDetails, setVerifyOTPDetails] = useState(null);
  const [otp, setOtp] = useState("");

  useEffect(() => {
    if (otpDetails) {
      if (verifyOTPDetails) {
        setVerifyOTPDetails({
          ...verifyOTPDetails,
          ...otpDetails,
        });

        setShowOTPVerifyScreen(true);
        stopLoading();
      }
    }
  }, [otpDetails]);

  useEffect(() => {
    if (verifyOTPResponse) {
      if (
        verifyOTPResponse.status === "failed" &&
        !verifyOTPResponse.data?.verified
      ) {
        openToastMessage({
          type: "error",
          message: verifyOTPResponse?.data?.message || "Invalid OTP",
          autoHide: true,
        });

        dispatch(verifyOTPResponseFailure());

        setTimeout(() => {
          closeToastMessage();
        }, 2500);

        return;
      }

      if (
        verifyOTPResponse.status === "success" &&
        verifyOTPResponse.data?.verified
      ) {
        openToastMessage({
          type: "success",
          message: "Your phone number is verified, redirecting...",
          autoHide: true,
        });

        startLoading();

        if (router.route === "/more/profile-edit") {
          const { messageId, info, save, ...userDetailsToUpdate } =
            verifyOTPDetails;
          dispatch(updateUserRequest(userDetailsToUpdate));
        }

        if (router?.route !== "/more/profile-edit") {
          const queries = router.query;

          const requiredUTMParams = [
            "utm_source",
            "utm_medium",
            "utm_campaign",
            "utm_id",
            "utm_term",
            "utm_content",
          ];

          // Filter the UTM parameters that are present in the queries
          const availableUTMParams = requiredUTMParams.filter(
            (key) => queries[key]
          );

          // Construct the URL with the available UTM parameters
          let targetURL =
            availableUTMParams.length > 0
              ? `/home/?${availableUTMParams
                  .map((key) => `${key}=${queries[key]}`)
                  .join("&")}`
              : "/home";

          const fromPreviewNotLoggedIn = sessionStorage.getItem("previewURL");
          if (fromPreviewNotLoggedIn) {
            targetURL =
              availableUTMParams.length > 0
                ? fromPreviewNotLoggedIn +
                  "/?" +
                  availableUTMParams
                    .map((key) => `${key}=${queries[key]}`)
                    .join("&")
                : fromPreviewNotLoggedIn;
          }

          sessionStorage.removeItem("previewURL");

          window.location.href = targetURL;

          // router.replace("/home");
        }

        dispatch(verifyOTPResponseFailure());

        setTimeout(() => {
          closeBottomSheet();
          if (router?.route === "/more/profile-edit") {
            stopLoading();
          }
          closeToastMessage();
        }, 2500);
      }
    }
  }, [verifyOTPResponse]);

  if (showOTPVerifyScreen) {
    return (
      <div className="w-full px-5 pt-8">
        <div
          className="inline-flex items-center space-x-2 text-pwip-black-600 text-sm mb-12"
          onClick={() => {
            setShowOTPVerifyScreen(false);
            setOtp("");
            dispatch(verifyOTPResponseFailure());
            dispatch(otpRecievedFailure());
          }}
        >
          {arrowLeftBackIcon}
          <span>Back</span>
        </div>
        <div className="inline-flex flex-col space-y-2">
          <span className="text-left font-semibold text-md text-pwip-black-600">
            Hi, {userDetails?.first_name || userDetails?.email}
          </span>
          <span className="text-left text-sm text-pwip-gray-900">
            We have just sent OTP to your WhatsApp number{" "}
            <span className="text-pwip-v2-primary-700">
              +{verifyOTPDetails?.country_code} {verifyOTPDetails?.phone}
            </span>
          </span>
        </div>
        <div className="w-full mt-6">
          <OtpInput
            value={otp}
            onChange={setOtp}
            numInputs={6}
            containerStyle={`w-full !inline-flex justify-between`}
            renderSeparator=""
            renderInput={(props) => (
              <input {...props} pattern="[0-9]*" inputMode="numeric" />
            )}
            inputType="number"
            inputStyle={`block min-w-12 h-12 p-2 text-sm text-gray-900 border border-[#e3ebf0] rounded-md`}
          />
        </div>

        <ResendButton verifyOTPDetails={verifyOTPDetails} />

        <div className="relative w-full bg-white mt-8">
          <Button
            type="primary"
            buttonType="submit"
            label="Verify"
            onClick={async () => {
              if (otp) {
                await dispatch(
                  verifyOTPResponseRequest({
                    otp: otp,
                    messageId: verifyOTPDetails?.messageId,
                  })
                );
              }
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ProfileDetailForm
        token={token}
        fields={fields}
        fieldHeading={{
          heading: fieldHeading,
        }}
        professionOptions={[]}
        userObject={{ userData: userDetails }}
        profileObject={{}}
        isStandalone={true}
        phoneForOTP={userDetails?.phone || ""}
        overwriteHandleFormSubmit={async (payload) => {
          if (payload?.phone) {
            setVerifyOTPDetails({
              ...payload,
            });
            startLoading();
            if (
              router.route !== "/more/profile-edit" &&
              userDetails?.phone !== payload?.phone
            ) {
              await dispatch(updateUserRequest(payload));
            }

            await dispatch(
              sendOTPRequest(payload?.phone, payload?.country_code)
            );
          }
        }}
      />
    </React.Fragment>
  );
};

export default PhoneVerificationWithOTP;
