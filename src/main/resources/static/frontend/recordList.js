// 顯示總減碳量
let dateArray=[];
let totalFP = 0;
let deleteSvg = "<svg\n    xmlns=\"http://www.w3.org/2000/svg\"\n    fill=\"none\"\n    viewBox=\"0 0 50 59\"\n    class=\"bin\"\n  >\n    <path\n      fill=\"#B5BAC1\"\n      d=\"M0 7.5C0 5.01472 2.01472 3 4.5 3H45.5C47.9853 3 50 5.01472 50 7.5V7.5C50 8.32843 49.3284 9 48.5 9H1.5C0.671571 9 0 8.32843 0 7.5V7.5Z\"\n    ></path>\n    <path\n      fill=\"#B5BAC1\"\n      d=\"M17 3C17 1.34315 18.3431 0 20 0H29.3125C30.9694 0 32.3125 1.34315 32.3125 3V3H17V3Z\"\n    ></path>\n    <path\n      fill=\"#B5BAC1\"\n      d=\"M2.18565 18.0974C2.08466 15.821 3.903 13.9202 6.18172 13.9202H43.8189C46.0976 13.9202 47.916 15.821 47.815 18.0975L46.1699 55.1775C46.0751 57.3155 44.314 59.0002 42.1739 59.0002H7.8268C5.68661 59.0002 3.92559 57.3155 3.83073 55.1775L2.18565 18.0974ZM18.0003 49.5402C16.6196 49.5402 15.5003 48.4209 15.5003 47.0402V24.9602C15.5003 23.5795 16.6196 22.4602 18.0003 22.4602C19.381 22.4602 20.5003 23.5795 20.5003 24.9602V47.0402C20.5003 48.4209 19.381 49.5402 18.0003 49.5402ZM29.5003 47.0402C29.5003 48.4209 30.6196 49.5402 32.0003 49.5402C33.381 49.5402 34.5003 48.4209 34.5003 47.0402V24.9602C34.5003 23.5795 33.381 22.4602 32.0003 22.4602C30.6196 22.4602 29.5003 23.5795 29.5003 24.9602V47.0402Z\"\n      clip-rule=\"evenodd\"\n      fill-rule=\"evenodd\"\n    ></path>\n    <path fill=\"#B5BAC1\" d=\"M2 13H48L47.6742 21.28H2.32031L2 13Z\"></path>\n  </svg>";


function showTotalFP(){
    totalFP = 0;
    let thisRecords = records;
    let container = $('#totalFootprint');
    container.innerHTML = ""; // 清空容器內容

    if(thisRecords.length == 0){
        container.text("0g CO2e");
    } else {
        for (let i = 0; i < thisRecords.length; i++) {
            totalFP += parseFloat(thisRecords[i].footprint, 10);
        }
    }
    console.log(totalFP);
    result=convertTotalFPtoRankColor(totalFP);
    console.log(result);
    if(AllUsersFp.length!=undefined){
         const index = AllUsersFp.findIndex(user => user.userId === User.userId);
         AllUsersFp[index].totalFP = totalFP ;
         AllUsersFp[index].rankType=result.rankType;
    }
    $('#totalFootprint').css('background', result.color);
    container.html("總減碳量：<strong>" + result.FPString);
    $('#deleteDataFP').text("共減去 " + result.FPString);
    $('#recordFP').text(result.FPString);

}
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
        if (markers[i].id==nowRecord.recordId) {
            currentInfoWindowRecord = nowRecord;
            currentMarker=markers[i];
            markers[i].infoWindow.open(map,markers[i]);
            // 從紀錄列表點開也要呈現路線
            if(currentInfoWindowRecord.classType=="交通"){
                drawLine(currentInfoWindowRecord,false);
            }
            //console.log("InFoWindow OK")
            break;
        }
    }
}

// 圓餅圖
let myChart = null;
function showNewChart(nowRecords, type) {
    let nowCategories = categories;

    // 重置圖表減碳量 防止重開時累加
    for (let category in nowCategories) {
        let parent = nowCategories[category];
        parent.footprint = 0;

        parent.action.forEach(function (subcategory) {
            subcategory.totalFP = 0;
        });
    }

    for(let i=0; i<nowRecords.length; i++){
        let found = false;
        for (let category in nowCategories) {
            if(found) break;
            let parent = nowCategories[category];
            nowCategories[category].action.forEach(function(subcategory) {
                if(found) return;
                if(subcategory.type === nowRecords[i].type) {
                    if(typeof nowRecords[i].footprint !== "number"){
                        nowRecords[i].footprint = parseFloat(nowRecords[i].footprint).toFixed(2);
                    }
                    if(typeof subcategory.totalFP !== "number"){
                        subcategory.totalFP = parseFloat(subcategory.totalFP);
                    }
                    subcategory.totalFP += nowRecords[i].footprint;
                    if(typeof parent.footprint !== "number"){
                        parent.footprint = parseFloat(parent.footprint);
                    }
                    parent.footprint += nowRecords[i].footprint;
                    found = true;
                }
            });
        }
    }

    let chartBox = $('#chart');
    let chart = echarts.init(chartBox[0]);

    let seriesData = [];
    let nowFP = 0;

    if(type =="全部" || type == "init"){
        for(let [key, value] of Object.entries(nowCategories)){
            if(value.footprint != 0 && value.footprint != undefined) {
                if(typeof value.footprint !== "number"){
                    value.footprint = parseFloat(value.footprint).toFixed(2);
                } else {
                    value.footprint = value.footprint.toFixed(2);
                }
                seriesData.push({
                    name: key,
                    value: value.footprint,
                    itemStyle: {
                        color: value.color
                    }
                });
            }
        }
    } else {
        nowCategories[type].action.forEach(function(subcategory) {
            if(subcategory.totalFP != 0){
                if(typeof subcategory.totalFP !== "number"){
                    subcategory.totalFP = parseFloat(subcategory.totalFP).toFixed(2);
                } else {
                    value.footprint = value.footprint.toFixed(2);
                }
                seriesData.push({
                    name: subcategory.type,
                    value: parseFloat(subcategory.totalFP).toFixed(2),
                    itemStyle: {
                        color: subcategory.color
                    }
                });
            }
        });
    }
    if(type === "全部" || type === "init") type = "總";
    let option = {
        grid: {
            bottom: 0,
            left: 'center'
        },
        tooltip: {
            formatter: '{b}: {c} gCO2e',
            trigger: 'item'
        },
        series: [
            {
                center:['50%', '50%'],
                name: '減碳量',
                type: 'pie',
                radius: ['35%', '65%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#EBEDEFDD',
                    borderWidth: 2,
                },
                label: {
                    formatter: '{b|{b}}\n{per|{d}%}',
                    position: 'inside',
                    backgroundColor: '#EBEDEFDD',
                    borderColor: '#8C8D8E',
                    borderRadius: 4,
                    padding:[-5,3,8],
                    rich: {
                        b: {
                            color: '#4C5058',
                            fontSize: 14,
                            fontWeight: 'bold',
                            align: 'center',
                            lineHeight: 33
                        },
                        per: {
                            padding:[-5,0],
                            color: '#4C5058',
                            align: 'center',
                            borderRadius: 4
                        }
                    },
                    fontFamily: "'HunInn', 'Mandali', sans-serif"
                },
                labelLayout: {
                    hideOverlap: true
                },
                data: seriesData
            }
        ]
    };

    chart.setOption(option);
    chartBox.css("display", "inline-flex");
}

// 查看歷史紀錄
function showRecord() {
    //關閉上一個打開的infoWindow，及清除路線
    if (typeof currentMarker != 'undefined') {
        currentMarker.infoWindow.close();
        if(currentInfoWindowRecord.classType=="交通"){
            clearMapLines();
        }
    }

    //列表顯示環保紀錄
    let thisRecords = records;
    let container = $('#listContent');
    container.empty();

    if(thisRecords.length == 0){
        let recordDiv = $("<div>")
            .css({
                'display': 'flex',
                'align-items': 'center',
                'background': 'rgba(235, 237, 239, 0.87)',
                'border-radius': '20px',
                'justify-content': 'center',
                'align-items': 'center',
                'height': '70px',
                'margin-bottom': '5px'
            })
            .text("沒有紀錄");
        container.append(recordDiv);
        $('#newestRecord').empty();
        $('#newestRecord').append(recordDiv.clone());
    } else {
        let yearNmonth = "";
        let nowDiv;
        for (let i = thisRecords.length-1; i >= 0; i--) {
            let time = thisRecords[i].time.split(" ");
            // 時間標籤
            let timeTitle = time[0].split("-");
            let now = timeTitle[0] + "年" + timeTitle[1] + "月";
            if(now != yearNmonth){
                yearNmonth = now;
                let newTime = $("<div>")
                    .addClass("recordTime")
                    .text(now);
                nowDiv = $("<div>");
                container.append(newTime, nowDiv);
            }
            let icon = $('<svg>')
                .html(svgData.svgImages.recordList[thisRecords[i].classType])
                .attr('class', 'recordListSvg');

            // 創建新的checkbox
            let deleteBox = $('<div>')
                .addClass('deleteBox')
                .css({
                    'display': 'none'
                });
            let checkbox = $('<input>', {
                type: 'checkbox',
                class: 'deleteCheckbox',
                id: 'check_' + thisRecords[i].recordId
            });
            let label = $('<label>', {
                for: 'check_' + thisRecords[i].recordId,
                class: 'deleteButton'
            });
            label.html(deleteSvg);
            deleteBox.append(checkbox).append(label);

            // 每一筆紀錄的div
            let recordDiv = $("<div>")
                .addClass('recordDiv')
                .hover(
                    function() {
                        $(this).css('background-color', categories[thisRecords[i].classType].color);
                    },
                    function() {
                        $(this).css('background-color', 'rgba(235, 237, 239, 0.87)');
                    }
                );

            // 紀錄項目及減碳量div
            let recordElement = $("<div>")
                .css({
                    'width': '200px',
                });
            let typeDiv = $("<div>")
                .text(thisRecords[i].type)
                .css({
                    'font-size': '18px',
                    'margin-left' : '5px'
                });
            let footprintDiv = $("<div>")
                .text(parseFloat(thisRecords[i].footprint).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','))
                .css({
                    'color': '#28a745',
                    'font-size': '23px',
                    'margin-left': '5px',
                    'font-weight': 'bold'
                });
            let co2 = $("<span>")
                .text('gCO2e')
                .css({
                    'color': '#28a745',
                    'font-size': '10px',
                    'margin-left': '5px',
                    'font-weight': 'bold'
                });
            footprintDiv.append(co2);
            recordElement.append(typeDiv, footprintDiv);

            // 時間div
            let timeElement = $("<div>")
                .css({
                    'text-align': 'right',
                    'align-self': 'flex-end',
                    'margin-left': '20px',
                    'margin-bottom': '5px',
                    'font-size': '12px'
                });
            let dateSpan = $("<div>")
                .text(time[0]);
            let timeSpan = $("<div>")
                .text(time[1]);
            timeElement.append(dateSpan, timeSpan);

            recordDiv.append(deleteBox, icon, recordElement, timeElement);
            recordDiv.attr('id', 'record_' + thisRecords[i].recordId);
            nowDiv.append(recordDiv);
            if(i == thisRecords.length -1){
                let newest = recordDiv.clone();
                newest.find('[id]').each(function() {
                    $(this).attr('id', 'newest');
                });
                $('#newestRecord').empty();
                $('#newestRecord').append(newest);
            }

            (function(recordId) {
                recordElement.on('click', function() {
                    recordClick(recordId);
                });
            })(thisRecords[i].recordId);
        }
    }
    showNewChart(thisRecords,"init");
    records.sort((a, b) => new Date(a.time) - new Date(b.time));
    let formattedDate = getFormattedDate().slice(0, 10);
    let datePart;
    if(records.length>0){
        datePart = records[0].time.slice(0, 10);
        dateArray[0] = datePart;
        dateArray[1] = formattedDate;
    }else{
        datePart = formattedDate;
        dateArray[0] = datePart;
        dateArray[1] = formattedDate;
    }
    flatpickr("#startDate", {
        mode: "range", // 選擇模式
        dateFormat: "Y-m-d", // 日期格式
        defaultDate: [datePart, formattedDate], // 日期範圍
        minDate: datePart,
        maxDate: formattedDate,
        allowInput: false,
        onChange: function(selectedDates,dateStr){
            if(dateStr.includes('to')){
                dateArray = dateStr.split(' to ');
                //console.log(dateArray);
            }
            else{
                dateArray[0] = dateStr;
                dateArray[1] = dateStr;
                //console.log(dateStr,dateArray);
            }
            //console.log(dateStr,dateArray);
        }
    });
}
// 排序歷史紀錄
function sortRecordsBySelectedOption(method) {
    let selectedCategory = selectedArray;
    let sortedRecords = records;

    if (!selectedCategory.includes("全部")) {
        sortedRecords = sortedRecords.filter(function(item) {
            return selectedArray.includes(item.classType) || selectedArray.includes(item.type);
        });
    }

    if (method === "遠到近") {
        sortedRecords.sort((a, b) => new Date(b.time) - new Date(a.time));
    } else if (method === "近到遠") {
        sortedRecords.sort((a, b) => new Date(a.time) - new Date(b.time));
    } else if (method === "少到多") {
        sortedRecords.sort((a, b) => b.footprint - a.footprint);
    } else if (method === "多到少") {
        sortedRecords.sort((a, b) => a.footprint - b.footprint);
    }

    let startDate = dateArray[0];
    let endDate = dateArray[1];
    sortedRecords = sortedRecords.filter(record =>{
        let recordDate = new Date(record.time.split(' ')[0]); // 提取日期部分
        return recordDate >= new Date(startDate) && recordDate <= new Date(endDate);
    });
    showNewRecord(sortedRecords, selectedCategory);
}
// 監聽排序選項變化事件
$('#startDate, #endDate').on("change", sortRecordsBySelectedOption);

function showNewRecord(sortedRecords, selectedCategory) {
    $('#editRecord').css("display", "block");
    $('#saveEditRecord').css("display", "none");
    $('#deleteEditRecord').css("display", "none");

    let thisRecords = sortedRecords;
    let container = $('#listContent');
    container.empty();

    if(thisRecords.length == 0){
        let recordDiv = $("<div>")
            .css({
                'display': 'flex',
                'align-items': 'center',
                'background': 'rgba(235, 237, 239, 0.87)',
                'border-radius': '20px',
                'justify-content': 'center',
                'align-items': 'center',
                'height': '70px',
                'margin-bottom': '5px',
                'margin-top': '15px'
            })
            .text("沒有紀錄");
        container.append(recordDiv);
        if(selectedCategory == "全部"){
            $('#newestRecord').empty();
            $('#newestRecord').append(recordDiv.clone());
        }
    } else {
        let yearNmonth = "";
        let nowDiv;
        if(selectedCategory == "全部"){
            for (let i = thisRecords.length-1; i >= 0; i--) {
                let time = thisRecords[i].time.split(" ");
                // 時間標籤
                let timeTitle = time[0].split("-");
                let now = timeTitle[0] + "年" + timeTitle[1] + "月";
                if(now != yearNmonth){
                    yearNmonth = now;
                    let newTime = $("<div>")
                        .addClass("recordTime")
                        .text(now);
                    nowDiv = $("<div>");
                    container.append(newTime, nowDiv);
                }
                let icon = $('<svg>')
                    .html(svgData.svgImages.recordList[thisRecords[i].classType])
                    .attr('class', 'recordListSvg');

                // 創建新的checkbox
                let deleteBox = $('<div>')
                    .addClass('deleteBox')
                    .css({
                        'display': 'none'
                    });
                let checkbox = $('<input>', {
                    type: 'checkbox',
                    class: 'deleteCheckbox',
                    id: 'check_' + thisRecords[i].recordId
                });
                let label = $('<label>', {
                    for: 'check_' + thisRecords[i].recordId,
                    class: 'deleteButton'
                });
                label.html(deleteSvg);
                deleteBox.append(checkbox).append(label);

                // 每一筆紀錄的div
                let recordDiv = $("<div>")
                    .addClass('recordDiv')
                    .hover(
                        function() {
                            $(this).css('background-color', categories[thisRecords[i].classType].color);
                        },
                        function() {
                            $(this).css('background-color', 'rgba(235, 237, 239, 0.87)');
                        }
                    );

                // 紀錄項目及減碳量div
                let recordElement = $("<div>")
                    .css({
                        'width': '200px',
                    });
                let typeDiv = $("<div>")
                    .text(thisRecords[i].type)
                    .css({
                        'font-size': '18px',
                        'margin-left' : '5px'
                    });
                let footprintDiv = $("<div>")
                    .text(parseFloat(thisRecords[i].footprint).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','))
                    .css({
                        'color': '#28a745',
                        'font-size': '23px',
                        'margin-left': '5px',
                        'font-weight': 'bold'
                    });
                let co2 = $("<span>")
                    .text('gCO2e')
                    .css({
                        'color': '#28a745',
                        'font-size': '10px',
                        'margin-left': '5px',
                        'font-weight': 'bold'
                    });
                footprintDiv.append(co2);
                recordElement.append(typeDiv, footprintDiv);

                // 時間div
                let timeElement = $("<div>")
                    .css({
                        'text-align': 'right',
                        'align-self': 'flex-end',
                        'margin-left': '20px',
                        'margin-bottom': '5px',
                        'font-size': '12px'
                    });
                let dateSpan = $("<div>")
                    .text(time[0]);
                let timeSpan = $("<div>")
                    .text(time[1]);
                timeElement.append(dateSpan, timeSpan);

                recordDiv.append(deleteBox, icon, recordElement, timeElement);
                recordDiv.attr('id', 'record_' + thisRecords[i].recordId);
                nowDiv.append(recordDiv);

                (function(recordId) {
                    recordElement.on('click', function() {
                        recordClick(recordId);
                    });
                })(thisRecords[i].recordId);
            }
        } else {
            for (let i = thisRecords.length-1; i >= 0; i--) {
                let time = thisRecords[i].time.split(" ");
                // 時間標籤
                let timeTitle = time[0].split("-");
                let now = timeTitle[0] + "年" + timeTitle[1] + "月";
                if(now != yearNmonth){
                    yearNmonth = now;
                    let newTime = $("<div>")
                        .addClass("recordTime")
                        .text(now);
                    nowDiv = $("<div>");
                    container.append(newTime, nowDiv);
                }
                let icon = $('<svg>')
                    .html(svgData.svgImages.recordList[thisRecords[i].type])
                    .attr('class', 'recordListSvg');

                // 創建新的checkbox
                let deleteBox = $('<div>')
                    .addClass('deleteBox')
                    .css({
                        'display': 'none'
                    });
                let checkbox = $('<input>', {
                    type: 'checkbox',
                    class: 'deleteCheckbox',
                    id: 'check_' + thisRecords[i].recordId
                });
                let label = $('<label>', {
                    for: 'check_' + thisRecords[i].recordId,
                    class: 'deleteButton'
                });
                label.html(deleteSvg);
                deleteBox.append(checkbox).append(label);

                // 每一筆紀錄的div
                let recordDiv = $("<div>")
                    .addClass('recordDiv')
                    .hover(
                        function() {
                            $(this).css('background-color', categories[thisRecords[i].classType].color);
                        },
                        function() {
                            $(this).css('background-color', 'rgba(235, 237, 239, 0.87)');
                        }
                    );

                // 紀錄項目及減碳量div
                let recordElement = $("<div>")
                    .css({
                        'width': '200px',
                    });
                let typeDiv = $("<div>")
                    .text(thisRecords[i].type)
                    .css({
                        'font-size': '18px',
                        'margin-left' : '5px'
                    });
                let footprintDiv = $("<div>")
                    .text(parseFloat(thisRecords[i].footprint).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','))
                    .css({
                        'color': '#28a745',
                        'font-size': '23px',
                        'margin-left': '5px',
                        'font-weight': 'bold'
                    });
                let co2 = $("<span>")
                    .text('gCO2e')
                    .css({
                        'color': '#28a745',
                        'font-size': '10px',
                        'margin-left': '5px',
                        'font-weight': 'bold'
                    });
                footprintDiv.append(co2);
                recordElement.append(typeDiv, footprintDiv);

                // 時間div
                let timeElement = $("<div>")
                    .css({
                        'text-align': 'right',
                        'align-self': 'flex-end',
                        'margin-left': '20px',
                        'margin-bottom': '5px',
                        'font-size': '12px'
                    });
                let dateSpan = $("<div>")
                    .text(time[0]);
                let timeSpan = $("<div>")
                    .text(time[1]);
                timeElement.append(dateSpan, timeSpan);

                recordDiv.append(deleteBox, icon, recordElement, timeElement);
                recordDiv.attr('id', 'record_' + thisRecords[i].recordId);
                container.append(recordDiv);

                (function(recordId) {
                    recordElement.on('click', function() {
                        recordClick(recordId);
                    });
                })(thisRecords[i].recordId);
            }
        }
    }
}