// 顯示總減碳量
let dateArray=[];
let totalFP = 0;
function showTotalFP(){
    totalFP = 0;
    let thisRecords = records;
    let container = $('#totalFootprint');
    container.innerHTML = ""; // 清空容器內容

    if(thisRecords.length == 0){
        container.text("0g Co2E");
    } else {
        for (let i = 0; i < thisRecords.length; i++) {
            totalFP += parseFloat(thisRecords[i].footprint, 10);
        }
    }
    container.text("總減碳量: " + totalFP.toFixed(2) + "g Co2E");
    $('#deleteDataFP').text("共減去 " + totalFP.toFixed(2) + " g Co2E")
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
                }
                seriesData.push({
                    name: key,
                    value: value.footprint,
                    itemStyle: {
                        color: value.color
                    }
                });
                nowFP += value.footprint;
            }
        }
    } else {
        nowCategories[type].action.forEach(function(subcategory) {
            if(subcategory.totalFP != 0){
                if(typeof subcategory.totalFP !== "number"){
                    subcategory.totalFP = parseFloat(subcategory.totalFP).toFixed(2);
                }
                seriesData.push({
                    name: subcategory.type,
                    value: parseFloat(subcategory.totalFP).toFixed(2),
                    itemStyle: {
                        color: subcategory.color
                    }
                });
                nowFP += subcategory.totalFP;
            }
        });
    }

    nowFP = parseFloat(nowFP).toFixed(2);
    if(type === "全部" || type === "init") type = "總";
    let option = {
        grid: {
            bottom: 0,
            left: 'center'
        },
        title: {
            text: [
                type + '減碳量',
                nowFP + 'g',
                'Co2E'
            ].join('\n'),
            textStyle: {
                fontFamily: "'cwTeXYen', 'Mandali', sans-serif",
                textAlign: 'center',
                fontSize: 25,
                fontWeight: 'normal'
            },
            left: 'center',
            top: '40%'
        },
        tooltip: {
            formatter: '{b}: {c} gCo2E',
            trigger: 'item'
        },
        series: [
            {
                center:['50%', '53%'],
                name: '減碳量',
                type: 'pie',
                radius: ['55%', '75%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#F8F9FD',
                    borderWidth: 2,
                },
                label: {
                    formatter: '{b|{b}}\n{per|{d}%}',
                    backgroundColor: '#F8F9FD',
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
                    fontFamily: "'cwTeXYen', 'Mandali', sans-serif"
                },
                labelLine: {
                    length1: 5,
                    length2: 45
                },
                labelLayout: {
                    dy: -10,
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
                'text-align': 'center',
                'justify-content': 'center',
                'font-size': '20px'
            })
            .text("沒有紀錄");
        container.append(recordDiv);
    } else {
        for (let i = 0; i < thisRecords.length; i++) {
            let icon = $('<svg>')
                .html(svgData.svgImages.recordList[thisRecords[i].classType]);
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
            let recordElement= $("<p>")
                .css({
                    'display': 'inline-flex',
                    'align-items': 'center',
                    'margin': '0px'
                })
                .hover(
                    function() {
                        $(this).css('background-color', categories[thisRecords[i].classType].color);
                    },
                    function() {
                        $(this).css('background-color', '');
                    }
                );

            let timeSpan = $("<span>")
                .text(thisRecords[i].time);
            let typeSpan = $("<span>")
                .text(thisRecords[i].type)
                .css({
                    'font-size': '20px',
                    'margin-left' : '5px',
                    'margin-right' : '5px'
                });
            let footprintSpan = $("<span>")
                .text(" (" + parseFloat(thisRecords[i].footprint).toFixed(2) + "g Co2E)");

            recordElement.append(timeSpan, typeSpan, footprintSpan);
            recordDiv.append(checkbox, icon, recordElement);
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
    let startDate = dateArray[0];
    let endDate = dateArray[1];
    sortedRecords = sortedRecords.filter(record =>{
        let recordDate = new Date(record.time.split(' ')[0]); // 提取日期部分
        return recordDate >= new Date(startDate) && recordDate <= new Date(endDate);
    });
    showNewRecord(sortedRecords, selectedCategory);
}
// 監聽排序選項變化事件
$('#category, #sortType, #sortMethod, #startDate, #endDate').on("change", sortRecordsBySelectedOption);

function showNewRecord(sortedRecords, selectedCategory) {
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
                'text-align': 'center',
                'justify-content': 'center',
                'font-size': '20px'
            })
            .text("沒有紀錄");
        container.append(recordDiv);
    } else {
        for (let i = 0; i < thisRecords.length; i++) {
            let icon;
            let recordElement;
            if(selectedCategory != '全部'){
                icon = $('<svg>')
                    .html(svgData.svgImages.recordList[thisRecords[i].type]);
                let action = categories[thisRecords[i].classType].action;
                let actionColor;
                for(let k=0; k<action.length; k++){
                    if(action[k].type == thisRecords[i].type){
                        actionColor = action[k].color;
                        break;
                    }
                }
                recordElement= $("<p>")
                    .css({
                        'display': 'inline-flex',
                        'align-items': 'center',
                        'margin': '0px'
                    })
                    .hover(
                        function() {
                            $(this).css('background-color', actionColor);
                        },
                        function() {
                            $(this).css('background-color', '');
                        }
                    );
            } else {
                icon = $('<svg>')
                    .html(svgData.svgImages.recordList[thisRecords[i].classType]);
                recordElement= $("<p>")
                    .css({
                        'display': 'inline-flex',
                        'align-items': 'center',
                        'margin': '0px'
                    })
                    .hover(
                        function() {
                            $(this).css('background-color', categories[thisRecords[i].classType].color);
                        },
                        function() {
                            $(this).css('background-color', '');
                        }
                    );
            }
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

            let timeSpan = $("<span>")
                .text(thisRecords[i].time + " ");
            let typeSpan = $("<span>")
                .css({
                    'font-size': '20px',
                    'margin-left' : '5px',
                    'margin-right' : '5px'
                })
                .text(thisRecords[i].type + " ");
            let footprintSpan = $("<span>")
                .text(" (" + parseFloat(thisRecords[i].footprint).toFixed(2) + "g Co2E)");

            recordElement.append(timeSpan, typeSpan, footprintSpan);
            recordDiv.append(checkbox, icon, recordElement);
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