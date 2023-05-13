import "@/styles/globals.css";
import { ApolloProvider } from "@apollo/client";
import "semantic-ui-css/semantic.min.css";
import type { AppProps } from "next/app";
import ApolloClient from "@/lib/apollo";
import { SessionProvider } from "next-auth/react";
import localFont from "next/font/local";

const ProductSans = localFont({ src: "../../public/ProductSans.ttf", variable: "--font-product" });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <ApolloProvider client={ApolloClient}>
        <div className={ProductSans.className + " transition-colors duration-500"}>
          <div id="container">
          <Component {...pageProps} />
</div>
        </div>
      </ApolloProvider>
    </SessionProvider>
  );
}
