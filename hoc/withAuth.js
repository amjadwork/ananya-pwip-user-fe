import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { handleSettingAuthDataRequest } from "redux/actions/auth.actions";

const withAuth = (WrappedComponent) => {
  return function WithAuth(props) {
    const router = useRouter();
    const dispatch = useDispatch();
    const { data: session, status } = useSession();

    useEffect(() => {
      if (status === "authenticated") {
        dispatch(handleSettingAuthDataRequest(session.user, session.accessToken));
      }
    }, [status]);

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
