 const fs = require("fs");

// Read toy language code
const input = fs.readFileSync("examples/input.txt", "utf-8");

// Split into lines
const lines = input.split("\n");

// Output JavaScript
let output = "";

// Track declared variables
const declaredVariables = new Set();

// Track open blocks
let openBlocks = 0;

// Process each line with line numbers
lines.forEach((rawLine, index) => {
  const lineNumber = index + 1;
  const line = rawLine.trim();

  // Skip empty lines
  if (line === "") return;

  // Variable declaration
  if (line.startsWith("let")) {
    if (!line.includes("=")) {
      throw new Error(`Syntax error on line ${lineNumber}: Missing '=' in variable declaration`);
    }

    const statement = line.replace("let", "").trim();
    const parts = statement.split("=");

    const name = parts[0].trim();
    const value = parts[1].trim();

    declaredVariables.add(name);
    output += `let ${name} = ${value};\n`;
  }

  // IF condition
  else if (line.startsWith("if")) {
    if (!line.endsWith("{")) {
      throw new Error(`Syntax error on line ${lineNumber}: Missing '{' in if statement`);
    }

    const condition = line
      .replace("if", "")
      .replace("{", "")
      .trim();

    openBlocks++;
    output += `if (${condition}) {\n`;
  }

  // ELSE IF condition
  else if (line.startsWith("} else if")) {
    if (!line.endsWith("{")) {
      throw new Error(`Syntax error on line ${lineNumber}: Missing '{' in else if statement`);
    }

    const condition = line
      .replace("} else if", "")
      .replace("{", "")
      .trim();

    output += `} else if (${condition}) {\n`;
  }

  // ELSE block
  else if (line.startsWith("} else")) {
    if (!line.endsWith("{")) {
      throw new Error(`Syntax error on line ${lineNumber}: Missing '{' in else statement`);
    }

    output += `} else {\n`;
  }

  // WHILE loop
  else if (line.startsWith("while")) {
    if (!line.endsWith("{")) {
      throw new Error(`Syntax error on line ${lineNumber}: Missing '{' in while loop`);
    }

    const condition = line
      .replace("while", "")
      .replace("{", "")
      .trim();

    openBlocks++;
    output += `while (${condition}) {\n`;
  }

  // Block end
  else if (line === "}") {
    openBlocks--;
    if (openBlocks < 0) {
      throw new Error(`Syntax error on line ${lineNumber}: Unexpected '}'`);
    }
    output += "}\n";
  }

  // Print statement
  else if (line.startsWith("print")) {
    const value = line.replace("print", "").trim();

    // Check variable usage
    if (!value.startsWith('"') && !declaredVariables.has(value)) {
      throw new Error(`Semantic error on line ${lineNumber}: Undefined variable '${value}'`);
    }

    output += `console.log(${value});\n`;
  }

  // Variable update / expression
  else if (line.includes("=")) {
    const parts = line.split("=");

    const left = parts[0].trim();
    const right = parts[1].trim();

    if (!declaredVariables.has(left)) {
      throw new Error(`Semantic error on line ${lineNumber}: Variable '${left}' not declared`);
    }

    output += `${left} = ${right};\n`;
  }

  // Unknown statement
  else {
    throw new Error(`Syntax error on line ${lineNumber}: Unknown statement`);
  }
});

// Check for unclosed blocks
if (openBlocks !== 0) {
  throw new Error("Syntax error: Unclosed block '{'");
}

// Show generated JavaScript
console.log("Generated JavaScript Code:\n");
console.log(output);
