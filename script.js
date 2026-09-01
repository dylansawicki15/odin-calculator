let num = 0;
let operator = "";
let currentInput = "";
let showingResult = false;
const infinityError = "Error: infinity";
const MAX_DECIMALS = 2;

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
const point = document.querySelector(".point");

function appendDigit(digit) {
    if (currentInput === "" && digit === ".") currentInput = "0";
    currentInput += digit;
    syncPointButton();
    renderDisplay(currentInput);
}

function renderDisplay(value) {
    if (value === "") {
        display.textContent = "0";
        return;
    }
    display.textContent = value;
}

function roundForDisplay(value) {
    return Number(value.toFixed(MAX_DECIMALS));
}

function syncPointButton() {
    point.disabled = !showingResult && currentInput.includes(".");
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
    syncPointButton();
}

buttons.addEventListener("click", (event) => {
    if (event.target.matches(".digit")) {
        if (showingResult) {
            currentInput = "";
            syncPointButton();
            showingResult = false;
        }
        appendDigit(event.target.textContent);
        return;
    }
    
    if (event.target.matches(".clear")) {
        clearAll();
        return;
    }

    if (event.target.matches(".backspace")) {
        currentInput = currentInput.slice(0, -1);
        syncPointButton(); 
        renderDisplay(currentInput);
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
            renderDisplay(roundForDisplay(num));
        } else if (operator === "") {
            num = typedNumber();
        }

        operator = event.target.dataset.op;
        currentInput = "";
        syncPointButton();
        return;
    }

    if (event.target.matches(".equals")) {
        if (operator === "") return;
        const result = evaluate();
        if (result === null) {
            showError(infinityError);
            return;
        }
        renderDisplay(roundForDisplay(result));
        currentInput = String(result);
        operator = "";
        showingResult = true;
        syncPointButton();
        return;
    }
});

renderDisplay(currentInput);
