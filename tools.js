function displayTests(newTest){
    for( i in newTest.returnQuestionSet()){
      $("#test-display").append($(`
        <div class="frame" id="test-num-${i}">
          ${newTest.returnQuestionSet()[i].returnText()}
        </div>
      `))
      // console.log($("#test-display"));
    }
}
  function makeConsoleTester(logs){
    if(logs.length === 0){
      return ``
    }
    return `
    var logs = ${JSON.stringify(logs)};
    for(log of logs){
    //   logDup("W-logs:", logs, "S-logs:", storedLogs,  "log:", log, "found:", storedLogs.indexOf(log.toString()) === -1 );
      if(storedLogs.indexOf(log) === -1 ){
        failedTests.push(log);
      }else{
        storedLogs.splice(storedLogs.indexOf(log), 1);
      }
    }
    `
  }
  
  function makeVariableTester(vars){
    if(vars.length === 0){
      return ``
    }
    return `
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
    `
  }
  
  function makeFunctionTester(functs){
    if(functs.length === 0){
      return ``;
    }else{
      var newArray = new Array();
      for(funct of functs){
        var name = funct.name;
        for(test of funct.tests){
          var fnCall = name + "(" + test.input +")";
          newArray.push(`
          try{
            var x = ${fnCall};
            if(x !== ${test.output}){
              failedTests.push(${JSON.stringify(fnCall)});
              console.log("in function : ${name}, your output: ", x, "expected output: ${test.output}");
              return;
            }
          }catch{
            failedTests.push(${JSON.stringify(fnCall)});
            console.log("error : function ${name} not found");
            return;
          }
          `);
        }
      }
      return newArray.join("\n");
    }
  }