import { MessageConfig, SerializedMessageConfig } from "@/types/config"
import { compress, decompress } from "lz-string"
import { showStorageWarning, checkStorageHealth } from "./notifications"

const STORAGE_KEY_CONFIG = "slack-playground-config"
const STORAGE_KEY_BLOCKS = "slack-playground-blocks"

const isQuotaExceededError = (error: unknown): boolean => {
	return (
		error instanceof DOMException &&
		(error.name === "QuotaExceededError" ||
			error.name === "NS_ERROR_DOM_QUOTA_REACHED")
	)
}

const compressData = (data: string): string => {
	try {
		return compress(data)
	} catch {
		return data // Fallback to uncompressed
	}
}

const decompressData = (data: string): string => {
	try {
		return decompress(data) || data
	} catch {
		return data // Fallback to treat as uncompressed
	}
}

export const defaultConfig: MessageConfig = {
	logo: "https://a.slack-edge.com/80588/marketing/img/meta/slack_hash_256.png",
	name: "Acme Bot",
	time: new Date(),
	showBlockKitDebug: true,
	theme: undefined,
	unstyled: false,
	withoutWrapper: false,
	enableCustomUserHook: true,
	data: {
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
	},
}

export const serializeConfig = (
	config: MessageConfig
): SerializedMessageConfig => {
	return {
		...config,
		time: config.time ? config.time.toISOString() : null,
	}
}

export const deserializeConfig = (
	config: SerializedMessageConfig
): MessageConfig => {
	return {
		...config,
		time: config.time ? new Date(config.time) : null,
	}
}

export const saveConfig = (config: MessageConfig): void => {
	const key = STORAGE_KEY_CONFIG
	const data = JSON.stringify(serializeConfig(config))

	try {
		// Try saving directly first
		localStorage.setItem(key, data)
		localStorage.removeItem(`${key}_compressed`) // Clear compression flag if exists
		checkStorageHealth()
	} catch (error) {
		if (isQuotaExceededError(error)) {
			console.warn("localStorage quota exceeded for config, attempting compression...")

			try {
				// Try with compression
				const compressed = compressData(data)
				localStorage.setItem(key, compressed)
				localStorage.setItem(`${key}_compressed`, "true")
				console.info("Config saved with compression")
			} catch (compressError) {
				console.error("Failed to save config even with compression:", compressError)
				showStorageWarning(
					"Unable to save configuration. Storage quota exceeded."
				)
			}
		} else {
			console.error("Failed to save config to localStorage:", error)
		}
	}
}

export const loadConfig = (): MessageConfig | null => {
	try {
		const stored = localStorage.getItem(STORAGE_KEY_CONFIG)
		if (!stored) return null

		const isCompressed =
			localStorage.getItem(`${STORAGE_KEY_CONFIG}_compressed`) === "true"
		const data = isCompressed ? decompressData(stored) : stored

		const parsed = JSON.parse(data) as SerializedMessageConfig
		return deserializeConfig(parsed)
	} catch (error) {
		console.error("Failed to load config from localStorage:", error)
		// Clear corrupted data
		localStorage.removeItem(STORAGE_KEY_CONFIG)
		localStorage.removeItem(`${STORAGE_KEY_CONFIG}_compressed`)
		return null
	}
}

export const saveBlocks = (blocks: unknown[]): void => {
	const key = STORAGE_KEY_BLOCKS
	const data = JSON.stringify(blocks)

	try {
		// Try saving directly first
		localStorage.setItem(key, data)
		localStorage.removeItem(`${key}_compressed`) // Clear compression flag if exists
		checkStorageHealth()
	} catch (error) {
		if (isQuotaExceededError(error)) {
			console.warn("localStorage quota exceeded for blocks, attempting compression...")

			try {
				// Try with compression
				const compressed = compressData(data)
				localStorage.setItem(key, compressed)
				localStorage.setItem(`${key}_compressed`, "true")
				console.info("Blocks saved with compression")
				showStorageWarning(
					"Your blocks are large and have been compressed to save space."
				)
			} catch (compressError) {
				console.error("Failed to save blocks even with compression:", compressError)
				showStorageWarning(
					"Your blocks are too large to save. Consider reducing the size or exporting to a file."
				)
			}
		} else {
			console.error("Failed to save blocks to localStorage:", error)
		}
	}
}

export const loadBlocks = (): unknown[] | null => {
	try {
		const stored = localStorage.getItem(STORAGE_KEY_BLOCKS)
		if (!stored) return null

		const isCompressed =
			localStorage.getItem(`${STORAGE_KEY_BLOCKS}_compressed`) === "true"
		const data = isCompressed ? decompressData(stored) : stored

		return JSON.parse(data)
	} catch (error) {
		console.error("Failed to load blocks from localStorage:", error)
		// Clear corrupted data
		localStorage.removeItem(STORAGE_KEY_BLOCKS)
		localStorage.removeItem(`${STORAGE_KEY_BLOCKS}_compressed`)
		return null
	}
}

