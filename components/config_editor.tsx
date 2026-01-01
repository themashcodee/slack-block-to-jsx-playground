import React, { useState, useEffect } from "react"
import CodeEditor from "@monaco-editor/react"
import { MessageConfig } from "@/types/config"
import { serializeConfig, deserializeConfig } from "@/utils/config"
import { validateConfigJSON } from "@/utils/validation"
import { configPresets } from "@/utils/presets"

interface ConfigEditorProps {
	config: MessageConfig
	onConfigChange: (config: MessageConfig) => void
}

export const ConfigEditor: React.FC<ConfigEditorProps> = ({
	config,
	onConfigChange,
}) => {
	const [mode, setMode] = useState<"visual" | "json">("visual")
	const [jsonValue, setJsonValue] = useState("")
	const [jsonError, setJsonError] = useState<string | null>(null)

	// Update JSON value when config changes (from parent or preset)
	useEffect(() => {
		setJsonValue(JSON.stringify(serializeConfig(config), null, 2))
		setJsonError(null)
	}, [config])

	const handleVisualChange = (updates: Partial<MessageConfig>) => {
		const newConfig = { ...config, ...updates }
		onConfigChange(newConfig)
	}

	const handleJSONChange = (value: string | undefined) => {
		if (!value) return

		setJsonValue(value)

		const validation = validateConfigJSON(value)

		if (validation.valid) {
			try {
				const parsed = JSON.parse(value)
				const deserialized = deserializeConfig(parsed)
				onConfigChange(deserialized)
				setJsonError(null)
			} catch (error) {
				setJsonError(error instanceof Error ? error.message : "Failed to parse")
			}
		} else {
			setJsonError(validation.error || "Invalid configuration")
		}
	}

	const handlePresetChange = (presetId: string) => {
		const preset = configPresets.find((p) => p.id === presetId)
		if (preset) {
			onConfigChange(preset.config)
		}
	}

	const handleResetToDefaults = () => {
		const defaultPreset = configPresets.find((p) => p.id === "default")
		if (defaultPreset) {
			onConfigChange(defaultPreset.config)
		}
	}

	return (
		<div className="w-full h-full flex flex-col">
			{/* Header with mode toggle and preset selector */}
			<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
				<div className="flex items-center gap-2">
					<button
						onClick={() => setMode("visual")}
						className={`px-3 py-1.5 text-sm rounded transition-colors ${
							mode === "visual"
								? "bg-blue-500 text-white"
								: "bg-gray-200 text-gray-700 hover:bg-gray-300"
						}`}
					>
						Visual
					</button>
					<button
						onClick={() => setMode("json")}
						className={`px-3 py-1.5 text-sm rounded transition-colors ${
							mode === "json"
								? "bg-blue-500 text-white"
								: "bg-gray-200 text-gray-700 hover:bg-gray-300"
						}`}
					>
						JSON
					</button>
				</div>

				<div className="flex items-center gap-2 flex-wrap">
					<select
						onChange={(e) => handlePresetChange(e.target.value)}
						value=""
						className="px-3 py-1.5 text-sm border border-gray-300 rounded bg-white hover:border-gray-400 transition-colors"
					>
						<option value="" disabled>
							Load Preset...
						</option>
						{configPresets.map((preset) => (
							<option key={preset.id} value={preset.id}>
								{preset.name}
							</option>
						))}
					</select>

					<button
						onClick={handleResetToDefaults}
						className="px-3 py-1.5 text-sm border border-gray-300 rounded bg-white hover:bg-gray-50 transition-colors"
					>
						Reset to Defaults
					</button>
				</div>
			</div>

			{/* Visual Mode */}
			{mode === "visual" && (
				<div className="flex-1 overflow-auto space-y-4">
					{/* Basic Settings */}
					<div className="space-y-3">
						<h3 className="font-semibold text-sm text-gray-700">
							Basic Settings
						</h3>

						<div>
							<label className="block text-sm text-gray-600 mb-1">
								Bot Name <span className="text-red-500">*</span>
							</label>
							<input
								type="text"
								value={config.name}
								onChange={(e) => handleVisualChange({ name: e.target.value })}
								className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="Enter bot name"
							/>
						</div>

						<div>
							<label className="block text-sm text-gray-600 mb-1">
								Logo URL
							</label>
							<input
								type="url"
								value={config.logo}
								onChange={(e) => handleVisualChange({ logo: e.target.value })}
								className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="https://example.com/logo.png"
							/>
						</div>
					</div>

					{/* Display Options */}
					<div className="space-y-3 pt-4 border-t">
						<h3 className="font-semibold text-sm text-gray-700">
							Display Options
						</h3>

						<div>
							<label className="block text-sm text-gray-600 mb-1">
								Color Mode
							</label>
							<select
								value={config.theme}
								onChange={(e) =>
									handleVisualChange({
										theme: e.target.value as "light" | "dark",
									})
								}
								className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
							>
								<option value={undefined}>
									Select Color Mode...
								</option>
								<option value="light">Light</option>
								<option value="dark">Dark</option>
							</select>
						</div>

						<div className="flex items-center gap-2">
							<input
								type="checkbox"
								id="showBlockKitDebug"
								checked={config.showBlockKitDebug}
								onChange={(e) =>
									handleVisualChange({ showBlockKitDebug: e.target.checked })
								}
								className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
							/>
							<label htmlFor="showBlockKitDebug" className="text-sm text-gray-600">
								Show Block Kit Debug Link
							</label>
						</div>

						<div className="flex items-center gap-2">
							<input
								type="checkbox"
								id="unstyled"
								checked={config.unstyled || false}
								onChange={(e) => handleVisualChange({ unstyled: e.target.checked })}
								className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
							/>
							<label htmlFor="unstyled" className="text-sm text-gray-600">
								Unstyled (No default styles)
							</label>
						</div>

						<div className="flex items-center gap-2">
							<input
								type="checkbox"
								id="withoutWrapper"
								checked={config.withoutWrapper || false}
								onChange={(e) =>
									handleVisualChange({ withoutWrapper: e.target.checked })
								}
								className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
							/>
							<label htmlFor="withoutWrapper" className="text-sm text-gray-600">
								Without Wrapper (Blocks only)
							</label>
						</div>

						<div className="flex items-center gap-2">
							<input
								type="checkbox"
								id="enableCustomUserHook"
								checked={config.enableCustomUserHook || false}
								onChange={(e) =>
									handleVisualChange({ enableCustomUserHook: e.target.checked })
								}
								className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
							/>
							<label
								htmlFor="enableCustomUserHook"
								className="text-sm text-gray-600"
							>
								Enable Custom User Hook (Demo)
							</label>
						</div>
					</div>

					{/* Data Configuration */}
					<div className="space-y-3 pt-4 border-t">
						<h3 className="font-semibold text-sm text-gray-700">
							Data Configuration
						</h3>
						<p className="text-xs text-gray-500">
							Switch to JSON mode to edit users, channels, and user groups
						</p>

						<div className="bg-gray-50 p-3 rounded text-xs space-y-1">
							<div>
								<span className="font-medium">Users:</span>{" "}
								{config.data?.users?.length || 0}
							</div>
							<div>
								<span className="font-medium">Channels:</span>{" "}
								{config.data?.channels?.length || 0}
							</div>
							<div>
								<span className="font-medium">User Groups:</span>{" "}
								{config.data?.user_groups?.length || 0}
							</div>
						</div>
					</div>
				</div>
			)}

			{/* JSON Mode */}
			{mode === "json" && (
				<div className="flex-1 flex flex-col">
					{jsonError && (
						<div className="mb-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
							{jsonError}
						</div>
					)}
					<div className="flex-1 rounded-lg overflow-hidden border border-gray-300">
						<CodeEditor
							height="100%"
							defaultLanguage="json"
							language="json"
							value={jsonValue}
							theme="vs-light"
							onChange={handleJSONChange}
							options={{
								minimap: { enabled: false },
								scrollBeyondLastLine: false,
								fontSize: 13,
								lineNumbers: "on",
								tabSize: 2,
							}}
						/>
					</div>
				</div>
			)}
		</div>
	)
}

