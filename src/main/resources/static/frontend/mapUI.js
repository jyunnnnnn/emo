// 點擊紀錄按鈕
document.getElementById('openRecordModal').addEventListener('click', function () {
    // 顯示懸浮窗
    document.getElementById('activityModal').style.display = 'block';
    document.getElementById('activityModal').style.position = 'fixed';
});
// 點擊查看按鈕
document.getElementById('recordListButton').addEventListener('click', function () {
    // 顯示懸浮窗
    document.getElementById('activityListModal').style.display = 'block';
    document.getElementById('activityListModal').style.position = 'fixed';
});
//點擊設定按鈕
document.getElementById('settingButton').addEventListener('click', function () {
    // 顯示懸浮窗
    document.getElementById('settingModal').style.display = 'block';
    document.getElementById('settingModal').style.position = 'fixed';
});

// 關閉紀錄懸浮窗
document.getElementById('closeRecordModal').addEventListener('click', function () {
    document.getElementById('activityModal').style.display = 'none';
});
// 關閉查看懸浮窗
document.getElementById('closeListModal').addEventListener('click', function () {
    document.getElementById('activityListModal').style.display = 'none';
});

// 關閉設定懸浮窗
document.getElementById('closeSettingModal').addEventListener('click', function () {
    document.getElementById('settingModal').style.display = 'none';
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


// 關閉修改紀錄懸浮窗
document.getElementById('closeModifyRecordModal').addEventListener('click', function () {
    document.getElementById('modifyModal').style.display = 'none';
});

// 修改交通選單
document.getElementById('modifyTrafficRadio').addEventListener('change', function () {
    document.getElementById('modifyTrafficMenu').style.display = 'block';
    document.getElementById('modifyDailyMenu').style.display = 'none';
    document.getElementById('modifySPACE').style.display = 'none';
})
// 修改生活用品選單
document.getElementById('modifyDailyRadio').addEventListener('change', function () {
    document.getElementById('modifyTrafficMenu').style.display = 'none';
    document.getElementById('modifyDailyMenu').style.display = 'block';
    document.getElementById('modifySPACE').style.display = 'none';
})
