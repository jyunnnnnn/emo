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
    container.html("總減碳量：<strong>" + totalFP.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + "</strong> gCo2E");
    $('#deleteDataFP').text("共減去 " + totalFP.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + " gCo2E")
}
// 點擊換樹單位
$('#totalFootprint').click(function() {
    // 獲取當前 #totalFootprint 內容
    let currentContent = $('#totalFootprint').html();
    let tree =`<svg width="15px" height="15px" viewBox="0 0 1024 1024" class="icon"  version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M807.057402 313.232628v-2.320241c14.694864-85.075529-26.296073-172.471299-163.190333-151.589124-9.280967 1.546828-14.694864-62.646526-82.755287-76.567976-28.616314-5.413897-85.075529-6.187311-116.012084-0.773414-40.990937 6.960725-78.888218 40.217523-99.770393 89.716012H324.44713c-76.567976-4.640483-123.746224 63.41994-112.145015 134.574018 1.546828 6.960725 0.773414 13.92145 1.546828 20.882176-30.936556 20.882175-59.55287 68.060423-59.55287 114.465256 0 68.060423 53.365559 116.785498 109.824773 116.785499h0.773414c-6.960725 70.380665 56.459215 95.903323 107.504532 95.903323H471.39577c13.92145 0 27.069486-3.093656 39.444109-8.507553 13.92145 6.960725 28.616314 11.601208 44.858006 11.601209h99.770393c51.045317 0 94.356495-41.76435 107.504532-98.996979 0 0 106.731118 60.326284 133.02719-114.465257 12.374622-74.247734-38.670695-122.97281-88.942598-130.706949z" fill="#1ca538" /><path d="M714.247734 487.250755c-3.867069 50.271903-33.256798 52.592145-45.63142 51.045318 3.867069-5.413897 7.734139-11.601208 10.827795-18.561934 20.882175-40.990937 0-88.169184 6.187311-90.489426 29.389728-14.694864 12.374622-60.326284 12.374622-60.326284l-6.960725 1.546828c9.280967 23.975831 1.546828 40.990937-13.148036 48.725075-37.123867 18.561934-54.138973-20.108761-54.138973-20.108761l-3.093655 8.507553c13.92145 31.70997 53.365559 31.70997 53.365558 31.70997l0.773414 31.709969c-27.8429 37.897281-40.217523 0-40.217522 0l-1.546828 10.054381c23.202417 39.444109 39.444109 4.640483 39.444109 4.640483-1.546828 29.389728-17.78852 47.178248-35.57704 58.006043-34.803625 21.655589-71.154079 16.241692-71.154078 16.241692 19.335347-13.92145 26.296073-29.389728 23.202417-51.045318-3.093656-22.429003-13.148036-20.108761-32.483384-34.030211-12.374622-8.507553-19.335347-20.108761-21.655589-41.764351-3.093656-21.655589 27.8429-37.123867 27.8429-37.123867l-3.867069-6.960725c-55.685801 20.882175-27.069486 74.247734-27.069487 74.247734-19.335347 0.773414-21.655589 0.773414-32.483383-27.069486-10.827795-27.8429-37.123867-10.827795-37.123867-10.827794l1.546827 5.413897c20.108761-13.92145 28.616314 16.241692 28.616315 16.241692 5.413897 35.577039 37.897281 33.256798 37.897281 33.256797 57.232628 12.374622 18.561934 97.450151-28.616315 85.075529-72.700906-19.335347-61.099698-36.350453-61.099697-36.350453 43.311178-23.975831 11.601208-61.873112 11.601208-61.873112l-6.960725 5.413897c23.202417 9.280967 0 55.685801-23.975831 42.537765-26.296073-14.694864-3.867069-41.76435-3.867069-41.764351l-7.734139 1.546828c-23.202417 37.897281 18.561934 54.138973 18.561933 54.138973 1.546828 14.694864 7.734139 24.749245 14.694864 31.70997-37.897281-2.320242-118.332326-17.015106-93.583081-101.317221 0 0 71.154079 4.640483 75.021148-61.099698l-10.054381-3.867069s-5.413897 54.912387-66.513595 51.818731c0 0-46.404834-10.827795-20.108762-62.646526l-8.507552-1.546828s-32.483384 47.178248 16.241691 75.794562c0 0-13.148036 37.123867 1.546828 70.380665-19.335347 9.280967-33.256798-16.241692-33.256797-16.241692l-1.546828 15.468278c17.015106 20.108761 32.483384 14.694864 39.444109 10.827795 15.468278 24.749245 50.271903 45.63142 122.199395 44.084592l-0.773413 398.308157h122.972809l-15.468278-398.308157c37.123867-5.413897 67.287009-7.734139 91.26284-36.350454 55.685801 13.148036 60.326284-58.779456 60.326284-58.779456h-7.734139z" fill="#65320b" /></svg>`

    // 更改內容
    if (currentContent.indexOf("總減碳量") !== -1) {
        $(this).html("相當於 <strong>"+(totalFP/500).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')+"</strong> 棵"+tree+"一個月減碳量");
    } else {
        $(this).html("總減碳量：<strong>" + totalFP.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + "</strong> gCo2E");
    }
});
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
            // 從紀錄列表點開也要呈現路線
            if (currentInfoWindowRecord.type=="捷運" || currentInfoWindowRecord.type=="高鐵"){
                directionsDraw(currentInfoWindowRecord.lineOnMap);
            }
            else if(currentInfoWindowRecord.classType=="交通"){
                drawLine(currentInfoWindowRecord);
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

    nowFP = parseFloat(nowFP).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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
                fontSize: 23,
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
    if (currentMarker.infoWindow) {
        currentMarker.infoWindow.close();
    }
    if(currentInfoWindowRecord.classType=="交通"){
        clearMapLines();
        removeDirections();
    }
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
                .text(" (" + parseFloat(thisRecords[i].footprint).toFixed(2) + " gCo2E)");

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
                .text(" (" + parseFloat(thisRecords[i].footprint).toFixed(2) + " gCo2E)");

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