let num = 0;
let operator = "";
let currentInput = "";
let showingResult = false;
const infinityError = "Error: infinity";

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
        case "add": return add;
        case "subtract": return subtract;
        case "multiply": return multiply;
        case "divide": return divide;
    }
}

const typedNumber = () => Number(currentInput);

function evaluate() {
    const result = operate(num, typedNumber(), getOperation(operator));
    if (!Number.isFinite(result)) return null; 
    return result;
}

function showError(message) {
    clearAll();
    renderDisplay(message);
}

function clearAll() {
    num = 0;
    operator = "";
    currentInput = "";
    showingResult = false;
    renderDisplay(currentInput);
}

buttons.addEventListener("click", (event) => {
    if (event.target.matches(".digit")) {
        if (showingResult) {
            currentInput = "";
            showingResult = false;
        }
        appendDigit(event.target.textContent);
        return;
    }
    
    if (event.target.matches(".clear")) {
        clearAll();
        return;
    }

    if (event.target.matches(".operator")) {
        showingResult = false;

        if (operator !== "" && currentInput !== "") {
            const result = evaluate();
            if (result === null) {
                showError(infinityError);
                return;
            }
            num = result;
            renderDisplay(num);
        } else if (operator === "") {
            num = typedNumber();
        }

        operator = event.target.dataset.op;
        currentInput = "";
        return;
    }

    if (event.target.matches(".equals")) {
        if (operator === "") return;
        const result = evaluate();
        if (result === null) {
            showError(infinityError);
            return;
        }
        renderDisplay(result);
        currentInput = String(result);
        operator = "";
        showingResult = true;
        return;
    }
});

renderDisplay(currentInput);
