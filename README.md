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
	"const     foo = 1    "
)

console.log(formatted);

// prints:
// const foo = 1;
```