import { Editor } from "@/components"
import { Outfit } from "next/font/google"

const font = Outfit({ subsets: ["latin"] })

export default function Home() {
	return (
		<main
			className={`overflow-auto min-h-screen bg-[#F6F4F1] ${font.className}`}
		>
			<Editor />
		</main>
	)
}
