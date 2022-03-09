import "./_app/globals.css";
import type { AppProps } from "next/app";
import Layout from "components/Layout";
import store from "app/state";
import { Provider as ReduxProvider } from "react-redux";
import Portals from "app/components/Portals";

import "tui-image-editor/dist/tui-image-editor.min.css";
import "app/components/ImageEditor/style.css";

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
