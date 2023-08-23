const assert = require("assert");
const { formatWithDprint } = require("..");
const path = require("path");

const input = `
loop:
for(;;){console.log(1); console.log(2)}
`;

const expected = `
loop: for (;;) {
	console.log(1);
	console.log(2);
}
`.trim();

const actual = formatWithDprint(
	path.resolve(__dirname, ".."),
	"test.ts",
	input,
).trim();

assert.strictEqual(actual, expected);
