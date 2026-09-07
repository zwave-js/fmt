# @zwave-js/fmt

[Dprint](https://dprint.dev) wrapper to programmatically format source files in memory.

This project is meant for internal use in the `node-zwave-js` project.

## Install

```sh
yarn add --dev @dprint/formatter @dprint/json @dprint/markdown @dprint/typescript @zwave-js/fmt
```

## Usage

```ts
import { formatWithDprint } from "@zwave-js/fmt";

const formatted = formatWithDprint(
  "/path/to/repo/root",
  "/path/to/repo/root/path/to/file.ts",
  "const     foo = 1    ",
);

console.log(formatted);

// prints:
// const foo = 1;
```

## Changelog

<!--
	Placeholder for next release:
	### **WORK IN PROGRESS**
-->
### 1.0.6 (2026-01-27)

- Dependency updates

### 1.0.5 (2025-10-22)

- Dependency updates
