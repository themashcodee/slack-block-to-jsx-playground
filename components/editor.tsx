import React, { useRef, useState, useEffect } from "react"
import { Block, Message } from "slack-blocks-to-jsx"
import CodeEditor, { Monaco } from "@monaco-editor/react"
import { ErrorBoundary } from "./error_boundary"
import { ConfigEditor } from "./config_editor"
import packageJson from "../package.json"
import { images } from "@/images"
import Image from "next/image"
import { MessageConfig } from "@/types/config"
import {
	defaultConfig,
	loadConfig,
	saveConfig,
	loadBlocks,
	saveBlocks,
} from "@/utils/config"
const version = packageJson.dependencies["slack-blocks-to-jsx"].replace("^", "")

const example: Block[] = [
	{
		type: "rich_text",
		elements: [
			{
				type: "rich_text_section",
				elements: [
					{
						type: "text",
						text: "This is my friend ",
						style: {
							bold: true,
							code: true,
							italic: true,
							strike: true,
						},
					},
					{
						type: "user",
						user_id: "U2TEST",
						style: {
							bold: true,
							italic: true,
							strike: true,
						},
					},
					{
						type: "text",
						text: ".",
					},
				],
			},
		],
	},
	{
		type: "rich_text",
		block_id: "9xF+h2kh21",
		elements: [
			{
				type: "rich_text_section",
				elements: [
					{
						type: "text",
						text: "This is a rich text section with regular text. ",
					},
					{
						type: "text",
						text: "This is bold",
						style: {
							bold: true,
						},
					},
					{
						type: "text",
						text: ". ",
					},
					{
						type: "text",
						text: "This is italics.",
						style: {
							italic: true,
						},
					},
					{
						type: "text",
						text: " ",
						style: {
							bold: true,
							italic: true,
						},
					},
					{
						type: "text",
						text: "This is strikethrough.",
						style: {
							strike: true,
						},
					},
					{
						type: "text",
						text: " ",
					},
					{
						type: "text",
						text: "This is code.",
						style: {
							code: true,
						},
					},
					{
						type: "text",
						text: "\n\n",
					},
				],
			},
			{
				type: "rich_text_list",
				elements: [
					{
						type: "rich_text_section",
						elements: [
							{
								type: "text",
								text: "This is an",
							},
						],
					},
					{
						type: "rich_text_section",
						elements: [
							{
								type: "text",
								text: "ordered",
							},
						],
					},
					{
						type: "rich_text_section",
						elements: [
							{
								type: "text",
								text: "list",
							},
						],
					},
				],
				style: "ordered",
				indent: 0,
				border: 0,
			},
			{
				type: "rich_text_section",
				elements: [
					{
						type: "text",
						text: "\n",
					},
				],
			},
			{
				type: "rich_text_list",
				elements: [
					{
						type: "rich_text_section",
						elements: [
							{
								type: "text",
								text: "This is an",
							},
						],
					},
					{
						type: "rich_text_section",
						elements: [
							{
								type: "text",
								text: "unordered",
							},
						],
					},
					{
						type: "rich_text_section",
						elements: [
							{
								type: "text",
								text: "list",
							},
						],
					},
				],
				style: "bullet",
				indent: 8,
				border: 1,
			},
			{
				type: "rich_text_section",
				elements: [
					{
						type: "text",
						text: "\n",
					},
				],
			},
			{
				type: "rich_text_quote",
				elements: [
					{
						type: "text",
						text: "This is a \ntext quote",
					},
				],
			},
			{
				type: "rich_text_section",
				elements: [
					{
						type: "text",
						text: "\n",
					},
				],
			},
			{
				type: "rich_text_preformatted",
				elements: [
					{
						type: "text",
						text: "This is a\nmulti-line \ncode block",
					},
				],
				border: 1,
			},
			{
				type: "rich_text_section",
				elements: [
					{
						type: "text",
						text: "\nThis is a ",
					},
					{
						type: "link",
						url: "https://www.google.com/",
						text: "link",
					},
					{
						type: "text",
						text: " to google.\n\n",
					},
				],
			},
			{
				type: "rich_text_list",
				elements: [
					{
						type: "rich_text_section",
						elements: [
							{
								type: "text",
								text: "We should also support nested styling like this bolded text",
								style: {
									bold: true,
								},
							},
						],
					},
					{
						type: "rich_text_section",
						elements: [
							{
								type: "text",
								text: "in an unordered list",
								style: {
									bold: true,
								},
							},
						],
					},
					{
						type: "rich_text_section",
						elements: [
							{
								type: "text",
								text: "on a text quote.",
								style: {
									bold: true,
								},
							},
						],
					},
				],
				style: "bullet",
				indent: 0,
				border: 1,
			},
			{
				type: "rich_text_section",
				elements: [
					{
						type: "text",
						text: "Or this ",
					},
					{
						type: "text",
						text: "bolded",
						style: {
							bold: true,
							code: true,
						},
					},
					{
						type: "text",
						text: " code",
						style: {
							code: true,
						},
					},
					{
						type: "text",
						text: ".\n\n\n\nAnd preserve whitespace/newlines?",
					},
				],
			},
		],
	},
	{
		type: "rich_text",
		block_id: "9xF+h",
		elements: [
			{
				type: "rich_text_section",
				elements: [
					{
						type: "emoji",
						name: "couple_with_heart",
						skin_tone: 2,
						unicode: "1f9d1-1f3fc-200d-2764-fe0f-200d-1f9d1-1f3fe",
					},
					{
						type: "emoji",
						name: "+1",
					},
					{
						type: "emoji",
						name: "thumbsup",
					},
					{
						type: "user",
						user_id: "U3TEST",
						style: {
							bold: true,
							italic: true,
							strike: true,
						},
					},
					{
						type: "text",
						text: " hello man ",
					},
					{
						type: "link",
						url: "http://hi.com",
						text: "hello world",
					},
					{
						type: "text",
						text: " ",
					},
					{
						type: "link",
						url: "http://hi.com",
						text: "hi.com",
					},
					{
						type: "text",
						text: " ",
					},
					{
						type: "broadcast",
						range: "here",
					},
					{
						type: "text",
						text: " hi everyone ",
					},
					{
						type: "broadcast",
						range: "channel",
					},
					{
						type: "text",
						text: " hello everyone ",
					},
					{
						type: "broadcast",
						range: "everyone",
					},
					{
						type: "text",
						text: " hejj",
					},
					{
						type: "text",
						text: "This is a rich text section with regular text. ",
					},
					{
						type: "text",
						text: "This is bold",
						style: {
							bold: true,
						},
					},
					{
						type: "text",
						text: ". ",
					},
					{
						type: "text",
						text: "This is italics.",
						style: {
							italic: true,
						},
					},
					{
						type: "text",
						text: " ",
						style: {
							bold: true,
							italic: true,
						},
					},
					{
						type: "text",
						text: "This is strikethrough.",
						style: {
							strike: true,
						},
					},
					{
						type: "text",
						text: " ",
					},
					{
						type: "text",
						text: "This is code.",
						style: {
							code: true,
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
	const [config, setConfig] = useState<MessageConfig>(defaultConfig)
	const [activeTab, setActiveTab] = useState<"blocks" | "config">("blocks")
	const editorRef = useRef(null)

	useEffect(() => {
		const savedConfig = loadConfig()
		if (savedConfig) {
			setConfig(savedConfig)
		}

		const savedBlocks = loadBlocks()
		if (savedBlocks) {
			setBlocks(savedBlocks as Block[])
			setCode(JSON.stringify(savedBlocks, null, 2))
		}
	}, [])

	useEffect(() => {
		saveConfig(config)
	}, [config])

	useEffect(() => {
		saveBlocks(blocks)
	}, [blocks])

	const handleConfigChange = (newConfig: MessageConfig) => {
		setConfig(newConfig)
	}

	function handleEditorDidMount(editor: any, monaco: Monaco) {
		if (editorRef.current) {
			editorRef.current = editor
		}
	}

	return (
		<div className="w-full min-h-screen">
			{/* Header */}
			<header className="sticky top-0 z-10 backdrop-blur-xl bg-[#FAF5F0] border-b border-ds-border">
				<div className="max-w-[1600px] mx-auto px-6 sm:px-8 h-20 flex items-center justify-between">
					<div className="flex flex-col gap-0.5">
						<div className="flex items-center gap-3">
							<h1 className="text-ds-base font-semibold tracking-tight text-xl">
								Slack Blocks to JSX
							</h1>

							<a
								href={`https://github.com/themashcodee/slack-blocks-to-jsx/releases/tag/v${version}`}
								target="_blank"
								rel="noreferrer"
								className="ds-badge ds-badge-accent"
							>
								v{version}
							</a>
						</div>

						<p className="text-gray-400 text-sm">
							Playground for library which allows rendering Slack blocks in
							React with custom branding.
						</p>
					</div>

					<div className="flex items-center gap-1">
						<a
							href="https://www.npmjs.com/package/slack-blocks-to-jsx"
							target="_blank"
							rel="noreferrer"
							className="p-2 rounded-ds-md text-ds-text-tertiary hover:text-ds-text-secondary hover:bg-ds-surface-hover transition-all duration-base"
							aria-label="View on NPM"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 512 512"
								className="w-7 h-7"
							>
								<rect width="512" height="512" fill="none" rx="15%"></rect>
								<path
									fill="none"
									stroke="currentColor"
									strokeWidth="22"
									d="M166 333h90m146-101v68m-45-68v68m-112-68v45m-11 34h213V199H65v112h113V210m-45 22v68m157-90v90"
								></path>
							</svg>
						</a>

						<a
							href="https://github.com/themashcodee/slack-blocks-to-jsx"
							target="_blank"
							rel="noreferrer"
							className="p-2 rounded-ds-md text-ds-text-tertiary hover:text-ds-text-secondary hover:bg-ds-surface-hover transition-all duration-base"
							aria-label="View on GitHub"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 98 96"
								className="w-5 h-5"
							>
								<path
									fill="currentColor"
									fillRule="evenodd"
									d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0112.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
									clipRule="evenodd"
								></path>
							</svg>
						</a>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<div className="max-w-[1600px] mx-auto px-6 sm:px-8 py-6">
				<div className="w-full grid lg:grid-cols-12 grid-cols-1 gap-5">
					{/* Editor Panel */}
					<div className="lg:col-span-7 w-full flex flex-col gap-5">
						<div
							className="ds-card overflow-hidden flex flex-col"
							style={{ height: 600 }}
						>
							{/* Tab Bar */}
							<div className="flex items-center gap-1 px-4 pt-4 pb-0">
								<button
									onClick={() => setActiveTab("blocks")}
									className={`ds-tab ${
										activeTab === "blocks" ? "ds-tab-active" : ""
									}`}
								>
									Blocks JSON
								</button>
								<button
									onClick={() => setActiveTab("config")}
									className={`ds-tab ${
										activeTab === "config" ? "ds-tab-active" : ""
									}`}
								>
									Configuration
								</button>
							</div>

							<hr className="ds-divider mx-4 mt-3" />

							{/* Tab Content */}
							<div className="flex-1 overflow-hidden p-4">
								{activeTab === "blocks" && (
									<div className="w-full rounded-ds-lg overflow-hidden h-full border border-ds-border">
										<CodeEditor
											height="100%"
											defaultLanguage="json"
											language="json"
											defaultValue={code}
											value={code}
											theme="vs-light"
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
												scrollBeyondLastLine: false,
												fontSize: 13,
												fontFamily: "var(--ds-font-mono)",
												padding: { top: 16 },
												lineHeight: 1.6,
												renderLineHighlight: "none",
											}}
										/>
									</div>
								)}

								{activeTab === "config" && (
									<ConfigEditor
										config={config}
										onConfigChange={handleConfigChange}
									/>
								)}
							</div>
						</div>

						{/* Support Card */}
						<div className="ds-card p-5 flex flex-row items-center justify-between gap-6">
							<div className="flex flex-col items-start">
								<h3 className="text-ds-base font-medium text-ds-text-primary mb-1.5">
									Support this project
								</h3>
								<p className="text-ds-sm text-ds-text-tertiary mb-4 max-w-md">
									Your support keeps this project alive and evolving. Every
									contribution helps maintain and improve the library.
								</p>
								<a
									href="https://www.buymeacoffee.com/themashcodee"
									target="_blank"
									rel="noopener noreferrer"
									className="ds-btn ds-btn-primary"
								>
									Buy me a coffee
								</a>
							</div>

							<div className="hidden sm:flex flex-col items-center gap-2 shrink-0">
								<a
									href="https://www.buymeacoffee.com/themashcodee"
									target="_blank"
									rel="noopener noreferrer"
									className="rounded-ds-lg overflow-hidden border border-ds-border p-1.5 bg-white"
								>
									<Image
										width={72}
										height={72}
										src={images.buymeacoffee_qr}
										alt="Buy me a coffee QR code"
									/>
								</a>
								<p className="text-ds-xs text-ds-text-disabled text-center">
									Scan to support
								</p>
							</div>
						</div>
					</div>

					{/* Preview Panel */}
					<div className="lg:col-span-5 w-full">
						<div className="ds-card p-5 w-full h-full min-h-[500px] relative overflow-hidden">
							<div className="flex items-center justify-between mb-4">
								<h2 className="text-ds-sm font-medium text-ds-text-secondary text-lg">
									Preview
								</h2>
								<div className="h-2 w-2 rounded-full bg-ds-success animate-pulse" />
							</div>
							<hr className="ds-divider mb-4" />
							<div className="overflow-auto">
								<ErrorBoundary
									fallback={
										<div className="w-full h-full flex items-center justify-center p-6">
											<p className="text-ds-text-secondary text-ds-sm">
												Your blocks JSON might be invalid.{" "}
												<a
													target="_blank"
													rel="noreferrer"
													className="text-ds-accent-text hover:underline"
													href={`https://app.slack.com/block-kit-builder#${JSON.stringify(
														{ blocks },
													)}`}
												>
													Validate on Slack Block Kit Builder
												</a>
											</p>
										</div>
									}
								>
									<Message
										key={`message-${
											config.enableCustomUserHook ? "with-hooks" : "no-hooks"
										}`}
										logo={config.logo}
										name={config.name}
										time={config.time || undefined}
										showBlockKitDebug={config.showBlockKitDebug}
										blocks={blocks}
										unstyled={config.unstyled}
										withoutWrapper={config.withoutWrapper}
										data={config.data}
										theme={config.theme}
										hooks={
											config.enableCustomUserHook
												? {
														user(data) {
															return (
																<button
																	style={{
																		background: "var(--ds-accent)",
																		color: "var(--ds-text-inverse)",
																		padding: "2px 8px",
																		borderRadius: "var(--ds-radius-sm)",
																		fontSize: "var(--ds-text-sm)",
																	}}
																	onClick={() => {
																		alert(
																			"Guess what, we support custom wrappers",
																		)
																	}}
																>
																	@{data.name} (custom)
																</button>
															)
														},
													}
												: undefined
										}
									/>
								</ErrorBoundary>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
