import { MessageConfig, SerializedMessageConfig } from "@/types/config"

const STORAGE_KEY_CONFIG = "slack-playground-config"
const STORAGE_KEY_BLOCKS = "slack-playground-blocks"

export const defaultConfig: MessageConfig = {
	logo: "https://a.slack-edge.com/80588/marketing/img/meta/slack_hash_256.png",
	name: "Acme Bot",
	time: new Date(),
	showBlockKitDebug: true,
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
	try {
		localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(serializeConfig(config)))
	} catch (error) {
		console.error("Failed to save config to localStorage:", error)
	}
}

export const loadConfig = (): MessageConfig | null => {
	try {
		const stored = localStorage.getItem(STORAGE_KEY_CONFIG)
		if (stored) {
			const parsed = JSON.parse(stored) as SerializedMessageConfig
			return deserializeConfig(parsed)
		}
	} catch (error) {
		console.error("Failed to load config from localStorage:", error)
	}
	return null
}

export const saveBlocks = (blocks: unknown[]): void => {
	try {
		localStorage.setItem(STORAGE_KEY_BLOCKS, JSON.stringify(blocks))
	} catch (error) {
		console.error("Failed to save blocks to localStorage:", error)
	}
}

export const loadBlocks = (): unknown[] | null => {
	try {
		const stored = localStorage.getItem(STORAGE_KEY_BLOCKS)
		if (stored) {
			return JSON.parse(stored)
		}
	} catch (error) {
		console.error("Failed to load blocks from localStorage:", error)
	}
	return null
}

