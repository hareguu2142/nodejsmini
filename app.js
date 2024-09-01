const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// 루트 경로에 대한 라우트 핸들러
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 정적 파일 제공을 위한 미들웨어 설정
app.use(express.static(path.join(__dirname, 'public')));

// src 폴더의 JavaScript 파일을 /js 경로로 제공
app.use('/js', express.static(path.join(__dirname, 'src')));

// src 폴더의 특정 JavaScript 파일만 제공하는 라우트
app.get('/js/:filename', (req, res) => {
  const filename = req.params.filename;
  // 허용된 파일 목록 (현재는 없음)
  const allowedFiles = []; 

  if (allowedFiles.includes(filename)) {
    res.sendFile(path.join(__dirname, 'src', filename));
  } else {
    res.status(403).send('Access Denied');
  }
});


// 서버 시작
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});