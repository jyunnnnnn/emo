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

    // 設定量級 0-1,000 灰 1,000-10,000 銅 10,000-100,000銀 100,000上 金
    if(totalFP < 1000){ // 灰
        $('#totalFootprint').css('background', 'darkgray');
        container.html("總減碳量：<strong>" + totalFP.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + "</strong> gCO2e");
        $('#deleteDataFP').text("共減去 " + totalFP.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + " gCO2e");
        $('#recordFP').text(totalFP.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + " gCO2e");
    }else if(totalFP < 10000){ // 銅
        $('#totalFootprint').css('background', 'linear-gradient(to bottom right, rgb(184, 115, 51) 0%, rgb(218, 165, 32) 100%)');
        container.html("總減碳量：<strong>" + totalFP.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + "</strong> gCO2e");
        $('#deleteDataFP').text("共減去 " + totalFP.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + " gCO2e");
        $('#recordFP').text(totalFP.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + " gCO2e");
    }else if(totalFP < 100000){ // 銀
        $('#totalFootprint').css('background', 'linear-gradient(to bottom right, rgb(104, 107, 108) 0%, rgb(183, 188, 189) 100%)');
        container.html("總減碳量：<strong>" + (totalFP/1000.0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + "</strong> kgCO2e");
        $('#deleteDataFP').text("共減去 " + (totalFP/1000.0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + " kgCO2e");
        $('#recordFP').text((totalFP/1000.0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + " kgCO2e");
    }else { // 金
        $('#totalFootprint').css('background', 'linear-gradient(to bottom right, rgb(255, 215, 0) 0%, rgb(255, 165, 0) 100%)');
        // 換科學記號 不然上面數字會撞EMO
        if ((totalFP / 1000.0) > 1000000) {
            let exponent = Math.floor(Math.log10(Math.abs((totalFP / 1000.0)))); // Get exponent
            let mantissa = (totalFP / 1000.0) / Math.pow(10, exponent); // Get mantissa
            let notation = mantissa.toFixed(2) + "E" + exponent; // Format in scientific notation with 2 decimal places
            container.html("總減碳量：<strong>" + notation + "</strong> kgCO2e");
            $('#deleteDataFP').text("共減去 " + notation + " kgCO2e");
            $('#recordFP').text(notation + " kgCO2e");
        } else {
            container.html("總減碳量：<strong>" + (totalFP / 1000.0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + "</strong> kgCO2e");
            $('#deleteDataFP').text("共減去 " + (totalFP / 1000.0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + " kgCO2e");
            $('#recordFP').text((totalFP / 1000.0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + " kgCO2e");
        }
    }
}
// 點擊換樹單位
// $('#totalFootprint').click(function() {
//     // 獲取當前 #totalFootprint 內容
//     let currentContent = $('#totalFootprint').html();
//     let tree =`<svg width="15px" height="15px" viewBox="0 0 1024 1024" class="icon"  version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M807.057402 313.232628v-2.320241c14.694864-85.075529-26.296073-172.471299-163.190333-151.589124-9.280967 1.546828-14.694864-62.646526-82.755287-76.567976-28.616314-5.413897-85.075529-6.187311-116.012084-0.773414-40.990937 6.960725-78.888218 40.217523-99.770393 89.716012H324.44713c-76.567976-4.640483-123.746224 63.41994-112.145015 134.574018 1.546828 6.960725 0.773414 13.92145 1.546828 20.882176-30.936556 20.882175-59.55287 68.060423-59.55287 114.465256 0 68.060423 53.365559 116.785498 109.824773 116.785499h0.773414c-6.960725 70.380665 56.459215 95.903323 107.504532 95.903323H471.39577c13.92145 0 27.069486-3.093656 39.444109-8.507553 13.92145 6.960725 28.616314 11.601208 44.858006 11.601209h99.770393c51.045317 0 94.356495-41.76435 107.504532-98.996979 0 0 106.731118 60.326284 133.02719-114.465257 12.374622-74.247734-38.670695-122.97281-88.942598-130.706949z" fill="#1ca538" /><path d="M714.247734 487.250755c-3.867069 50.271903-33.256798 52.592145-45.63142 51.045318 3.867069-5.413897 7.734139-11.601208 10.827795-18.561934 20.882175-40.990937 0-88.169184 6.187311-90.489426 29.389728-14.694864 12.374622-60.326284 12.374622-60.326284l-6.960725 1.546828c9.280967 23.975831 1.546828 40.990937-13.148036 48.725075-37.123867 18.561934-54.138973-20.108761-54.138973-20.108761l-3.093655 8.507553c13.92145 31.70997 53.365559 31.70997 53.365558 31.70997l0.773414 31.709969c-27.8429 37.897281-40.217523 0-40.217522 0l-1.546828 10.054381c23.202417 39.444109 39.444109 4.640483 39.444109 4.640483-1.546828 29.389728-17.78852 47.178248-35.57704 58.006043-34.803625 21.655589-71.154079 16.241692-71.154078 16.241692 19.335347-13.92145 26.296073-29.389728 23.202417-51.045318-3.093656-22.429003-13.148036-20.108761-32.483384-34.030211-12.374622-8.507553-19.335347-20.108761-21.655589-41.764351-3.093656-21.655589 27.8429-37.123867 27.8429-37.123867l-3.867069-6.960725c-55.685801 20.882175-27.069486 74.247734-27.069487 74.247734-19.335347 0.773414-21.655589 0.773414-32.483383-27.069486-10.827795-27.8429-37.123867-10.827795-37.123867-10.827794l1.546827 5.413897c20.108761-13.92145 28.616314 16.241692 28.616315 16.241692 5.413897 35.577039 37.897281 33.256798 37.897281 33.256797 57.232628 12.374622 18.561934 97.450151-28.616315 85.075529-72.700906-19.335347-61.099698-36.350453-61.099697-36.350453 43.311178-23.975831 11.601208-61.873112 11.601208-61.873112l-6.960725 5.413897c23.202417 9.280967 0 55.685801-23.975831 42.537765-26.296073-14.694864-3.867069-41.76435-3.867069-41.764351l-7.734139 1.546828c-23.202417 37.897281 18.561934 54.138973 18.561933 54.138973 1.546828 14.694864 7.734139 24.749245 14.694864 31.70997-37.897281-2.320242-118.332326-17.015106-93.583081-101.317221 0 0 71.154079 4.640483 75.021148-61.099698l-10.054381-3.867069s-5.413897 54.912387-66.513595 51.818731c0 0-46.404834-10.827795-20.108762-62.646526l-8.507552-1.546828s-32.483384 47.178248 16.241691 75.794562c0 0-13.148036 37.123867 1.546828 70.380665-19.335347 9.280967-33.256798-16.241692-33.256797-16.241692l-1.546828 15.468278c17.015106 20.108761 32.483384 14.694864 39.444109 10.827795 15.468278 24.749245 50.271903 45.63142 122.199395 44.084592l-0.773413 398.308157h122.972809l-15.468278-398.308157c37.123867-5.413897 67.287009-7.734139 91.26284-36.350454 55.685801 13.148036 60.326284-58.779456 60.326284-58.779456h-7.734139z" fill="#65320b" /></svg>`
//
//     // 更改內容
//     if (currentContent.indexOf("總減碳量") !== -1) {
//         if(totalFP>100000){
//             $(this).html("相當於 <strong>" + (totalFP / 6000).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + "</strong> 棵" + tree + "一年吸收碳量");
//         }else {
//             $(this).html("相當於 <strong>" + (totalFP / 500).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + "</strong> 棵" + tree + "一個月吸收碳量");
//         }
//     } else {
//         // 設定量級 0-1,000 灰 1,000-10,000 銅 10,000-100,000銀 100,000上 金
//         if(totalFP < 1000){ // 灰
//             $('#totalFootprint').css('background', 'darkgray');
//             $(this).html("總減碳量：<strong>" + totalFP.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + "</strong> gCO2e");
//         }else if(totalFP < 10000){ // 銅
//             $('#totalFootprint').css('background', 'linear-gradient(to bottom right, rgb(184, 115, 51) 0%, rgb(218, 165, 32) 100%)');
//             $(this).html("總減碳量：<strong>" + totalFP.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + "</strong> gCO2e");
//         }else if(totalFP < 100000){ // 銀
//             $('#totalFootprint').css('background', 'linear-gradient(to bottom right, rgb(104, 107, 108) 0%, rgb(183, 188, 189) 100%)');
//             $(this).html("總減碳量：<strong>" + (totalFP/1000.0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + "</strong> kgCO2e");
//         }else{ // 金
//             $('#totalFootprint').css('background', 'linear-gradient(to bottom right, rgb(255, 215, 0) 0%, rgb(255, 165, 0) 100%)');
//             $(this).html("總減碳量：<strong>" + (totalFP/1000.0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + "</strong> kgCO2e");
//         }
//     }
// });
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
            removeDirections();
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
        console.log("遠到近")
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