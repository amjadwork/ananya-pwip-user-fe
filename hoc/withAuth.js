import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { handleSettingAuthDataRequest } from "redux/actions/auth.actions";

const withAuth = (WrappedComponent) => {
  return function WithAuth(props) {
    const router = useRouter();
    const dispatch = useDispatch();
    const { data: session, status } = useSession();

    const authToken = useSelector((state) => state.auth.token);

    // const checkUserSubscriptionDetails = async (token) => {
    //   try {
    //     const response = await axios.get(
    //       apiBaseURL + "api" + "/user-subscription", //+ userDetails.user._id,
    //       {
    //         headers: {
    //           Authorization: `Bearer ${token}`,
    //         },
    //       }
    //     );
    //     console.log("here response", response);
    //   } catch (err) {
    //     console.log("here err", err);
    //   }
    // };

    // useEffect(() => {
    //   if (authToken && status === "authenticated") {
    //     checkUserSubscriptionDetails(authToken);
    //   }
    // }, [authToken, status]);

    useEffect(() => {
      if (status === "authenticated" && !authToken) {
        dispatch(
          handleSettingAuthDataRequest(session.user, session.accessToken)
        );
      }
    }, [status, authToken]);

    if (status === "loading") {
      return (
        <div className="w-screen h-screen inline-flex flex-col items-center justify-center text-white bg-pwip-primary">
          <span className="text-sm font-sans">Loading...</span>
        </div>
      );
    }

    if (!session) {
      router.replace("/");
      return null;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
