// 紀錄按鈕
document.getElementById('openRecordModal').addEventListener('click', function () {
    // 顯示懸浮窗
    document.getElementById('recordFW').style.display = 'flex';
    document.getElementById('recordFW').style.position = 'fixed';
    document.getElementById('trafficLabel').style.display = 'none';
    document.getElementById('dailyLabel').style.display = 'block';
    document.getElementById('dailyRadio').checked = true;
    document.getElementById('trafficMenu').style.display = 'none';
    document.getElementById('dailyMenu').style.display = 'block';
    document.getElementById('SPACE').style.display = 'none';
    $("#count").val(1);
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
        if (Number.isInteger(parseInt(data_value,10)) && parseInt(data_value,10) > 0) {
            document.getElementById('recordFW').style.display = 'none';
        } else {
            alert("請輸入正整數");
        }
    } else {
        alert("請輸入完整資訊");
    }
});
// 查看按鈕
document.getElementById('recordListButton').addEventListener('click', function () {
    // 顯示懸浮窗
    document.getElementById('recordListFW').style.display = 'flex';
    document.getElementById('recordListFW').style.position = 'fixed';
    $('#category').val('all');
    $('#sortType').val('time');
    $("#method").attr("label", "時間");
    $("#option1").val("old");
    $("#option1").text("遠到近");
    $("#option2").val("new");
    $("#option2").text("近到遠");
    $('#sortMethod').val('old');

    $('#startDate').val(records[0].time.slice(0, 10));
    var year = now.getFullYear();
    var month = (now.getMonth() + 1).toString().padStart(2, '0');
    var day = now.getDate().toString().padStart(2, '0');
    var formattedDate = `${year}-${month}-${day}`;
    $('#endDate').val(formattedDate);
});
// 點擊設定按鈕
document.getElementById('settingButton').addEventListener('click', function () {
    // 顯示懸浮窗
    document.getElementById('settingFW').style.display = 'flex';
    document.getElementById('settingFW').style.position = 'fixed';
});
// 點擊刪除帳號按鈕
document.getElementById('deleteAccount').addEventListener('click', function () {
    // 顯示懸浮窗
    document.getElementById('deleteFW').style.display = 'flex';
    document.getElementById('deleteFW').style.position = 'fixed';
});
// 點擊修改暱稱按鈕
document.getElementById('rename').addEventListener('click', function () {
    // 顯示懸浮窗
    document.getElementById('renameFW').style.display = 'flex';
    document.getElementById('renameFW').style.position = 'fixed';
    document.getElementById('newName').placeholder = username;
});

function closeFW(event){
    if (event.target.id === 'recordFW') {
        document.getElementById('recordFW').style.display = 'none';
    } else if(event.target.id === 'recordListFW') {
        document.getElementById('recordListFW').style.display = 'none';
    } else if(event.target.id === 'settingFW') {
        document.getElementById('settingFW').style.display = 'none';
    } else if(event.target.id === 'deleteFW') {
        document.getElementById('deleteFW').style.display = 'none';
    } else if(event.target.id === 'modifyFW') {
        document.getElementById('modifyFW').style.display = 'none';
    } else if(event.target.id === 'renameFW') {
        document.getElementById('renameFW').style.display = 'none';
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
// 關閉設定懸浮窗
document.getElementById('closeSettingModal').addEventListener('click', function () {
    document.getElementById('settingFW').style.display = 'none';
});
// 關閉刪除懸浮窗
document.getElementById('closeDeleteModal').addEventListener('click', function () {
    document.getElementById('deleteFW').style.display = 'none';
});
// 關閉刪除懸浮窗
document.getElementById('closeRenameModal').addEventListener('click', function () {
    document.getElementById('renameFW').style.display = 'none';
});
// 關閉修改紀錄懸浮窗
document.getElementById('closeModifyRecordModal').addEventListener('click', function () {
    document.getElementById('modifyFW').style.display = 'none';
});

// 生活用品選單
document.getElementById('dailyRadio').addEventListener('change', function () {
    document.getElementById('trafficMenu').style.display = 'none';
    document.getElementById('dailyMenu').style.display = 'block';
    document.getElementById('SPACE').style.display = 'none';
})
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
