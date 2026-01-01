 const fs = require("fs");

// Read toy language code
const input = fs.readFileSync("examples/input.txt", "utf-8");

// Split code into lines
const lines = input.split("\n");

// Collect generated JavaScript
let output = "";

// Process each line
for (let line of lines) {
  line = line.trim();

  // 1. Variable declaration
  if (line.startsWith("let")) {
    const statement = line.replace("let", "").trim();
    const parts = statement.split("=");

    const name = parts[0].trim();
    const value = parts[1].trim();

    output += `let ${name} = ${value};\n`;
  }

  // 2. IF condition
  else if (line.startsWith("if")) {
    const condition = line
      .replace("if", "")
      .replace("{", "")
      .trim();

    output += `if (${condition}) {\n`;
  }

  // 3. WHILE loop
  else if (line.startsWith("while")) {
    const condition = line
      .replace("while", "")
      .replace("{", "")
      .trim();

    output += `while (${condition}) {\n`;
  }

  // 4. Block end
  else if (line === "}") {
    output += "}\n";
  }

  // 5. Print statement
  else if (line.startsWith("print")) {
    const value = line.replace("print", "").trim();
    output += `console.log(${value});\n`;
  }

  // 6. Variable update / expression
  else if (line.includes("=")) {
    const parts = line.split("=");

    const left = parts[0].trim();
    const right = parts[1].trim();

    output += `${left} = ${right};\n`;
  }
}

// Show generated JavaScript
console.log("Generated JavaScript Code:\n");
console.log(output);
