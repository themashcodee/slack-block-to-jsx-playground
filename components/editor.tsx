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
		<div className="w-full h-screen overflow-auto bg-[#eef2f5]">
			<div className="p-6 w-full h-full grid lg:grid-cols-7 grid-cols-1 gap-6">
				<div className="p-6 lg:col-span-3 h-full w-full">
					<div className="bg-white rounded-xl p-4 shadow-sm border w-full h-full">
						<ErrorBoundary
							fallback={
								<div className="w-full h-full flex items-center justify-center p-6">
									<p>
										Oops, you might have done a mistake in the blocks json and
										sorry I am very lazy person I did not add a validation check
										so please go the{" "}
										<a
											target="_blank"
											rel="noreferrer"
											className="text-blue-600"
											href={`https://app.slack.com/block-kit-builder#${JSON.stringify(
												{ blocks }
											)}`}
										>
											slack blocks builder
										</a>{" "}
										websie to see where exactly you are doing wrong.
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

				<div className="lg:col-span-4 p-6 h-full w-full">
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
	)
}
