let targetX, targetY;
let attempts;
let gameStarted = false;
let gameLost = false;
let gameWon = false;
let distance;
let maxAttempts = 4;
let clicks = [];
let testCode = ""; // Default value

async function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  try {
    testCode = await findDocumentByCamo('test', 'code');
    testCode = testCode.trim(); // Remove any whitespace
  } catch (error) {
    console.error("Error fetching test code:", error);
    // Fallback to "testcode" if there's an error (already set as default)
  }
  startGame();
}

function startGame() {
  targetX = random(20, width - 20);
  targetY = random(20, height - 20);
  attempts = 0;
  distance = null;
  gameStarted = false;
  gameLost = false;
  gameWon = false;
  clicks = []; // 게임이 재시작될 때 클릭 기록을 초기화
  loop(); // 게임이 재시작되면 draw() 함수가 다시 실행되도록 loop를 활성화합니다.

  // 승리나 패배 UI를 숨김
  hideInputForm();
}

function draw() {
  background(220);
  strokeWeight(5); // 선의 두께를 5로 설정
  line(10, 10, 20, 10); // (10, 10)에서 (20, 10)까지 길이 10인 가로선

  if (gameStarted && !gameLost && !gameWon) {
    // Display the remaining attempts
    textSize(min(20, windowWidth / 20));
    fill(0);
    text(`Attempts: ${maxAttempts - attempts}`, width / 2, 20);

    // If a click was made, display the distance to the target
    if (distance !== null) {
      textSize(min(18, windowWidth / 30));
      text(`Distance: ${distance.toFixed(2)}`, width / 2, height - 30);
    }
  }

  // 클릭한 모든 위치에 원을 다시 그리기 (distance에 해당하는 원도 함께 그리기)
  for (let i = 0; i < clicks.length; i++) {
    let click = clicks[i];
    fill(0);
    ellipse(click.x, click.y, 10, 10); // 클릭 위치에 작은 원

    noFill();
    stroke(100, 100, 255); // 파란색 원
    ellipse(click.x, click.y, click.distance * 2, click.distance * 2); // distance에 해당하는 원
  }

  // If the game is won, display the 'You Win!' message
  if (gameWon) {
    textSize(min(32, windowWidth / 15));
    fill(0, 200, 0);
    text('You Found It!', width / 2, height / 2 - 20);
    textSize(min(20, windowWidth / 25));
    fill(0);
    // 타겟의 위치를 표시
    fill(255, 0, 0);
    ellipse(targetX, targetY, 15, 15); // 타겟을 빨간색으로 표시
    textSize(min(18, windowWidth / 30));
    fill(0);
    text('Target was here!', targetX, targetY - 15);
    noLoop(); // 게임이 종료되면 draw() 함수가 멈추도록 합니다.
    
    // Update this part to use the fetched testCode
    textSize(min(24, windowWidth / 20));
    fill(0);
    text(`CODE:${testCode}`, width / 2, height / 2 + 80);
    
    // 게임 승리 시 input과 submit 버튼을 표시
    showInputForm();
  }

  // If the game is lost, display the 'lose' message and show the target
  if (gameLost) {
    textSize(min(32, windowWidth / 15));
    fill(255, 0, 0);
    text('You Lose!', width / 2, height / 2 - 20);
    textSize(min(20, windowWidth / 25));
    fill(0);
    drawStartButton();

    // 타겟의 위치를 표시
    fill(255, 0, 0);
    ellipse(targetX, targetY, 10, 10); // 타겟을 빨간색으로 표시
    textSize(min(18, windowWidth / 30));
    fill(0);
    text('Target was here!', targetX, targetY - 15);
  }

  // If the game has not started, show the start button and instructions
  if (!gameStarted && !gameLost && !gameWon) {
    drawStartButton();
  }
}

function drawStartButton() {
  strokeWeight(1); 
  fill(255); 
  let buttonWidth = min(400, windowWidth * 0.8);
  let buttonHeight = min(300, windowHeight * 0.4);
  rect(windowWidth / 2 - buttonWidth / 2, windowHeight / 2 - buttonHeight / 2, buttonWidth, buttonHeight, 20); // 네모 생성
  fill(0); 
  textSize(min(24, windowWidth / 20));
  text('<게임방법>', windowWidth / 2, windowHeight / 2 - buttonHeight / 2 + 50); // 게임 방법 타이틀
  textSize(min(16, windowWidth / 30));
  text('1. 마우스를 클릭하면, 클릭한 지점으로부터', windowWidth / 2, windowHeight / 2 - buttonHeight / 2 + 90);
  text('찾아야 하는 점까지의 거리가 표시됩니다.', windowWidth / 2, windowHeight / 2 - buttonHeight / 2 + 110);
  text('2. 총 4번의 기회가 주어집니다.', windowWidth / 2, windowHeight / 2 - buttonHeight / 2 + 130);

  // Start 버튼
  fill(0, 200, 0);
  let startButtonWidth = min(100, windowWidth * 0.3);
  let startButtonHeight = min(40, windowHeight * 0.06);
  rect(windowWidth / 2 - startButtonWidth / 2, windowHeight / 2 + buttonHeight / 2 - startButtonHeight - 20, startButtonWidth, startButtonHeight, 10); 
  fill(255);
  textSize(min(20, windowWidth / 25));
  text('START', windowWidth / 2, windowHeight / 2 + buttonHeight / 2 - startButtonHeight / 2 - 20);
}

function mousePressed() {
  handleInput(mouseX, mouseY);
}

function touchStarted() {
  handleInput(touches[0].x, touches[0].y);
  return false;
}

function handleInput(x, y) {
  // If the game is lost or not started, check if the start button is clicked
  if (!gameStarted || gameLost) {
    let buttonWidth = min(100, windowWidth * 0.3);
    let buttonHeight = min(40, windowHeight * 0.06);
    let startButtonX = windowWidth / 2 - buttonWidth / 2;
    let startButtonY = windowHeight / 2 + min(300, windowHeight * 0.4) / 2 - buttonHeight - 20;
    if (x > startButtonX && x < startButtonX + buttonWidth && y > startButtonY && y < startButtonY + buttonHeight) {
      startGame();
      gameStarted = true;
      return;
    }
  }

  // If the game has started and is still in progress
  if (gameStarted && !gameLost && !gameWon) {
    attempts++;
    let d = dist(x, y, targetX, targetY);
    distance = d;

    // 클릭한 위치와 그 위치에서 타겟까지의 거리를 배열에 저장
    clicks.push({x: x, y: y, distance: d});

    // If the target is found (within radius of 5)
    if (d < 5) {
      fill(0, 200, 0);
      ellipse(targetX, targetY, 10, 10);
      gameWon = true;
    }

    // If the attempts exceed the maximum and target is not found
    if (attempts >= maxAttempts && d >= 5) {
      gameLost = true;
    }
  }
}

// 화면 크기가 변경될 때 캔버스 크기를 다시 조정
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // 게임 상태에 따라 UI 요소 재배치
  if (gameWon) {
    showInputForm();
  } else {
    hideInputForm();
  }
}

// input과 submit 버튼을 나타내는 함수
function showInputForm() {
  const inputElement = document.getElementById("codeInput");
  const submitButton = document.querySelector("button");

  inputElement.style.display = "block";
  submitButton.style.display = "block";

  // 모바일 환경에서 입력 필드에 포커스가 가면 가상 키보드가 나타나도록 함
  if (windowWidth <= 600) {
    inputElement.focus();
  }
}

// input과 submit 버튼을 숨기는 함수
function hideInputForm() {
  const inputElement = document.getElementById("codeInput");
  const submitButton = document.querySelector("button");

  inputElement.style.display = "none";
  submitButton.style.display = "none";
}
