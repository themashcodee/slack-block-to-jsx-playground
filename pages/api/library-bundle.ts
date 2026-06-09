import type { NextApiRequest, NextApiResponse } from "next"
import zlib from "zlib"

/**
 * Serves prebuilt `slack-blocks-to-jsx` builds that npm CDNs cannot resolve —
 * namely https://pkg.pr.new/... continuous-release tarballs tied to a PR/commit.
 *
 * Published versions (e.g. `slack-blocks-to-jsx@1.0.6`, `@latest`, dist tags)
 * are NOT handled here: the client loads those straight from esm.sh / jsDelivr.
 *
 * For pkg.pr.new we fetch the tarball and serve its raw, already-built
 * `dist/index.mjs` and `dist/style.css`. We deliberately do NOT bundle the
 * library's dependencies (node-emoji, react-markdown, remark-gfm, react): the
 * built file imports them as bare specifiers, and the preview iframe resolves
 * those through an import map pointing at esm.sh. That keeps this route free of
 * `npm install` / esbuild, which do not work reliably inside a serverless
 * function.
 */

type BundleType = "module" | "css"

const PACKAGE_NAME = "slack-blocks-to-jsx"
const CACHE_TTL_MS = 5 * 60 * 1000

type CachedBuild = {
	expires: number
	module: string
	css: string
}

const buildCache = new Map<string, CachedBuild>()
const inflight = new Map<string, Promise<CachedBuild>>()

const getBundleType = (value: unknown): BundleType => {
	const raw = Array.isArray(value) ? value[0] : value
	return raw === "css" ? "css" : "module"
}

const resolvePkgPrNewUrl = (value: unknown): string => {
	const raw = Array.isArray(value) ? value[0] : value
	const spec = String(raw || "")
		.trim()
		.replace(/^npm\s+(?:i|install)\s+/i, "")

	if (!spec) {
		throw new Error("Missing package spec")
	}

	if (spec.length > 300) {
		throw new Error("Package spec is too long")
	}

	let url: URL
	try {
		url = new URL(spec)
	} catch {
		throw new Error(
			"This endpoint only serves https://pkg.pr.new/... builds. Published versions load directly from a CDN.",
		)
	}

	if (url.protocol !== "https:" || url.hostname !== "pkg.pr.new") {
		throw new Error(
			"This endpoint only serves https://pkg.pr.new/... builds. Published versions load directly from a CDN.",
		)
	}

	if (!url.pathname.includes(PACKAGE_NAME)) {
		throw new Error(`Only ${PACKAGE_NAME} builds are allowed`)
	}

	return url.toString()
}

const readOctal = (buf: Buffer): number => {
	const text = buf.toString("latin1").replace(/\0.*$/, "").trim()
	return text ? parseInt(text, 8) : 0
}

// Minimal, dependency-free tar reader for npm pack tarballs (ustar format,
// short paths). Returns a map of in-package paths (the leading `package/` is
// stripped) to their raw contents.
const extractTarGz = (gz: Buffer): Map<string, Buffer> => {
	const tar = zlib.gunzipSync(gz)
	const files = new Map<string, Buffer>()
	let offset = 0

	while (offset + 512 <= tar.length) {
		const header = tar.subarray(offset, offset + 512)
		if (header.every((byte) => byte === 0)) break

		let name = header.subarray(0, 100).toString("latin1").replace(/\0.*$/, "")
		const prefix = header
			.subarray(345, 500)
			.toString("latin1")
			.replace(/\0.*$/, "")
		if (prefix) name = `${prefix}/${name}`

		const size = readOctal(header.subarray(124, 136))
		const typeflag = String.fromCharCode(header[156])
		const dataStart = offset + 512

		// Only regular files ("0", legacy "\0", or empty typeflag).
		if (name && (typeflag === "0" || typeflag === "\0" || typeflag === "")) {
			const data = tar.subarray(dataStart, dataStart + size)
			files.set(name.replace(/^package\//, ""), Buffer.from(data))
		}

		offset = dataStart + Math.ceil(size / 512) * 512
	}

	return files
}

const loadBuild = async (tarballUrl: string): Promise<CachedBuild> => {
	const response = await fetch(tarballUrl)
	if (!response.ok) {
		throw new Error(`Could not download build (HTTP ${response.status})`)
	}

	const files = extractTarGz(Buffer.from(await response.arrayBuffer()))

	const packageJsonRaw = files.get("package.json")
	if (!packageJsonRaw) {
		throw new Error("Build tarball is missing package.json")
	}

	const packageJson = JSON.parse(packageJsonRaw.toString("utf8")) as {
		name?: string
		module?: string
		main?: string
	}

	if (packageJson.name !== PACKAGE_NAME) {
		throw new Error("Resolved build is not slack-blocks-to-jsx")
	}

	const entry = packageJson.module || packageJson.main || "dist/index.mjs"
	const moduleBuffer = files.get(entry)
	if (!moduleBuffer) {
		throw new Error("Build does not expose a module entry")
	}

	const cssBuffer = files.get("dist/style.css")

	// The prebuilt bundle leaves `process.env.NODE_ENV` for the consumer's
	// bundler to define (esm.sh inlines it for published versions). Since we
	// serve the file straight to the browser, inline it the same way so the
	// module does not throw `ReferenceError: process is not defined`.
	const moduleCode = moduleBuffer
		.toString("utf8")
		.replace(/process\.env\.NODE_ENV/g, '"production"')

	return {
		expires: Date.now() + CACHE_TTL_MS,
		module: moduleCode,
		css: cssBuffer ? cssBuffer.toString("utf8") : "",
	}
}

const getBuild = async (tarballUrl: string): Promise<CachedBuild> => {
	const cached = buildCache.get(tarballUrl)
	if (cached && cached.expires > Date.now()) {
		return cached
	}

	const existing = inflight.get(tarballUrl)
	if (existing) {
		return existing
	}

	const pending = loadBuild(tarballUrl)
		.then((result) => {
			buildCache.set(tarballUrl, result)
			return result
		})
		.finally(() => {
			inflight.delete(tarballUrl)
		})

	inflight.set(tarballUrl, pending)
	return pending
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	res.setHeader("Access-Control-Allow-Origin", "*")

	if (req.method !== "GET") {
		res.setHeader("Allow", "GET")
		res.status(405).json({ error: "Method not allowed" })
		return
	}

	try {
		const type = getBundleType(req.query.type)
		const tarballUrl = resolvePkgPrNewUrl(req.query.spec)
		const build = await getBuild(tarballUrl)

		if (type === "css") {
			res.setHeader("Content-Type", "text/css; charset=utf-8")
			res.setHeader("Cache-Control", "public, max-age=300")
			res.send(build.css)
			return
		}

		res.setHeader("Content-Type", "application/javascript; charset=utf-8")
		res.setHeader("Cache-Control", "public, max-age=300")
		res.send(build.module)
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Unable to load build"
		res.status(400).json({ error: message })
	}
}
