const display = document.querySelector('.display');
const historyDiv = document.querySelector('.history');
const resultDiv = document.querySelector('.result');
const buttons = document.querySelector('.buttons');

let currentNumber = '';
let previousNumber = '';
let operation = '';
let shouldResetResult = false;

buttons.addEventListener('click', (e) => {
    if (e.target.classList.contains('button')) {
        const value = e.target.textContent;

        if (e.target.classList.contains('operator')) {
            handleOperator(value);
        } else if (value === '.') {
            handleDecimal();
        } else {
            handleNumber(value);
        }
        updateDisplay();
    }
});

function handleNumber(value) {
    if (shouldResetResult) {
        currentNumber = '';
        shouldResetResult = false;
    }
    if (currentNumber.length < 15) {
        currentNumber += value;
    }
}

function handleDecimal() {
    if (shouldResetResult) {
        currentNumber = '0';
        shouldResetResult = false;
    }
    if (!currentNumber.includes('.')) {
        currentNumber += '.';
    }
}

function handleOperator(value) {
    switch (value) {
        case 'AC':
            clearAll();
            break;
        case 'DEL':
            deleteLast();
            break;
        case '=':
            calculate();
            break;
        case '%':
            applyPercentage();
            break;
        default:
            setOperation(value);
            break;
    }
}

function setOperation(op) {
    if (currentNumber === '' && previousNumber === '') return;
    if (currentNumber !== '' && previousNumber !== '') {
        calculate();
    }
    operation = op;
    if (currentNumber !== '') {
        previousNumber = currentNumber;
        currentNumber = '';
    }
    shouldResetResult = false;
}

function calculate() {
    if (previousNumber === '' || currentNumber === '') return;
    let result;
    const prev = parseFloat(previousNumber);
    const curr = parseFloat(currentNumber);

    switch (operation) {
        case '+':
            result = prev + curr;
            break;
        case '-':
            result = prev - curr;
            break;
        case '*':
            result = prev * curr;
            break;
        case '/':
            if (curr === 0) {
                result = 'Error';
            } else {
                result = prev / curr;
            }
            break;
        default:
            return;
    }
    currentNumber = result.toString();
    operation = '';
    previousNumber = '';
    shouldResetResult = true;
}

function applyPercentage() {
    if (currentNumber === '') return;
    currentNumber = (parseFloat(currentNumber) / 100).toString();
}

function clearAll() {
    currentNumber = '';
    previousNumber = '';
    operation = '';
    updateDisplay();
}

function deleteLast() {
    if (shouldResetResult) {
        clearAll();
    } else {
        currentNumber = currentNumber.slice(0, -1);
    }
}

function updateDisplay() {
    resultDiv.textContent = currentNumber === '' ? '0' : formatNumber(currentNumber);
    if (operation != null) {
        historyDiv.textContent = `${formatNumber(previousNumber)} ${operation}`;
    } else {
        historyDiv.textContent = '';
    }
}

function formatNumber(number) {
    if (number === 'Error') return 'Error';
    if (number === '') return '';
    const stringNumber = number.toString();
    const integerDigits = parseFloat(stringNumber.split('.')[0]);
    const decimalDigits = stringNumber.split('.')[1];
    let integerDisplay;
    if (isNaN(integerDigits)) {
        integerDisplay = '';
    } else {
        integerDisplay = integerDigits.toLocaleString('en', {
            maximumFractionDigits: 0,
        });
    }
    if (decimalDigits != null) {
        return `${integerDisplay}.${decimalDigits}`;
    } else {
        return integerDisplay;
    }
}
