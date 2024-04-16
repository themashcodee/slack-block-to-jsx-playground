import { Editor } from "@/components"
import { Outfit } from "next/font/google"

const font = Outfit({ subsets: ["latin"] })

export default function Home() {
	return (
		<main className={`h-screen overflow-hidden ${font.className}`}>
			<Editor />
		</main>
	)
}
