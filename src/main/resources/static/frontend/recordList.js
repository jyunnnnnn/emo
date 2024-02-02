// 設定頁面顯示總減碳量(刪掉)
function showSettingPage(){
    let thisRecords = records;
    let container = document.getElementById("totalFootprint");
    container.innerHTML = ""; // 清空容器內容

    let totalFPDiv = document.createElement("div");
    totalFPDiv.style.display = "inline";
    let totalFP = 0;
    if(thisRecords.length == 0){
        totalFPDiv.textContent = "0g Co2E";
        container.appendChild(totalFPDiv);
    } else {
        for (let i = 0; i < thisRecords.length; i++) {
            totalFP += parseInt(thisRecords[i].footprint, 10);
        }
        totalFPDiv.textContent = totalFP + "g Co2E";
        totalFPDiv.style.maxWidth = "300px";
        container.appendChild(totalFPDiv);
        document.getElementById('deleteDataFP').textContent = "共減去 " + totalFP + " g Co2E";
    }
}
//點擊列表中的record
function recordClick(recordId){
    let recordIndex = records.findIndex(record => record.recordId === recordId);
    nowRecord=records[recordIndex];

    //關閉視窗
    $('#recordListFW').css('display', 'none');
    //找位置
    showNowRecordInFoWindow(nowRecord);
    //console.log(nowRecord);
}
//讓被點擊的紀錄呈現畫面中間，並打開inFoWindow
function showNowRecordInFoWindow(nowRecord){
    //跑到中心
    let centerPosition = new google.maps.LatLng(nowRecord.latitude, nowRecord.longitude);
    map.panTo(centerPosition);
    map.setZoom(15);

    // 找所有marker
    for (let i = 0; i < markers.length; i++) {
        if (markers[i].getPosition().equals(centerPosition)) {
            currentInfoWindowRecord = nowRecord;
            currentMarker=markers[i];
            markers[i].infoWindow.open(map,markers[i]);
            //console.log("InFoWindow OK")
            break;
        }
    }
}
// 圓餅圖
let myChart = null;
function showNewChart(nowRecords, type) {
    let data;
    let nowCategories = categories;
    const chartBox = $("#chartBox");
    for(let i=0; i<nowRecords.length; i++){
        let found = false;
        for (let category in nowCategories) {
            if(found) break;
            let parent = nowCategories[category];
            nowCategories[category].action.forEach(function(subcategory) {
                if(found) return;
                if(subcategory.type === nowRecords[i].type) {
                    subcategory.totalFP += nowRecords[i].footprint;
                    parent.footprint += nowRecords[i].footprint;
                    found = true;
                }
            });
        }
    }

    if(type =="全部" || type == "init"){
        for(let [key, value] of Object.entries(nowCategories)){
            if(key.footprint != 0) {
                found = true;
                break;
            }
        }
        if(!found){
            $("#chartBox").css("display", "none");
            $("#chartBox").text("沒有紀錄");
            return;
        } else {
            data = {
                labels: [],
                datasets: [{
                    label: '減碳量',
                    data: [],
                }]
            };
            for(let [key, value] of Object.entries(nowCategories)){
                data.labels.push(key);
                data.datasets[0].data.push(value.footprint);
            }
        }
    }else{
        if(nowCategories[type].footprint == 0){
            chartBox.css("display", "none");
            let container = $("#listContent");
            container.empty(); // 清空容器內容
            container.css({
                "overflowY": "scroll",
                "maxHeight": "150px"
            });
            let recordDiv = $("<div>")
                .css({
                    "display": "inline",
                    "textAlign": "center"
                })
                .text("沒有紀錄");
            container.append(recordDiv);

            return;
        }
        data = {
            labels: [],
            datasets: [{
                label: '減碳量',
                data: [],
            }]
        };

        nowCategories[type].action.forEach(function(subcategory) {
            data.labels.push(subcategory.type);
            data.datasets[0].data.push(subcategory.totalFP);
        });
    }
    const chartElement = $('#recordChart');
    // 判斷是否已經存在舊的圖
    if (myChart !== null) {
        myChart.destroy();
    }
    // 創建新的圖
    myChart = new Chart(chartElement, {
        type: 'pie',
        data: data,
    });

    chartBox.css("display", "block");
}
// 查看歷史紀錄
function showRecord() {
    //列表顯示環保紀錄
    let thisRecords = records;
    let container = $('#listContent');
    container.empty();
    container.css({
        'overflow-y': 'scroll',
        'max-height': '150px'
    });

    if(thisRecords.length == 0){
        let recordDiv = $("<div>")
            .css({
                'display': 'inline',
                'text-align': 'center'
            })
            .text("沒有紀錄");
        container.append(recordDiv);
    } else {
        for (let i = 0; i < thisRecords.length; i++) {
            // 創建新的checkbox
            let checkbox = $('<label>')
                .addClass('checkbox-container')
                .css({
                    'margin-right': '3px',
                    'display': 'none'
                });
            let input = $('<input>')
                .attr('type', 'checkbox')
                .addClass('custom-checkbox');
            let span = $('<span>')
                .addClass('checkmark')
                .attr('id', 'check_' + thisRecords[i].recordId);
            checkbox.append(input).append(span);

            // 創建新的<div>元素
            let recordDiv = $("<div>")
                .css({
                    'display': 'flex',
                    'align-items': 'center'
                });

            // 創建新的 <p> 元素
            let recordElement = $("<p>");
            let timeSpan = $("<span>")
                .text(thisRecords[i].time + " ");
            let typeSpan = $("<span>")
                .text(thisRecords[i].type + " ");
            let footprintSpan = $("<span>")
                .text(" (" + thisRecords[i].footprint + "g Co2E)");

            recordElement.append(timeSpan, typeSpan, footprintSpan);
            recordDiv.append(checkbox, recordElement);
            recordDiv.attr('id', 'record_' + thisRecords[i].recordId);
            container.append(recordDiv);

            (function(recordId) {
                recordElement.on('click', function() {
                    recordClick(recordId);
                });
            })(thisRecords[i].recordId);
        }
    }
    showNewChart(thisRecords,"init");

    let formattedDate = getFormattedDate();
    records.sort((a, b) => new Date(a.time) - new Date(b.time));
    let datePart;
    if(records.length>0){
         datePart = records[0].time.slice(0, 10);
    }else{
        datePart = formattedDate;
    }

    $('#startDate').val(datePart);
    $('#endDate').val(formattedDate);
    // 時間始末
    $('#startDate').attr('min', datePart);
    $('#startDate').attr('max', formattedDate);
    $('#endDate').attr('min', datePart);
    $('#endDate').attr('max', formattedDate);
}
// 排序歷史紀錄
function sortRecordsBySelectedOption() {
    let selectedCategory = $("#category option:selected").text();
    let selectedType = $("#sortType option:selected").text();
    let sortedRecords = records;

    if (selectedCategory != "全部") {
        sortedRecords = sortedRecords.filter(record => record.classType === selectedCategory);
    }

    if (selectedType === "時間") {
        $("#method").attr("label", "時間");
        $("#option1").val("old");
        $("#option1").text("遠到近");
        $("#option2").val("new");
        $("#option2").text("近到遠");
        let selectedMethod = $("#sortMethod option:selected").text();
        if (selectedMethod === "近到遠") {
            sortedRecords.sort((a, b) => new Date(b.time) - new Date(a.time));
        } else if (selectedMethod === "遠到近") {
            sortedRecords.sort((a, b) => new Date(a.time) - new Date(b.time));
        }
    } else if (selectedType === "減碳量") {
        $("#method").attr("label", "減碳量");
        $("#option1").val("more");
        $("#option1").text("多到少");
        $("#option2").val("less");
        $("#option2").text("少到多");
        let selectedMethod = $("#sortMethod option:selected").text();
        if (selectedMethod === "多到少") {
            sortedRecords.sort((a, b) => b.footprint - a.footprint);
        } else if (selectedMethod === "少到多") {
            sortedRecords.sort((a, b) => a.footprint - b.footprint);
        }
    }
    let startDate = $('#startDate').val()
    let endDate = $('#endDate').val()
    sortedRecords = sortedRecords.filter(record =>{
        let recordDate = new Date(record.time.split(' ')[0]); // 提取日期部分
        return recordDate >= new Date(startDate) && recordDate <= new Date(endDate);
    });
    $('#startDate').attr('max', endDate);
    $('#endDate').attr('min', startDate);
    showNewRecord(sortedRecords);
}
// 監聽排序選項變化事件
$('#category, #sortType, #sortMethod, #startDate, #endDate').on("change", sortRecordsBySelectedOption);

function showNewRecord(sortedRecords) {
    let thisRecords = sortedRecords;
    let container = $('#listContent');
    container.empty();
    container.css({
        'overflow-y': 'scroll',
        'max-height': '150px'
    });

    if(thisRecords.length == 0){
        let recordDiv = $("<div>")
            .css({
                'display': 'inline',
                'text-align': 'center'
            })
            .text("沒有紀錄");
        container.append(recordDiv);
    } else {
        for (let i = 0; i < thisRecords.length; i++) {
            // 創建新的checkbox
            let checkbox = $('<label>')
                .addClass('checkbox-container')
                .css({
                    'margin-right': '3px',
                    'display': 'none'
                });
            let input = $('<input>')
                .attr('type', 'checkbox')
                .addClass('custom-checkbox');
            let span = $('<span>')
                .addClass('checkmark')
                .attr('id', 'check_' + thisRecords[i].recordId);
            checkbox.append(input).append(span);

            // 創建新的<div>元素
            let recordDiv = $("<div>")
                .css({
                    'display': 'flex',
                    'align-items': 'center'
                });

            // 創建新的 <p> 元素
            let recordElement = $("<p>");
            let timeSpan = $("<span>")
                .text(thisRecords[i].time + " ");
            let typeSpan = $("<span>")
                .text(thisRecords[i].type + " ");
            let footprintSpan = $("<span>")
                .text(" (" + thisRecords[i].footprint + "g Co2E)");

            recordElement.append(timeSpan, typeSpan, footprintSpan);
            recordDiv.append(checkbox, recordElement);
            recordDiv.attr('id', 'record_' + thisRecords[i].recordId);
            container.append(recordDiv);

            (function(recordId) {
                recordElement.on('click', function() {
                    recordClick(recordId);
                });
            })(thisRecords[i].recordId);
        }
    }
    showNewChart(thisRecords, $("#category option:selected").text());
}