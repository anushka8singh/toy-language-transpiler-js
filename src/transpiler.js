let projectName ="Toy Language Transpiler";
console.log(projectName);

function startTranspiler(){
    console.log("Transpiler is starting...");
}

startTranspiler();

function transpileLine(line){
    return "//Transpiled code will go here";
}

console.log(transpileLine("print hello"));