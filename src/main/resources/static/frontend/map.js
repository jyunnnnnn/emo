var map;
var infoWindow;
var intervalId;
var FootprintData = [];
var recordedPositions = [];//路線紀錄
var records = [];//進入系統時把該用戶的環保紀錄存進去
var isRecording = false;//false=>開始  true=>結束
var username;//使用者名稱
var User;
//小作弊
var currentInfoWindowRecord; // 目前 infoWindow 的內容
var currentInfoWindow;//目前infowindow
var currentMarker;//目前Marker
$(document).ready(function() {
    User = JSON.parse(JSON.parse(localStorage.getItem('EmoAppUser')));
    username =User.username;
    $('#user').text(username);
    loadEcoRecords(User.userId);//載入環保紀錄
    loadFootprintData();//載入碳足跡計算
    $('#logoutAccount').click(logoutAccount);//登出
    $('#deleteAccount').click(deleteAccount);//刪除帳號
    $('#saveRecord').click(function(event) {// 添加標記
        saveRecord(event);
    });
    $('#updateRecord').click(updateRecord)//修改紀錄
    $('#deleteRecord').click(deleteRecord)//刪除紀錄
    $('#recordListButton').click(showRecord);//查看環保紀錄
    $('#startRecording').click(function () {
        if (!isRecording) {
            startRecording(); //false
        } else {
            stopRecording(); //true
        }
    });// 路線紀錄(開始/停止)
});
//登出
function logoutAccount(){
    alert("登出成功");
    localStorage.removeItem('EmoAppUser');
    window.location.href= '/login';
}

//刪除Emo_User
function deleteAccountToBackend(userId){
    $.ajax({
        type: 'DELETE',
        url: `/api/deleteUserAccount?userId=${userId}`,
        contentType: 'application/string',
        success: function(response) {
            console.log("已刪除該用戶")
            console.log(response); // 成功刪除時的處理邏輯
        },
        error: function(xhr, status, error) {
            console.error(error); // 刪除失敗時的處理邏輯
        }
    });
    alert("帳號刪除成功");
    localStorage.removeItem('EmoAppUser');
    window.location.href= 'frontend/login.html';
}
//刪除Emo_Record裡面指定用戶的紀錄
function deleteRecordByAccount(userId){
     $.ajax({
            type: 'DELETE',
            url: `/api/deleteSpecificUserRecord?userId=${userId}`,
            contentType: 'application/string',
            success: function(response) {
                console.log("已删除該用戶紀錄");
                console.log(response); // 成功刪除時的處理邏輯
            },
            error: function(xhr, status, error) {
                console.error(error); // 刪除失敗時的處理邏輯
            }
        });
}
//載入碳足跡計算係數
function loadFootprintData() {
    $.ajax({
            url: '/api/getFootprint',
            method: 'GET',
            success: function (data) {
                // 處理成功時的邏輯
                FootprintData = data;
                //console.log(FootprintData);

            },
            error: function(xhr, status, error) {
               var errorData = JSON.parse(xhr.responseText);
               var errorMessage = errorData.message;
               alert(errorMessage);
           }
        });
}
//透過type找到coefficient
function findCoefficientByType(type) {
    var result = FootprintData.find(function(item) {
        return item.type === type;
    });
    // 如果找到對應的 type，返回 coefficient，否則返回 null 或其他預設值
    return result ? result.coefficient : null;
}
//計算footprint
function calculateFootprint(type,data_value) {
    var footprint = 0;
    var coefficient = findCoefficientByType(type);
    footprint=data_value * coefficient;
    return footprint;
}
//判斷輸入的data_value是否合法
function isDataValueValid(data_value) {
    if (!isNaN(data_value) && parseInt(data_value, 10) % 1 === 0 && parseInt(data_value, 10) >= 1) {
        return true;
    } else {
        return false;
    }
}
// 記錄按鈕事件處理
function saveRecord(event){
    event.preventDefault();
    var latitude;
    var longitude;
    var classType;
    var type;
    var data_value;
    var footprint;
    var recordId;
    if ("geolocation" in navigator) {
        // 當前位置
        navigator.geolocation.getCurrentPosition(function(position) {
//            latitude = position.coords.latitude;
//            longitude = position.coords.longitude;     抓取真實位置
            latitude = map.getCenter().lat();
            longitude = map.getCenter().lng();
//            抓取中心位置 這是備案
            if ($("#trafficRadio").is(":checked")) {
                classType = $("#traffic").text();
                type = $("#trafficMenu option:selected").text();
                data_value = document.getElementById('kilometer').value;
            } else if ($("#dailyRadio").is(":checked")) {
                classType = $("#daily").text();
                type = $("#dailyMenu option:selected").text();
                data_value = document.getElementById('count').value;
            }
            footprint = calculateFootprint(type,data_value);
            // 保存紀錄到後端
            if(classType && type && data_value && latitude && longitude && footprint && Number.isInteger(parseInt(data_value,10)) && parseInt(data_value,10) > 0) {
                var now = new Date();
                recordId=now.getTime();
                var formattedDate = now.toISOString().slice(0, 19).replace("T", " ");
                saveRecordToBackend(User.userId,classType, type, data_value, latitude, longitude,footprint ,formattedDate,recordId);
            }
        });
    } else {
        alert("不支援定位");
    }
}
// 保存紀錄的函數
function saveRecordToBackend(userId,classType, type, data_value, latitude, longitude,footprint,formattedDate,recordId) {
    var record = {
        userId: userId, // 使用者 ID，這裡使用本地存儲的使用者名稱
        classType: classType,
        type: type,
        data_value: data_value,
        latitude: latitude,
        longitude: longitude,
        footprint:footprint,
        time: formattedDate,
        recordId:recordId
    };
    //console.log(record);
    if(record.userId) {
        uploadRecordToBackend(record);
        records.push(record);
        addMarker(record);
        clearForm();
    }
    else {
        alert("請重新登入");
        window.location.href = '/login';
    }
    // 上傳紀錄到後端
}
function clearForm(){
    $('input[type="radio"]:checked').each(function() {
        $(this).prop('checked', false);
    });
    document.getElementById('kilometer').value = 'none';
    document.getElementById('trafficMenu').style.display = 'none';
    document.getElementById('dailyMenu').style.display = 'none';
    document.getElementById('SPACE').style.display = 'block';
}
// 將紀錄上傳到後端
function uploadRecordToBackend(record) {
    $.ajax({
        type: 'POST',
        url: '/api/addRecord',
        contentType: 'application/json',
        data: JSON.stringify(record),
        success: function(response) {
            console.log(response); // 成功上傳時的處理邏輯
        },
        error: function(xhr, status, error) {
            console.error(error); // 上傳失敗時的處理邏輯
        }
    });
}
//一開始把所有資料拉下來做成標籤 每次新增也要做出新標籤
function loadEcoRecords(userId) {
    $.ajax({
        url: '/api/getSpecificUserRecord?userId=' + userId,
        method: 'GET',
        success: function (data) {
            // 處理成功時的邏輯
            records = data;
            var thisRecords = records;
            //console.log(records);
             for (var i = 0; i < thisRecords.length; i++) {
                    addMarker(thisRecords[i]);
             }
        },
        error: function(xhr, status, error) {
           var errorData = JSON.parse(xhr.responseText);
           var errorMessage = errorData.message;
           alert(errorMessage);
       }
    });

}
//新增標記
function addMarker(recordToAdd) {
        //console.log(recordToAdd);
        if (map) {
            var currentLocation = {
                lat: recordToAdd.latitude,
                lng: recordToAdd.longitude
            }//抓現在位置
            var marker = new google.maps.Marker({
                position: currentLocation,
                map: map,
                title: recordToAdd.type
            });
           //小改
           let infoWindowContent = `
               <div>
                   <h6 style="padding:3px; margin:3px;">${recordToAdd.type}</h6>
                   <p style="padding:3px; margin:3px;">減少的碳足跡為:${recordToAdd.footprint}gCO2E</p>
                   <p style="padding:3px; margin:3px;">${recordToAdd.time}</p>
                   <button id="editButton" type="button" style="position: absolute; right: 5px; bottom: 5px; background-color: #6c757d; color: #fff; padding: 5px; border: none; cursor: pointer;" onclick="recordModal()">編輯</button>
               </div>`;
               //class="btn btn-secondary"
           let infoWindow = new google.maps.InfoWindow({
                content: infoWindowContent
           });
            // 監聽 marker click 事件
           marker.addListener('click', e => {
                infoWindow.open(this.map, marker);
                currentInfoWindowRecord=recordToAdd;
                currentInfoWindow=infoWindow;
                currentMarker=marker;
           });
        }
}

//修改懸浮視窗是歷史紀錄
function recordModal(){
    // console.log("編輯按鈕可以按");
    // 顯示懸浮窗
        document.getElementById('modifyFW').style.display = 'flex';
        document.getElementById('modifyFW').style.position = 'fixed';

        if(currentInfoWindowRecord.classType == "交通"){
            console.log(currentInfoWindowRecord.classType);
            document.getElementById('modifyTrafficRadio').checked = true;
            document.getElementById('modifyTrafficMenu').style.display = 'block';
            document.getElementById('modifyDailyMenu').style.display = 'none';
            document.getElementById('modifySPACE').style.display = 'none';

            if(currentInfoWindowRecord.type == "公車"){
                document.getElementById('modifyTrafficType').value = 'traffic-bus';
            }else if(currentInfoWindowRecord.type == "捷運"){
                document.getElementById('modifyTrafficType').value = 'traffic-MRT';
            }else if(currentInfoWindowRecord.type == "火車"){
                document.getElementById('modifyTrafficType').value = 'traffic-train';
            }else{
                document.getElementById('modifyTrafficType').value = 'traffic-HSR';
            }

            document.getElementById('modifyKilometer').value = currentInfoWindowRecord.data_value;
        }else{
            //console.log(currentInfoWindowRecord.classType);
            document.getElementById('modifyDailyRadio').checked = true;
            document.getElementById('modifyTrafficMenu').style.display = 'none';
            document.getElementById('modifyDailyMenu').style.display = 'block';
            document.getElementById('modifySPACE').style.display = 'none';

            if(currentInfoWindowRecord.type == "環保杯"){
                document.getElementById('modifyDailyType').value = 'daily-cup';
            }else if(currentInfoWindowRecord.type == "環保餐具"){
                document.getElementById('modifyDailyType').value = 'daily-tableware';
            }else{
                document.getElementById('modifyDailyType').value = 'daily-bag';
            }
            document.getElementById('modifyCount').value = currentInfoWindowRecord.data_value;
        }
}
// 修改記錄按鈕事件處理 //test
function updateRecord(){
    event.preventDefault();
    if ($("#modifyTrafficRadio").is(":checked")) {
        var classType = $("#modifyTraffic").text();
        var type = $("#modifyTrafficMenu option:selected").text();
        var data_value = document.getElementById('modifyKilometer').value;
    } else if ($("#modifyDailyRadio").is(":checked")) {
        var classType = $("#modifyDaily").text();
        var type = $("#modifyDailyMenu option:selected").text();
        var data_value = document.getElementById('modifyCount').value;
    }

    // 更新紀錄到後端
    if(classType!=null &&type!=null &&data_value!=null){
        updateRecordToBackend(classType, type, data_value);
    }
}
// 更新紀錄的函數
function updateRecordToBackend(newClassType, newType, newDataValue) {
    var footprint = calculateFootprint(newType,newDataValue);
    var record = {
        userId: currentInfoWindowRecord.userId, // 使用者 ID
        classType: newClassType,
        type: newType,
        data_value: newDataValue,
        latitude: currentInfoWindowRecord.latitude,
        longitude: currentInfoWindowRecord.longitude,
        footprint:footprint,
        time: currentInfoWindowRecord.time,
        recordId:currentInfoWindowRecord.recordId
    };
    if(record.userId) {
        modifyRecordToBackend(record);
        updateRecordInArray(newClassType, newType, newDataValue,footprint);//更新record[]
        updateMarkerContent(record);
        document.getElementById('modifyFW').style.display = 'none';
    }
    else {
        alert("請重新登入");
        window.location.href = 'frontend/login.html';
    }
    // 上傳紀錄到後端
}
// 將紀錄更新到後端
function modifyRecordToBackend(record) {
    //console.log("有改到")
    console.log(record)
    $.ajax({
        type: 'PUT',
        url: '/api/updateRecord',
        contentType: 'application/json',
        data: JSON.stringify(record),
        success: function(response) {
            console.log(response); // 成功更新時的處理邏輯
        },
        error: function(xhr, status, error) {
            console.error(error); // 更新失敗時的處理邏輯
        }
    });
}
//更新marker inFoWindow

function updateMarkerContent(newContent) {
    let modifyContent=`
         <div>
             <h6 style="padding:3px; margin:3px;">${newContent.type}</h6>
             <p style="padding:3px; margin:3px;">減少的碳足跡為:${newContent.footprint}gCO2E</p>
             <p style="padding:3px; margin:3px;">${newContent.time}</p>
             <button id="editButton" type="button" style="position: absolute; right: 5px; bottom: 5px; background-color: #6c757d; color: #fff; padding: 5px; border: none; cursor: pointer;" onclick="recordModal()">編輯</button>
         </div>`;
         //class="btn btn-secondary"
    if (currentInfoWindow) {
        //console.log("更新infowindow成功");
        currentInfoWindow.setContent(modifyContent);
    }else {
        console.error('InfoWindow not available.');
    }
}
//更新record[]
function updateRecordInArray(newClassType, newType, newDataValue,newFootprint){
    var recordIndex = records.findIndex(record => record.recordId === currentInfoWindowRecord.recordId);
    if (recordIndex !== -1) {
        // 有紀錄，更新
        records[recordIndex].classType = newClassType;
        records[recordIndex].type = newType;
        records[recordIndex].data_value = newDataValue;
        records[recordIndex].footprint =newFootprint;
        console.log('Updated records:', records);
    } else {
        console.log('Record not found');
    }
}

//刪除資料
function deleteRecord(){
    event.preventDefault();
    //我先用confirm做:0
    var result = confirm("確定要刪除目前資料嗎？");
    if (result) {
        deleteRecordInArray(currentInfoWindowRecord.recordId);//更新record[]
        deleteRecordToBackend(currentInfoWindowRecord.recordId);
        deleteMarker();
        console.log("刪資料");
    } else {
        console.log("沒刪");
    }
}

//從records刪資料
function deleteRecordInArray(recordId){
    records = records.filter(item => item.recordId !== recordId);

}

//從後端刪資料
function deleteRecordToBackend(recordId) {
    console.log(records);
    $.ajax({
        type: 'DELETE',
        url: `/api/deleteOneRecord?recordId=${recordId}`,
        contentType: 'application/string',
        success: function(response) {
            console.log("已刪除")
            console.log(response); // 成功刪除時的處理邏輯
        },
        error: function(xhr, status, error) {
            console.error(error); // 刪除失敗時的處理邏輯
        }
    });
}

//刪mark
function deleteMarker(){
    currentInfoWindow.close();
    currentMarker.setMap(null);
}
//點擊列表中的record
function recordClick(recordId){
    var recordIndex = records.findIndex(record => record.recordId === recordId);
    nowRecord=records[recordIndex];
    console.log(nowRecord);
}

// 查看歷史紀錄
function showRecord() {
//列表顯示環保紀錄
    var thisRecords = records;
    var container = document.getElementById("listContent");
    container.innerHTML = ""; // 清空容器內容
    container.style.overflowY = "scroll";
    container.style.maxHeight = "300px";

    for (var i = 0; i < thisRecords.length; i++) {
        // 創建新的<div>元素
        var recordDiv = document.createElement("div");
        recordDiv.style.display = "inline";
        recordDiv.style.textAlign = "left";

        // 創建新的 <p> 元素
        var recordElement = document.createElement("p");
        var timeSpan = document.createElement("span");
        timeSpan.textContent = thisRecords[i].time + " ";
        var typeSpan = document.createElement("span");
        typeSpan.textContent = thisRecords[i].type + " ";
        var footprintSpan = document.createElement("span");
        footprintSpan.textContent = "減少的碳排放: " + thisRecords[i].footprint + "gCo2E";

        // 將 <span> 元素附加到 <p> 元素
        recordElement.appendChild(timeSpan);
        recordElement.appendChild(typeSpan);
        recordElement.appendChild(footprintSpan);

        recordDiv.appendChild(recordElement);
        container.appendChild(recordDiv);
        recordDiv.id  = 'record_' + thisRecords[i].recordId;
        (function(recordId) {
                recordDiv.addEventListener('click', function() {
                    recordClick(recordId);
                });
            })(thisRecords[i].recordId);
    }
}
// 排序歷史紀錄
function sortRecordsBySelectedOption() {
    var selectedCategory = $("#category option:selected").text();
    var selectedTime = $("#time option:selected").text();

    var sortedRecords = records;

    if (selectedCategory !== "全部") {
        sortedRecords = sortedRecords.filter(record => record.classType === selectedCategory);
    }

    if (selectedTime === "近到遠") {
        sortedRecords.sort((a, b) => new Date(a.time) - new Date(b.time));
    } else if (selectedTime === "遠到近") {
        sortedRecords.sort((a, b) => new Date(b.time) - new Date(a.time));
    }

    showNewRecord(sortedRecords);
}
// 監聽排序選項變化事件
document.getElementById("category").addEventListener("change", sortRecordsBySelectedOption);
document.getElementById("time").addEventListener("change", sortRecordsBySelectedOption);
function showNewRecord(records) {
    var thisRecords = records;
    var container = document.getElementById("listContent");
    container.innerHTML = ""; // 清空容器內容
    container.style.overflowY = "scroll";
    container.style.maxHeight = "300px";

    for (var i = 0; i < thisRecords.length; i++) {
        // 創建新的<div>元素
        var recordDiv = document.createElement("div");
        recordDiv.style.display = "inline";
        recordDiv.style.textAlign = "left";
        // 創建新的 <p> 元素
        var recordElement = document.createElement("p");
        var timeSpan = document.createElement("span");
        timeSpan.textContent = thisRecords[i].time + " ";
        var typeSpan = document.createElement("span");
        typeSpan.textContent = thisRecords[i].type + " ";
        var footprintSpan = document.createElement("span");
        footprintSpan.textContent = "減少的碳排放: " + thisRecords[i].footprint + "gCo2E";

        // 將 <span> 元素附加到 <p> 元素
        recordElement.appendChild(timeSpan);
        recordElement.appendChild(typeSpan);
        recordElement.appendChild(footprintSpan);

        recordDiv.appendChild(recordElement);
        container.appendChild(recordDiv);
        recordDiv.id  = 'record_' + thisRecords[i].recordId;
                (function(recordId) {
                        recordDiv.addEventListener('click', function() {
                            recordClick(recordId);
                        });
                    })(thisRecords[i].recordId);
    }
}


////路線紀錄，不知道有沒有功能
function startRecording() {
    // 按下變成結束
    $('#startRecording').text('結束');
    isRecording = true;

    // 每五秒記錄一次
    intervalId = setInterval(function () {
        recordLocation();
    }, 5000);
}

function stopRecording() {
    // 修改按鈕文字和標誌位元
    $('#startRecording').text('開始記錄');
    isRecording = false;


    //這裡存一下recordedPositions資料

    // 清除時間間隔
    clearInterval(intervalId);
    // 清空位置紀錄
    recordedPositions = [];
    // 移除地圖上的線條
    clearMapLines();
}

function recordLocation() {
    if ("geolocation" in navigator) {
        // 獲取目前位置
        navigator.geolocation.getCurrentPosition(function (position) {
            var currentLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            // 儲存記錄的位置
            recordedPositions.push(currentLocation);

            // 在記錄的位置之間繪製線條
            drawLines();
        });
    } else {
        alert("不支援定位");
    }
}

function drawLines() {
    if (recordedPositions.length >= 2) {
        //一段一段畫
        var lastTwoPoints = recordedPositions.slice(-2); // 取得最後兩個點
        var lineCoordinates = lastTwoPoints.map(function (position) {
            return new google.maps.LatLng(position.lat, position.lng);
        });

        var line = new google.maps.Polyline({
            path: lineCoordinates,
            geodesic: true,
            strokeColor: '#0D5025',
            strokeOpacity: 1.0,
            strokeWeight: 2
        });

        line.setMap(map);
    }
}
//清線
function clearMapLines() {
    // 取得地圖上的所有線條
    var mapLines = map.getOverlays('polyline');

    // 移除線
    for (var i = 0; i < mapLines.length; i++) {
        map.removeOverlay(mapLines[i]);
    }
}
// 初始化Google Map
function initMap() {
    if ("geolocation" in navigator) {
        // 當前位置
        navigator.geolocation.getCurrentPosition(function(position) {
            var currentLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            // 創建地圖
            map = new google.maps.Map(document.getElementById('map'), {
                center: currentLocation,
                zoom: 15,
                mapTypeControl: false,
                zoomControl: false,
                scaleControl: false,
                streetViewControl: false,
                rotateControl: false,
                fullscreenControl: false,
                styles: [
                    {
                        featureType: 'poi',
                        elementType: 'labels',
                        stylers: [
                            { visibility: 'off' }
                        ]
                    }
                ]
            });
            infoWindow = new google.maps.InfoWindow();
            // 當前位置標記
            var circle = new google.maps.Marker({
                position: currentLocation,
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 5
                },
                map: map
            });
        });
    } else {
        alert("不支援定位");
    }
}