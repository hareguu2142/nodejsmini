const colorBox = document.getElementById("color-box");
const redSlider = document.getElementById("red");
const greenSlider = document.getElementById("green");
const blueSlider = document.getElementById("blue");
const textDisplay = document.createElement("div");
document.body.appendChild(textDisplay);
textDisplay.style.position = "fixed";
textDisplay.style.top = "50%";
textDisplay.style.left = "50%";
textDisplay.style.transform = "translate(-50%, -50%)";
textDisplay.style.fontSize = "24px";
textDisplay.style.fontWeight = "bold";

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

let solve_code = null;

async function updateColor() {
    const r = parseInt(redSlider.value);
    const g = parseInt(greenSlider.value);
    const b = parseInt(blueSlider.value);
    const color = `rgb(${r},${g},${b})`;
    document.body.style.backgroundColor = color;
    if (r === 0 && g === 100 && b === 0) {
        alert("!!!");
        solve_code = await findDocumentByCamo("begin", "code");
        textDisplay.textContent = "CODE:" + solve_code;
        textDisplay.style.color = "black";
        codeInput.style.display = "block"; // 정해진 색상이 되면 변경되면 코드 입력 창을 보이게 함
        submitButton.style.display = "block"; // 정해진 색상이 되면 변경되면 코드 입력 창을 보이게 함
        showInputField();
    } else {
        textDisplay.textContent = "what color??";
        textDisplay.style.color = "RGB(0, 100, 0)";
        codeInput.style.display = "none";
        submitButton.style.display = "none";
    }
}

function showInputField() {
    if (!document.getElementById("codeInput")) {
        const inputField = document.createElement("input");
        inputField.type = "text";
        inputField.id = "codeInput";
        inputField.placeholder = "Enter code here";
        inputField.style.position = "fixed";
        inputField.style.bottom = "20px";
        inputField.style.left = "50%";
        inputField.style.transform = "translateX(-50%)";
        inputField.style.padding = "10px";
        inputField.style.width = "200px";

        const submitButton = document.createElement("button");
        submitButton.textContent = "Submit";
        submitButton.style.position = "fixed";
        submitButton.style.bottom = "20px";
        submitButton.style.left = "50%";
        submitButton.style.transform = "translateX(110px)";
        submitButton.style.padding = "10px";


    }
}


// Submit 버튼에 이벤트 리스너 추가
const submitButton = document.getElementById("submitButton");
submitButton.addEventListener("click", checkCode);

redSlider.addEventListener("input", () => updateColor());
greenSlider.addEventListener("input", () => updateColor());
blueSlider.addEventListener("input", () => updateColor());


updateColor();
