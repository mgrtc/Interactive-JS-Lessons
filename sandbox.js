var tests = [
  {text:"Write code that will console.log out 5 and 6", logs: ['5', '6'], vars: []},
  {text:"Write code that will set x = 5, y = 6, and z = 9", logs: [], vars: [{name: "x", val: 5}, {name: "y", val: 6}, {name: "z", val: 9}]}
]
var failedTests;
currentTest = 0;

function displayTests(){
  for( i in tests){
    $("#test-display").append($(`
      <div class="frame" id="test-num-${i}">
        ${tests[i].text}
      </div>
    `))
    console.log($("#test-display"))
  }
}

window.addEventListener("load", ()=>{
  displayTests();
})

function makeConsoleTester(logs){
  if(logs.length === 0){
    return ``
  }
  return `
(()=>{
  var logs = ${JSON.stringify(logs)};
  logDup("logs:", logs);
  for(log of logs){
    logDup("W-logs:", logs, "S-logs:", storedLogs,  "log:", log, "found:", storedLogs.indexOf(log.toString()) === -1 );
    if(storedLogs.indexOf(log) === -1 ){
      failedTests.push(log);
    }else{
      storedLogs.splice(storedLogs.indexOf(log), 1);
    }
  }
})()
  `
}

function makeVariableTester(vars){
  if(vars.length === 0){
    return ``
  }
  return `
(()=>{
  var vars = ${JSON.stringify(vars)};
  for(variable of vars){
    try{
      if(JSON.stringify(eval(variable.name)) !== JSON.stringify(variable.val)){
        failedTests.push(variable);
      }
    }catch{
      failedTests.push(variable);
    }
  }
})()
  `
}

function runCurrentTest(){
    //******************
    //hijack console.log
    //******************
    window.logDup = console.log;           //hang on to an original console.log
    var logToPage  = function(){
        var args = [...arguments];
        $("#console").append($(`<br>`));
        for(arg of args){
            $("#console").append($(`<span>${arg} </span>`));
        }
    };

    storedLogs = [];
    var storeLogs = function(){
      // logDup(storedLogs)
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

    // var ftc = `((input)=>{
    //   console.log('ftc:', (input - 32) * (5/9), a);
    // })`
    failedTests = [];
    testFunctions = [];
    testFunctions.push(makeConsoleTester(tests[currentTest].logs));
    testFunctions.push(makeVariableTester(tests[currentTest].vars));
    
    
    logDup(editor.getValue()+"\n"+testFunctions.join("\n"))
    Function(editor.getValue()+";\n"+testFunctions.join("\n"))(); //we should look into this option, though I wasn't able to access internal variables and functions https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/Function
    // eval(editor.getValue());
    
    if(failedTests.length === 0){
      $(`#test-num-${currentTest}`).css("background-color", "green");
      currentTest += 1;
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
    console.log("ft",failedTests)
}


//*************************************************
//*Initialize editor, and wire up the play button *
//*************************************************


var editor;
addEventListener("load",()=>{
    editor = CodeMirror(document.querySelector('#code-editor'), {
        lineNumbers: true,
        firstLineNumber: 0,
        tabSize: 2,
        value: 
`console.log(5)
console.log(6)
x = 2
y = 3
z = 9`
// `var a = 10;
// function b(){
//   a = 5;  
//   c();
//   console.log(d);
// }
// function c(){
//   d = 6;
//   var a = 7;
//   e = 9;
//   function f(){
//     a = 2;
//   }
//   f();
// }
// b();`
,
        mode: {name: 'javascript'},
        theme: 'monokai'
      });
    $("#run").on("click",runCurrentTest);
});
