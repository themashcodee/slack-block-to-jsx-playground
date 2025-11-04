import { MessageConfig } from "@/types/config"

export interface ConfigPreset {
	id: string
	name: string
	description: string
	config: MessageConfig
}

export const configPresets: ConfigPreset[] = [
	{
		id: "default",
		name: "Default (Acme Bot)",
		description: "The default playground configuration",
		config: {
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
		},
	},
	{
		id: "github",
		name: "GitHub Bot",
		description: "Configuration for a GitHub notification bot",
		config: {
			logo: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
			name: "GitHub Bot",
			time: new Date(),
			showBlockKitDebug: true,
			unstyled: false,
			withoutWrapper: false,
			enableCustomUserHook: false,
			data: {
				user_groups: [
					{
						id: "SDEV001",
						name: "developers",
					},
				],
				channels: [
					{
						id: "C1GITHUB",
						name: "github-notifications",
					},
					{
						id: "C2DEV",
						name: "dev-team",
					},
				],
				users: [
					{
						id: "U1DEV",
						name: "alice",
					},
					{
						id: "U2DEV",
						name: "bob",
					},
					{
						id: "U3DEV",
						name: "charlie",
					},
				],
			},
		},
	},
	{
		id: "support",
		name: "Support Bot",
		description: "Configuration for a customer support bot",
		config: {
			logo: "https://cdn-icons-png.flaticon.com/512/3239/3239952.png",
			name: "Support Assistant",
			time: new Date(),
			showBlockKitDebug: false,
			unstyled: false,
			withoutWrapper: false,
			enableCustomUserHook: false,
			data: {
				user_groups: [
					{
						id: "SSUPPORT",
						name: "support-team",
					},
				],
				channels: [
					{
						id: "C1SUPPORT",
						name: "customer-support",
					},
					{
						id: "C2URGENT",
						name: "urgent-tickets",
					},
				],
				users: [
					{
						id: "U1SUP",
						name: "sarah",
					},
					{
						id: "U2SUP",
						name: "mike",
					},
					{
						id: "U3SUP",
						name: "emma",
					},
				],
			},
		},
	},
	{
		id: "alert",
		name: "Alert Bot",
		description: "Configuration for system alerts and monitoring",
		config: {
			logo: "https://cdn-icons-png.flaticon.com/512/2913/2913133.png",
			name: "Alert System",
			time: new Date(),
			showBlockKitDebug: false,
			unstyled: false,
			withoutWrapper: false,
			enableCustomUserHook: false,
			data: {
				user_groups: [
					{
						id: "SONCALL",
						name: "on-call",
					},
					{
						id: "SDEVOPS",
						name: "devops",
					},
				],
				channels: [
					{
						id: "C1ALERTS",
						name: "alerts",
					},
					{
						id: "C2INCIDENTS",
						name: "incidents",
					},
					{
						id: "C3MONITORING",
						name: "monitoring",
					},
				],
				users: [
					{
						id: "U1OPS",
						name: "ops-lead",
					},
					{
						id: "U2OPS",
						name: "devops-1",
					},
					{
						id: "U3OPS",
						name: "devops-2",
					},
				],
			},
		},
	},
	{
		id: "minimal",
		name: "Minimal",
		description: "Minimal configuration without wrapper",
		config: {
			logo: "",
			name: "",
			time: null,
			showBlockKitDebug: false,
			unstyled: false,
			withoutWrapper: true,
			enableCustomUserHook: false,
			data: {
				user_groups: [],
				channels: [],
				users: [],
			},
		},
	},
]

