/**
 * Utilities for showing storage warnings and notifications
 */

export const showStorageWarning = (message: string): void => {
	if (typeof window !== "undefined") {
		console.warn("[Storage Warning]:", message)
		// Dispatch custom event for UI components to show toast notification
		window.dispatchEvent(
			new CustomEvent("storage-warning", { detail: message })
		)
	}
}

export const getStorageSize = (): {
	used: number
	limit: number
	percentage: number
} => {
	let used = 0

	if (typeof window === "undefined" || !window.localStorage) {
		return { used: 0, limit: 5 * 1024 * 1024, percentage: 0 }
	}

	for (const key in localStorage) {
		if (localStorage.hasOwnProperty(key)) {
			used += localStorage[key].length + key.length
		}
	}

	const limit = 5 * 1024 * 1024 // Approximate 5MB limit
	const percentage = (used / limit) * 100

	return { used, limit, percentage }
}

export const checkStorageHealth = (): void => {
	const { percentage } = getStorageSize()

	if (percentage > 80) {
		showStorageWarning(
			`Storage is ${percentage.toFixed(0)}% full. Consider exporting your data.`
		)
	}
}

export const formatBytes = (bytes: number): string => {
	if (bytes === 0) return "0 Bytes"

	const k = 1024
	const sizes = ["Bytes", "KB", "MB"]
	const i = Math.floor(Math.log(bytes) / Math.log(k))

	return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i]
}

