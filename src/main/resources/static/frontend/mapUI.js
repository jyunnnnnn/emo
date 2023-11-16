// 點擊紀錄按鈕
document.getElementById('openRecordModal').addEventListener('click', function () {
    // 顯示懸浮窗
    document.getElementById('activityModal').style.display = 'block';
    document.getElementById('activityModal').style.position = 'fixed';
});

//關閉懸浮窗
document.getElementById('closeRecordModal').addEventListener('click', function () {
    document.getElementById('activityModal').style.display = 'none';
});


// 交通選單
document.getElementById('trafficRadio').addEventListener('change', function () {
    document.getElementById('trafficMenu').style.display = 'block';
    document.getElementById('dailyMenu').style.display = 'none';
    document.getElementById('SPACE').style.display = 'none';
})
// 生活用品選單
document.getElementById('dailyRadio').addEventListener('change', function () {
    document.getElementById('trafficMenu').style.display = 'none';
    document.getElementById('dailyMenu').style.display = 'block';
    document.getElementById('SPACE').style.display = 'none';
})
