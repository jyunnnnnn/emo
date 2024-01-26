let selectDatas;

// 一般記錄按鈕
$('#openRecordModal').on('click', function() {
    $('#recordFW').css("display", "flex");

    // 初始化行為選單
    $('#type').empty();
    $('#type').append($('<option>', {
        disabled: true,
        selected: true,
        text: "請先選擇類別"
    }));
    // 初始化克數按鈕
    $('#gramRadios').empty();
    let label = $('<label>', {
        class: 'gram'
    });
    let input = $('<input>', {
        type: 'radio',
        name: 'radio',
        disabled: true
    });
    let span = $('<span>', {
        class: 'name',
        text: '請先選擇類別',
        id: 'initType'
    });
    label.append(input, span);
    $('#gramRadios').append(label);
    // 初始化克數輸入框
    $("#gram").prop("disabled", true);
    $('#gram').val("");
    $('#gram').attr("placeholder", "請先選擇類別");

    let checked = $('input[name="typeRadio"]:checked');
    if(checked){
        checked.prop('checked', false);
    }
});
// 監聽類別變化
$('input[name="typeRadio"]').on('change', function() {
    $('#initType').text("請先選擇行為");
    $('#gram').attr("placeholder", "請先選擇行為");

    let classType = $('input[name="typeRadio"]:checked').val();
    if(classType != ''){
        let select = $('#type');
        selectDatas = FootprintData.filter(function(item) {
            return item.class === classType;
        });
        select.empty();
        select.append($('<option>', {
            text: "請選擇一項行為",
            selected: true,
            disabled: true
        }));
        for(let selectData of selectDatas){
            select.append($('<option>', {
                text: selectData.type
            }));
        }
    }
});
// 監聽行為變化
$('#type').on('change', function(){
    let gram = $('#gramRadios');
    $('#gram').attr("placeholder", "請選擇克數");
    gram.empty();
    let selected = $('#type option:selected').text();
    let options;
    for(let selectData of selectDatas){
        if(selectData.type === selected){
            options = selectData.option;
            break;
        }
    }

    for(let [key, value] of Object.entries(options)){
        let label = $('<label>', {
            class: 'gram'
        });
        let input = $('<input>', {
            type: 'radio',
            name: 'radio',
            id: key + 'Radio'
        });
        let span = $('<span>', {
            class: 'name',
            text: key
        });
        label.append(input, span);
        gram.append(label);
    }
    let label = $('<label>', {
        class: 'gram'
    });
    let input = $('<input>', {
        type: 'radio',
        name: 'radio',
    });
    let span = $('<span>', {
        class: 'name',
        text: '自訂'
    });
    label.append(input, span);
    gram.append(label);
});
// 監聽克數變化
$('#gramRadios').on('change', 'input[type="radio"]', function() {
    let text = $(this).siblings('.name').text();
    if(text === "自訂"){
        $("#gram").prop("disabled", false);
        $("#gram").val("");
    } else {
        $("#gram").prop("disabled", true);
        let match = text.match(/\d+/);
        let value = match ? match[0] : "";
        $("#gram").val(value);
    }
});
// 一般記錄儲存
$('#saveRecord').on('click', function () {
    event.preventDefault();
    let classType = $('input[name="typeRadio"]:checked').next('.radio-tile').find('.radio-label').text();
    let type = $('#type option:selected').text();
    let data_value = $('#gram').val();

    if(data_value <= 0) {
        alert("請輸入正數");
    } else if(classType && type && data_value) {
        saveRecord(classType, type, data_value);
        $('#recordFW').css("display", "none");
    } else {
        alert("請輸入完整資訊");
    }
});

// 查看按鈕
document.getElementById('recordListButton').addEventListener('click', function () {
    // 顯示懸浮窗
    document.getElementById('recordListFW').style.display = 'flex';
    document.getElementById('recordListFW').style.position = 'fixed';
    document.getElementById('editRecord').style.display = 'block';
    document.getElementById('saveEditRecord').style.display = 'none';
    document.getElementById('deleteEditRecord').style.display = 'none';
    $('#category').val('all');
    $('#sortType').val('time');
    $("#method").attr("label", "時間");
    $("#option1").val("old");
    $("#option1").text("遠到近");
    $("#option2").val("new");
    $("#option2").text("近到遠");
    $('#sortMethod').val('old');
    let now = new Date();
    let year = now.getFullYear();
    let month = (now.getMonth() + 1).toString().padStart(2, '0');
    let day = now.getDate().toString().padStart(2, '0');
    let formattedDate = `${year}-${month}-${day}`;
    let datePart;
        if(records.length>0){
             datePart = records[0].time.slice(0, 10);
        }else{
            datePart=formattedDate;
        }
    $('#startDate').val(datePart);
    $('#endDate').val(formattedDate);
});
// 點擊管理員按鈕
document.getElementById('adminButton').addEventListener('click', function () {
    // 顯示懸浮窗
    document.getElementById('adminFW').style.display = 'flex';
    document.getElementById('adminFW').style.position = 'fixed';
    document.getElementById('editFP').style.display = 'block';
    document.getElementById('saveFP').style.display = 'none';
    document.getElementById('deleteFP').style.display = 'none';
});
// 管理員編輯
document.getElementById('editFP').addEventListener('click', function() {
    event.preventDefault();
    document.getElementById('editFP').style.display = 'none';
    document.getElementById('saveFP').style.display = 'block';
    document.getElementById('deleteFP').style.display = 'block';
    let checkboxes = document.querySelectorAll('.checkbox-container');
    checkboxes.forEach(function(checkbox) {
        checkbox.style.display = 'flex';
    });
    let inputs = document.querySelectorAll('.inputFP');
    inputs.forEach(function(input, index) {
        if (index % 2 != 0) {
            input.disabled = false;
        }
    });
});
document.getElementById('saveFP').addEventListener('click', function() {
    event.preventDefault();
    document.getElementById('editFP').style.display = 'block';
    document.getElementById('saveFP').style.display = 'none';
    document.getElementById('deleteFP').style.display = 'none';
    let checkboxes = document.querySelectorAll('.checkbox-container');
    checkboxes.forEach(function(checkbox) {
        checkbox.style.display = 'none';
    });
    let inputs = document.querySelectorAll('.inputFP');
    inputs.forEach(function(inputs) {
        inputs.disabled = true;
    });
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
    let time = document.getElementById('deleteDataTime');
    let now = new Date();
    let year = now.getFullYear();
    let month = (now.getMonth() + 1).toString().padStart(2, '0');
    let day = now.getDate().toString().padStart(2, '0');
    let hours = now.getHours().toString().padStart(2, '0');
    let minutes = now.getMinutes().toString().padStart(2, '0');
    let seconds = now.getSeconds().toString().padStart(2, '0');
    let formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    time.textContent = "截至" + formattedDate;

    let trafficCount = 0;
    let dailyCount = 0;
    let footprint = 0;
    let traffic = document.getElementById('deleteDataTraffic');
    let daily = document.getElementById('deleteDataDaily');
    for(let i=0; i<records.length; i++){
        if(records[i].classType === "交通") trafficCount++;
        else if(records[i].classType === "生活用品") dailyCount++;
    }
    traffic.textContent = "已紀錄 " + trafficCount + " 次環保交通";
    daily.textContent = "已紀錄 " + dailyCount + " 次環保生活用品";
});
// 點擊修改暱稱按鈕
document.getElementById('rename').addEventListener('click', function () {
    // 顯示懸浮窗
    document.getElementById('renameFW').style.display = 'flex';
    document.getElementById('renameFW').style.position = 'fixed';
    document.getElementById('newName').placeholder = nickname;
});

function closeFW(event){
    if (event.target.id === 'recordFW') {
        document.getElementById('closeAuthFW').style.display = 'flex';
        document.getElementById('closeAuthFW').position = 'fixed';
    } else if (event.target.id === 'routeFW') {
        document.getElementById('closeAuthFW').style.display = 'flex';
        document.getElementById('closeAuthFW').position = 'fixed';
    } else if(event.target.id === 'recordListFW') {
        document.getElementById('recordListFW').style.display = 'none';
    } else if(event.target.id === 'settingFW') {
        document.getElementById('settingFW').style.display = 'none';
    } else if(event.target.id === 'deleteFW') {
        document.getElementById('deleteFW').style.display = 'none';
    } else if(event.target.id === 'renameFW') {
        document.getElementById('renameFW').style.display = 'none';
    } else if(event.target.id === 'closeAuthFW') {
        document.getElementById('closeAuthFW').style.display = 'none';
    } else if(event.target.id === 'adminFW') {
        document.getElementById('adminFW').style.display = 'none';
    }
}

// 關閉紀錄懸浮窗
document.getElementById('closeRecordModal').addEventListener('click', function () {
    document.getElementById('closeAuthFW').style.display = 'flex';
    document.getElementById('closeAuthFW').position = 'fixed';
});
document.getElementById('closeRouteModal').addEventListener('click', function () {
    document.getElementById('closeAuthFW').style.display = 'flex';
    document.getElementById('closeAuthFW').position = 'fixed';
});
document.getElementById('closeAuthBtn').addEventListener('click', function () {
    document.getElementById('closeAuthFW').style.display = 'none';
});
document.getElementById('closeRecord').addEventListener('click', function () {
    document.getElementById('closeAuthFW').style.display = 'none';
    document.getElementById('recordFW').style.display = 'none';
    document.getElementById('routeFW').style.display = 'none';
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
// 關閉管理員懸浮窗
document.getElementById('closeAdminModal').addEventListener('click', function () {
    document.getElementById('adminFW').style.display = 'none';
});


// 批量編輯歷史紀錄
document.getElementById('editRecord').addEventListener('click', function() {
    event.preventDefault();
    document.getElementById('editRecord').style.display = 'none';
    document.getElementById('saveEditRecord').style.display = 'block';
    document.getElementById('deleteEditRecord').style.display = 'block';
    let checkboxes = document.querySelectorAll('.checkbox-container');
    checkboxes.forEach(function(checkbox) {
        checkbox.style.display = 'flex';
    });
})
document.getElementById('saveEditRecord').addEventListener('click', function() {
    event.preventDefault();
    document.getElementById('editRecord').style.display = 'block';
    document.getElementById('saveEditRecord').style.display = 'none';
    document.getElementById('deleteEditRecord').style.display = 'none';
    let checkboxes = document.querySelectorAll('.checkbox-container');
    checkboxes.forEach(function(checkbox) {
        checkbox.style.display = 'none';
    });
});


//修改懸浮視窗變成歷史紀錄
function recordModal(){
    // 顯示懸浮窗
        document.getElementById('recordFW').style.display = 'flex';
        document.getElementById('recordFW').style.position = 'fixed';
        document.getElementById('saveRecord').style.display = 'none';
        document.getElementById('updateRecord').style.display = 'block';
        document.getElementById('deleteRecord').style.display = 'block';

        if(currentInfoWindowRecord.classType === "交通"){
            //console.log(currentInfoWindowRecord.classType);
            document.getElementById('trafficLabel').style.display = 'block'
            document.getElementById('dailyLabel').style.display = 'none'
            document.getElementById('trafficRadio').checked = true;
            document.getElementById('dailyLabel').style.display = 'none';
            document.getElementById('trafficMenu').style.display = 'block';
            document.getElementById('dailyMenu').style.display = 'none';
            document.getElementById('SPACE').style.display = 'none';

            if(currentInfoWindowRecord.type === "公車"){
                document.getElementById('trafficType').value = 'traffic-bus';
            }else if(currentInfoWindowRecord.type === "捷運"){
                document.getElementById('trafficType').value = 'traffic-MRT';
            }else if(currentInfoWindowRecord.type === "火車"){
                document.getElementById('trafficType').value = 'traffic-train';
            }else if(currentInfoWindowRecord.type === "高鐵"){
                document.getElementById('trafficType').value = 'traffic-HSR';
            }

            document.getElementById('kilometer').value = currentInfoWindowRecord.data_value;
            document.getElementById('kilometer').disabled = true;
        }else if(currentInfoWindowRecord.classType === "生活用品"){
            document.getElementById('trafficLabel').style.display = 'none'
            document.getElementById('dailyLabel').style.display = 'block'
            document.getElementById('dailyRadio').checked = true;
            document.getElementById('trafficLabel').style.display = 'none';
            document.getElementById('trafficMenu').style.display = 'none';
            document.getElementById('dailyMenu').style.display = 'block';
            document.getElementById('SPACE').style.display = 'none';
            document.getElementById('gramRadios').style.display = 'flex';
            document.getElementById('customRadio').checked = true;

            if(currentInfoWindowRecord.type === "環保杯"){
                document.getElementById('dailyType').value = 'daily-cup';
            }else if(currentInfoWindowRecord.type === "環保餐具"){
                document.getElementById('dailyType').value = 'daily-tableware';
            }else if(currentInfoWindowRecord.type === "環保袋"){
                document.getElementById('dailyType').value = 'daily-bag';
            }
            document.getElementById('gram').value = currentInfoWindowRecord.data_value;
            document.getElementById('gram').disabled = false;
        }
}