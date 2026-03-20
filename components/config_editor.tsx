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
			{/* Controls */}
			<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
				<div className="flex items-center gap-1.5">
					<button
						onClick={() => setMode("visual")}
						className={`ds-tab ${mode === "visual" ? "ds-tab-active" : ""}`}
					>
						Visual
					</button>
					<button
						onClick={() => setMode("json")}
						className={`ds-tab ${mode === "json" ? "ds-tab-active" : ""}`}
					>
						JSON
					</button>
				</div>

				<div className="flex items-center gap-2 flex-wrap">
					<select
						onChange={(e) => handlePresetChange(e.target.value)}
						value=""
						className="ds-select"
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
						className="ds-btn ds-btn-ghost"
					>
						Reset
					</button>
				</div>
			</div>

			{/* Visual Mode */}
			{mode === "visual" && (
				<div className="flex-1 overflow-auto space-y-5">
					{/* Basic Settings */}
					<fieldset className="space-y-3">
						<legend className="text-ds-xs font-medium text-ds-text-tertiary uppercase tracking-wider">
							Basic Settings
						</legend>

						<div>
							<label className="ds-label block mb-1.5">
								Bot Name <span className="text-ds-error">*</span>
							</label>
							<input
								type="text"
								value={config.name}
								onChange={(e) => handleVisualChange({ name: e.target.value })}
								className="ds-input"
								placeholder="Enter bot name"
							/>
						</div>

						<div>
							<label className="ds-label block mb-1.5">Logo URL</label>
							<input
								type="url"
								value={config.logo}
								onChange={(e) => handleVisualChange({ logo: e.target.value })}
								className="ds-input"
								placeholder="https://example.com/logo.png"
							/>
						</div>
					</fieldset>

					<hr className="ds-divider" />

					{/* Display Options */}
					<fieldset className="space-y-3">
						<legend className="text-ds-xs font-medium text-ds-text-tertiary uppercase tracking-wider">
							Display Options
						</legend>

						<div>
							<label className="ds-label block mb-1.5">Theme</label>
							<select
								value={config.theme || ""}
								onChange={(e) =>
									handleVisualChange({
										theme:
											e.target.value === ""
												? undefined
												: (e.target.value as "light" | "dark"),
									})
								}
								className="ds-select w-full"
							>
								<option value="">System Preference</option>
								<option value="light">Light</option>
								<option value="dark">Dark</option>
							</select>
							<p className="text-ds-xs text-ds-text-disabled mt-1.5">
								Controls the color theme of the rendered message
							</p>
						</div>

						<label className="flex items-center gap-2.5 cursor-pointer group">
							<input
								type="checkbox"
								checked={config.showBlockKitDebug}
								onChange={(e) =>
									handleVisualChange({ showBlockKitDebug: e.target.checked })
								}
								className="ds-checkbox"
							/>
							<span className="text-ds-sm text-ds-text-secondary group-hover:text-ds-text-primary transition-colors">
								Show Block Kit Debug Link
							</span>
						</label>

						<label className="flex items-center gap-2.5 cursor-pointer group">
							<input
								type="checkbox"
								checked={config.unstyled || false}
								onChange={(e) =>
									handleVisualChange({ unstyled: e.target.checked })
								}
								className="ds-checkbox"
							/>
							<span className="text-ds-sm text-ds-text-secondary group-hover:text-ds-text-primary transition-colors">
								Unstyled (No default styles)
							</span>
						</label>

						<label className="flex items-center gap-2.5 cursor-pointer group">
							<input
								type="checkbox"
								checked={config.withoutWrapper || false}
								onChange={(e) =>
									handleVisualChange({ withoutWrapper: e.target.checked })
								}
								className="ds-checkbox"
							/>
							<span className="text-ds-sm text-ds-text-secondary group-hover:text-ds-text-primary transition-colors">
								Without Wrapper (Blocks only)
							</span>
						</label>

						<label className="flex items-center gap-2.5 cursor-pointer group">
							<input
								type="checkbox"
								checked={config.enableCustomUserHook || false}
								onChange={(e) =>
									handleVisualChange({ enableCustomUserHook: e.target.checked })
								}
								className="ds-checkbox"
							/>
							<span className="text-ds-sm text-ds-text-secondary group-hover:text-ds-text-primary transition-colors">
								Enable Custom User Hook (Demo)
							</span>
						</label>
					</fieldset>

					<hr className="ds-divider" />

					{/* Data Configuration */}
					<fieldset className="space-y-3">
						<legend className="text-ds-xs font-medium text-ds-text-tertiary uppercase tracking-wider">
							Data Configuration
						</legend>
						<p className="text-ds-xs text-ds-text-disabled">
							Switch to JSON mode to edit users, channels, and user groups
						</p>

						<div className="bg-ds-bg-primary rounded-ds-md p-3 space-y-1.5 border border-ds-border-subtle">
							<div className="flex justify-between text-ds-xs">
								<span className="text-ds-text-tertiary">Users</span>
								<span className="text-ds-text-secondary font-medium">
									{config.data?.users?.length || 0}
								</span>
							</div>
							<div className="flex justify-between text-ds-xs">
								<span className="text-ds-text-tertiary">Channels</span>
								<span className="text-ds-text-secondary font-medium">
									{config.data?.channels?.length || 0}
								</span>
							</div>
							<div className="flex justify-between text-ds-xs">
								<span className="text-ds-text-tertiary">User Groups</span>
								<span className="text-ds-text-secondary font-medium">
									{config.data?.user_groups?.length || 0}
								</span>
							</div>
						</div>
					</fieldset>
				</div>
			)}

			{/* JSON Mode */}
			{mode === "json" && (
				<div className="flex-1 flex flex-col">
					{jsonError && (
						<div className="mb-3 px-3 py-2 bg-ds-error-subtle border border-ds-error/20 rounded-ds-md text-ds-xs text-ds-error">
							{jsonError}
						</div>
					)}
					<div className="flex-1 rounded-ds-lg overflow-hidden border border-ds-border">
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
								fontFamily: "var(--ds-font-mono)",
								lineNumbers: "on",
								tabSize: 2,
								padding: { top: 16 },
								lineHeight: 1.6,
								renderLineHighlight: "none",
							}}
						/>
					</div>
				</div>
			)}
		</div>
	)
}
