// 

// 코드 확인 및 페이지 이동 함수
async function checkCode() {
    const codeInput = document.getElementById('codeInput').value;
    
    try {
        const data = await findDocumentBycode(codeInput, 'page');
        
        if (data) {
            // 큰따옴표 제거
            const cleanData = data.replace(/"/g, '');
            // pages 폴더 내의 HTML 파일로 이동
            window.location.href = `/pages/${cleanData}.html`;
        } else {
            alert('Invalid code. Please try again.');
        }
    } catch (error) {
        console.error('Error checking code:', error);
        alert('An error occurred. Please try again.');
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







async function findDocumentBycode(code, field = null) { 
    try {
        let url = `/findcode?code=${encodeURIComponent(code)}`;
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
        console.error('Error fetching document by code:', error);
        throw error;
    }
}