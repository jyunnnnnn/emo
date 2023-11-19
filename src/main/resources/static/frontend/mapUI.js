// 紀錄按鈕
document.getElementById('openRecordModal').addEventListener('click', function () {
    // 顯示懸浮窗
    document.getElementById('recordFW').style.display = 'flex';
    document.getElementById('recordFW').style.position = 'fixed';
});
// 儲存按鈕
document.getElementById('saveRecord').addEventListener('click', function () {
    var selected;
    if ($("#trafficRadio").is(":checked")) {
        classType = $("#traffic").text();
        type = $("#trafficMenu option:selected").text();
        data_value = document.getElementById('kilometer').value;
    } else if ($("#dailyRadio").is(":checked")) {
        classType = $("#daily").text();
        type = $("#dailyMenu option:selected").text();
        data_value = document.getElementById('count').value;
    }
    if(classType && type && data_value){
        document.getElementById('recordFW').style.display = 'none';
    } else {
        alert("請輸入完整資訊");
    }
});
// 查看按鈕
document.getElementById('recordListButton').addEventListener('click', function () {
    // 顯示懸浮窗
    document.getElementById('recordListFW').style.display = 'flex';
    document.getElementById('recordListFW').style.position = 'fixed';
});

function closeFW(event){
    if (event.target.id === 'recordFW') {
        document.getElementById('recordFW').style.display = 'none';
    } else if(event.target.id === 'recordListFW') {
        document.getElementById('recordListFW').style.display = 'none';
    }
}
// 關閉紀錄懸浮窗
document.getElementById('closeRecordModal').addEventListener('click', function () {
    document.getElementById('recordFW').style.display = 'none';
});
// 關閉查看懸浮窗
document.getElementById('closeListModal').addEventListener('click', function () {
    document.getElementById('recordListFW').style.display = 'none';
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
