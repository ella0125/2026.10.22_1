/*
 * 修正版重點：
 * 1. 修正答案放入題目後無法再次拖曳的問題。
 * 2. 已放入題目的答案會在題目答案位置繪製可拖曳按鈕。
 * 3. 點擊已放入的答案後，可以將它拖出題目區撤回。
 * 4. 拖曳到其他題目時，可以直接交換答案。
 * 5. 拖曳到題目區外時，答案會回到下方答案區。
 *
 * 使用方式：
 * 將本程式完整貼到 sketch.js。
 * GIF 請放在 assets 資料夾。
 */

// --------------------------------------------------
// 題庫
// --------------------------------------------------

let questionBank = [
  {
    question: "吃飯前應該先做什麼？",
    answer: "洗手",
    gif: "assets/hands.gif",
    type: "hands",
    color: "#FFD166"
  },
  {
    question: "過馬路時應該先看哪裡？",
    answer: "左右兩邊",
    gif: "assets/traffic.gif",
    type: "traffic",
    color: "#EF476F"
  },
  {
    question: "打噴嚏時應該怎麼做？",
    answer: "遮住口鼻",
    gif: "assets/sneeze.gif",
    type: "sneeze",
    color: "#06D6A0"
  },
  {
    question: "玩完玩具後應該怎麼做？",
    answer: "收好玩具",
    gif: "assets/toys.gif",
    type: "toys",
    color: "#118AB2"
  },
  {
    question: "看到垃圾時應該怎麼做？",
    answer: "丟進垃圾桶",
    gif: "assets/trash.gif",
    type: "trash",
    color: "#9B5DE5"
  },
  {
    question: "口渴時最適合喝什麼？",
    answer: "白開水",
    gif: "assets/water.gif",
    type: "water",
    color: "#F15BB5"
  },
  {
    question: "進教室時應該怎麼做？",
    answer: "和老師問好",
    gif: "assets/hello.gif",
    type: "hello",
    color: "#FF9F1C"
  },
  {
    question: "排隊時應該怎麼做？",
    answer: "耐心等待",
    gif: "assets/queue.gif",
    type: "queue",
    color: "#2EC4B6"
  },
  {
    question: "看到朋友跌倒時應該怎麼做？",
    answer: "幫助朋友",
    gif: "assets/friend.gif",
    type: "friend",
    color: "#E71D36"
  },
  {
    question: "使用剪刀時應該怎麼做？",
    answer: "小心使用",
    gif: "assets/scissors.gif",
    type: "scissors",
    color: "#8338EC"
  },
  {
    question: "睡覺前應該做什麼？",
    answer: "刷牙洗臉",
    gif: "assets/sleep.gif",
    type: "sleep",
    color: "#3A86FF"
  },
  {
    question: "上廁所後應該做什麼？",
    answer: "沖水洗手",
    gif: "assets/toilet.gif",
    type: "toilet",
    color: "#06D6A0"
  },
  {
    question: "借用別人的東西前要怎麼做？",
    answer: "先問對方",
    gif: "assets/ask.gif",
    type: "ask",
    color: "#FF006E"
  },
  {
    question: "和別人說話時應該怎麼做？",
    answer: "看著對方",
    gif: "assets/talk.gif",
    type: "talk",
    color: "#FB5607"
  },
  {
    question: "吃水果前應該怎麼做？",
    answer: "洗乾淨",
    gif: "assets/fruit.gif",
    type: "fruit",
    color: "#80B918"
  },
  {
    question: "天氣很熱時可以怎麼做？",
    answer: "到陰涼處休息",
    gif: "assets/shade.gif",
    type: "shade",
    color: "#00B4D8"
  },
  {
    question: "下雨天出門要帶什麼？",
    answer: "雨傘",
    gif: "assets/umbrella.gif",
    type: "umbrella",
    color: "#4361EE"
  },
  {
    question: "看到火或瓦斯時應該怎麼做？",
    answer: "不能靠近",
    gif: "assets/fire.gif",
    type: "fire",
    color: "#F72585"
  },
  {
    question: "身體不舒服時要告訴誰？",
    answer: "告訴大人",
    gif: "assets/sick.gif",
    type: "sick",
    color: "#7209B7"
  },
  {
    question: "搭乘汽車時應該怎麼做？",
    answer: "繫好安全帶",
    gif: "assets/seatbelt.gif",
    type: "seatbelt",
    color: "#277DA1"
  },
  {
    question: "和朋友一起玩時應該怎麼做？",
    answer: "互相分享",
    gif: "assets/share.gif",
    type: "share",
    color: "#F9844A"
  }
];

// --------------------------------------------------
// 全域變數
// --------------------------------------------------

// 目前抽出的六題。
let questions = [];

// 六個答案物件。
let answers = [];

// 六個題目放置區。
let answerZones = [];

// 儲存 GIF 圖片。
let gifImages = {};

// 目前拖曳中的答案。
let draggingAnswer = null;

// 拖曳開始前的原本題目編號。
let draggingOriginalZone = -1;

// 是否已經交卷。
let submitted = false;

// 答對題數。
let score = 0;

// 是否顯示彩帶。
let showConfetti = false;

// 彩帶陣列。
let confetti = [];

// 交卷按鈕。
let submitButton;

// 再玩一次按鈕。
let restartButton;


// --------------------------------------------------
// 預先載入 GIF
// --------------------------------------------------

function preload() {
  // 載入所有題目的 GIF。
  for (let i = 0; i < questionBank.length; i++) {
    let item = questionBank[i];

    // 嘗試載入 GIF。
    gifImages[item.type] = loadImage(
      item.gif,
      function() {
        // GIF 載入成功時不需要額外處理。
      },
      function() {
        // GIF 載入失敗時改用備用圖示。
        gifImages[item.type] = null;
      }
    );
  }
}


// --------------------------------------------------
// 初始化
// --------------------------------------------------

function setup() {
  // 建立全螢幕畫布。
  createCanvas(windowWidth, windowHeight);

  // 設定文字置中。
  textAlign(CENTER, CENTER);

  // 設定矩形從中心點繪製。
  rectMode(CENTER);

  // 開始新測驗。
  startNewQuiz();

  // 建立交卷按鈕。
  createSubmitButton();

  // 建立重新作答按鈕。
  createRestartButton();

  // 建立彩帶。
  createConfetti();

  // 設定按鈕位置。
  positionButtons();
}


// --------------------------------------------------
// 開始新測驗
// --------------------------------------------------

function startNewQuiz() {
  // 複製題庫並打亂。
  let shuffledQuestions = shuffle(questionBank.slice());

  // 隨機抽出六題。
  questions = shuffledQuestions.slice(0, 6);

  // 建立答案。
  createAnswers();

  // 建立題目區。
  createAnswerZones();

  // 重設狀態。
  submitted = false;
  score = 0;
  showConfetti = false;
}


// --------------------------------------------------
// 建立答案
// --------------------------------------------------

function createAnswers() {
  // 清空答案陣列。
  answers = [];

  // 取得六個答案並打亂。
  let shuffledAnswers = shuffle(
    questions.map(function(item) {
      return item.answer;
    })
  );

  // 建立答案物件。
  for (let i = 0; i < shuffledAnswers.length; i++) {
    answers.push({
      text: shuffledAnswers[i],
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      homeX: 0,
      homeY: 0,
      placedZone: -1,
      isDragging: false
    });
  }
}


// --------------------------------------------------
// 建立題目區
// --------------------------------------------------

function createAnswerZones() {
  // 清空題目區。
  answerZones = [];

  // 建立六個題目區。
  for (let i = 0; i < questions.length; i++) {
    answerZones.push({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      answerIndex: -1,
      questionIndex: i
    });
  }
}


// --------------------------------------------------
// 建立按鈕
// --------------------------------------------------

function createSubmitButton() {
  // 建立交卷按鈕。
  submitButton = createButton("交卷看成績");

  // 設定點擊事件。
  submitButton.mousePressed(function() {
    submitQuiz();
  });

  // 設定按鈕樣式。
  styleButton(submitButton, "#FF8C42", "#D96A24");
}

function createRestartButton() {
  // 建立重新作答按鈕。
  restartButton = createButton("再玩一次");

  // 設定點擊事件。
  restartButton.mousePressed(function() {
    restartQuiz();
  });

  // 設定按鈕樣式。
  styleButton(restartButton, "#48A9A6", "#277875");

  // 初始時隱藏按鈕。
  restartButton.hide();
}

function styleButton(button, backgroundColor, shadowColor) {
  // 設定字型。
  button.style("font-family", "Arial, sans-serif");

  // 設定文字大小。
  button.style("font-size", "18px");

  // 設定文字粗細。
  button.style("font-weight", "bold");

  // 設定文字顏色。
  button.style("color", "#FFFFFF");

  // 設定背景顏色。
  button.style("background-color", backgroundColor);

  // 移除外框。
  button.style("border", "none");

  // 設定圓角。
  button.style("border-radius", "16px");

  // 設定內距。
  button.style("padding", "14px 24px");

  // 設定滑鼠游標。
  button.style("cursor", "pointer");

  // 設定陰影。
  button.style("box-shadow", "0 5px 0 " + shadowColor);
}


// --------------------------------------------------
// 主要繪圖
// --------------------------------------------------

function draw() {
  // 根據是否交卷繪製不同畫面。
  if (submitted) {
    drawResultScreen();
  } else {
    drawQuizScreen();
  }

  // 高分時繪製彩帶。
  if (showConfetti) {
    drawConfetti();
  }
}


// --------------------------------------------------
// 測驗畫面
// --------------------------------------------------

function drawQuizScreen() {
  // 繪製背景。
  drawBackground();

  // 繪製標題。
  drawTitle();

  // 繪製題目。
  drawQuestionZones();

  // 繪製答案。
  drawDraggableAnswers();

  // 繪製提示。
  drawInstruction();
}


// --------------------------------------------------
// 背景
// --------------------------------------------------

function drawBackground() {
  // 設定背景顏色。
  background("#F5FBFF");

  // 不繪製外框。
  noStroke();

  // 繪製裝飾圓。
  fill("#E3F4FF");
  ellipse(width * 0.06, height * 0.16, 150, 150);

  fill("#FFF1D6");
  ellipse(width * 0.95, height * 0.18, 180, 180);

  fill("#E6FAF3");
  ellipse(width * 0.10, height * 0.88, 180, 180);

  fill("#FBE5F2");
  ellipse(width * 0.92, height * 0.85, 160, 160);
}


// --------------------------------------------------
// 標題
// --------------------------------------------------

function drawTitle() {
  // 設定標題顏色。
  fill("#24527A");

  // 設定粗體。
  textStyle(BOLD);

  // 設定標題大小。
  textSize(getResponsiveTextSize(30));

  // 顯示標題。
  text("生活小達人配對測驗", width / 2, height * 0.055);

  // 恢復一般字體。
  textStyle(NORMAL);

  // 設定說明文字。
  fill("#537895");
  textSize(getResponsiveTextSize(15));

  // 顯示說明。
  text(
    "點一下題目可以聽語音，拖曳答案到正確的位置",
    width / 2,
    height * 0.095
  );
}


// --------------------------------------------------
// 題目區
// --------------------------------------------------

function drawQuestionZones() {
  // 計算內容寬度。
  let contentWidth = min(width * 0.94, 930);

  // 手機一欄，桌面兩欄。
  let columns = width < 650 ? 1 : 2;

  // 計算題目區寬度。
  let zoneWidth = columns === 1
    ? contentWidth
    : (contentWidth - 18) / 2;

  // 計算題目區高度。
  let zoneHeight = width < 650 ? 78 : 82;

  // 計算題目區起始位置。
  let startY = height * 0.155;

  // 逐一繪製題目。
  for (let i = 0; i < questions.length; i++) {
    // 計算欄位。
    let column = columns === 1 ? 0 : i % 2;

    // 計算列數。
    let row = columns === 1 ? i : floor(i / 2);

    // 計算題目水平位置。
    let zoneX = columns === 1
      ? width / 2
      : width / 2 + (
        column === 0
          ? -zoneWidth / 2 - 9
          : zoneWidth / 2 + 9
      );

    // 計算題目垂直位置。
    let zoneY = startY + row * (zoneHeight + 9);

    // 儲存題目位置。
    answerZones[i].x = zoneX;
    answerZones[i].y = zoneY;
    answerZones[i].width = zoneWidth;
    answerZones[i].height = zoneHeight;

    // 判斷是否有答案。
    let hasAnswer = answerZones[i].answerIndex !== -1;

    // 繪製卡片。
    fill(hasAnswer ? "#E8F8EE" : "#FFFFFF");
    stroke(hasAnswer ? "#57B894" : "#B7D9E8");
    strokeWeight(2);
    rect(zoneX, zoneY, zoneWidth, zoneHeight, 18);

    // 計算圖片位置。
    let imageX = zoneX - zoneWidth / 2 + 52;
    let imageY = zoneY;

    // 繪製圖片。
    drawQuestionImage(questions[i], imageX, imageY, 58, i);

    // 設定題目文字位置。
    let textX = zoneX + 35;

    // 繪製題目文字。
    noStroke();
    fill("#315A70");
    textSize(getResponsiveTextSize(width < 650 ? 14 : 15));
    text(questions[i].question, textX, zoneY - 16);

    // 顯示答案或提示。
    if (!hasAnswer) {
      fill("#8BAAB9");
      textSize(getResponsiveTextSize(12));
      text("請拖曳答案到這裡", textX, zoneY + 18);
    } else {
      // 取得答案。
      let selectedAnswer = answers[answerZones[i].answerIndex];

      // 顯示可再次拖曳的答案。
      drawPlacedAnswerButton(
        selectedAnswer,
        textX,
        zoneY + 18,
        zoneWidth * 0.52,
        31
      );
    }

    // 繪製題號。
    fill("#FFFFFF");
    noStroke();
    circle(
      zoneX + zoneWidth / 2 - 22,
      zoneY - zoneHeight / 2 + 20,
      25
    );

    // 繪製題號文字。
    fill(questions[i].color);
    textStyle(BOLD);
    textSize(12);
    text(
      i + 1,
      zoneX + zoneWidth / 2 - 22,
      zoneY - zoneHeight / 2 + 20
    );
    textStyle(NORMAL);
  }
}


// --------------------------------------------------
// 顯示已放入題目的答案
// --------------------------------------------------

function drawPlacedAnswerButton(answer, x, y, buttonWidth, buttonHeight) {
  // 如果答案正在拖曳，就不在原位置繪製。
  if (answer.isDragging) {
    return;
  }

  // 儲存答案目前顯示位置。
  answer.x = x;
  answer.y = y;
  answer.width = buttonWidth;
  answer.height = buttonHeight;

  // 繪製答案陰影。
  noStroke();
  fill(0, 20);
  rect(x + 2, y + 3, buttonWidth, buttonHeight, 10);

  // 繪製答案按鈕。
  fill("#FFFFFF");
  stroke("#57B894");
  strokeWeight(2);
  rect(x, y, buttonWidth, buttonHeight, 10);

  // 繪製答案文字。
  noStroke();
  fill("#268A57");
  textStyle(BOLD);
  textSize(getResponsiveTextSize(14));
  text(answer.text, x, y);
  textStyle(NORMAL);
}


// --------------------------------------------------
// 繪製 GIF 或備用圖片
// --------------------------------------------------

function drawQuestionImage(item, x, y, size, index) {
  // 計算上下浮動動畫。
  let bounce = sin(frameCount * 0.05 + index) * 2;

  // 取得 GIF。
  let gif = gifImages[item.type];

  // GIF 載入成功時顯示 GIF。
  if (gif && gif.width > 0 && gif.height > 0) {
    // 繪製白色圓底。
    noStroke();
    fill("#FFFFFF");
    circle(x, y + bounce, size + 14);

    // 設定圖片置中。
    imageMode(CENTER);

    // 繪製 GIF。
    image(gif, x, y + bounce, size, size);

    // 恢復圖片模式。
    imageMode(CORNER);
  } else {
    // GIF 載入失敗時繪製備用圖示。
    drawFallbackIllustration(
      item.type,
      x,
      y + bounce,
      37,
      item.color,
      index
    );
  }
}


// --------------------------------------------------
// 備用插圖
// --------------------------------------------------

function drawFallbackIllustration(type, x, y, size, color, index) {
  // 儲存繪圖狀態。
  push();

  // 移動到圖示位置。
  translate(x, y);

  // 繪製白色圓底。
  noStroke();
  fill("#FFFFFF");
  circle(0, 0, size * 1.8);

  // 依照類型繪製簡化圖示。
  if (type === "hands") {
    // 洗手圖示。
    fill("#FFBE86");
    ellipse(0, 3, 27, 19);
    rect(-13, -8, 7, 21, 4);
    rect(-4, -13, 7, 25, 4);
    rect(5, -13, 7, 25, 4);
    rect(14, -7, 7, 20, 4);
    fill("#4CC9F0");
    ellipse(-8, 18, 6, 10);
    ellipse(8, 18, 6, 10);
  } else if (type === "traffic") {
    // 紅綠燈。
    fill("#263238");
    rect(0, 0, 22, 42, 6);
    fill("#FF595E");
    circle(0, -12, 8);
    fill("#FFD166");
    circle(0, 0, 8);
    fill("#8AC926");
    circle(0, 12, 8);
  } else if (type === "sneeze") {
    // 打噴嚏。
    fill("#FFD6A5");
    circle(-3, 0, 28);
    fill("#754F2E");
    arc(-3, -7, 28, 23, PI, TWO_PI);
    fill("#FFFFFF");
    stroke("#4CC9F0");
    strokeWeight(2);
    triangle(6, 7, 23, 2, 17, 17);
  } else if (type === "toys") {
    // 玩具。
    fill("#FFC8DD");
    circle(0, -7, 27);
    circle(-12, -19, 11);
    circle(12, -19, 11);
    fill("#FFAFCC");
    ellipse(0, 13, 29, 23);
  } else if (type === "trash") {
    // 垃圾桶。
    fill("#A0C4FF");
    rect(0, 8, 25, 30, 4);
    fill("#4361EE");
    rect(0, -9, 31, 5, 3);
    stroke("#FFFFFF");
    strokeWeight(2);
    line(-6, -1, -6, 18);
    line(0, -1, 0, 18);
    line(6, -1, 6, 18);
  } else if (type === "water") {
    // 水杯。
    fill("#BDE0FE");
    stroke("#277DA1");
    strokeWeight(2);
    beginShape();
    vertex(-12, -15);
    vertex(12, -15);
    vertex(9, 18);
    vertex(-9, 18);
    endShape(CLOSE);
    noStroke();
    fill("#4CC9F0");
    ellipse(0, -13, 23, 6);
  } else if (type === "hello") {
    // 揮手。
    fill("#FFD6A5");
    circle(0, -6, 27);
    fill(color);
    arc(0, 28, 34, 35, PI, TWO_PI);
    stroke("#FFD6A5");
    strokeWeight(6);
    line(13, 10, 24, -8);
  } else if (type === "queue") {
    // 排隊。
    drawMiniPerson(-13, 2, "#FFBE86", "#A0C4FF");
    drawMiniPerson(0, 2, "#FFD6A5", color);
    drawMiniPerson(13, 2, "#FFBE86", "#A0C4FF");
  } else if (type === "friend") {
    // 朋友。
    drawMiniPerson(-12, 3, "#FFD6A5", "#FF8C42");
    drawMiniPerson(12, 3, "#FFBE86", "#48A9A6");
    fill("#EF476F");
    noStroke();
    textSize(20);
    text("♥", 0, -15);
  } else if (type === "scissors") {
    // 剪刀。
    stroke("#78909C");
    strokeWeight(4);
    line(-2, 0, 20, -16);
    line(-2, 0, 20, 16);
    noFill();
    stroke(color);
    strokeWeight(5);
    circle(-10, -8, 13);
    circle(-10, 8, 13);
  } else if (type === "sleep") {
    // 月亮。
    fill("#FFD166");
    arc(0, 0, 34, 34, -PI / 2, PI / 2);
    fill("#9B5DE5");
    textSize(19);
    text("★", 17, -15);
  } else if (type === "toilet") {
    // 馬桶。
    fill("#D9F0FF");
    stroke("#277DA1");
    strokeWeight(2);
    rect(8, -10, 14, 19, 3);
    ellipse(-1, 7, 31, 19);
    rect(3, 16, 22, 10, 4);
  } else if (type === "ask") {
    // 問號。
    fill("#FFFFFF");
    stroke(color);
    strokeWeight(2);
    rect(0, 0, 38, 27, 7);
    fill(color);
    noStroke();
    textStyle(BOLD);
    textSize(22);
    text("?", 0, 0);
    textStyle(NORMAL);
  } else if (type === "talk") {
    // 對話框。
    fill("#FFFFFF");
    stroke("#4CC9F0");
    strokeWeight(2);
    rect(-7, -8, 28, 20, 6);
    fill("#D9F0FF");
    stroke(color);
    rect(9, 9, 28, 20, 6);
  } else if (type === "fruit") {
    // 水果。
    fill("#FF595E");
    circle(-7, 5, 23);
    circle(8, 5, 23);
    fill("#80B918");
    ellipse(5, -13, 17, 7);
  } else if (type === "shade") {
    // 遮陽。
    fill("#FFD166");
    circle(0, -12, 19);
    fill("#80B918");
    circle(0, 9, 25);
    fill("#8D6E63");
    rect(0, 24, 7, 18);
  } else if (type === "umbrella") {
    // 雨傘。
    fill(color);
    stroke("#263238");
    strokeWeight(2);
    arc(0, -2, 44, 30, PI, TWO_PI);
    line(0, -2, 0, 21);
    noFill();
    arc(5, 22, 11, 10, 0, PI);
  } else if (type === "fire") {
    // 火焰。
    fill("#FF595E");
    triangle(0, -22, 17, 14, -17, 14);
    noFill();
    stroke("#263238");
    strokeWeight(3);
    circle(0, 0, 45);
    line(-16, -16, 16, 16);
  } else if (type === "sick") {
    // 生病。
    fill("#FFD6A5");
    circle(0, -5, 28);
    fill("#6D4C41");
    arc(0, -10, 28, 23, PI, TWO_PI);
    stroke("#EF476F");
    strokeWeight(3);
    line(17, 2, 23, -15);
    fill("#EF476F");
    noStroke();
    circle(17, 3, 7);
  } else if (type === "seatbelt") {
    // 安全帶。
    fill("#90A4AE");
    rect(-10, 5, 17, 35, 5);
    stroke("#FFD166");
    strokeWeight(6);
    line(-17, -19, 17, 19);
    fill("#EF476F");
    noStroke();
    rect(7, 9, 9, 13, 3);
  } else if (type === "share") {
    // 分享。
    drawMiniPerson(-12, 3, "#FFD6A5", "#FF8C42");
    drawMiniPerson(12, 3, "#FFBE86", "#48A9A6");
    stroke(color);
    strokeWeight(3);
    line(-3, -3, 4, -3);
    line(0, -8, 5, -3);
    line(0, 2, 5, -3);
  }

  // 還原繪圖狀態。
  pop();
}


// --------------------------------------------------
// 小人物
// --------------------------------------------------

function drawMiniPerson(x, y, skinColor, shirtColor) {
  // 儲存繪圖狀態。
  push();

  // 移動人物。
  translate(x, y);

  // 繪製頭部。
  fill(skinColor);
  noStroke();
  circle(0, -11, 12);

  // 繪製身體。
  fill(shirtColor);
  ellipse(0, 7, 17, 20);

  // 還原繪圖狀態。
  pop();
}


// --------------------------------------------------
// 繪製答案
// --------------------------------------------------

function drawDraggableAnswers() {
  // 計算內容寬度。
  let areaWidth = min(width * 0.94, 930);

  // 手機一欄，桌面三欄。
  let columns = width < 650 ? 1 : 3;

  // 計算按鈕寬度。
  let buttonWidth = columns === 1
    ? min(areaWidth, 270)
    : (areaWidth - 24) / 3;

  // 設定按鈕高度。
  let buttonHeight = 49;

  // 設定答案區起始位置。
  let startY = width < 650 ? height * 0.715 : height * 0.745;

  // 逐一處理答案。
  for (let i = 0; i < answers.length; i++) {
    // 計算欄位。
    let column = columns === 1 ? 0 : i % columns;

    // 計算列數。
    let row = columns === 1 ? i : floor(i / columns);

    // 計算下方答案位置。
    let answerX = columns === 1
      ? width / 2
      : width / 2 - buttonWidth + column * (buttonWidth + 12);

    // 計算答案垂直位置。
    let answerY = startY + row * (buttonHeight + 8);

    // 儲存答案按鈕尺寸。
    answers[i].width = buttonWidth;
    answers[i].height = buttonHeight;

    // 儲存下方原始位置。
    answers[i].homeX = answerX;
    answers[i].homeY = answerY;

    // 只有尚未放置的答案才放在下方答案區。
    if (answers[i].placedZone === -1 && !answers[i].isDragging) {
      answers[i].x = answerX;
      answers[i].y = answerY;
    }

    // 拖曳中的答案跟著滑鼠或手指。
    if (answers[i].isDragging) {
      answers[i].x = mouseX;
      answers[i].y = mouseY;
    }

    // 已放在題目區且沒有拖曳時，不在下方重複繪製。
    if (answers[i].placedZone !== -1 && !answers[i].isDragging) {
      continue;
    }

    // 繪製答案陰影。
    noStroke();
    fill(0, 25);
    rect(
      answers[i].x + 3,
      answers[i].y + 4,
      buttonWidth,
      buttonHeight,
      15
    );

    // 繪製答案按鈕。
    fill("#FFFFFF");
    stroke("#6C9DB5");
    strokeWeight(2);
    rect(
      answers[i].x,
      answers[i].y,
      buttonWidth,
      buttonHeight,
      15
    );

    // 繪製答案文字。
    noStroke();
    fill("#315A70");
    textStyle(BOLD);
    textSize(getResponsiveTextSize(15));
    text(answers[i].text, answers[i].x, answers[i].y);
    textStyle(NORMAL);
  }
}


// --------------------------------------------------
// 操作提示
// --------------------------------------------------

function drawInstruction() {
  // 設定提示文字。
  fill("#6B8795");
  textSize(getResponsiveTextSize(13));

  // 顯示操作提示。
  text(
    "答案放入題目後仍可再次拖曳，也可以拖出題目撤回",
    width / 2,
    height * 0.965
  );
}


// --------------------------------------------------
// 滑鼠按下
// --------------------------------------------------

function mousePressed() {
  // 交卷後不再拖曳。
  if (submitted) {
    return;
  }

  // 從最上層答案開始檢查。
  for (let i = answers.length - 1; i >= 0; i--) {
    // 取得答案。
    let answer = answers[i];

    // 判斷是否點到答案。
    if (isPointInsideAnswer(mouseX, mouseY, answer)) {
      // 記錄拖曳前所在的題目。
      draggingOriginalZone = answer.placedZone;

      // 立即清除原本題目的答案連結。
      if (draggingOriginalZone !== -1) {
        answerZones[draggingOriginalZone].answerIndex = -1;
      }

      // 清除答案所在題目。
      answer.placedZone = -1;

      // 設定拖曳狀態。
      answer.isDragging = true;

      // 記錄正在拖曳的答案。
      draggingAnswer = answer;

      // 朗讀答案。
      speakText(answer.text);

      // 結束搜尋。
      return;
    }
  }

  // 如果沒有點到答案，再檢查是否點到題目。
  let questionIndex = getQuestionAtPosition(mouseX, mouseY);

  // 點到題目時朗讀題目。
  if (questionIndex !== -1) {
    speakText(questions[questionIndex].question);
  }
}


// --------------------------------------------------
// 滑鼠拖曳
// --------------------------------------------------

function mouseDragged() {
  // 確認有答案正在拖曳。
  if (draggingAnswer !== null) {
    // 讓答案跟隨滑鼠。
    draggingAnswer.x = mouseX;
    draggingAnswer.y = mouseY;
  }
}


// --------------------------------------------------
// 滑鼠放開
// --------------------------------------------------

function mouseReleased() {
  // 沒有拖曳中的答案時結束。
  if (draggingAnswer === null) {
    return;
  }

  // 結束拖曳狀態。
  draggingAnswer.isDragging = false;

  // 尋找答案放置的題目。
  let targetZone = findTargetZone(draggingAnswer);

  // 如果答案拖到題目區。
  if (targetZone !== -1) {
    // 取得答案索引。
    let newAnswerIndex = answers.indexOf(draggingAnswer);

    // 取得該題原本的答案。
    let oldAnswerIndex = answerZones[targetZone].answerIndex;

    // 如果該題已有答案，將原答案撤回下方。
    if (oldAnswerIndex !== -1 && oldAnswerIndex !== newAnswerIndex) {
      answers[oldAnswerIndex].placedZone = -1;
      answers[oldAnswerIndex].x = answers[oldAnswerIndex].homeX;
      answers[oldAnswerIndex].y = answers[oldAnswerIndex].homeY;
    }

    // 設定新的答案。
    answerZones[targetZone].answerIndex = newAnswerIndex;

    // 記錄答案所在題目。
    draggingAnswer.placedZone = targetZone;

    // 設定答案顯示位置。
    draggingAnswer.x = answerZones[targetZone].x + 35;
    draggingAnswer.y = answerZones[targetZone].y + 18;
  } else {
    // 拖出題目區時，答案撤回下方。
    draggingAnswer.placedZone = -1;
    draggingAnswer.x = draggingAnswer.homeX;
    draggingAnswer.y = draggingAnswer.homeY;
  }

  // 清除拖曳中的答案。
  draggingAnswer = null;

  // 清除原始題目紀錄。
  draggingOriginalZone = -1;
}


// --------------------------------------------------
// 觸控操作
// --------------------------------------------------

function touchStarted() {
  // 使用滑鼠按下處理觸控。
  mousePressed();

  // 阻止手機捲動。
  return false;
}

function touchMoved() {
  // 使用滑鼠拖曳處理觸控。
  mouseDragged();

  // 阻止手機捲動。
  return false;
}

function touchEnded() {
  // 使用滑鼠放開處理觸控。
  mouseReleased();

  // 阻止手機預設操作。
  return false;
}


// --------------------------------------------------
// 判斷是否點到答案
// --------------------------------------------------

function isPointInsideAnswer(pointerX, pointerY, answer) {
  // 判斷答案是否有有效尺寸。
  if (answer.width <= 0 || answer.height <= 0) {
    return false;
  }

  // 判斷水平範圍。
  let insideX = pointerX > answer.x - answer.width / 2 &&
    pointerX < answer.x + answer.width / 2;

  // 判斷垂直範圍。
  let insideY = pointerY > answer.y - answer.height / 2 &&
    pointerY < answer.y + answer.height / 2;

  // 回傳判斷結果。
  return insideX && insideY;
}


// --------------------------------------------------
// 找出被點擊的題目
// --------------------------------------------------

function getQuestionAtPosition(pointerX, pointerY) {
  // 逐一檢查題目區。
  for (let i = 0; i < answerZones.length; i++) {
    // 取得題目區。
    let zone = answerZones[i];

    // 判斷水平位置。
    let insideX = pointerX > zone.x - zone.width / 2 &&
      pointerX < zone.x + zone.width / 2;

    // 判斷垂直位置。
    let insideY = pointerY > zone.y - zone.height / 2 &&
      pointerY < zone.y + zone.height / 2;

    // 如果點到題目，回傳題號。
    if (insideX && insideY) {
      return i;
    }
  }

  // 沒有點到時回傳 -1。
  return -1;
}


// --------------------------------------------------
// 尋找答案放置區
// --------------------------------------------------

function findTargetZone(answer) {
  // 逐一檢查題目區。
  for (let i = 0; i < answerZones.length; i++) {
    // 取得題目區。
    let zone = answerZones[i];

    // 判斷答案中心是否在題目區內。
    let insideX = answer.x > zone.x - zone.width / 2 &&
      answer.x < zone.x + zone.width / 2;

    // 判斷答案中心是否在題目區內。
    let insideY = answer.y > zone.y - zone.height / 2 &&
      answer.y < zone.y + zone.height / 2;

    // 找到目標區時回傳題號。
    if (insideX && insideY) {
      return i;
    }
  }

  // 找不到題目區時回傳 -1。
  return -1;
}


// --------------------------------------------------
// 語音
// --------------------------------------------------

function speakText(message) {
  // 確認瀏覽器支援語音。
  if (!("speechSynthesis" in window)) {
    return;
  }

  // 停止上一段語音。
  window.speechSynthesis.cancel();

  // 建立語音物件。
  let utterance = new SpeechSynthesisUtterance(message);

  // 設定繁體中文。
  utterance.lang = "zh-TW";

  // 設定幼兒適合的語速。
  utterance.rate = 0.82;

  // 設定音調。
  utterance.pitch = 1.12;

  // 設定音量。
  utterance.volume = 1;

  // 播放語音。
  window.speechSynthesis.speak(utterance);
}


// --------------------------------------------------
// 交卷
// --------------------------------------------------

function submitQuiz() {
  // 避免重複交卷。
  if (submitted) {
    return;
  }

  // 歸零分數。
  score = 0;

  // 檢查每一題。
  for (let i = 0; i < questions.length; i++) {
    // 取得答案索引。
    let answerIndex = answerZones[i].answerIndex;

    // 檢查答案是否正確。
    if (
      answerIndex !== -1 &&
      answers[answerIndex].text === questions[i].answer
    ) {
      // 答對時加一分。
      score++;
    }
  }

  // 設定為已交卷。
  submitted = true;

  // 高於 80% 時顯示彩帶。
  showConfetti = score / questions.length > 0.8;

  // 隱藏交卷按鈕。
  submitButton.hide();

  // 顯示重新作答按鈕。
  restartButton.show();

  // 播放成績語音。
  speakText(
    "測驗完成，你答對了 " +
    score +
    " 題，成績是 " +
    round(score / questions.length * 100) +
    " 分"
  );

  // 重新定位按鈕。
  positionButtons();
}


// --------------------------------------------------
// 成績畫面
// --------------------------------------------------

function drawResultScreen() {
  // 繪製背景。
  drawBackground();

  // 顯示標題。
  fill("#24527A");
  textStyle(BOLD);
  textSize(getResponsiveTextSize(34));
  text("測驗完成！", width / 2, height * 0.24);

  // 顯示答對題數。
  fill("#FF8C42");
  textSize(getResponsiveTextSize(54));
  text(score + " / " + questions.length, width / 2, height * 0.39);

  // 顯示百分比。
  fill("#315A70");
  textSize(getResponsiveTextSize(25));
  text(
    "你的成績是 " +
    round(score / questions.length * 100) +
    "%",
    width / 2,
    height * 0.51
  );

  // 顯示鼓勵文字。
  textSize(getResponsiveTextSize(20));

  // 依照成績顯示鼓勵內容。
  if (score / questions.length > 0.8) {
    fill("#E85D75");
    text("太棒了！你是生活小達人！", width / 2, height * 0.62);
  } else if (score / questions.length >= 0.5) {
    fill("#537895");
    text("表現不錯，再試一次會更棒！", width / 2, height * 0.62);
  } else {
    fill("#537895");
    text("沒關係，重新挑戰看看吧！", width / 2, height * 0.62);
  }

  // 恢復一般字體。
  textStyle(NORMAL);
}


// --------------------------------------------------
// 彩帶
// --------------------------------------------------

function createConfetti() {
  // 清空彩帶。
  confetti = [];

  // 建立彩帶粒子。
  for (let i = 0; i < 120; i++) {
    confetti.push({
      x: random(width),
      y: random(-height, 0),
      size: random(7, 15),
      speed: random(2, 6),
      rotation: random(TWO_PI),
      rotationSpeed: random(-0.08, 0.08),
      color: random([
        "#EF476F",
        "#FFD166",
        "#06D6A0",
        "#118AB2",
        "#9B5DE5",
        "#F15BB5"
      ])
    });
  }
}

function drawConfetti() {
  // 逐一繪製彩帶。
  for (let i = 0; i < confetti.length; i++) {
    // 取得彩帶。
    let piece = confetti[i];

    // 更新彩帶位置。
    piece.y += piece.speed;

    // 更新旋轉。
    piece.rotation += piece.rotationSpeed;

    // 超出畫面後重新出現。
    if (piece.y > height + 20) {
      piece.y = random(-100, -20);
      piece.x = random(width);
    }

    // 儲存繪圖狀態。
    push();

    // 移動至彩帶位置。
    translate(piece.x, piece.y);

    // 旋轉彩帶。
    rotate(piece.rotation);

    // 設定彩帶外觀。
    fill(piece.color);
    noStroke();

    // 繪製彩帶。
    rect(0, 0, piece.size, piece.size * 1.8, 2);

    // 還原繪圖狀態。
    pop();
  }
}


// --------------------------------------------------
// 重新開始
// --------------------------------------------------

function restartQuiz() {
  // 重新抽取六題。
  startNewQuiz();

  // 顯示交卷按鈕。
  submitButton.show();

  // 隱藏再玩一次按鈕。
  restartButton.hide();

  // 重新建立彩帶。
  createConfetti();

  // 重新設定按鈕位置。
  positionButtons();

  // 播放提示語音。
  speakText("新測驗開始，請把答案拖到正確的位置");
}


// --------------------------------------------------
// 視窗大小改變
// --------------------------------------------------

function windowResized() {
  // 調整畫布大小。
  resizeCanvas(windowWidth, windowHeight);

  // 重新建立彩帶。
  createConfetti();

  // 重新設定按鈕位置。
  positionButtons();
}


// --------------------------------------------------
// 按鈕位置
// --------------------------------------------------

function positionButtons() {
  // 確認按鈕已建立。
  if (!submitButton || !restartButton) {
    return;
  }

  // 計算按鈕水平位置。
  let buttonX = width / 2;

  // 計算測驗頁按鈕垂直位置。
  let quizButtonY = width < 650
    ? height * 0.915
    : height * 0.91;

  // 計算成績頁按鈕垂直位置。
  let resultButtonY = height * 0.73;

  // 設定交卷按鈕位置。
  submitButton.position(
    buttonX - submitButton.width / 2,
    quizButtonY
  );

  // 設定再玩一次按鈕位置。
  restartButton.position(
    buttonX - restartButton.width / 2,
    resultButtonY
  );
}


// --------------------------------------------------
// 響應式文字大小
// --------------------------------------------------

function getResponsiveTextSize(defaultSize) {
  // 根據畫面寬度計算縮放比例。
  let scale = constrain(width / 700, 0.78, 1.2);

  // 回傳縮放後文字大小。
  return defaultSize * scale;
}