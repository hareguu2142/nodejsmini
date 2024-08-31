const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// 정적 파일 제공을 위한 미들웨어 설정
app.use(express.static(path.join(__dirname, 'public')));

// src 폴더의 JavaScript 파일을 /js 경로로 제공
app.use('/js', express.static(path.join(__dirname, 'src')));

// 루트 경로에 대한 라우트 핸들러
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 서버 시작
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});