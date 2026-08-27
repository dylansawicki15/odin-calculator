let firstNum = 0;
let secondNum = 0;
let operator = "";

function operate(firstNum, secondNum, operator) {
    return operator(firstNum, secondNum);
}

function add(firstNum, secondNum) {
    return firstNum + secondNum;
}

function subtract(firstNum, secondNum) {
    return firstNum - secondNum;
}

function multiply(firstNum, secondNum) {
    return firstNum * secondNum;
}

function divide(firstNum, secondNum) {
    return firstNum / secondNum;
}
