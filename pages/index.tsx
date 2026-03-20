import { Editor } from "@/components"
import { Outfit } from "next/font/google"
import Head from "next/head"

const font = Outfit({
	subsets: ["latin"],
	variable: "--font-outfit",
})

export default function Home() {
	return (
		<>
			<Head>
				<title>Slack Blocks to JSX - Online Playground</title>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			</Head>
			<main className={`overflow-auto ds-page-bg ${font.className}`}>
				<Editor />
			</main>
		</>
	)
}
