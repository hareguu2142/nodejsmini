// 코드 확인 및 페이지 이동 함수
async function checkCode() {
    const codeInput = document.getElementById("codeInput").value;

    try {
        const data = await findDocumentBycode(codeInput, "page");

        if (data) {
            // 큰따옴표 제거
            const cleanData = data.replace(/"/g, "");
            // pages 폴더 내의 HTML 파일로 이동
            window.location.href = `/pages/${cleanData}.html`;
        } else {
            alert("Invalid code. Please try again.");
        }
    } catch (error) {
        console.error("Error checking code:", error);
        alert("An error occurred. Please try again.");
    }
}

// camo -> field value 가져오기 값 불러오는 예시 코드 solve_code = await findDocumentByCamo('begin', 'code');
async function findDocumentByCamo(camo, field = null) {
    try {
        let url = `/find?camo=${encodeURIComponent(camo)}`;
        if (field) {
            url += `&field=${encodeURIComponent(field)}`;
        }

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.text();
    } catch (error) {
        console.error("Error fetching document by camo:", error);
        throw error;
    }
}

async function findDocumentBycode(code, field = null) {
    try {
        let url = `/findcode?code=${encodeURIComponent(code)}`;
        if (field) {
            url += `&field=${encodeURIComponent(field)}`;
        }

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.text();
    } catch (error) {
        console.error("Error fetching document by code:", error);
        throw error;
    }
}

// 모든 문자가 포함되어 있는지 확인
function containsAllCharacters(text, charArray) {
    return charArray.every((char) => text.includes(char));
}

async function checkText() {
    const inputText = document.getElementById("inputText").value;
    const keywordvalue = await findDocumentByCamo("philosophy", "hint1");
    let keyword = [...keywordvalue].slice(1, 7);
    console.log(keyword);
    console.log(inputText);
    let result = "";
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

    // 모든 문자가 포함되어 있는지 확인
    for (let char of keyword) {
        if (!containsAllCharacters(inputText, keyword)) {
            allKeywordsFound = false;
        }
    }
    // Check if all keywords were found
    if (allKeywordsFound && !document.getElementById("newInput")) {
        // Check if the new input box already exists
        // Create a new input box
        const newInput = document.createElement("input");
        newInput.type = "text";
        newInput.id = "newInput";
        newInput.placeholder = "CODE:?";
        document.body.appendChild(newInput);
        const hint = await findDocumentByCamo("philosophy", "code");
        const cleanhint = hint.replace(/"/g, "");

        // Add an event listener to the new input box
        newInput.addEventListener("input", () => {
            if (newInput.value === cleanhint) {
                alert("정답!");
            }
        });
    } else {
        allKeywordsFound = false;
    }

    document.getElementById("result").innerHTML = result;
    if (allKeywordsFound) {
        document.getElementById("result").innerHTML += "<br>!";
    }
}
