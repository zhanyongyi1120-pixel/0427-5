// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];

function preload() {
  // Initialize HandPose model with flipped video input
  handPose = ml5.handPose({ flipped: true });
}

function mousePressed() {
  console.log(hands);
}

function gotHands(results) {
  hands = results;
}

function setup() {
  // 1. 建立全螢幕畫布
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO, { flipped: true });
  video.hide();

  // Start detecting hands
  handPose.detectStart(video, gotHands);
}

function draw() {
  // 2. 設定畫布背景顏色
  background('#e7c6ff');

  // 3. 計算影片寬高（全螢幕的 50%）
  let vW = windowWidth * 0.5;
  let vH = windowHeight * 0.5;

  // 計算影片置中時的左上角 X 與 Y 座標
  let xOff = (windowWidth - vW) / 2;
  let yOff = (windowHeight - vH) / 2;

  // 繪製影片，帶入計算好的位置與大小
  image(video, xOff, yOff, vW, vH);

  // Ensure at least one hand is detected
  if (hands.length > 0) {
    for (let hand of hands) {
      if (hand.confidence > 0.1) {
        // Loop through keypoints and draw circles
        for (let i = 0; i < hand.keypoints.length; i++) {
          let keypoint = hand.keypoints[i];

          // Color-code based on left or right hand
          if (hand.handedness == "Left") {
            fill(255, 0, 255);
          } else {
            fill(255, 255, 0);
          }

          noStroke();
          
          // 4. 將原本相對於原始影片解析度的節點座標，轉換為畫布上的實際座標
          // (原始座標 / 原始影片寬高) * 縮放後的影片寬高 + 偏移量
          let drawX = xOff + (keypoint.x / video.width) * vW;
          let drawY = yOff + (keypoint.y / video.height) * vH;

          // 使用計算後的新座標畫圓
          circle(drawX, drawY, 16);
        }
      }
    }
  }
}

// 加入這個函式確保視窗縮放時，畫布能跟著自適應調整
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}