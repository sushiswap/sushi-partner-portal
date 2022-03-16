import "../styles/globals.css";
import "tui-image-editor/dist/tui-image-editor.min.css";
import "app/components/ImageEditor/style.css";

import Portals from "app/components/Portals";
import store from "app/state";
import Layout from "components/Layout";
import type { AppProps } from "next/app";
import { Provider as ReduxProvider } from "react-redux";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ReduxProvider store={store}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <Portals />
    </ReduxProvider>
  );
}

export default MyApp;
