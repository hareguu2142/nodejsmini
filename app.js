const express = require('express');
const path = require('path');
const app = express();
const { MongoClient } = require('mongodb');
const port = 3000;
const uri = "mongodb+srv://puzzle2:puzzle2@cluster0.3bfxg.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri);

app.use(express.json());
// 루트 경로에 대한 라우트 핸들러
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// 정적 파일 제공을 위한 미들웨어 설정
app.use(express.static(path.join(__dirname, 'public')));

// src 폴더의 JavaScript 파일을 /js 경로로 제공
app.use('/js', express.static(path.join(__dirname, 'src')));

app.get('/find', async (req, res) => {
  const { camo, field } = req.query;

  if (!camo) {
    return res.status(400).json({ error: "camo parameter is required" });
  }

  try {
    await client.connect();
    const database = client.db("code_to_map");
    const collection = database.collection("code_to_map");
    const query = { camo: camo };
    const document = await collection.findOne(query);

    if (document) {
      const id = document._id;
      let selectedField = field;

      // field가 제공되지 않았다면, 'page' 또는 'code' 중 무작위 선택
      if (!selectedField) {
        selectedField = Math.random() < 0.5 ? 'page' : 'code';
      }

      // 선택된 필드가 문서에 존재하는지 확인
      if (selectedField in document) {
        const fieldValue = document[selectedField];
        return res.json(fieldValue);
      } else {
        return res.status(404).json({ error: `Field '${selectedField}' not found in the document` });
      }
    } else {
      return res.status(404).json({ error: "No document found with the given camo value" });
    }
  } catch (error) {
    console.error("Error occurred while querying the database:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});


app.get('/findcode', async (req, res) => {
  const { code, field } = req.query;

  if (!code) {
    return res.status(400).json({ error: "code parameter is required" });
  }

  try {
    await client.connect();
    const database = client.db("code_to_map");
    const collection = database.collection("code_to_map");
    const query = { code: code };
    const document = await collection.findOne(query);

    if (document) {
      const id = document._id;
      let selectedField = field;

      if (selectedField in document) {
        const fieldValue = document[selectedField];
        return res.json(fieldValue);
      } else {
        return res.status(404).json({ error: `Field '${selectedField}' not found in the document` });
      }
    } else {
      return res.status(404).json({ error: "No document found with the given code value" });
    }
  } catch (error) {
    console.error("Error occurred while querying the database:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});
// 서버 시작
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

