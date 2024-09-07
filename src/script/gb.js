// 범용적으로 사용해야하는 경우에 활용하는 함수입니다.

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
