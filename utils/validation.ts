export const isValidUrl = (url: string): boolean => {
	if (!url) return true // Empty URLs are valid (for minimal config)
	try {
		new URL(url)
		return true
	} catch {
		return false
	}
}

export const isValidJSON = (jsonString: string): boolean => {
	try {
		JSON.parse(jsonString)
		return true
	} catch {
		return false
	}
}

export const validateConfigJSON = (
	jsonString: string
): { valid: boolean; error?: string } => {
	try {
		const parsed = JSON.parse(jsonString)

		// Check required fields
		if (typeof parsed.name !== "string") {
			return { valid: false, error: "Field 'name' must be a string" }
		}

		if (parsed.logo && typeof parsed.logo !== "string") {
			return { valid: false, error: "Field 'logo' must be a string" }
		}

		if (parsed.logo && !isValidUrl(parsed.logo)) {
			return { valid: false, error: "Field 'logo' must be a valid URL" }
		}

		if (
			parsed.time !== null &&
			parsed.time !== undefined &&
			typeof parsed.time !== "string"
		) {
			return {
				valid: false,
				error: "Field 'time' must be a string (ISO date) or null",
			}
		}

		if (
			parsed.showBlockKitDebug !== undefined &&
			typeof parsed.showBlockKitDebug !== "boolean"
		) {
			return { valid: false, error: "Field 'showBlockKitDebug' must be a boolean" }
		}

		if (parsed.unstyled !== undefined && typeof parsed.unstyled !== "boolean") {
			return { valid: false, error: "Field 'unstyled' must be a boolean" }
		}

		if (
			parsed.withoutWrapper !== undefined &&
			typeof parsed.withoutWrapper !== "boolean"
		) {
			return { valid: false, error: "Field 'withoutWrapper' must be a boolean" }
		}

		if (
			parsed.enableCustomUserHook !== undefined &&
			typeof parsed.enableCustomUserHook !== "boolean"
		) {
			return {
				valid: false,
				error: "Field 'enableCustomUserHook' must be a boolean",
			}
		}

		// Validate data structure if present
		if (parsed.data) {
			if (typeof parsed.data !== "object") {
				return { valid: false, error: "Field 'data' must be an object" }
			}

			const { users, channels, user_groups } = parsed.data

			if (users !== undefined && !Array.isArray(users)) {
				return { valid: false, error: "Field 'data.users' must be an array" }
			}

			if (channels !== undefined && !Array.isArray(channels)) {
				return { valid: false, error: "Field 'data.channels' must be an array" }
			}

			if (user_groups !== undefined && !Array.isArray(user_groups)) {
				return {
					valid: false,
					error: "Field 'data.user_groups' must be an array",
				}
			}

			// Validate array items
			if (users) {
				for (let i = 0; i < users.length; i++) {
					const user = users[i]
					if (!user.id || !user.name) {
						return {
							valid: false,
							error: `User at index ${i} must have 'id' and 'name' fields`,
						}
					}
				}
			}

			if (channels) {
				for (let i = 0; i < channels.length; i++) {
					const channel = channels[i]
					if (!channel.id || !channel.name) {
						return {
							valid: false,
							error: `Channel at index ${i} must have 'id' and 'name' fields`,
						}
					}
				}
			}

			if (user_groups) {
				for (let i = 0; i < user_groups.length; i++) {
					const group = user_groups[i]
					if (!group.id || !group.name) {
						return {
							valid: false,
							error: `User group at index ${i} must have 'id' and 'name' fields`,
						}
					}
				}
			}
		}

		return { valid: true }
	} catch (error) {
		return {
			valid: false,
			error: error instanceof Error ? error.message : "Invalid JSON",
		}
	}
}

