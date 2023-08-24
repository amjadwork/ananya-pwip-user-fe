import axios from "axios";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { setAuthData } from "@/redux/actions/auth.actions";

export function inrToUsd(inrAmount, exchangeRate) {
  return (inrAmount / exchangeRate).toFixed(2);
}

export let api = axios.create({
  baseURL: "https://api-stage.pwip.co/api", // Replace with your API base URL
  timeout: 5000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Unauthorized error (e.g., invalid token)
      const dispatch = useDispatch();
      dispatch(setAuthData(null, null)); // Assuming you have a logout action to clear user state

      const router = useRouter();
      router.push("/"); // Redirect to login page
    }
    return Promise.reject(error);
  }
);
