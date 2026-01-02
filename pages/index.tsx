import { Editor } from "@/components";
import { Outfit } from "next/font/google";
import Head from "next/head";

const font = Outfit({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Head>
        <title>Slack Blocks to JSX - Online Playground</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main
        className={`overflow-auto min-h-screen bg-[#F6F4F1] ${font.className}`}
      >
        <div className="w-full py-1 px-2 bg-gradient-to-r from-red-500 to-orange-500 text-white">
          <p className="text-center text-sm">
            Craft perfect Slack and Teams messages in seconds with ready-made
            templates!{" "}
            <a
              href="https://temlist.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Visit Temlist
            </a>
          </p>
        </div>

        <Editor />
      </main>
    </>
  );
}
