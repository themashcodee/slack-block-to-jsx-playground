import React, { useRef, useState } from "react"
import { Block, Message } from "slack-blocks-to-jsx"
import CodeEditor, { Monaco } from "@monaco-editor/react"
import { ErrorBoundary } from "./error_boundary"

const example1: Block[] = [
	{
		"type": "section",
		"text": {
			"type": "mrkdwn",
			"text":
				"Hello, Assistant to the Regional Manager Dwight! *Michael Scott* wants to know where you'd like to take the Paper Company investors to dinner tonight.\n\n *Please select a restaurant:*",
		},
	},
	{
		"type": "divider",
	},
	{
		"type": "section",
		"text": {
			"type": "mrkdwn",
			"text":
				"*Farmhouse Thai Cuisine*\n:star::star::star::star: 1528 reviews\n They do have some vegan options, like the roti and curry, plus they have a ton of salad stuff and noodles can be ordered without meat!! They have something for everyone here",
		},
		"accessory": {
			"type": "image",
			"image_url":
				"https://s3-media3.fl.yelpcdn.com/bphoto/c7ed05m9lC2EmA3Aruue7A/o.jpg",
			"alt_text": "alt text for image",
		},
	},
	{
		"type": "section",
		"text": {
			"type": "mrkdwn",
			"text":
				"*Kin Khao*\n:star::star::star::star: 1638 reviews\n The sticky rice also goes wonderfully with the caramelized pork belly, which is absolutely melt-in-your-mouth and so soft.",
		},
		"accessory": {
			"type": "image",
			"image_url":
				"https://s3-media2.fl.yelpcdn.com/bphoto/korel-1YjNtFtJlMTaC26A/o.jpg",
			"alt_text": "alt text for image",
		},
	},
	{
		"type": "section",
		"text": {
			"type": "mrkdwn",
			"text":
				"*Ler Ros*\n:star::star::star::star: 2082 reviews\n I would really recommend the  Yum Koh Moo Yang - Spicy lime dressing and roasted quick marinated pork shoulder, basil leaves, chili & rice powder.",
		},
		"accessory": {
			"type": "image",
			"image_url":
				"https://s3-media2.fl.yelpcdn.com/bphoto/DawwNigKJ2ckPeDeDM7jAg/o.jpg",
			"alt_text": "alt text for image",
		},
	},
	{
		"type": "divider",
	},
	{
		"type": "actions",
		"elements": [
			{
				"type": "button",
				"text": {
					"type": "plain_text",
					"text": "Farmhouse",
					"emoji": true,
				},
				"value": "click_me_123",
			},
			{
				"type": "button",
				"text": {
					"type": "plain_text",
					"text": "Kin Khao",
					"emoji": true,
				},
				"value": "click_me_123",
				"url": "https://google.com",
			},
			{
				"type": "button",
				"text": {
					"type": "plain_text",
					"text": "Ler Ros",
					"emoji": true,
				},
				"value": "click_me_123",
				"url": "https://google.com",
			},
		],
	},
]

export const Editor = () => {
	const [blocks, setBlocks] = useState<Block[]>(example1)
	const [code, setCode] = useState(JSON.stringify(blocks, null, 2))
	const editorRef = useRef(null)

	function handleEditorDidMount(editor: any, monaco: Monaco) {
		if (editorRef.current) {
			editorRef.current = editor
		}
	}

	return (
		<div className="w-full h-screen overflow-auto bg-[#eef2f5] gap-4">
			<div className="p-6 flex flex-col gap-4 h-full w-full">
				<header className="lg:h-16 shrink-0 bg-white rounded-xl w-full flex flex-col lg:flex-row items-center justify-between px-4 py-4">
					<div className="flex items-center gap-2">
						<p className="text-2xl">🧪</p>

						<div className="flex flex-col">
							<p className="text-lg font-medium">
								Slack Blocks to JSX NPM Library Playground
							</p>
							<p className="text-gray-500 text-xs">
								Render Slack blocks in React with ease with your own logo, name,
								and time.
							</p>
						</div>
					</div>

					<div className="flex items-center gap-6">
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

				<div className="w-full h-full grid lg:grid-cols-7 grid-cols-1 gap-6">
					<div className="lg:col-span-3 h-full w-full">
						<div className="bg-white rounded-xl p-4 shadow-sm border w-full h-full">
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
								/>
							</ErrorBoundary>
						</div>
					</div>

					<div className="lg:col-span-4 h-full w-full">
						<div className="w-full h-full rounded-xl bg-white border shadow-sm p-4">
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
											setCode(value)
											try {
												const parsed = JSON.parse(value)
												setBlocks(parsed)
											} catch (error) {
												console.error(error)
											}
										}
									}}
									onMount={handleEditorDidMount}
									options={{
										minimap: { enabled: false },
									}}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
