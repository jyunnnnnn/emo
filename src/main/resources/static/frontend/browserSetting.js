
//頁面手勢設定
document.addEventListener('gesturestart', function(event) {
  // 阻止兩指縮放畫面
  event.preventDefault();
});
let lastTouchEndTime = 0;
document.addEventListener('touchend', (event) => {
  const now = new Date().getTime();
  if((now - lastTouchEndTime) <= 300) {      // 偵測時間差是否小於 300ms
    event.preventDefault();
  }
  lastTouchEndTime = now;
}, false);
document.addEventListener('touchstart', (event) => {
  if (event.touches && event.touches.length > 1) {  // 禁止多指觸控
     event.preventDefault();
  }
}, { passive: false });

let vh = window.innerHeight * 0.01;
// Then we set the value in the --vh custom property to the root of the document
document.documentElement.style.setProperty('--vh', `${vh}px`);

// We listen to the resize event
window.addEventListener('resize', () => {
  // We execute the same script as before
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
});
