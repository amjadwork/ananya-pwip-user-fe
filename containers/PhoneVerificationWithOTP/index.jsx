import React, { useEffect, useState } from "react";
import OtpInput from "react-otp-input";
import { useOverlayContext } from "@/context/OverlayContext";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";

import ProfileDetailForm from "@/components/ProfileDetailForm";
import { Button } from "@/components/Button";

import {
  // fetchUserFailure,
  updateUserRequest,
  // fetchUserRequest,
  // updateUserFailure,
} from "@/redux/actions/userEdit.actions";

const PhoneVerificationWithOTP = ({
  token,
  fields,
  fieldHeading,
  userDetails,
}) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const {
    openBottomSheet,
    closeBottomSheet,
    startLoading,
    stopLoading,
    isLoading,
  } = useOverlayContext();

  const [showOTPVerifyScreen, setShowOTPVerifyScreen] = useState(false);
  const [verifyOTPDetails, setVerifyOTPDetails] = useState(null);
  const [otp, setOtp] = useState("");

  if (showOTPVerifyScreen) {
    return (
      <div className="w-full px-5 pt-8">
        <div className="inline-flex flex-col space-y-2">
          <span className="text-left font-semibold text-md text-pwip-black-600">
            Hi, {userDetails?.first_name || userDetails?.email}
          </span>
          <span className="text-left text-sm text-pwip-gray-900">
            We have just sent OTP to your WhatsApp number{" "}
            <span className="text-pwip-v2-primary-700">
              +91 {verifyOTPDetails?.phone}
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
            renderInput={(props) => <input {...props} />}
            inputStyle={`block min-w-12 h-12 p-2 text-sm text-gray-900 border border-[#e3ebf0] rounded-md`}
          />
        </div>
        <div className="inline-flex items-center text-sm space-x-2 w-full mt-3">
          <span className="text-left text-pwip-gray-800">
            Didn't recieve the code?{" "}
          </span>
          <button className="">
            <span className="text-pwip-v2-primary-700">Resend it</span>
          </button>
        </div>

        <div className="absolute left-0 bottom-0 w-full bg-white px-4 pb-8">
          <Button
            type="primary"
            buttonType="submit"
            label="Verify"
            // disabled={
            //   Object.keys(errors).length || isSubmitting ? false : true
            // }
            onClick={() => {
              //   requestAction = await dispatch(updateUserRequest(payload));
              closeBottomSheet();
              router.push("/home");
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
        overwriteHandleFormSubmit={async (payload) => {
          if (payload?.phone) {
            setVerifyOTPDetails({
              ...payload,
            });
            setShowOTPVerifyScreen(true);
          }
        }}
      />
    </React.Fragment>
  );
};

export default PhoneVerificationWithOTP;
