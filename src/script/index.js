async function checkCode() {
    const codeInput = document.getElementById('codeInput').value;
    
    try {
        const response = await fetch('/js/codetomap.json');
        const data = await response.json();
        
        const matchingCode = data.codes.find((item) => item.code === codeInput);
        
        if (matchingCode) {
            // pages 폴더 내의 HTML 파일로 이동
            window.location.href = `/pages/${matchingCode.page}.html`;
        } else {
            alert('Invalid code. Please try again.');
        }
    } catch (error) {
        console.error('Error fetching or parsing JSON:', error);
    }
}