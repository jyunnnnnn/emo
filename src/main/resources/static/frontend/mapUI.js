let selectDatas;
// 一般記錄按鈕
$('#openRecordModal').on('click', function() {
    $('#recordFW').css("display", "flex");
    $('#saveRecord').css("display", "block");
    $('#updateRecord').css("display", "none");
    $('#deleteRecord').css("display", "none");

    // 初始化行為選單
    $('#type').empty();
    $('#type').append($('<option>', {
        disabled: true,
        selected: true,
        id: "noType",
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
            id: "noAction",
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
    $("#gram").prop("disabled", true);
    $("#gram").val("");
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
        name: 'radio'
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
    let type = $('#type option:selected');
    let data_value = $('#gram').val();
    if(!classType){
        alert("請選擇類別");
        return;
    }else if(type.attr('id') == "noAction"){
        alert("請選擇行為");
        return;
    }else if(data_value <= 0){
       alert("請輸入正數");
       return;
    }else{
        saveRecord(classType, type.text(), data_value);
        $('#recordFW').css("display", "none");
    }
});
// 路線記錄儲存
$('#saveTrafficRecord').on('click', function () {
    event.preventDefault();
    let type = $('#trafficType option:selected');
    let data_value = $('#kilometer').val();

    if(data_value <= 0) {
        alert("請輸入正數");
    } else if(type.attr('id') == "noAction") {
        alert("請選擇行為");
    } else {
        saveRecord("交通", type.text(), data_value);
        $('#routeFW').css("display", "none");
    }
});

// 查看按鈕
$('#recordListButton').on('click', function () {
    // 顯示懸浮窗
    $('#recordListFW').css("display", "flex");
    $('#recordListFW').css("position", "fixed");
    $('#editRecord').css("display", "block");
    $('#saveEditRecord').css("display", "none");
    $('#deleteEditRecord').css("display", "none");

    $('#category').val('all');
    $('#sortType').val('time');
    $('#sortMethod').val('old');
    let formattedDate = getFormattedDate().match(/\d{4}-\d{2}-\d{2}/)[0];
    let datePart;
    if(records.length>0){
         datePart = records[0].time.slice(0, 10);
    }else{
        datePart = formattedDate;
    }
    $('#startDate').val(datePart);
    $('#endDate').val(formattedDate);
});
// 點擊管理員按鈕
$('#adminButton').on('click', function () {
    // 顯示懸浮窗
    $('#adminFW').css("display", "flex");
    $('#adminFW').css("position", "fixed");
    $('#editFP').css("display", "block");
    $('#saveFP').css("display", "none");
    $('#deleteFP').css("display", "none");
});
// 管理員編輯
$('#editFP').on('click', function() {
    event.preventDefault();
    $('#editFP').css("display", "none");
    $('#saveFP').css("display", "block");
    $('#deleteFP').css("display", "block");
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
$('#saveFP').on('click', function() {
    event.preventDefault();
    $('#editFP').css("display", "block");
    $('#saveFP').css("display", "none");
    $('#deleteFP').css("display", "none");
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
$('#settingButton').on('click', function () {
    // 顯示懸浮窗
    $('#settingFW').css("display", "flex");
    $('#settingFW').css("position", "fixed");
});
// 點擊刪除帳號按鈕
$('#deleteAccount').on('click', function () {
    // 顯示懸浮窗
    $('#deleteFW').css("display", "flex");
    $('#deleteFW').css("position", "fixed");
    let time = $('#deleteDataTime');
    let formattedDate = getFormattedDate();
    time.textContent = "截至" + formattedDate;
    let trafficCount = 0;
    let dailyCount = 0;
    let footprint = 0;
    let traffic = $('#deleteDataTraffic');
    let daily = $('#deleteDataDaily');
    for(let i=0; i<records.length; i++){
        if(records[i].classType === "交通") trafficCount++;
        else if(records[i].classType === "生活用品") dailyCount++;
    }
    traffic.textContent = "已紀錄 " + trafficCount + " 次環保交通";
    daily.textContent = "已紀錄 " + dailyCount + " 次環保生活用品";
});
// 點擊修改暱稱按鈕
$('#rename').on('click', function () {
    // 顯示懸浮窗
    $('#renameFW').css("display", "flex");
    $('#renameFW').css("position", "fixed");
    $('#newName').attr("placeholder", nickname);
});

function closeFW(event){
    if (event.target.id === 'recordFW' || event.target.id === 'routeFW') {
        $('#closeAuthFW').css("display", "flex");
        $('#closeAuthFW').css("position", "fixed");
    } else if(event.target.id === 'recordListFW') {
        $('#recordListFW').css("display", "none");
    } else if(event.target.id === 'settingFW') {
        $('#settingFW').css("display", "none");
    } else if(event.target.id === 'deleteFW') {
        $('#deleteFW').css("display", "none");
    } else if(event.target.id === 'renameFW') {
        $('#renameFW').css("display", "none");
    } else if(event.target.id === 'closeAuthFW') {
        $('#closeAuthFW').css("display", "none");
    } else if(event.target.id === 'adminFW') {
        $('#adminFW').css("display", "none");
    }
}

// 關閉紀錄懸浮窗
$('#closeRecordModal').on('click', function () {
    $('#closeAuthFW').css("display", "flex");
    $('#closeAuthFW').css("position", "fixed");
});
$('#closeRouteModal').on('click', function () {
    $('#closeAuthFW').css("display", "flex");
    $('#closeAuthFW').css("position", "fixed");
});
$('#closeAuthBtn').on('click', function () {
    $('#closeAuthFW').css("display", "none");
});
$('#closeRecord').on('click', function () {
    $('#closeAuthFW').css("display", "none");
    $('#recordFW').css("display", "none");
    $('#routeFW').css("display", "none");
});
// 關閉查看懸浮窗
$('#closeListModal').on('click', function () {
    $('#recordListFW').css("display", "none");
});
// 關閉設定懸浮窗
$('#closeSettingModal').on('click', function () {
    $('#settingFW').css("display", "none");
});
// 關閉刪除懸浮窗
$('#closeDeleteModal').on('click', function () {
    $('#deleteFW').css("display", "none");
});
// 關閉刪除懸浮窗
$('#closeRenameModal').on('click', function () {
    $('#renameFW').css("display", "none");
});
// 關閉管理員懸浮窗
$('#closeAdminModal').on('click', function () {
    $('#adminFW').css("display", "none");
});


// 批量編輯歷史紀錄
$('#editRecord').on('click', function() {
    event.preventDefault();
    $('#editRecord').css("display", "none");
    $('#saveEditRecord').css("display", "block");
    $('#deleteEditRecord').css("display", "block");
    let checkboxes = document.querySelectorAll('.checkbox-container');
    checkboxes.forEach(function(checkbox) {
        checkbox.style.display = 'flex';
    });
})
$('#saveEditRecord').on('click', function() {
    event.preventDefault();
    $('#editRecord').css("display", "block");
    $('#saveEditRecord').css("display", "none");
    $('#deleteEditRecord').css("display", "none");
    let checkboxes = document.querySelectorAll('.checkbox-container');
    checkboxes.forEach(function(checkbox) {
        checkbox.style.display = 'none';
    });
});

// 修改懸浮視窗變成歷史紀錄
function recordModal(){
    // 顯示懸浮窗
    if(currentInfoWindowRecord.classType === "交通"){
        $('#routeFW').css("display", "flex");
        $('#routeFW').css("position", "fixed");
        $('#saveTrafficRecord').css("display", "none");
        $('#updateTrafficRecord').css("display", "block");
        $('#deleteTrafficRecord').css("display", "block");

        let select = $('#trafficType');
        let trafficDatas = FootprintData.filter(function(item) {
            return item.class === "transportation";
        });
        select.empty();
        select.append($('<option>', {
            text: "請選擇一項行為",
            selected: true,
            disabled: true
        }));
        for(let trafficData of trafficDatas){
            if(trafficData.type == currentInfoWindowRecord.type){
                select.append($('<option>', {
                    text: trafficData.type,
                    selected: true
                }));
            } else {
                select.append($('<option>', {
                    text: trafficData.type
                }));
            }
        }

        $('#kilometer').val(currentInfoWindowRecord.data_value);
    } else {
        $('#recordFW').css("display", "flex");
        $('#recordFW').css("position", "fixed");
        $('#saveRecord').css("display", "none");
        $('#updateRecord').css("display", "block");
        $('#deleteRecord').css("display", "block");

        $('input[name="typeRadio"]').each(function() {
            if ($(this).next('.radio-tile').find('.radio-label').text() === currentInfoWindowRecord.classType) {
                $(this).prop("checked", true);
            }
        });

        let select = $('#type');
        selectDatas = FootprintData.filter(function(item) {
            return item.classZH === currentInfoWindowRecord.classType;
        });
        select.empty();
        select.append($('<option>', {
            text: "請選擇一項行為",
            selected: true,
            disabled: true
        }));

        let options;
        for(let selectData of selectDatas){
            if(selectData.type == currentInfoWindowRecord.type){
                select.append($('<option>', {
                    text: selectData.type,
                    selected: true
                }));
                options = selectData.option;
            } else {
                select.append($('<option>', {
                    text: selectData.type
                }));
            }
        }

        let gram = $('#gramRadios');
        gram.empty();
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
            checked: true
        });
        let span = $('<span>', {
            class: 'name',
            text: '自訂'
        });
        label.append(input, span);
        gram.append(label);

        $('#gram').val(currentInfoWindowRecord.data_value);
        $('#gram').prop("disabled", false);
    }
}