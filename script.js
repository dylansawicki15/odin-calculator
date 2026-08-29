let firstNum = 0;
let secondNum = 0;
let operator = "";
let currentInput = "";

function operate(a, b, operator) {
    return operator(a, b);
}

function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    return a / b;
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

function clearAll() {
    firstNum = 0;
    secondNum = 0;
    operator = "";
    currentInput = "";
    renderDisplay(currentInput);
}

buttons.addEventListener("click", (event) => {
    if (event.target.matches(".digit")) {
        appendDigit(event.target.textContent);
        return;
    }
    
    if (event.target.matches(".clear")) {
        clearAll();
    }
});

renderDisplay(currentInput);
