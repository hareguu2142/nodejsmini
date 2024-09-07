// 범용적으로 사용해야하는 경우에 활용하는 함수입니다.

// 코드 확인 및 페이지 이동 함수
async function checkCode() {
    const codeInput = document.getElementById("codeInput").value; // 입력필드는 codeInput이어야합니다.

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

// DB를 이용해서, camo value으로부터 특정 field의 value를 불러오는 코드입니다. 예시: solve_code = await findDocumentByCamo('begin', 'code');
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
// DB를 이용해서, code value으로부터 특정 field의 value를 불러오는 코드입니다.
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

document.addEventListener("DOMContentLoaded", function () {
    const sunIcon = document.getElementById("sun-icon");
    const body = document.body;
    const codeText = document.getElementById("code-text");
    let isDark = false;

    // 입력 필드와 제출 버튼 생성
    const inputField = document.createElement("input");
    inputField.type = "text";
    inputField.id = "codeInput"; // 여기를 "codeInput"으로 변경
    inputField.placeholder = "Enter code here";
    inputField.style.position = "fixed";
    inputField.style.bottom = "20px";
    inputField.style.left = "50%";
    inputField.style.transform = "translateX(-50%)";
    inputField.style.padding = "10px";
    inputField.style.width = "200px";
    inputField.style.display = "none";

    const submitButton = document.createElement("button");
    submitButton.textContent = "Submit";
    submitButton.style.position = "fixed";
    submitButton.style.bottom = "20px";
    submitButton.style.left = "50%";
    submitButton.style.transform = "translateX(110px)";
    submitButton.style.padding = "10px";
    submitButton.style.display = "none";

    body.appendChild(inputField);
    body.appendChild(submitButton);

    sunIcon.addEventListener("click", function () {
        if (!isDark) {
            // 화면을 어둡게 만들기
            body.style.backgroundColor = "black";
            body.style.transition = `background-color 10s`;
            codeText.style.display = "block";
            inputField.style.display = "block";
            submitButton.style.display = "block";
            isDark = true;
        } else {
            // 화면을 밝게 만들기
            body.style.backgroundColor = "#ffe400";
            body.style.transition = `background-color 1s`;
            codeText.style.display = "block";
            inputField.style.display = "none";
            submitButton.style.display = "none";
            isDark = false;
        }
    });

    submitButton.addEventListener("click", async function () {
        const code = await findDocumentByCamo("test", "code");
        const cleancode = code.replace(/"/g, "");
        const enteredCode = inputField.value.trim(); // 여기서 inputField.value 사용
        if (enteredCode === cleancode) {
            alert("Correct code!");
            checkCode();
            // 코드가 정확한 경우 correct코드가 실행되도록 합니다.
        } else {
            alert("Incorrect code. Try again.");
        }
        inputField.value = ""; // 입력 필드 초기화
    });
});
