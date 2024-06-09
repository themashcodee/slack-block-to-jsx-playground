import { Editor } from "@/components"
import { Outfit } from "next/font/google"

const font = Outfit({ subsets: ["latin"] })

export default function Home() {
	return (
		<main
			className={`overflow-auto min-h-screen p-6 bg-[#eef2f5] ${font.className}`}
		>
			<Editor />
		</main>
	)
}
