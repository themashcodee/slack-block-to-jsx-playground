import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta
          name="description"
          content="Interactive playground for rendering Slack blocks in React with custom branding. Test and preview Slack Block Kit components."
        />

        {/* Open Graph tags for social sharing */}
        <meta
          property="og:title"
          content="Slack Blocks to JSX - Online Playground"
        />
        <meta
          property="og:description"
          content="Interactive playground for rendering Slack blocks in React with custom branding"
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://slack-block-to-jsx-playground.vercel.app/"
        />

        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Slack Blocks to JSX - Online Playground"
        />
        <meta
          name="twitter:description"
          content="Interactive playground for rendering Slack blocks in React"
        />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
