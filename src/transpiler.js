const fs = require("fs");

// Read toy language code
const input = fs.readFileSync("examples/input.txt", "utf-8");

// Split code into individual lines
const lines = input.split("\n");

// This will collect generated JavaScript code
let output = "";

// Process each line one by one
for (let line of lines) {
  line = line.trim();

  // 1. Variable declaration: let x = 5
  if (line.startsWith("let")) {
    const statement = line.replace("let", "").trim();
    const parts = statement.split("=");

    const name = parts[0].trim();
    const value = parts[1].trim();

    output += `let ${name} = ${value};\n`;
  }

  // 2. Conditional start: if x > 5 {
  else if (line.startsWith("if")) {
    const condition = line
      .replace("if", "")
      .replace("{", "")
      .trim();

    output += `if (${condition}) {\n`;
  }

  // 3. Block end: }
  else if (line === "}") {
    output += "}\n";
  }

  // 4. Print statement: print x
  else if (line.startsWith("print")) {
    const value = line.replace("print", "").trim();
    output += `console.log(${value});\n`;
  }

  // 5. Variable update / expression: x = x + 1
  else if (line.includes("=")) {
    const parts = line.split("=");

    const left = parts[0].trim();
    const right = parts[1].trim();

    output += `${left} = ${right};\n`;
  }
}

// Show the generated JavaScript
console.log("Generated JavaScript Code:\n");
console.log(output);
