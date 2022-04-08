class Test{
  testQuestionSet;
  currentQuestion;
  constructor(){
    this.testQuestionSet = new Array();
    this.currentQuestion = 0;
  }
  //add question setters and getters
  addQuestion(newQuestion){
    this.testQuestionSet.push(newQuestion);
  }
  nextQuestion(){
    if(this.currentQuestion >= this.testQuestionSet.length-1){
      return;
    }
    this.currentQuestion++;
  }
  returnCurrentQuestion(){
    return this.testQuestionSet[this.currentQuestion];
  }
  returnQuestionSet(){
    return this.testQuestionSet;
  }
}
class Question{
  text; //Question - a string
  logs;//array of console.logs to be detected 
  vars; //variables to be detected
  functs; //functions to be made, along with tests.
  //we got three types of questions so far, asking for console.logs; asking to create variables with specific values, function name and expected inputs/outputs
  constructor(text){
    this.text = text;
    this.logs = new Array();
    this.vars = new Array();
    this.functs = new Array();
  }
  returnText(){
    return this.text;
  }
  returnConsoleTests(){
    return this.logs;
  }
  returnVariableTests(){
    return this.vars;
  }
  returnFunctionTests(){
    return this.functs;
  }
  addConsoleRequirements(testCase){ //could be a number or string. 
    this.logs.push(testCase);
  }
  addVariableRequirements(newVariableTest){
    this.vars.push({name: newVariableTest.name, val: newVariableTest.val});
  }
  addFunctionRequirements(newFunctionTest){ //string, array[{input = "", output = ""}, ..]
    this.functs.push({name: newFunctionTest.name, tests : newFunctionTest.tests});
  }
  
}
class variableTest{
  type; //eg var, let, or... am i missing anything? *currently not used.
  name; //name
  val; //value. strings allowed
  constructor(name, value){
    this.name = name;
    this.val = value;
  }
}
class functionTest{
  name; //function name without the parenthesis
  tests; //
  constructor(name){
    this.name = name;
    this.tests = new Array();
  }
  addTest(testInput, expectedOutput){ //testInput = "<string>" ie: "3", 
    this.tests.push({input: testInput, output : expectedOutput});
  }
}