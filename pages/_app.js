import "../styles/globals.css";
import { OverlayProvider } from "@/context/OverlayContext";

function MyPWIPApp({ Component, pageProps }) {
  return (
    <OverlayProvider>
      <Component {...pageProps} />
    </OverlayProvider>
  );
}

export default MyPWIPApp;
