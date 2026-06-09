import React, { useEffect, useMemo, useState } from "react"
import { MessageConfig } from "@/types/config"

type PreviewStatus = {
	state: "loading" | "ready" | "error"
	message: string
}

interface LibraryPreviewProps {
	blocks: unknown[]
	config: MessageConfig
	librarySpec: string
}

const previewSource = "slack-blocks-to-jsx-runtime-preview"

const escapeForScript = (value: unknown) =>
	JSON.stringify(value).replace(/</g, "\\u003c")

const serializeConfig = (config: MessageConfig) => ({
	...config,
	time: config.time ? config.time.toISOString() : null,
})

const createPreviewHtml = (librarySpec: string, payload: unknown) => {
	const encodedSpec = encodeURIComponent(librarySpec)
	const moduleUrl = `/api/library-bundle?type=module&spec=${encodedSpec}`
	const cssUrl = `/api/library-bundle?type=css&spec=${encodedSpec}`
	const payloadJson = escapeForScript(payload)
	const librarySpecJson = escapeForScript(librarySpec)

	return `<!doctype html>
<html>
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<link rel="stylesheet" href="${cssUrl}" />
		<style>
			:root {
				color-scheme: light dark;
				font-family: Arial, Helvetica, sans-serif;
			}

			body {
				margin: 0;
				background: transparent;
				color: #1d1c1d;
			}

			#root {
				min-height: 120px;
				padding: 2px;
			}

			.runtime-preview-error {
				border: 1px solid #f0b8b2;
				border-radius: 8px;
				background: #fff4f2;
				color: #8f1d14;
				font: 13px/1.5 ui-monospace, SFMono-Regular, Menlo, monospace;
				padding: 12px;
				white-space: pre-wrap;
			}
		</style>
	</head>
	<body>
		<div id="root"></div>
		<script type="module">
			const source = "${previewSource}";
			let payload = ${payloadJson};
			const rootElement = document.getElementById("root");
			let renderPreview = null;

			const report = (state, message) => {
				window.parent.postMessage({ source, state, message }, "*");
			};

			const showError = (error) => {
				const message = error instanceof Error ? error.message : String(error);
				rootElement.innerHTML = "";
				const errorElement = document.createElement("pre");
				errorElement.className = "runtime-preview-error";
				errorElement.textContent = message;
				rootElement.appendChild(errorElement);
				report("error", message);
			};

			const librarySpec = ${librarySpecJson};

			report("loading", "Loading " + librarySpec);

			window.addEventListener("message", (event) => {
				if (event.data && event.data.source === source + ":payload") {
					payload = event.data.payload;

					if (renderPreview) {
						try {
							renderPreview(payload);
						} catch (error) {
							showError(error);
						}
					}
				}
			});

			try {
				const [{ default: React }, ReactDOM, library] = await Promise.all([
					import("https://esm.sh/react@18.3.1"),
					import("https://esm.sh/react-dom@18.3.1/client?external=react"),
					import("${moduleUrl}")
				]);

				const Message = library.Message || (library.default && library.default.Message) || library.default;

				if (!Message) {
					throw new Error("The selected package does not export a Message component.");
				}

				class PreviewBoundary extends React.Component {
					constructor(props) {
						super(props);
						this.state = { error: null };
					}

					static getDerivedStateFromError(error) {
						return { error };
					}

					componentDidCatch(error) {
						report("error", error instanceof Error ? error.message : String(error));
					}

					render() {
						if (this.state.error) {
							return React.createElement("pre", {
								className: "runtime-preview-error"
							}, this.state.error instanceof Error ? this.state.error.message : String(this.state.error));
						}

						return this.props.children;
					}
				}

				const root = ReactDOM.createRoot(rootElement);

				const getHooks = (config) => {
					if (!config.enableCustomUserHook) {
						return undefined;
					}

					return {
						user(data) {
							return React.createElement("button", {
								style: {
									background: "#7546d5",
									border: 0,
									borderRadius: 6,
									color: "#ffffff",
									cursor: "pointer",
									fontSize: 13,
									padding: "2px 8px"
								},
								onClick() {
									alert("Guess what, we support custom wrappers");
								}
							}, "@" + data.name + " (custom)");
						}
					};
				};

				const render = (nextPayload) => {
					const config = nextPayload.config;
					const props = {
						logo: config.logo,
						name: config.name,
						time: config.time ? new Date(config.time) : undefined,
						showBlockKitDebug: config.showBlockKitDebug,
						blocks: nextPayload.blocks,
						unstyled: config.unstyled,
						withoutWrapper: config.withoutWrapper,
						data: config.data,
						theme: config.theme,
						hooks: getHooks(config)
					};

					root.render(
						React.createElement(
							PreviewBoundary,
							null,
							React.createElement(Message, props)
						)
					);
					report("ready", "Rendering " + librarySpec);
				};

				renderPreview = render;
				render(payload);
			} catch (error) {
				showError(error);
			}
		</script>
	</body>
</html>`
}

export const LibraryPreview: React.FC<LibraryPreviewProps> = ({
	blocks,
	config,
	librarySpec,
}) => {
	const [status, setStatus] = useState<PreviewStatus>({
		state: "loading",
		message: "Loading preview",
	})
	const iframeRef = React.useRef<HTMLIFrameElement>(null)

	const payload = useMemo(
		() => ({
			blocks,
			config: serializeConfig(config),
		}),
		[blocks, config],
	)
	const latestPayloadRef = React.useRef(payload)
	latestPayloadRef.current = payload

	const html = useMemo(
		() => createPreviewHtml(librarySpec, latestPayloadRef.current),
		[librarySpec],
	)

	useEffect(() => {
		setStatus({
			state: "loading",
			message: `Loading ${librarySpec}`,
		})
	}, [librarySpec])

	useEffect(() => {
		const handleMessage = (event: MessageEvent) => {
			if (event.data?.source !== previewSource) {
				return
			}

			setStatus({
				state: event.data.state,
				message: event.data.message,
			})
		}

		window.addEventListener("message", handleMessage)
		return () => window.removeEventListener("message", handleMessage)
	}, [])

	useEffect(() => {
		iframeRef.current?.contentWindow?.postMessage(
			{
				source: `${previewSource}:payload`,
				payload,
			},
			"*",
		)
	}, [payload])

	return (
		<div className="flex flex-col gap-3">
			<div className="flex items-center justify-between gap-3">
				<div className="min-w-0">
					<div className="text-ds-xs font-medium text-ds-text-tertiary uppercase">
						Library Build
					</div>
					<div className="text-ds-sm text-ds-text-secondary truncate">
						{librarySpec}
					</div>
				</div>
				<div
					className={`shrink-0 ds-badge ${
						status.state === "ready"
							? "ds-badge-success"
							: status.state === "error"
								? "ds-badge-error"
								: "ds-badge-accent"
					}`}
				>
					{status.state}
				</div>
			</div>
			{status.state === "error" && (
				<p className="text-ds-xs text-ds-error break-words">{status.message}</p>
			)}
			<iframe
				ref={iframeRef}
				title="Slack Blocks to JSX runtime preview"
				srcDoc={html}
				className="w-full min-h-[520px] border-0"
				sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox"
			/>
		</div>
	)
}
