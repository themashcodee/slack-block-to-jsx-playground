import { createHash } from "crypto"
import { promises as fs } from "fs"
import os from "os"
import path from "path"
import { promisify } from "util"
import { execFile as execFileCallback } from "child_process"
import type { NextApiRequest, NextApiResponse } from "next"

const execFile = promisify(execFileCallback)

const CACHE_ROOT = path.join(os.tmpdir(), "slack-blocks-to-jsx-playground")
const REACT_VERSION = "18.3.1"
const packageLocks = new Map<string, Promise<string>>()
const bundleLocks = new Map<string, Promise<string>>()

type BundleType = "module" | "css"

const normalizeSpec = (value: unknown): string => {
	const raw = Array.isArray(value) ? value[0] : value
	const spec = String(raw || "")
		.trim()
		.replace(/^npm\s+(?:i|install)\s+/i, "")

	if (!spec) {
		return "slack-blocks-to-jsx@latest"
	}

	if (spec.length > 300) {
		throw new Error("Package spec is too long")
	}

	if (spec.startsWith("https://pkg.pr.new/slack-blocks-to-jsx@")) {
		return spec
	}

	if (spec === "slack-blocks-to-jsx") {
		return spec
	}

	if (spec.startsWith("slack-blocks-to-jsx@")) {
		return spec
	}

	if (/^[A-Za-z0-9._-]+$/.test(spec)) {
		return `slack-blocks-to-jsx@${spec}`
	}

	throw new Error(
		"Use slack-blocks-to-jsx@version, a dist tag, or a https://pkg.pr.new/slack-blocks-to-jsx@... URL",
	)
}

const getBundleType = (value: unknown): BundleType => {
	const raw = Array.isArray(value) ? value[0] : value
	return raw === "css" ? "css" : "module"
}

const getCacheDir = (spec: string) => {
	const hash = createHash("sha256").update(spec).digest("hex").slice(0, 20)
	return path.join(CACHE_ROOT, hash)
}

const pathExists = async (target: string) => {
	try {
		await fs.access(target)
		return true
	} catch {
		return false
	}
}

const run = async (command: string, args: string[], cwd?: string) => {
	try {
		await execFile(command, args, {
			cwd,
			env: {
				...process.env,
				npm_config_audit: "false",
				npm_config_fund: "false",
			},
			maxBuffer: 1024 * 1024 * 12,
		})
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Unknown package command error"
		throw new Error(message)
	}
}

const findTarball = async (dir: string) => {
	const entries = await fs.readdir(dir)
	const tarball = entries.find((entry) => entry.endsWith(".tgz"))

	if (!tarball) {
		throw new Error("npm pack did not produce a tarball")
	}

	return path.join(dir, tarball)
}

const ensurePackage = async (spec: string, cacheDir: string) => {
	const packageDir = path.join(cacheDir, "package")
	const packageJsonPath = path.join(packageDir, "package.json")

	if (await pathExists(packageJsonPath)) {
		return packageDir
	}

	await fs.rm(cacheDir, { force: true, recursive: true })
	await fs.mkdir(cacheDir, { recursive: true })
	await run("npm", ["pack", spec, "--pack-destination", cacheDir])

	const tarball = await findTarball(cacheDir)
	await run("tar", ["-xzf", tarball, "-C", cacheDir])

	if (!(await pathExists(packageJsonPath))) {
		throw new Error("Package tarball did not contain package.json")
	}

	await run("npm", [
		"install",
		"--omit=dev",
		"--ignore-scripts",
		"--no-audit",
		"--no-fund",
	], packageDir)

	return packageDir
}

const ensurePackageWithLock = async (spec: string, cacheDir: string) => {
	const existing = packageLocks.get(cacheDir)
	if (existing) {
		return existing
	}

	const pending = ensurePackage(spec, cacheDir).finally(() => {
		packageLocks.delete(cacheDir)
	})
	packageLocks.set(cacheDir, pending)
	return pending
}

const readPackageJson = async (packageDir: string) => {
	const packageJson = JSON.parse(
		await fs.readFile(path.join(packageDir, "package.json"), "utf8"),
	)

	if (packageJson.name !== "slack-blocks-to-jsx") {
		throw new Error("Resolved package is not slack-blocks-to-jsx")
	}

	return packageJson as {
		main?: string
		module?: string
		version?: string
	}
}

const ensureModuleBundle = async (packageDir: string, cacheDir: string) => {
	const bundlePath = path.join(cacheDir, "bundle.mjs")

	if (await pathExists(bundlePath)) {
		return bundlePath
	}

	const esbuild = require("esbuild") as typeof import("esbuild")
	const packageJson = await readPackageJson(packageDir)
	const entry = path.join(
		packageDir,
		packageJson.module || packageJson.main || "dist/index.mjs",
	)

	if (!(await pathExists(entry))) {
		throw new Error("Resolved package does not expose a module entry")
	}

	await esbuild.build({
		entryPoints: [entry],
		bundle: true,
		format: "esm",
		outfile: bundlePath,
		platform: "browser",
		target: "es2020",
		plugins: [
			{
				name: "react-cdn",
				setup(build) {
					const reactModules: Record<string, string> = {
						react: `https://esm.sh/react@${REACT_VERSION}`,
						"react/jsx-runtime": `https://esm.sh/react@${REACT_VERSION}/jsx-runtime`,
					}

					build.onResolve(
						{ filter: /^(react|react\/jsx-runtime)$/ },
						(args) => ({
							path: reactModules[args.path],
							external: true,
						}),
					)
				},
			},
		],
	})

	return bundlePath
}

const ensureModuleBundleWithLock = async (
	packageDir: string,
	cacheDir: string,
) => {
	const existing = bundleLocks.get(cacheDir)
	if (existing) {
		return existing
	}

	const pending = ensureModuleBundle(packageDir, cacheDir).finally(() => {
		bundleLocks.delete(cacheDir)
	})
	bundleLocks.set(cacheDir, pending)
	return pending
}

const getCssPath = async (packageDir: string) => {
	const cssPath = path.join(packageDir, "dist", "style.css")
	return (await pathExists(cssPath)) ? cssPath : null
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	res.setHeader("Access-Control-Allow-Origin", "*")

	if (req.method !== "GET") {
		res.setHeader("Allow", "GET")
		res.status(405).send("Method not allowed")
		return
	}

	try {
		const spec = normalizeSpec(req.query.spec)
		const type = getBundleType(req.query.type)
		const cacheDir = getCacheDir(spec)
		const packageDir = await ensurePackageWithLock(spec, cacheDir)

		if (type === "css") {
			const cssPath = await getCssPath(packageDir)
			res.setHeader("Content-Type", "text/css; charset=utf-8")
			res.setHeader("Cache-Control", "public, max-age=3600")
			res.send(cssPath ? await fs.readFile(cssPath, "utf8") : "")
			return
		}

		const bundlePath = await ensureModuleBundleWithLock(packageDir, cacheDir)
		res.setHeader("Content-Type", "application/javascript; charset=utf-8")
		res.setHeader("Cache-Control", "public, max-age=3600")
		res.send(await fs.readFile(bundlePath, "utf8"))
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Unable to load package"
		res.status(400).json({ error: message })
	}
}
