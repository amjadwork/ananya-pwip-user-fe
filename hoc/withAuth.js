import React, { useLayoutEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import {
  handleSettingAuthDataRequest,
  handleSettingAuthDataSuccess,
} from "redux/actions/auth.actions";
import { fetchProfileRequest } from "@/redux/actions/profileEdit.actions";
import { fetchUserRequest } from "@/redux/actions/userEdit.actions";

const withAuth = (WrappedComponent) => {
  return function WithAuth(props) {
    const router = useRouter();
    const dispatch = useDispatch();
    const { data: session, status } = useSession();

    const profileObject = useSelector((state) => state.profile);
    const userObject = useSelector((state) => state.user);
    const authToken = useSelector((state) => state.auth.token);
    const authUser = useSelector((state) => state.auth.user);

    // useLayoutEffect(() => {
    //   if (status === "authenticated" && !authToken) {
    //     dispatch(
    //       handleSettingAuthDataRequest(session.user, session.accessToken)
    //     );
    //   }
    // }, [status, authToken]);

    // async function getUserProfileDetails() {
    //   await dispatch(fetchUserRequest());
    //   await dispatch(fetchProfileRequest());
    // }

    // useLayoutEffect(() => {
    //   if (authUser && !profileObject?.profileData && !userObject?.userData) {
    //     if (authUser?.apiMessage) {
    //       getUserProfileDetails();
    //     }
    //   }
    // }, [authUser, fetchProfileRequest, fetchUserRequest]);

    // useLayoutEffect(() => {
    //   if (profileObject?.profileData && userObject?.userData && authToken) {
    //     const userPayload = {
    //       ...authUser,
    //       ...profileObject?.profileData,
    //       ...userObject?.userData,
    //     };
    //     dispatch(handleSettingAuthDataSuccess(userPayload, authToken));
    //   }
    // }, [authToken, profileObject?.profileData, userObject?.userData]);

    if (status === "loading" && !authToken) {
      return (
        <div className="w-screen h-screen inline-flex flex-col items-center justify-center text-pwip-primary bg-white">
          <span className="text-sm font-sans">Loading...</span>
        </div>
      );
    }

    if (!authToken && !session) {
      router.replace("/");
      return null;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
