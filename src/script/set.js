function generateSet(n) {
    const An = [];
    for (let x = 1; x <= 100; x++) {
        if (x % n === 3) {
            An.push(x);
        }
    }
    return An;
}

function updateResult() {
    const n = parseInt(document.getElementById('nInput').value);
    if (isNaN(n) || n <= 0) {
        alert('양의 정수를 입력해주세요.');
        return;
    }

    const result = generateSet(n);
    if (n === 11) {
        document.getElementById('result').textContent = 'A_{n}은 무슨 뜻일까...?';
    } else {
        document.getElementById('result').textContent = `A_{${n}} = {${result.join(', ')}}`;
    }
}

document.getElementById('calculateBtn').addEventListener('click', updateResult);