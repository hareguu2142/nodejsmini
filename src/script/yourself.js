function checkText() {
    const inputText = document.getElementById('inputText').value;
    const keyword = ['너', '자', '신', '을', '알', '라'];
    let result = '';
    let allKeywordsFound = true; // Add a flag to track if all keywords are found

    for (let char of inputText) {
        if (keyword.includes(char)) {
            result += `<span class="highlight">${char}</span>`;
            // Remove the keyword from the array if found
            keyword.splice(keyword.indexOf(char), 1);
        } else {
            result += char;
        }
    }

    // Check if all keywords were found
    if (keyword.length === 0 && !document.getElementById('newInput')) { // Check if the new input box already exists
        // Create a new input box
        const newInput = document.createElement('input');
        newInput.type = 'text';
        newInput.id = 'newInput';
        newInput.placeholder = 'CODE:?';
        document.body.appendChild(newInput);

        // Add an event listener to the new input box
        newInput.addEventListener('input', () => {
            if (newInput.value === '소크라테스') {
                alert('정답!');
            }
        });
    } else {
        allKeywordsFound = false;
    }

    document.getElementById('result').innerHTML = result;
    if (allKeywordsFound) {
        document.getElementById('result').innerHTML += '<br>!';
    }
}