document.addEventListener('DOMContentLoaded', function() {
    const sunIcon = document.getElementById('sun-icon');
    const body = document.body;
    const codeText = document.getElementById('code-text');
    let isDark = false;

    // 입력 필드와 제출 버튼 생성
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
    inputField.style.display = 'none';

    const submitButton = document.createElement('button');
    submitButton.textContent = 'Submit';
    submitButton.style.position = 'fixed';
    submitButton.style.bottom = '20px';
    submitButton.style.left = '50%';
    submitButton.style.transform = 'translateX(110px)';
    submitButton.style.padding = '10px';
    submitButton.style.display = 'none';

    body.appendChild(inputField);
    body.appendChild(submitButton);

    sunIcon.addEventListener('click', function() {
        if (!isDark) {
            // 화면을 어둡게 만들기
            body.style.backgroundColor = 'black';
            body.style.transition = `background-color 10s`;
            codeText.style.display = 'block';
            inputField.style.display = 'block';
            submitButton.style.display = 'block';
            isDark = true;
        } else {
            // 화면을 밝게 만들기
            body.style.backgroundColor = '#ffe400';
            body.style.transition = `background-color 1s`;
            codeText.style.display = 'block';
            inputField.style.display = 'none';
            submitButton.style.display = 'none';
            isDark = false;
        }
    });

    submitButton.addEventListener('click', function() {
        const enteredCode = inputField.value.trim();
        if (enteredCode === 'start') {
            alert('Correct code!');
            // 여기에 코드가 맞을 때 실행할 추가 로직을 넣을 수 있습니다.
        } else {
            alert('Incorrect code. Try again.');
        }
        inputField.value = ''; // 입력 필드 초기화
    });
});