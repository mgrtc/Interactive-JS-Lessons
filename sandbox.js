var editor;
var failedTests;

addEventListener("load",()=>{
    editor = CodeMirror(document.querySelector('#code-editor'), {
        lineNumbers: true,
        firstLineNumber: 0,
        tabSize: 2,
        value: 
`function convertFtoC(input){
  return (input - 23) * (5/9);
}
// function convertCtoF(input){
//   return (input * 9/5) + 32;
// }
console.log(5);
console.log(6);
x = 5;
y = 6;
z = 9;`,
        mode: {name: 'javascript'},
        theme: 'monokai'
      });
      
    var newTest = populateATesterTest();

    console.log(newTest);

    displayTests(newTest);
    var element = document.getElementById("run");
    addRunButtonEventListener(element, newTest);
});

function addRunButtonEventListener(element, newTest){
  element.addEventListener("click", function(){
    runCurrentTest(newTest);
  });
}

function populateATesterTest(){
  var newTest = new Test();

  var newQuestion = new Question("Write code that will console.log out 5 and 6");
  newQuestion.addConsoleRequirements("5");
  newQuestion.addConsoleRequirements("6");

  var newVariableTest = new variableTest("x", 5);
  newQuestion.addVariableRequirements(newVariableTest);
  newVariableTest = new variableTest("y", 6);
  newQuestion.addVariableRequirements(newVariableTest);
  newVariableTest = new variableTest("z", 9);
  newQuestion.addVariableRequirements(newVariableTest);

  newTest.addQuestion(newQuestion);

  // newQuestion = new Question("Write code that will set x = 5, y = 6, and z = 9");
  // var newVariableTest = new variableTest("x", 5);
  // newQuestion.addVariableRequirements(newVariableTest);
  // newVariableTest = new variableTest("y", 6);
  // newQuestion.addVariableRequirements(newVariableTest);
  // newVariableTest = new variableTest("z", 9);
  // newQuestion.addVariableRequirements(newVariableTest);
  // newTest.addQuestion(newQuestion);

  newQuestion = new Question("Correct function <b>convertFtoC</b> so that it correctly takes in a degrees in fahrenheit, returns in degrees celcius, then write a function <b>convertCtoF</b> to reverse the conversion");
  var newFunctionTest = new functionTest("convertFtoC");
    newFunctionTest.addTest("32", "0");
    newFunctionTest.addTest("82", "27.77777777777778");
  newQuestion.addFunctionRequirements(newFunctionTest);
  var newFunctionTest = new functionTest("convertCtoF");
    newFunctionTest.addTest("0", "32");
    newFunctionTest.addTest("27.77777777777778", "82");
  newQuestion.addFunctionRequirements(newFunctionTest);
  newTest.addQuestion(newQuestion);

  return newTest;
}

function runCurrentTest(newTest){
    //******************
    //hijack console.log
    //******************
    window.logDup = console.log;           //hang on to an original console.log. what does logDup even do? It doesn't appear to affect how the
    var logToPage  = function(){
        var args = [...arguments];
        $("#console").append($(`<br>`));
        for(arg of args){
            $("#console").append($(`<span>${arg} </span>`));
        }
    };

    storedLogs = [];
    var storeLogs = function(){
      logDup(storedLogs)
      storedLogs.push([...arguments].join(' '));
    }

    console.log = function(){
        //hijack it here
        logDup(...arguments);
        storeLogs(...arguments);
        logToPage(...arguments);
    }
    //**************
    //run user input
    //**************
    failedTests = [];
    testFunctions = [];
    testFunctions.push("(()=>{");
    testFunctions.push(makeConsoleTester(newTest.returnCurrentQuestion().logs));
    testFunctions.push(makeVariableTester(newTest.returnCurrentQuestion().vars));
    testFunctions.push(makeFunctionTester(newTest.returnCurrentQuestion().functs));
    testFunctions.push("})()");
    
    logDup(editor.getValue()+"\n"+testFunctions.join("\n"))
      Function(editor.getValue()+";\n"+testFunctions.join("\n"))(); //we should look into this option, though I wasn't able to access internal variables and functions https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/Function
    // eval(editor.getValue());
    
    if(failedTests.length === 0){
      $(`#test-num-${newTest.currentQuestion}`).css("background-color", "green");
      newTest.nextQuestion();
    }

    //******************
    //analyze user input
    //******************

    // console.log("a:",a);
    // console.log("b:",b);


    //Very important, because eval treats the frame it was called in as its code's global frame from here we can access the user's global variables and functions
    //So any testing we'd want to do on a user's functions and variables will happen here

    //********************************
    // Clean up changes to console.log
    //********************************
    console.log = logDup;
    window.logDup = undefined;
    // console.log("ft",failedTests)
}

