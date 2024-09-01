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

async function checkText() {
    const inputText = document.getElementById('inputText').value;
    const keywordvalue = await findDocumentByCamo('philosophy', 'hint1');
    keyword = [...keywordvalue];

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
    if (!document.getElementById('newInput')) { // Check if the new input box already exists
        // Create a new input box
        const newInput = document.createElement('input');
        newInput.type = 'text';
        newInput.id = 'newInput';
        newInput.placeholder = 'CODE:?';
        document.body.appendChild(newInput);
        const hint = await findDocumentByCamo('philosophy', 'code');
        const cleanhint = hint.replace(/"/g, '');

        // Add an event listener to the new input box
        newInput.addEventListener('input', () => {
            if (newInput.value === cleanhint) {
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