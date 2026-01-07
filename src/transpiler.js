const fs = require("fs");

// ---------- STATE ----------
const declaredVariables = new Set();
let openBlocks = 0;
let output = "";

// ---------- ERROR HELPERS ----------
function syntaxError(line, message) {
  throw new Error(`Syntax error on line ${line}: ${message}`);
}

function semanticError(line, message) {
  throw new Error(`Semantic error on line ${line}: ${message}`);
}

// ---------- HANDLERS ----------
function handleDeclaration(line, lineNumber) {
  if (!line.includes("=")) {
    syntaxError(lineNumber, "Missing '=' in variable declaration");
  }

  const statement = line.replace("let", "").trim();
  const [name, value] = statement.split("=").map(s => s.trim());

  declaredVariables.add(name);
  return `let ${name} = ${value};\n`;
}

function handleIf(line, lineNumber) {
  if (!line.endsWith("{")) {
    syntaxError(lineNumber, "Missing '{' in if statement");
  }

  openBlocks++;
  const condition = line.replace("if", "").replace("{", "").trim();
  return `if (${condition}) {\n`;
}

function handleElseIf(line, lineNumber) {
  if (!line.endsWith("{")) {
    syntaxError(lineNumber, "Missing '{' in else if statement");
  }

  const condition = line.replace("} else if", "").replace("{", "").trim();
  return `} else if (${condition}) {\n`;
}

function handleElse() {
  return `} else {\n`;
}

function handleWhile(line, lineNumber) {
  if (!line.endsWith("{")) {
    syntaxError(lineNumber, "Missing '{' in while loop");
  }

  openBlocks++;
  const condition = line.replace("while", "").replace("{", "").trim();
  return `while (${condition}) {\n`;
}

// 🔥 NEW FEATURE: repeat loop
function handleRepeat(line, lineNumber) {
  if (!line.endsWith("{")) {
    syntaxError(lineNumber, "Missing '{' in repeat loop");
  }

  const count = line
    .replace("repeat", "")
    .replace("{", "")
    .trim();

  if (isNaN(count)) {
    syntaxError(lineNumber, "Repeat count must be a number");
  }

  openBlocks++;
  return `for (let i = 0; i < ${count}; i++) {\n`;
}

function handleBlockEnd(lineNumber) {
  openBlocks--;
  if (openBlocks < 0) {
    syntaxError(lineNumber, "Unexpected '}'");
  }
  return "}\n";
}

function handlePrint(line, lineNumber) {
  const value = line.replace("print", "").trim();

  if (!value.startsWith('"') && !declaredVariables.has(value)) {
    semanticError(lineNumber, `Undefined variable '${value}'`);
  }

  return `console.log(${value});\n`;
}

function handleExpression(line, lineNumber) {
  const [left, right] = line.split("=").map(s => s.trim());

  if (!declaredVariables.has(left)) {
    semanticError(lineNumber, `Variable '${left}' not declared`);
  }

  return `${left} = ${right};\n`;
}

// ---------- MAIN ----------
const input = fs.readFileSync("examples/input.txt", "utf-8");
const lines = input.split("\n");

lines.forEach((rawLine, index) => {
  const lineNumber = index + 1;
  const line = rawLine.trim();

  if (line === "") return;

  if (line.startsWith("let")) {
    output += handleDeclaration(line, lineNumber);
  }
  else if (line.startsWith("if")) {
    output += handleIf(line, lineNumber);
  }
  else if (line.startsWith("} else if")) {
    output += handleElseIf(line, lineNumber);
  }
  else if (line.startsWith("} else")) {
    output += handleElse();
  }
  else if (line.startsWith("while")) {
    output += handleWhile(line, lineNumber);
  }
  else if (line.startsWith("repeat")) {
    output += handleRepeat(line, lineNumber);
  }
  else if (line === "}") {
    output += handleBlockEnd(lineNumber);
  }
  else if (line.startsWith("print")) {
    output += handlePrint(line, lineNumber);
  }
  else if (line.includes("=")) {
    output += handleExpression(line, lineNumber);
  }
  else {
    syntaxError(lineNumber, "Unknown statement");
  }
});

// Final validation
if (openBlocks !== 0) {
  throw new Error("Syntax error: Unclosed '{'");
}

console.log("Generated JavaScript Code:\n");
console.log(output);

