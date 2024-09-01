// 

// 코드 확인 및 페이지 이동 함수
async function checkCode() {
    const codeInput = document.getElementById('codeInput').value;
    
    try {
        const data = await getMapFromCode(codeInput);
        
        if (data.success) {
            // pages 폴더 내의 HTML 파일로 이동
            window.location.href = `/pages/${data.page}.html`;
        } else {
            alert('Invalid code. Please try again.');
        }
    } catch (error) {
        console.error('Error checking code:', error);
        alert('An error occurred. Please try again.');
    }
}

// 코드로부터 맵 정보 가져오기
async function getMapFromCode(code) {
    try {
        const response = await fetch('/check-code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code: code }),
        });
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching map from code:', error);
        throw error;
    }
}

// 모든 코드 가져오기
async function getAllCodes() {
    try {
        const response = await fetch('/get-all-codes', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching all codes:', error);
        throw error;
    }
}

// 모든 맵 가져오기
async function getAllMaps() {
    try {
        const response = await fetch('/get-all-maps', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching all maps:', error);
        throw error;
    }
}

// 다른 js 파일에서 사용할 수 있도록 함수들을 export
