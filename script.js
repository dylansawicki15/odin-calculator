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
    if (value === "") {
        display.textContent = "0";
        return;
    }
    display.textContent = value;
}

function getOperation(name) {
    switch (name) {
        // TODO(you): one case per operator, each returning the function itself
        case "add": return add;
        case "subtract": return subtract;
        case "multiply": return multiply;
        case "divide": return divide;
    }
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
        return;
    }

    if (event.target.matches(".operator")) {
        firstNum = Number(currentInput);
        operator = event.target.dataset.op;
        currentInput = "";
        return;
    }

    if (event.target.matches(".equals")) {
        if (operator === "") return;
        secondNum = Number(currentInput);

        const operation = getOperation(operator);
        renderDisplay(operate(firstNum, secondNum, operation)); 
        return;
    }
});

renderDisplay(currentInput);
