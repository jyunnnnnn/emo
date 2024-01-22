// 設定頁面顯示總減碳量(刪掉)
function showTotalFootprint(){
    var thisRecords = records;
    var container = document.getElementById("totalFootprint");
    container.innerHTML = ""; // 清空容器內容

    var totalFPDiv = document.createElement("div");
    totalFPDiv.style.display = "inline";
    var totalFP = 0;
    if(thisRecords.length == 0){
        totalFPDiv.textContent = "0g Co2E";
        container.appendChild(totalFPDiv);
    } else {
        for (var i = 0; i < thisRecords.length; i++) {
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
    var recordIndex = records.findIndex(record => record.recordId === recordId);
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
function showNewChart(nowRecords,type) {
    const chartBox = document.getElementById("chartBox");
    var data;
    var trafficTotal=0;
    var dailyTotal=0;
    var bus=0;
    var train=0;
    var mrt=0;
    var hsr=0;
    var cup=0;
    var bag=0;
    var tableware=0;
    for(var i=0;i<nowRecords.length;i++){
        if(nowRecords[i].type == "公車"){
            bus+=nowRecords[i].footprint;
        }else if(nowRecords[i].type == "火車"){
            train+=nowRecords[i].footprint;
        }else if(nowRecords[i].type == "捷運"){
            mrt+=nowRecords[i].footprint;
        }else if(nowRecords[i].type == "高鐵"){
            hsr+=nowRecords[i].footprint;
        }else if(nowRecords[i].type == "環保杯"){
            cup+=nowRecords[i].footprint;
        }else if(nowRecords[i].type == "環保袋"){
            bag+=nowRecords[i].footprint;
        }else if(nowRecords[i].type == "環保餐具"){
            tableware+=nowRecords[i].footprint;
        }
    }
    if(type =="全部" || type == "init"){
        dailyTotal=cup+bag+tableware;
        trafficTotal=train+mrt+bus+hsr;
        if(dailyTotal+trafficTotal==0){
            chartBox.style.display = "none";
            //這邊應該要讓列表出現沒有紀錄
            return;
        }
        data = {
            labels: ['交通', '生活用品'],
            datasets: [{
                label: '減碳量',
                data: [trafficTotal, dailyTotal],
            }]
        };
    }else if(type == "交通"){
        if(bus+train+mrt+hsr==0){
            chartBox.style.display = "none";
            var container = document.getElementById("listContent");
            container.innerHTML = ""; // 清空容器內容
            container.style.overflowY = "scroll";
            container.style.maxHeight = "150px";
            var recordDiv = document.createElement("div");
            recordDiv.style.display = "inline";
            recordDiv.style.textAlign = "center";
            recordDiv.textContent = "沒有紀錄";
            container.appendChild(recordDiv);

            return;
        }
        data = {
            labels: ['公車','火車','捷運','高鐵'],
            datasets: [{
                label: '減碳量',
                data: [bus,train,mrt,hsr],
            }]
        };
    }else if(type == "生活用品"){
        if(cup+bag+tableware==0){
            chartBox.style.display = "none";
            var container = document.getElementById("listContent");
            container.innerHTML = ""; // 清空容器內容
            container.style.overflowY = "scroll";
            container.style.maxHeight = "150px";
            var recordDiv = document.createElement("div");
            recordDiv.style.display = "inline";
            recordDiv.style.textAlign = "center";
            recordDiv.textContent = "沒有紀錄";
            container.appendChild(recordDiv);
            return;
        }
        data = {
            labels: ['環保杯','環保袋','環保餐具'],
            datasets: [{
                label: '減碳量',
                data: [cup,bag,tableware],
            }]
        };
    }
    const chartElement = document.getElementById("recordChart");
    // 判斷是否已經存在舊的圖
    if (myChart !== null) {
        myChart.destroy();
    }

    // 創建新的圖
    myChart = new Chart(chartElement, {
        type: 'pie',
        data: data,
    });

    chartBox.style.display = "block";
}
// 查看歷史紀錄
function showRecord() {
//列表顯示環保紀錄
    var thisRecords = records;
    var container = document.getElementById("listContent");
    container.innerHTML = ""; // 清空容器內容
    container.style.overflowY = "scroll";
    container.style.maxHeight = "150px";

    if(thisRecords.length == 0){
        var recordDiv = document.createElement("div");
        recordDiv.style.display = "inline";
        recordDiv.style.textAlign = "center";
        recordDiv.textContent = "沒有紀錄";

        container.appendChild(recordDiv);
    } else {
        for (var i = 0; i < thisRecords.length; i++) {
            // 創建新的checkbox
            var checkbox = document.createElement('label');
            checkbox.className = 'checkbox-container';
            var input = document.createElement('input');
            input.type = 'checkbox';
            input.className = 'custom-checkbox';
            var span = document.createElement('span');
            span.className = 'checkmark';
            span.id  = 'check_' + thisRecords[i].recordId;
            checkbox.appendChild(input);
            checkbox.appendChild(span);
            checkbox.style.marginRight = "3px";
            checkbox.style.display = "none";

            // 創建新的<div>元素
            var recordDiv = document.createElement("div");
            recordDiv.style.display = "flex";
            recordDiv.style.alignItems = "center";

            // 創建新的 <p> 元素
            var recordElement = document.createElement("p");
            var timeSpan = document.createElement("span");
            timeSpan.textContent = thisRecords[i].time + " ";
            var typeSpan = document.createElement("span");
            typeSpan.textContent = thisRecords[i].type + " ";
            var footprintSpan = document.createElement("span");
            footprintSpan.textContent = " (" + thisRecords[i].footprint + "g Co2E)";

            // 將 <span> 元素附加到 <p> 元素
            recordElement.appendChild(timeSpan);
            recordElement.appendChild(typeSpan);
            recordElement.appendChild(footprintSpan);

            recordDiv.appendChild(checkbox);
            recordDiv.appendChild(recordElement);
            container.appendChild(recordDiv);
            recordDiv.id  = 'record_' + thisRecords[i].recordId;
            (function(recordId) {
                recordElement.addEventListener('click', function() {
                    recordClick(recordId);
                });
            })(thisRecords[i].recordId);
        }

    }
    showNewChart(thisRecords,"init");
    var now = new Date();
    //console.log(now);
    var year = now.getFullYear();
    var month = (now.getMonth() + 1).toString().padStart(2, '0');
    var day = now.getDate().toString().padStart(2, '0');
    var formattedDate = `${year}-${month}-${day}`;
    records.sort((a, b) => new Date(a.time) - new Date(b.time));
    var datePart;
    if(records.length>0){
         datePart = records[0].time.slice(0, 10);
    }else{
        datePart=formattedDate;
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
    var selectedCategory = $("#category option:selected").text();
    var selectedType = $("#sortType option:selected").text();
    var sortedRecords = records;

    if (selectedCategory !== "全部") {
        sortedRecords = sortedRecords.filter(record => record.classType === selectedCategory);
    }

    if (selectedType === "時間") {
        $("#method").attr("label", "時間");
        $("#option1").val("old");
        $("#option1").text("遠到近");
        $("#option2").val("new");
        $("#option2").text("近到遠");
        var selectedMethod = $("#sortMethod option:selected").text();
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
        var selectedMethod = $("#sortMethod option:selected").text();
        if (selectedMethod === "多到少") {
            sortedRecords.sort((a, b) => b.footprint - a.footprint);
        } else if (selectedMethod === "少到多") {
            sortedRecords.sort((a, b) => a.footprint - b.footprint);
        }
    }
    var startDate=$('#startDate').val()
    var endDate=$('#endDate').val()
    sortedRecords=sortedRecords.filter(record =>{
        var recordDate = new Date(record.time.split(' ')[0]); // 提取日期部分
        return recordDate >= new Date(startDate) && recordDate <= new Date(endDate);
    });
    $('#startDate').attr('max', endDate);
    $('#endDate').attr('min', startDate);
    showNewRecord(sortedRecords);
}
// 監聽排序選項變化事件
document.getElementById("category").addEventListener("change", function (){

    sortRecordsBySelectedOption();
});
document.getElementById("sortType").addEventListener("change", sortRecordsBySelectedOption);
document.getElementById("sortMethod").addEventListener("change", sortRecordsBySelectedOption);
document.getElementById("startDate").addEventListener("change", sortRecordsBySelectedOption);
document.getElementById("endDate").addEventListener("change",sortRecordsBySelectedOption);
function showNewRecord(sortedRecords) {
    var thisRecords = sortedRecords;
    var container = document.getElementById("listContent");
    container.innerHTML = ""; // 清空容器內容
    container.style.overflowY = "scroll";
    container.style.maxHeight = "150px";
    var display = document.getElementById("saveEditRecord").style.display;

    if(thisRecords.length == 0){
        var recordDiv = document.createElement("div");
        recordDiv.style.display = "inline";
        recordDiv.style.textAlign = "center";
        recordDiv.textContent = "沒有紀錄";

        container.appendChild(recordDiv);
    } else {
        for (var i = 0; i < thisRecords.length; i++) {
            // 創建新的checkbox
            var checkbox = document.createElement('label');
            checkbox.className = 'checkbox-container';
            var input = document.createElement('input');
            input.type = 'checkbox';
            input.className = 'custom-checkbox';
            var span = document.createElement('span');
            span.className = 'checkmark';
            span.id  = 'check_' + thisRecords[i].recordId;
            checkbox.appendChild(input);
            checkbox.appendChild(span);
            checkbox.style.marginRight = "3px";
            checkbox.style.display = display;

            // 創建新的<div>元素
            var recordDiv = document.createElement("div");
            recordDiv.style.display = "flex";
            recordDiv.style.alignItems = "center";

            // 創建新的 <p> 元素
            var recordElement = document.createElement("p");
            var timeSpan = document.createElement("span");
            timeSpan.textContent = thisRecords[i].time + " ";
            var typeSpan = document.createElement("span");
            typeSpan.textContent = thisRecords[i].type + " ";
            var footprintSpan = document.createElement("span");
            footprintSpan.textContent = " (" + thisRecords[i].footprint + "g Co2E)";

            // 將 <span> 元素附加到 <p> 元素
            recordElement.appendChild(timeSpan);
            recordElement.appendChild(typeSpan);
            recordElement.appendChild(footprintSpan);

            recordDiv.appendChild(checkbox);
            recordDiv.appendChild(recordElement);
            container.appendChild(recordDiv);
            recordDiv.id  = 'record_' + thisRecords[i].recordId;
            (function(recordId) {
                recordElement.addEventListener('click', function() {
                    recordClick(recordId);
                });
            })(thisRecords[i].recordId);
        }
        showNewChart(thisRecords,$("#category option:selected").text());
    }
}