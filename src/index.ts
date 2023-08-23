import {
	type Formatter,
	type GlobalConfiguration,
	createFromBuffer,
} from "@dprint/formatter";
import fs from "fs";
import JSON5 from "json5";
import path from "path";

import { getPath as jsonGetPath } from "@dprint/json";
import { getPath as mdGetPath } from "@dprint/markdown";
// TODO: Re-enable this when the typescript formatter is fixed.
// import { getPath as tsGetPath } from "@dprint/typescript";

const tsGetPath = () => path.resolve(__dirname, "../plugins/typescript.wasm");

const formatterCache = new Map<string, Formatter>();

interface Config {
	global: GlobalConfiguration;
	".ts": Record<string, unknown>;
	".json": Record<string, unknown>;
	".md": Record<string, unknown>;
}

type Extension = Exclude<keyof Config, "global">;

const configPathCache = new Map<string, string>();
const configCache = new Map<string, Config>();

function findNearestConfigPath(rootDir: string, filename: string): string {
	const searched: string[] = [];

	if (
		path.isAbsolute(filename)
		&& !path.relative(rootDir, filename).startsWith("..")
	) {
		let dir = path.dirname(filename);
		if (configPathCache.has(dir)) return configPathCache.get(dir)!;

		while (path.relative(rootDir, dir) !== "") {
			const configPath = path.join(dir, ".dprint.jsonc");
			searched.push(dir);
			if (fs.existsSync(configPath)) {
				for (const path of searched) {
					configPathCache.set(path, configPath);
				}

				return configPath;
			}
			dir = path.dirname(dir);
		}
	}

	const ret = path.join(rootDir, ".dprint.jsonc");
	for (const path of searched) {
		configPathCache.set(path, ret);
	}
	return ret;
}

function getConfig(rootDir: string, filename: string): Config {
	const configPath = findNearestConfigPath(rootDir, filename);
	if (!configCache.has(configPath)) {
		const fileContent = fs.readFileSync(configPath, "utf8");
		const {
			lineWidth,
			useTabs,
			indentWidth,
			newLineKind,
			typescript,
			json,
			markdown,
		} = JSON5.parse(fileContent);

		configCache.set(configPath, {
			global: {
				lineWidth,
				useTabs,
				indentWidth,
				newLineKind,
			},
			".ts": typescript,
			".json": json,
			".md": markdown,
		});
	}
	return configCache.get(configPath)!;
}

function getNormalizedExtension(filename: string): Extension {
	const extension = path.extname(filename);
	if (extension === ".ts" || extension === ".js") {
		return ".ts";
	} else if (extension === ".json" || extension === ".md") {
		return extension;
	}

	throw new Error(`Unsupported extension: ${extension}`);
}

function assertNever(_: never): never {
	throw new Error("Never assertion failed");
}

function getFormatter(filename: string): Formatter {
	const extension = getNormalizedExtension(filename);

	if (!formatterCache.has(extension)) {
		let buffer: Buffer;
		if (extension === ".ts") {
			buffer = fs.readFileSync(tsGetPath());
		} else if (extension === ".json") {
			buffer = fs.readFileSync(jsonGetPath());
		} else if (extension === ".md") {
			buffer = fs.readFileSync(mdGetPath());
		} else {
			throw assertNever(extension);
		}

		const formatter = createFromBuffer(buffer);
		formatterCache.set(extension, formatter);
	}

	return formatterCache.get(extension)!;
}

export function formatWithDprint(
	rootDir: string,
	filename: string,
	sourceText: string,
): string {
	const formatter = getFormatter(filename);
	const config = getConfig(rootDir, filename);
	const extension = getNormalizedExtension(filename);
	formatter.setConfig(config.global, (config as any)[extension] ?? {});
	return formatter.formatText(filename, sourceText);
}
