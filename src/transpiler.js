const fs = require("fs");

/*
1. Read toy language code from file
   Result is ONE big string
*/
const input = fs.readFileSync("examples/input.txt", "utf-8");

/*
2. Break the code into lines
   Each line = one instruction
*/
const lines = input.split("\n");

/*
3. This will store generated JavaScript code
*/
let output = "";

/*
4. This object will act as memory for variables
*/
const variables = {};

/*
5. Process each line one by one
*/
for (let line of lines) {

  // Remove extra spaces
  line = line.trim();

  /*
  HANDLE VARIABLE DECLARATION
  Example: let x = 5
  */
  if (line.startsWith("let")) {

    // Remove 'let' keyword
    const statement = line.replace("let", "").trim();

    // Split name and value
    const parts = statement.split("=");

    const variableName = parts[0].trim();
    const variableValue = parts[1].trim();

    // Store in memory
    variables[variableName] = variableValue;
  }

  /*
  HANDLE PRINT STATEMENT
  Example: print x
  */
  else if (line.startsWith("print")) {

    const value = line.replace("print", "").trim();

    // If value exists in memory, print variable
    if (variables[value] !== undefined) {
      output += `console.log(${variables[value]});\n`;
    } 
    // Otherwise print directly (string or number)
    else {
      output += `console.log(${value});\n`;
    }
  }
}

/*
6. Show the generated JavaScript code
*/
console.log("Generated JavaScript Code:\n");
console.log(output);
