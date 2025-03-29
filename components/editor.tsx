import React, { useRef, useState } from "react"
import { Block, Message } from "slack-blocks-to-jsx"
import CodeEditor, { Monaco } from "@monaco-editor/react"
import { ErrorBoundary } from "./error_boundary"
import packageJson from "../package.json"
import { images } from "@/images"
import Image from "next/image"
const version = packageJson.dependencies["slack-blocks-to-jsx"]

const example: Block[] = [
	{
		"type": "rich_text",
		"elements": [
			{
				"type": "rich_text_section",
				"elements": [
					{
						"type": "text",
						"text": "This is my friend ",
						style: {
							bold: true,
							code: true,
							italic: true,
							strike: true,
						},
					},
					{
						"type": "user",
						"user_id": "U2TEST",
						style: {
							"bold": true,
							"italic": true,
							"strike": true,
						},
					},
					{
						"type": "text",
						"text": ".",
					},
				],
			},
		],
	},
	{
		"type": "rich_text",
		"block_id": "9xF+h2kh21",
		"elements": [
			{
				"type": "rich_text_section",
				"elements": [
					{
						"type": "text",
						"text": "This is a rich text section with regular text. ",
					},
					{
						"type": "text",
						"text": "This is bold",
						"style": {
							"bold": true,
						},
					},
					{
						"type": "text",
						"text": ". ",
					},
					{
						"type": "text",
						"text": "This is italics.",
						"style": {
							"italic": true,
						},
					},
					{
						"type": "text",
						"text": " ",
						"style": {
							"bold": true,
							"italic": true,
						},
					},
					{
						"type": "text",
						"text": "This is strikethrough.",
						"style": {
							"strike": true,
						},
					},
					{
						"type": "text",
						"text": " ",
					},
					{
						"type": "text",
						"text": "This is code.",
						"style": {
							"code": true,
						},
					},
					{
						"type": "text",
						"text": "\n\n",
					},
				],
			},
			{
				"type": "rich_text_list",
				"elements": [
					{
						"type": "rich_text_section",
						"elements": [
							{
								"type": "text",
								"text": "This is an",
							},
						],
					},
					{
						"type": "rich_text_section",
						"elements": [
							{
								"type": "text",
								"text": "ordered",
							},
						],
					},
					{
						"type": "rich_text_section",
						"elements": [
							{
								"type": "text",
								"text": "list",
							},
						],
					},
				],
				"style": "ordered",
				"indent": 0,
				"border": 0,
			},
			{
				"type": "rich_text_section",
				"elements": [
					{
						"type": "text",
						"text": "\n",
					},
				],
			},
			{
				"type": "rich_text_list",
				"elements": [
					{
						"type": "rich_text_section",
						"elements": [
							{
								"type": "text",
								"text": "This is an",
							},
						],
					},
					{
						"type": "rich_text_section",
						"elements": [
							{
								"type": "text",
								"text": "unordered",
							},
						],
					},
					{
						"type": "rich_text_section",
						"elements": [
							{
								"type": "text",
								"text": "list",
							},
						],
					},
				],
				"style": "bullet",
				"indent": 8,
				"border": 1,
			},
			{
				"type": "rich_text_section",
				"elements": [
					{
						"type": "text",
						"text": "\n",
					},
				],
			},
			{
				"type": "rich_text_quote",
				"elements": [
					{
						"type": "text",
						"text": "This is a \ntext quote",
					},
				],
			},
			{
				"type": "rich_text_section",
				"elements": [
					{
						"type": "text",
						"text": "\n",
					},
				],
			},
			{
				"type": "rich_text_preformatted",
				"elements": [
					{
						"type": "text",
						"text": "This is a\nmulti-line \ncode block",
					},
				],
				"border": 1,
			},
			{
				"type": "rich_text_section",
				"elements": [
					{
						"type": "text",
						"text": "\nThis is a ",
					},
					{
						"type": "link",
						"url": "https://www.google.com/",
						"text": "link",
					},
					{
						"type": "text",
						"text": " to google.\n\n",
					},
				],
			},
			{
				"type": "rich_text_list",
				"elements": [
					{
						"type": "rich_text_section",
						"elements": [
							{
								"type": "text",
								"text":
									"We should also support nested styling like this bolded text",
								"style": {
									"bold": true,
								},
							},
						],
					},
					{
						"type": "rich_text_section",
						"elements": [
							{
								"type": "text",
								"text": "in an unordered list",
								"style": {
									"bold": true,
								},
							},
						],
					},
					{
						"type": "rich_text_section",
						"elements": [
							{
								"type": "text",
								"text": "on a text quote.",
								"style": {
									"bold": true,
								},
							},
						],
					},
				],
				"style": "bullet",
				"indent": 0,
				"border": 1,
			},
			{
				"type": "rich_text_section",
				"elements": [
					{
						"type": "text",
						"text": "Or this ",
					},
					{
						"type": "text",
						"text": "bolded",
						"style": {
							"bold": true,
							"code": true,
						},
					},
					{
						"type": "text",
						"text": " code",
						"style": {
							"code": true,
						},
					},
					{
						"type": "text",
						"text": ".\n\n\n\nAnd preserve whitespace/newlines?",
					},
				],
			},
		],
	},
	{
		"type": "rich_text",
		"block_id": "9xF+h",
		"elements": [
			{
				"type": "rich_text_section",
				"elements": [
					{
						"type": "emoji",
						"name": "couple_with_heart",
						skin_tone: 2,
						unicode: "1f9d1-1f3fc-200d-2764-fe0f-200d-1f9d1-1f3fe",
					},
					{
						"type": "emoji",
						"name": "+1",
					},
					{
						"type": "emoji",
						"name": "thumbsup",
					},
					{
						"type": "user",
						"user_id": "U3TEST",
						style: {
							bold: true,
							italic: true,
							strike: true,
						},
					},
					{
						"type": "text",
						"text": " hello man ",
					},
					{
						"type": "link",
						"url": "http://hi.com",
						"text": "hello world",
					},
					{
						"type": "text",
						"text": " ",
					},
					{
						"type": "link",
						"url": "http://hi.com",
						"text": "hi.com",
					},
					{
						"type": "text",
						"text": " ",
					},
					{
						"type": "broadcast",
						"range": "here",
					},
					{
						"type": "text",
						"text": " hi everyone ",
					},
					{
						"type": "broadcast",
						"range": "channel",
					},
					{
						"type": "text",
						"text": " hello everyone ",
					},
					{
						"type": "broadcast",
						"range": "everyone",
					},
					{
						"type": "text",
						"text": " hejj",
					},
					{
						"type": "text",
						"text": "This is a rich text section with regular text. ",
					},
					{
						"type": "text",
						"text": "This is bold",
						"style": {
							"bold": true,
						},
					},
					{
						"type": "text",
						"text": ". ",
					},
					{
						"type": "text",
						"text": "This is italics.",
						"style": {
							"italic": true,
						},
					},
					{
						"type": "text",
						"text": " ",
						"style": {
							"bold": true,
							"italic": true,
						},
					},
					{
						"type": "text",
						"text": "This is strikethrough.",
						"style": {
							"strike": true,
						},
					},
					{
						"type": "text",
						"text": " ",
					},
					{
						"type": "text",
						"text": "This is code.",
						"style": {
							"code": true,
						},
					},
				],
			},
		],
	},
	{
		type: "section",
		text: {
			type: "mrkdwn",
			text: "Hellow world\nhello world\n\nhellow orld <@U1TEST> and <@U2TEST> have been recognized for *:busts_in_silhouette: Collaborates Radically* by <@U3TEST> on <#C1TEST> and <!subteam^SAZ94GDB8> and <#general> @here @everyone @channel @hello _this is italic_ and _~this is strikethrough~_\nThis is a like break, ~another strikethrough~ and this is is `inline **code**` okay cool ```This is a code block\nAnd it's multi-line``` now here is the list \n- Detective Chimp\n- Bouncing Boy \n\n\n- Aqualad hello dot. \n<http://www.example.com|This message *is* a link> Hello _*<!date^1392734382^Posted {date_short} {time_secs}^https://youtube.com|Posted 2014-02-18 6:39:42 AM PST>*_ hello :heart: :ok_hand::skin-tone-2:",
		},
	},
]

export const Editor = () => {
	const [blocks, setBlocks] = useState<Block[]>(example)
	const [code, setCode] = useState(JSON.stringify(blocks, null, 2))
	const editorRef = useRef(null)

	function handleEditorDidMount(editor: any, monaco: Monaco) {
		if (editorRef.current) {
			editorRef.current = editor
		}
	}

	return (
		<div className="w-full">
			<div className="p-6 sm:p-8 flex flex-col gap-6 w-full">
				<header className="lg:h-16 shrink-0 bg-white rounded-xl w-full flex flex-col lg:flex-row lg:items-center justify-between px-4 py-4 border border-black gap-2">
					<div className="flex items-center gap-2">
						<div className="flex flex-col gap-2">
							<p className="text-lg leading-none flex gap-2 flex-wrap items-center">
								<span className="font-medium">Slack Blocks to JSX</span>

								<a
									href={`https://github.com/themashcodee/slack-blocks-to-jsx/releases/tag/v${version}`}
									target="_blank"
									rel="noreferrer"
									className="text-xs bg-[#F9C603] px-2 py-[1.5px] rounded"
								>
									v{version}
								</a>
							</p>

							<p className="text-gray-500 text-xs leading-none">
								A playground for rendering Slack blocks in React with custom
								branding.
							</p>
						</div>
					</div>

					<div className="flex items-center gap-2 lg:gap-6">
						<a
							href="https://www.npmjs.com/package/slack-blocks-to-jsx"
							target="_blank"
							rel="noreferrer"
							className="flex items-center justify-center"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 512 512"
								className="w-12"
							>
								<rect width="512" height="512" fill="#fff" rx="15%"></rect>
								<path
									fill="none"
									stroke="#cb3837"
									strokeWidth="22"
									d="M166 333h90m146-101v68m-45-68v68m-112-68v45m-11 34h213V199H65v112h113V210m-45 22v68m157-90v90"
								></path>
							</svg>
						</a>

						<a
							href="https://github.com/themashcodee/slack-blocks-to-jsx"
							target="_blank"
							rel="noreferrer"
							className="flex items-center justify-center"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 98 96"
								className="w-8"
							>
								<path
									fill="#24292f"
									fillRule="evenodd"
									d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0112.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
									clipRule="evenodd"
								></path>
							</svg>
						</a>
					</div>
				</header>

				<div className="w-full max-h-max grid lg:grid-cols-7 grid-cols-1 gap-6">
					<div className="lg:col-span-3 w-full">
						<div className="bg-white rounded-xl p-4 border border-black w-full h-full">
							<ErrorBoundary
								fallback={
									<div className="w-full h-full flex items-center justify-center p-6">
										<p>
											Uh-oh, your blocks JSON might be playing tricks on us.
											I&apos;m all out of validation skills today—how about a
											quick peek on the{" "}
											<a
												target="_blank"
												rel="noreferrer"
												className="text-blue-600"
												href={`https://app.slack.com/block-kit-builder#${JSON.stringify(
													{ blocks }
												)}`}
											>
												Slack Blocks Builder website
											</a>{" "}
											to sort it out?
										</p>
									</div>
								}
							>
								<Message
									logo="https://static-00.iconduck.com/assets.00/slack-icon-2048x2048-5nfqoyso.png"
									name="Acme Bot"
									time={new Date()}
									showBlockKitDebug
									blocks={blocks}
									data={{
										user_groups: [
											{
												id: "SAZ94GDB8",
												name: "My User Group",
											},
										],
										channels: [
											{
												id: "C1TEST",
												name: "general",
											},
											{
												id: "C2TEST",
												name: "leadership-feedback",
											},
										],
										users: [
											{
												id: "U1TEST",
												name: "Amanda",
											},
											{
												id: "U2TEST",
												name: "Harry",
											},
											{
												id: "U3TEST",
												name: "John",
											},
											{
												id: "U4TEST",
												name: "Mash Codee",
											},
											{
												id: "U5TEST",
												name: "Jake",
											},
										],
									}}
									hooks={{
										user(data) {
											return (
												<button
													style={{
														background: "#187C58",
														backgroundImage:
															"linear-gradient(135deg, #187C58, #40C28C)",
														color: "white",
													}}
													onClick={() => {
														alert("Guess what, we support custom wrappers")
													}}
												>
													@{data.name} (user custom wrapper)
												</button>
											)
										},
										// emoji: (data, parse) => {
										// 	if (data.name === "heart") {
										// 		return (
										// 			<span className="font-medium">
										// 				I REPLACED HEART EMOJI
										// 			</span>
										// 		)
										// 	}

										// 	return parse(data)
										// },
									}}
								/>
							</ErrorBoundary>
						</div>
					</div>

					<div className="lg:col-span-4 w-full h-full flex flex-col gap-6">
						<div className="h-[600px] shrink-0 overflow-hidden">
							<div className="w-full rounded-xl bg-white border border-black h-full p-4">
								<div className="w-full rounded-lg overflow-hidden h-full">
									<CodeEditor
										height="100%"
										defaultLanguage="json"
										language="json"
										defaultValue={code}
										value={code}
										theme="vs-dark"
										onChange={(value) => {
											if (value) {
												try {
													const parsed = JSON.parse(value.trim())
													if (Array.isArray(parsed)) {
														setBlocks(parsed)
														setCode(value)
													} else if (
														parsed &&
														typeof parsed === "object" &&
														"blocks" in parsed
													) {
														setBlocks(parsed.blocks)
														setCode(JSON.stringify(parsed.blocks, null, 2))
													} else {
														setCode(value)
													}
												} catch (error) {
													setCode(value)
												}
											}
										}}
										onMount={handleEditorDidMount}
										options={{
											minimap: { enabled: false },
											scrollBeyondLastLine: false, // This prevents extra space after the last line
										}}
									/>
								</div>
							</div>
						</div>

						<div className="w-full rounded-xl bg-white border border-black p-6 flex flex-row items-center justify-between gap-6">
							<div className="flex flex-col items-start text-left">
								<h3 className="text-xl font-medium mb-2">
									Keep the Energy Alive with Coffee & Love 💕☕️
								</h3>
								<p className="mb-2 text-gray-500">
									Your kindness keeps this project alive and vibrant. Every
									coffee you buy keeps the ideas flowing, and me smiling. Donate
									now!
								</p>
								<a
									href="https://www.buymeacoffee.com/themashcodee"
									target="_blank"
									rel="noopener noreferrer"
									className="mt-2 px-4 py-2 bg-yellow-400 text-black rounded-lg text-sm hover:bg-yellow-500 transition-colors"
								>
									Treat me to a coffee! ❤️
								</a>
							</div>

							<div className="hidden flex-col items-center gap-2 shrink-0 sm:flex">
								<a
									href="https://www.buymeacoffee.com/themashcodee"
									target="_blank"
									rel="noopener noreferrer"
								>
									<Image
										width={80}
										height={80}
										src={images.buymeacoffee_qr}
										alt="Buy me a coffee QR code"
									/>
								</a>
								<p className="text-sm text-gray-600 text-center">
									Scan the QR
									<br /> code to donate
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
