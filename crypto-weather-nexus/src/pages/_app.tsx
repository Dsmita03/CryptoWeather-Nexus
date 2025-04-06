import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { store } from "../store/store";
import { Toaster } from "sonner"; // Add this line

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Toaster position="top-right" richColors /> {/* Toast container */}
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
