class Stack{
    top;
    newStack;
    constructor(){
      this.newStack = [];
      this.top = -1;
    }
    push(data){
      this.top++;
      this.newStack[this.top] = data;
    }
    pop(){
      var newData = this.newStack[this.top];
      this.top--;
      return newData;
    }
    peek(){
      return this.newStack[this.top];
    }
  }