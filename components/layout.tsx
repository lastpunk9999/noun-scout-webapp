import Navbar from "./navbar";
import Footer from "./footer";
import MatchBanner from "./MatchBanner";
import { useRouter } from "next/router";
import FocusedNav from "./FocusedNav";
import Head from "next/head";
import { siteTitle, siteDescription, siteUrl } from "../config";
import { NextSeo } from "next-seo";

export default function Layout({ children }) {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>{siteTitle}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NextSeo
        title={siteTitle}
        description={siteDescription}
        openGraph={{
          title: siteTitle,
          description: siteDescription,
          url: siteUrl,
          site_name: siteTitle,
        }}
        twitter={{
          cardType: "summary_large_image",
          site: siteUrl,
        }}
      />

      <div className="font-sans relative z-10">
        {router.pathname === "/add" ? (
          <>
            <FocusedNav />
          </>
        ) : (
          <>
            <MatchBanner />
            <Navbar />
          </>
        )}
        <main>{children}</main>
        <Footer />
      </div>
      <div className="bg" />
    </>
  );
}
