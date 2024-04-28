let selectDatas;
let cropper; // 上傳的照片
let croppedImageUrl;// 裁好的照片
// 一般記錄按鈕
$('#openRecordModal').on('click', function() {
    //關閉上一個打開的infoWindow，及清除路線
    if (typeof currentMarker !='undefined') {
        currentMarker.infoWindow.close();
        if(currentInfoWindowRecord.classType=="交通"){
            removeDirections();
            clearMapLines();
        }
    }


    $('#recordCalculate').text("0 gCO2e");
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
    //console.log(description[0],description[1]);
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
    $('#recordCalculate').text(showExpectedFP  + " gCO2e");
});
$('#gram').on('input', function(event) {
    let type = $('#type').find('.item.is-selected');
    let data_value = $('#gram').val();
    let showExpectedFP = 0;
    if (data_value > 0){
        showExpectedFP = parseFloat(calculateFootprint(type.text(), data_value)).toFixed(2);
    }
    $('#recordCalculate').text(showExpectedFP + " gCO2e");
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
    reloadAchievement();
    // 顯示懸浮窗
    $('#historyFW').css("display", "flex");
    $('#historyFW').css("position", "fixed");
    $('#editRecord').css("display", "block");
    $('#saveEditRecord').css("display", "none");
    $('#deleteEditRecord').css("display", "none");

    $('#selectedSortType').text('請選擇排序依據');
    $('#selectedMethod').text('請先選擇一項依據');
    $('#method').attr('class', 'ts-select is-disabled');
    $('#classNType').children().each(function() {
        if ($(this).hasClass('is-selected')) {
            $(this).removeClass('is-selected');
        }
        $('#all').addClass('is-selected');
    });
    $('#selectedClass').children().each(function() {
        if ($(this).css('display') === 'flex') {
            $(this).css('display', 'none');
        }
        $('#allClass').css('display', 'inline-flex');
    });
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
$('#sortByTime, #sortByFP').on('click', function() {
    $('#method').attr('class', 'ts-select');
    $('#selectedMethod').text('請選擇排序方式');
    $('#sortTypeBtn').find('.item').removeClass('is-selected').addClass('item');
    $(this).addClass('is-selected');
    $('#selectedSortType').text($(this).text());

    if($(this).text() === "時間"){
        $('#time1').css('display', 'block');
        $('#time2').css('display', 'block');
        $('#FP1').css('display', 'none');
        $('#FP2').css('display', 'none');
    } else {
        $('#time1').css('display', 'none');
        $('#time2').css('display', 'none');
        $('#FP1').css('display', 'block');
        $('#FP2').css('display', 'block');
    }
});
$('#time1, #time2, #FP1, #FP2').on('click', function() {
    $('#methodBtn').find('.item').removeClass('is-selected').addClass('item');
    $(this).addClass('is-selected');
    $('#selectedMethod').text($(this).text());
    sortRecordsBySelectedOption($(this).text());
});
// 監聽篩選項目
let selectedArray = ["全部"]
let targetNode = document.getElementById('selectedClass');
let observer = new MutationObserver(function(mutationsList, observer) {
    mutationsList.forEach(function(mutation) {
        if (mutation.attributeName === 'style') {
            let nowClass;
            if(mutation.target.style.display === 'none'){
                selectedArray = selectedArray.filter(item => item !== mutation.target.textContent);
                let count = 0;
                $('#classNType').children().each(function() {
                    if ($(this).hasClass('is-selected')) {
                        count++;
                    }
                });
                if(count == 0){
                    $('#allClass').css('display', 'inline-flex');
                    $('#all').addClass('is-selected');
                }
            } else {
                selectedArray.push(mutation.target.textContent);
                if (mutation.target.id.includes("Class")){ //是類別且選取
                    nowClass = mutation.target.id.replace("Class", "");
                    if(nowClass === "all"){
                        $('#classNType').children().each(function() {
                            if ($(this).hasClass('is-selected') && $(this).attr('id') != 'all') {
                                $(this).removeClass('is-selected');
                            }
                        });
                        $('#selectedClass').children().each(function() {
                            if ($(this).css('display') === 'flex' && $(this).attr('id') != 'allClass') {
                                $(this).css('display', 'none');
                            }
                        });
                    } else {
                        if ($('#all').hasClass('is-selected')) {
                            $('#all').removeClass('is-selected');
                            $('#allClass').css('display', 'none');
                        }
                        $('#classNType').children().each(function() {
                            let id = $(this).attr('id');
                            if (id.includes(nowClass) && $(this).hasClass('is-selected')  && id != nowClass + 'NClass') {
                                $(this).removeClass('is-selected');
                                let newId = id.split('N');
                                $('#' + newId[0] + newId[1]).css('display', 'none');
                            }
                        });
                        $('#selectedClass').children().each(function() {
                            if ($(this).css('display') === 'flex' && $(this).attr('id').includes(nowClass) && $(this).attr('id') != mutation.target.id) {
                                $(this).css('display', 'none');
                            }
                        });
                    }
                } else {//是項目且選取
                    nowClass = mutation.target.id.split('and');
                    if ($('#all').hasClass('is-selected')) {
                        $('#all').removeClass('is-selected');
                        $('#allClass').css('display', 'none');
                    }
                    if($('#' + nowClass[1] + 'NClass').hasClass('is-selected')){
                        $('#' + nowClass[1] + 'NClass').removeClass('is-selected');
                        $('#' + nowClass[1] + 'Class').css('display', 'none');
                    }
                }
            }
        }
        sortRecordsBySelectedOption($('#selectedMethod').text());
    });
});
let config = { attributes: true, subtree: true };
observer.observe(targetNode, config);

// 顯示更多紀錄
$('#moreRecord').on('click', function (){
    $('#recordListFW').css("display", "flex");
    $('#recordListFW').css("position", "fixed");
    $('#historyFW').css("display", "none");
    $('#editRecord').css("display", "block");
    $('#saveEditRecord').css("display", "none");
    $('#deleteEditRecord').css("display", "none");

    let checked = $('input[name="tabs"]:checked');
    let checkedVal = $('input[name="tabs"]:checked').val();
    if(checkedVal != undefined){
        checked.prop('checked', false);
        $('#selectClass input[id="allHistory"]').prop('checked', true);
        showRecord();
    } else {
        $('#selectClass input[id="allHistory"]').prop('checked', true);
    }
});
$('#recordReturn').on('click', function (){
    $('#historyFW').css("display", "flex");
    $('#historyFW').css("position", "fixed");
    $('#recordListFW').css("display", "none");

    $('#newestRecord .deleteBox').css("display", "none");
    $('#newestRecord .recordListSvg').css("display", "flex");
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
    } else if(event.target.id === 'historyFW') {
        $('#historyFW').css("display", "none");
    } else if(event.target.id === 'recordListFW') {
        $('#recordListFW').css("display", "none");
        $('#historyFW').css("display", "flex");
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
    } else if(event.target.id === 'historyFW') {
        $('#historyFW').css("display", "none");
    } else if(event.target.id === 'achievementFW') {
        $('#achievementFW').css("display", "none");
        $('#historyFW').css("display", "flex");
    } else if(event.target.id === 'eachAchievementFW') {
        $('#eachAchievementFW').css("display", "none");
        $('#achievementFW').css("display", "flex");
    }else if(event.target.id === 'uploadUserPhotoFW') {
        $('#uploadUserPhotoFW').css("display", "none");
    }else if(event.target.id === 'FPTransferFW') {
        $('#FPTransferFW').css("display", "none");
    }else if(event.target.id === 'rankingFW') {
        $('#rankingFW').css("display", "none");
    }else if(event.target.id === 'shareError') {
        $('#shareError').css("display", "none");
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
$('#closeHistoryModal').on('click', function () {
    $('#historyFW').css("display", "none");
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
    let deleteBoxes = document.querySelectorAll('.deleteBox');
    let recordListSvg = document.querySelectorAll('.recordListSvg');
    deleteBoxes.forEach(function(deleteBox) {
        deleteBox.style.display = 'flex';
    });
    recordListSvg.forEach(function(svg) {
        svg.style.display = 'none';
    });
})
$('#saveEditRecord').on('click', function() {
    event.preventDefault();
    $('#editRecord').css("display", "block");
    $('#saveEditRecord').css("display", "none");
    $('#deleteEditRecord').css("display", "none");
    $('input[type=checkbox].deleteCheckbox:checked').prop('checked', false);
    let deleteBoxes = document.querySelectorAll('.deleteBox');
    let recordListSvg = document.querySelectorAll('.recordListSvg');
    deleteBoxes.forEach(function(deleteBox) {
        deleteBox.style.display = 'none';
    });
    recordListSvg.forEach(function(svg) {
        svg.style.display = 'flex';
    });
});

// 修改懸浮視窗變成歷史紀錄
function recordModal(){
    //關閉上一個打開的infoWindow，及清除路線
    if (typeof currentMarker !='undefined') {
        currentMarker.infoWindow.close();
        if(currentInfoWindowRecord.classType=="交通"){
            removeDirections();
            clearMapLines();
        }
    }
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
        $('#routeCalculate').text(currentInfoWindowRecord.footprint + " gCO2e");
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
        $('#recordCalculate').text(currentInfoWindowRecord.footprint + " gCO2e");
        let description = questionMark[target.type].split(" ");
        $("#recordCompare").text(description[0]);
        $("#recordFormula").text(description[1]);
    }
}

// 打開上傳照片懸浮窗
$('#photoContainer').click(function(event) {
    $('#originalPhoto').css("display","block");
    $('#originalPhoto').attr("src",User.photo);
    $('#fileInputLabel').css("display","block");
    $('#uploadUserPhotoFW').css("display", "flex");
    $('#cropperContainer').css("display","none");
    $('#croppedImage').css("display","none");
    $('#cropImage').css("display","none");
    $('.cropper-container').css("display", "none");
    $('#upLoadUserPhoto').css("display","none");
    $('#fileInput').val("");
});

$('#userPhoto').click(function(event) {
    $('#fileInputLabel').css("display","block");
    $('#uploadUserPhotoFW').css("display", "flex");
    $('#cropperContainer').css("display","none");
    $('#croppedImage').css("display","none");
    $('#cropImage').css("display","none");
    $('.cropper-container').css("display", "none");
    $('#upLoadUserPhoto').css("display","none");
    $('#fileInput').val("");
});

// 關閉上傳照片懸浮窗
$('#uploadUserPhotoBtn').on('click', function () {
    $('#uploadUserPhotoFW').css("display", "none");
});

// 上傳照片後處理
$('#fileInput').on('change', function(event) {
    $('#fileInputLabel').css("display","none");
    $('#originalPhoto').css("display","none");
    $('#croppedImage').css("display","none");
    let file = event.target.files[0];
    let reader = new FileReader();

    reader.onload = function(event) {
        // 判斷HEIF
        if (file.type === 'image/heic' || file.type === 'image/heif') {
            convertHEIFtoJPEG(file).then((jpegFile) => {
                displayImage(jpegFile);
            }).catch((error) => {
                console.error('照片格式轉換錯誤:', error);
            });
        } else {
            displayImage(file);
        }
    };

    reader.readAsDataURL(file);
    $('#cropperContainer').css("display","block");
    $('#cropImage').css("display","block");
});

// 將 HEIF 格式的影像轉換為 JPEG 格式
function convertHEIFtoJPEG(heifFile) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = image.width;
            canvas.height = image.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(image, 0, 0);
            canvas.toBlob((blob) => {
                resolve(new File([blob], heifFile.name.replace(/\.(heif|heic)$/, '.jpg'), { type: 'image/jpeg' }));
            }, 'image/jpeg');
        };
        image.onerror = (error) => {
            reject(error);
        };
        image.src = URL.createObjectURL(heifFile);
    });
}

function displayImage(imageFile) {
    let img = document.getElementById('cropperContainer');
    img.src = URL.createObjectURL(imageFile);
    if (cropper) {
        cropper.destroy();
    }

    cropper = new Cropper(img, {
        aspectRatio: 1 / 1,
        viewMode: 1
    });
}

$('#cropImage').click(cropImage);
// 裁剪照片
function cropImage() {
    $('.cropper-container').css("display", "none");
    $('#cropperContainer').css("display","none");
    $('#cropImage').css("display","none");
    let canvas = cropper.getCroppedCanvas({
        width: 280,
        height: 200
    });
    if (canvas) {
        croppedImageUrl = canvas.toDataURL();
        let modalImg = document.getElementById('croppedImage');
        modalImg.src = croppedImageUrl;
        // console.log(croppedImageUrl);
    }
    $('#croppedImage').css("display","block");
    $('#upLoadUserPhoto').css("display","block");
}

// 打開碳排轉換懸浮窗
$('#totalFootprint').click(function(event) {
    $('#FPTransferFW').css("display", "flex");
    //來源台北旅遊網一次性用品之碳排放量(data之後改
    let bottle=totalFP/3.63; //g
    let straw =totalFP/5.33; //g
    let chopsticks =totalFP/20.0; //g
    let tree;
    let treeSVG =`<svg width="20px" height="20px" viewBox="0 0 1000 1000" class="icon"  version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M807.057402 313.232628v-2.320241c14.694864-85.075529-26.296073-172.471299-163.190333-151.589124-9.280967 1.546828-14.694864-62.646526-82.755287-76.567976-28.616314-5.413897-85.075529-6.187311-116.012084-0.773414-40.990937 6.960725-78.888218 40.217523-99.770393 89.716012H324.44713c-76.567976-4.640483-123.746224 63.41994-112.145015 134.574018 1.546828 6.960725 0.773414 13.92145 1.546828 20.882176-30.936556 20.882175-59.55287 68.060423-59.55287 114.465256 0 68.060423 53.365559 116.785498 109.824773 116.785499h0.773414c-6.960725 70.380665 56.459215 95.903323 107.504532 95.903323H471.39577c13.92145 0 27.069486-3.093656 39.444109-8.507553 13.92145 6.960725 28.616314 11.601208 44.858006 11.601209h99.770393c51.045317 0 94.356495-41.76435 107.504532-98.996979 0 0 106.731118 60.326284 133.02719-114.465257 12.374622-74.247734-38.670695-122.97281-88.942598-130.706949z" fill="#1ca538" /><path d="M714.247734 487.250755c-3.867069 50.271903-33.256798 52.592145-45.63142 51.045318 3.867069-5.413897 7.734139-11.601208 10.827795-18.561934 20.882175-40.990937 0-88.169184 6.187311-90.489426 29.389728-14.694864 12.374622-60.326284 12.374622-60.326284l-6.960725 1.546828c9.280967 23.975831 1.546828 40.990937-13.148036 48.725075-37.123867 18.561934-54.138973-20.108761-54.138973-20.108761l-3.093655 8.507553c13.92145 31.70997 53.365559 31.70997 53.365558 31.70997l0.773414 31.709969c-27.8429 37.897281-40.217523 0-40.217522 0l-1.546828 10.054381c23.202417 39.444109 39.444109 4.640483 39.444109 4.640483-1.546828 29.389728-17.78852 47.178248-35.57704 58.006043-34.803625 21.655589-71.154079 16.241692-71.154078 16.241692 19.335347-13.92145 26.296073-29.389728 23.202417-51.045318-3.093656-22.429003-13.148036-20.108761-32.483384-34.030211-12.374622-8.507553-19.335347-20.108761-21.655589-41.764351-3.093656-21.655589 27.8429-37.123867 27.8429-37.123867l-3.867069-6.960725c-55.685801 20.882175-27.069486 74.247734-27.069487 74.247734-19.335347 0.773414-21.655589 0.773414-32.483383-27.069486-10.827795-27.8429-37.123867-10.827795-37.123867-10.827794l1.546827 5.413897c20.108761-13.92145 28.616314 16.241692 28.616315 16.241692 5.413897 35.577039 37.897281 33.256798 37.897281 33.256797 57.232628 12.374622 18.561934 97.450151-28.616315 85.075529-72.700906-19.335347-61.099698-36.350453-61.099697-36.350453 43.311178-23.975831 11.601208-61.873112 11.601208-61.873112l-6.960725 5.413897c23.202417 9.280967 0 55.685801-23.975831 42.537765-26.296073-14.694864-3.867069-41.76435-3.867069-41.764351l-7.734139 1.546828c-23.202417 37.897281 18.561934 54.138973 18.561933 54.138973 1.546828 14.694864 7.734139 24.749245 14.694864 31.70997-37.897281-2.320242-118.332326-17.015106-93.583081-101.317221 0 0 71.154079 4.640483 75.021148-61.099698l-10.054381-3.867069s-5.413897 54.912387-66.513595 51.818731c0 0-46.404834-10.827795-20.108762-62.646526l-8.507552-1.546828s-32.483384 47.178248 16.241691 75.794562c0 0-13.148036 37.123867 1.546828 70.380665-19.335347 9.280967-33.256798-16.241692-33.256797-16.241692l-1.546828 15.468278c17.015106 20.108761 32.483384 14.694864 39.444109 10.827795 15.468278 24.749245 50.271903 45.63142 122.199395 44.084592l-0.773413 398.308157h122.972809l-15.468278-398.308157c37.123867-5.413897 67.287009-7.734139 91.26284-36.350454 55.685801 13.148036 60.326284-58.779456 60.326284-58.779456h-7.734139z" fill="#65320b" /></svg>`
    // 轉換單位
    $('#reduceToBottle').html(convertToUnit(bottle));
    $('#reduceToStraw').html(convertToUnit(straw));
    $('#reduceToChopsticks').html(convertToUnit(chopsticks));

    if(totalFP>100000){
        tree = totalFP/6000.0;
        $('#FPTransferTree').html("相當於 " + convertToUnit(tree) + " 棵"+ treeSVG + "<br>一年吸收碳當量");
    }else {
        tree = totalFP/500.0;
        $('#FPTransferTree').html("相當於 " + convertToUnit(tree) + " 棵" + treeSVG + "<br>一個月吸收碳當量");
    }
});

// 關閉碳排轉換懸浮窗
$('#FPTransferBtn').on('click', function () {
    $('#FPTransferFW').css("display", "none");
});

// 單位轉換
function convertToUnit(value) {
    if (value > 99999999) {
        return "<strong>"+(value / 100000000).toFixed(2)+"</strong>" + "億";
    } else if (value > 9999999) {
        return "<strong>"+(value / 10000000).toFixed(2) +"</strong>"+ "千萬";
    } else if (value > 999999) {
        return "<strong>"+(value / 1000000).toFixed(2) +"</strong>"+ "百萬";
    } else if (value > 9999) {
        return "<strong>"+(value / 10000).toFixed(2) +"</strong>"+ "萬";
    } else {
        return "<strong>"+value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')+"</strong>";
    }
}


