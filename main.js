let letterElement = null;
let startElement = null;
let shareElement = null;
let clipboardElement = null;
let isClipboardElementAvailable = false;

let startTime = 0;
let endTime = 0;
let isInGame = false;

const letterList = [..."A"];
let letterIndex = 0;

const gameStart = async () => {
  startTime = 0;
  endTime = 0;
  letterIndex = 0;
  isInGame = false;

  letterElement.textContent = "3";
  await new Promise((r) => setTimeout(r, 1000));
  letterElement.textContent = "2";
  await new Promise((r) => setTimeout(r, 1000));
  letterElement.textContent = "1";
  await new Promise((r) => setTimeout(r, 1000));
  letterElement.textContent = "A";
  startTime = Date.now();
  isInGame = true;
};

const gameClear = () => {
  endTime = Date.now();
  letterElement.textContent = "";
  isInGame = false;

  shareElement.style.visibility = "visible";
};

const share = async () => {
  const shareText = `アルファベット打ち終わる まで ${((endTime - startTime) / 1000).toFixed(
    3
  )} 秒で打ちました #タイピング ${window.location.href}`;
  try {
    window.navigator.clipboard.writeText(shareText);
  } catch (e) {
    console.log(e);
    return;
  }

  if (isClipboardElementAvailable) {
    return;
  }
  isClipboardElementAvailable = true;
  clipboardElement.style.opacity = 1;
  clipboardElement.style.transform = "translateY(0)";
  await new Promise((r) => setTimeout(r, 150));
  await new Promise((r) => setTimeout(r, 2000));
  clipboardElement.style.opacity = 0;
  clipboardElement.style.transform = "translateY(1rem)";
  await new Promise((r) => setTimeout(r, 150));
  isClipboardElementAvailable = false;
};

function init() {
  letterElement = document.getElementById("letter");
  startElement = document.getElementById("start");
  shareElement = document.getElementById("share");
  clipboardElement = document.getElementById("clipboard");
  startElement.onpointerdown = (e) => {
    startElement.textContent = "Retry";
    gameStart();
  };
  shareElement.onpointerup = () => {
    share();
  };

  const tick = () => {
    requestAnimationFrame(tick);
    if (startTime === 0) {
      document.getElementById("timer").textContent = "0.000s";
      return;
    }
    const elipsedTime = (endTime || Date.now()) - startTime;
    document.getElementById("timer").textContent =
      (elipsedTime / 1000).toFixed(3) + "s";
  };
  tick();

  document.onkeydown = (e) => {
    const key = e.key.toUpperCase();
    if (!isInGame) {
      return;
    }
    if (key === letterList[letterIndex]) {
      letterIndex++;
      if (letterIndex === letterList.length) {
        gameClear();
      } else {
        letterElement.textContent = letterList[letterIndex];
      }
    }
  };
}

window.addEventListener("DOMContentLoaded", () => {
  init();
});
