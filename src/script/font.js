const colorBox = document.getElementById('color-box');
const redSlider = document.getElementById('red');
const greenSlider = document.getElementById('green');
const blueSlider = document.getElementById('blue');

async function findDocumentByCamo(camo, field = null) {
    try {
        let url = `/find?camo=${encodeURIComponent(camo)}`;
        if (field) {
            url += `&field=${encodeURIComponent(field)}`;
        }

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.text();
    } catch (error) {
        console.error('Error fetching document by camo:', error);
        throw error;
    }
}

let solve_code = null;

async function updateColor() {
    const r = redSlider.value.toString(16).padStart(2, '0');
    const g = greenSlider.value.toString(16).padStart(2, '0');
    const b = blueSlider.value.toString(16).padStart(2, '0');
    const color = `#${r}${g}${b}`;
    colorBox.style.backgroundColor = color;

    if (color === '#006400') {
        if (solve_code === null) {
            solve_code = await findDocumentByCamo('begin', 'code');
        }
        colorBox.textContent = 'CODE:' + solve_code;
        showInputField();
        colorBox.style.color = 'black';
    } else {
        colorBox.textContent = 'what color?';
        hideInputField();
        colorBox.style.color = '#006400';
    }
}



function showInputField() {
    if (!document.getElementById('code-input')) {
        const inputField = document.createElement('input');
        inputField.type = 'text';
        inputField.id = 'code-input';
        inputField.placeholder = 'Enter code here';
        inputField.style.position = 'fixed';
        inputField.style.bottom = '20px';
        inputField.style.left = '50%';
        inputField.style.transform = 'translateX(-50%)';
        inputField.style.padding = '10px';
        inputField.style.width = '200px';

        const submitButton = document.createElement('button');
        submitButton.textContent = 'Submit';
        submitButton.style.position = 'fixed';
        submitButton.style.bottom = '20px';
        submitButton.style.left = '50%';
        submitButton.style.transform = 'translateX(110px)';
        submitButton.style.padding = '10px';

        document.body.appendChild(inputField);
        document.body.appendChild(submitButton);
    } else {
        document.getElementById('code-input').style.display = 'block';
        document.querySelector('button').style.display = 'inline-block';
    }
}

function hideInputField() {
    const inputField = document.getElementById('code-input');
    const submitButton = document.querySelector('button');
    if (inputField) {
        inputField.style.display = 'none';
        submitButton.style.display = 'none';
    }
}

redSlider.addEventListener('input', () => updateColor());
greenSlider.addEventListener('input', () => updateColor());
blueSlider.addEventListener('input', () => updateColor());

updateColor();