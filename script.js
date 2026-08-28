let firstNum = 0;
let secondNum = 0;
let operator = "";
let currentInput = "";

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

const display = document.querySelector(".display");
const buttons = document.querySelector(".buttons");

function appendDigit(digit) {
    currentInput += digit;
    renderDisplay(currentInput);
}

function renderDisplay(value) {
    display.textContent = value;
}

buttons.addEventListener("click", (event) => {
    if (!event.target.matches(".digit")) return;
    appendDigit(event.target.textContent);
});

renderDisplay(currentInput);
