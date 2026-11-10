let currentOperand = '';
let previousOperand = '';
let operation = undefined;
let shouldResetDisplay = false;

const display = document.getElementById('display');

// Fungsi baru untuk menampilkan seluruh persamaan di layar
function updateDisplay() {
    if (operation != null) {
        // Mengubah simbol agar terlihat lebih rapih di layar
        let symbol = operation;
        if (operation === '*') symbol = '×';
        if (operation === '/') symbol = '÷';
        
        display.innerText = `${previousOperand} ${symbol} ${currentOperand}`;
    } else {
        display.innerText = currentOperand === '' ? '0' : currentOperand;
    }
}

function appendNumber(number) {
    // Reset jika user mengetik angka baru setelah menekan sama dengan (=)
    if (shouldResetDisplay && operation === undefined) {
        currentOperand = '';
        shouldResetDisplay = false;
    }
    
    // Aturan BVA: Maksimal 8 digit per angka yang dimasukkan
    if (currentOperand.replace('.', '').length >= 8) return;
    if (number === '.' && currentOperand.includes('.')) return;
    
    if (currentOperand === '' && number === '.') {
        currentOperand = '0.';
    } else if (currentOperand === '0' && number !== '.') {
        currentOperand = number;
    } else {
        currentOperand += number;
    }
    
    updateDisplay();
}

function appendOperator(op) {
    if (display.innerText === 'Error') return;

    // Memungkinkan user melanjutkan hitungan (chaining) setelah menekan =
    if (shouldResetDisplay) {
        shouldResetDisplay = false;
    }

    if (currentOperand === '') {
        // Mengizinkan user mengganti operator jika salah klik (misal: klik + lalu ganti -)
        if (previousOperand !== '') {
            operation = op;
            updateDisplay();
        }
        return;
    }

    if (previousOperand !== '') {
        calculate();
    }

    operation = op;
    previousOperand = currentOperand;
    currentOperand = '';
    updateDisplay();
}

function calculateSquareRoot() {
    if (display.innerText === 'Error') return;
    
    let valueToRoot = currentOperand !== '' ? parseFloat(currentOperand) : parseFloat(previousOperand);
    
    if (isNaN(valueToRoot)) return;

    // Aturan EP: Akar dari angka negatif adalah Error
    if (valueToRoot < 0) {
        display.innerText = 'Error';
        currentOperand = '';
        previousOperand = '';
        operation = undefined;
        return;
    }

    let result = Math.sqrt(valueToRoot);
    
    if (result.toString().includes('.')) {
        result = parseFloat(result.toFixed(6));
    }

    currentOperand = result.toString();
    operation = undefined;
    previousOperand = '';
    shouldResetDisplay = true;
    updateDisplay();
}

function calculate() {
    let result;
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);

    if (isNaN(prev) || isNaN(current)) return;

    // Aturan EP: Pembagian dengan 0 adalah Error
    if (operation === '/' && current === 0) {
        display.innerText = 'Error';
        currentOperand = '';
        previousOperand = '';
        operation = undefined;
        return;
    }

    switch (operation) {
        case '+': result = prev + current; break;
        case '-': result = prev - current; break;
        case '*': result = prev * current; break;
        case '/': result = prev / current; break;
        case '^': result = Math.pow(prev, current); break;
        default: return;
    }

    if (result.toString().includes('.')) {
        result = parseFloat(result.toFixed(6));
    }

    currentOperand = result.toString();
    operation = undefined;
    previousOperand = '';
    shouldResetDisplay = true;
    updateDisplay();
}

function clearDisplay() {
    currentOperand = '';
    previousOperand = '';
    operation = undefined;
    shouldResetDisplay = false;
    updateDisplay();
}

function deleteNumber() {
    if (display.innerText === 'Error' || shouldResetDisplay) {
        clearDisplay();
        return;
    }

    // Logika hapus modern: Hapus angka saat ini, jika kosong hapus operatornya
    if (currentOperand !== '') {
        currentOperand = currentOperand.toString().slice(0, -1);
    } else if (operation !== undefined) {
        operation = undefined;
        currentOperand = previousOperand;
        previousOperand = '';
    }
    
    updateDisplay();
}