let selectDatas;
// 一般記錄按鈕
$('#openRecordModal').on('click', function() {
    //關閉上一個打開的infoWindow，及清除路線
    if (currentMarker.infoWindow) {
        currentMarker.infoWindow.close();
    }
    if(currentInfoWindowRecord.classType=="交通"){
        removeDirections();
        clearMapLines();
    }
    $('#recordCalculate').text("0 gCo2E");
    $("#recordCompare").text("選擇行為以獲得基準值");
    $("#recordFormula").text("選擇行為以獲得計算公式");
    $('#recordFW').css("display", "flex");
    $('#saveRecord').css("display", "block");
    $('#updateRecord').css("display", "none");
    $('#deleteRecord').css("display", "none");

    // 初始化行為選單
    $('#select').attr('class', 'ts-select is-disabled');
    $('#selectedType').text("請先選擇類別");
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
    let checkedVal = $('input[name="typeRadio"]:checked').val();
    if(checkedVal != undefined){
        $('#' + checkedVal + 'Icon').html(svgData.svgImages[checkedVal][checkedVal + 'Icon']);
        checked.prop('checked', false);
    }
});
// 監聽類別變化
function typeListener(){
    $('input[name="typeRadio"]').on('change', function() {
        $('#gram').attr("placeholder", "請先選擇行為");
        $('#gramRadios').find('span.name').text('請先選擇行為');

        let classType = $('input[name="typeRadio"]:checked').val();
        if(classType != ''){
            let select = $('#type');
            selectDatas = FootprintData.filter(function(item) {
                return item.class === classType;
            });
            $('#selectedType').text("請選擇一項行為");
            $('#select').attr('class', 'ts-select');
            select.empty();
            for(let selectData of selectDatas){
                let button = $('<button>', {
                    class: "item",
                    type: "button",
                    text: selectData.type
                });
                button.on('click', function() {
                    typeChange($(this).text());
                    select.find('.item').removeClass('is-selected').addClass('item');
                    $(this).addClass('is-selected');
                    $('#selectedType').text($(this).text());
                });
                select.append(button);
            }
        }
    });
}
// 監聽行為變化
function typeChange(selected){
    $("#gram").prop("disabled", true);
    $("#gram").val("");
    let gram = $('#gramRadios');
    $('#gram').attr("placeholder", "請選擇克數");
    gram.empty();
    let item;
    for(let selectData of selectDatas){
        if(selectData.type === selected){
            item = selectData;
            break;
        }
    }

    for(let [key, value] of Object.entries(item)){
        if(key === "option"){
            for(let [key, val] of Object.entries(value)){
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
                    text: key + '(' + val + 'g)'
                });
                label.append(input, span);
                gram.append(label);
            }
            break;
        }
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
    let target = FootprintData.find(item => item.type === selected);
    let description = questionMark[target.type].split(" ");
    $("#recordCompare").text(description[0]);
    $("#recordFormula").text(description[1]);
    console.log(description[0],description[1]);
}
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

    let type = $('#type').find('.item.is-selected');
    let data_value = $('#gram').val();
    let showExpectedFP = 0;
    if (data_value > 0){
        showExpectedFP = parseFloat(calculateFootprint(type.text(), data_value)).toFixed(2);
    }
    $('#recordCalculate').text(showExpectedFP  + " gCo2E");
});
$('#gram').on('input', function(event) {
    let type = $('#type').find('.item.is-selected');
    let data_value = $('#gram').val();
    let showExpectedFP = 0;
    if (data_value > 0){
        showExpectedFP = parseFloat(calculateFootprint(type.text(), data_value)).toFixed(2);
    }
    $('#recordCalculate').text(showExpectedFP + " gCo2E");
    let target = FootprintData.find(item => item.type === type.text());
    let description = questionMark[target.type].split(" ");
    $("#recordCompare").text(description[0]);
    $("#recordFormula").text(description[1]);
});
// 一般記錄儲存
$('#saveRecord').on('click', function () {
    event.preventDefault();
    let classType = $('input[name="typeRadio"]:checked').next('.radio-tile').find('.radio-label').text();
    let type = $('#type').find('.item.is-selected');
    console.log(type.text());
    let data_value = $('#gram').val();
    if(!classType){
        alert("請選擇類別");
        return;
    }else if(type.text() == ""){
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
    let type = $('input[name="engine"]:checked').next().find('.radio-label').text();
    let data_value = $('#kilometer').val();
    if(data_value <= 0) {
        alert("請輸入正數");
    } else if(!type) {
        alert("請選擇行為");
    } else {
        saveRecord("交通", type, data_value);
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
    time.text("截至" + formattedDate);
});
// 點擊修改暱稱按鈕
$('#rename').on('click', function () {
    // 顯示懸浮窗
    $('#renameFW').css("display", "flex");
    $('#renameFW').css("position", "fixed");
    $('#newName').attr("placeholder", User.nickname);
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
    $("#recordDetail").html();
    if(currentInfoWindowRecord.classType === "交通"){
        $('#routeFW').css("display", "flex");
        $('#routeFW').css("position", "fixed");
        $('#saveTrafficRecord').css("display", "none");
        $('#updateTrafficRecord').css("display", "block");
        $('#deleteTrafficRecord').css("display", "block");

        let checked = $('input[name="engine"]:checked');
        let checkedVal = $('input[name="engine"]:checked').val();
        if(checkedVal != undefined){
            $('#' + checkedVal + 'Icon').html(svgData.svgImages.transportation[checkedVal + 'Icon']);
            checked.prop('checked', false);
        }

        let type;
        $('input[name="engine"]').each(function() {
            if ($(this).next('.radio-tile').find('.radio-label').text() === currentInfoWindowRecord.type) {
                type = $(this).val();
                $(this).prop("checked", true);
                let changeEvent = new Event('change');
                $(this).trigger('change');
            }
        });

        let target = FootprintData.find(item => item.index === type);
        let description = questionMark[target.type].split(" ");
        $("#routeCompare").text(description[0]);
        $("#routeFormula").text(description[1]);
        $('#kilometer').val(currentInfoWindowRecord.data_value);
        $('#routeCalculate').text(currentInfoWindowRecord.footprint + " gCo2E");
    } else {
        $('#recordFW').css("display", "flex");
        $('#recordFW').css("position", "fixed");
        $('#saveRecord').css("display", "none");
        $('#updateRecord').css("display", "block");
        $('#deleteRecord').css("display", "block");

        $('input[name="typeRadio"]').each(function() {
            if ($(this).next('.radio-tile').find('.radio-label').text() === currentInfoWindowRecord.classType) {
                let classType = $(this).val();
                $(this).prop("checked", true);
                let changeEvent = new Event('change');
                $(this).trigger('change');
            }
        });

        let select = $('#type');
        selectDatas = FootprintData.filter(function(item) {
            return item.classZH === currentInfoWindowRecord.classType;
        });
        $('#select').attr('class', 'ts-select');
        select.empty();

        let options;
        let target;
        for(let selectData of selectDatas){
            if(selectData.type == currentInfoWindowRecord.type){
                $('#selectedType').text(selectData.type);
                let button = $('<button>', {
                    class: "item is-selected",
                    type: "button",
                    text: selectData.type
                });
                button.on('click', function() {
                    typeChange($(this).text());
                    select.find('.item').removeClass('is-selected').addClass('item');
                    $(this).addClass('is-selected');
                    $('#selectedType').text($(this).text());
                });
                select.append(button);
                options = selectData.option;
                target = selectData;
            } else {
                let button = $('<button>', {
                    class: "item",
                    type: "button",
                    text: selectData.type
                });
                button.on('click', function() {
                    typeChange($(this).text());
                    select.find('.item').removeClass('is-selected').addClass('item');
                    $(this).addClass('is-selected');
                    $('#selectedType').text($(this).text());
                });
                select.append(button);
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
                text: key + '(' + value + 'g)'
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
        $('#recordCalculate').text(currentInfoWindowRecord.footprint + " gCo2E");
        let description = questionMark[target.type].split(" ");
        $("#recordCompare").text(description[0]);
        $("#recordFormula").text(description[1]);
    }
}