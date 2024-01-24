var map;
var infoWindow;
var intervalId;//時間間隔
var FootprintData = [];
var records = [];//進入系統時把該用戶的環保紀錄存進去
var isRecording = false;//false=>開始  true=>結束
var username;//使用者名稱
var User;
var nickname;
var currentInfoWindowRecord; // 目前 infoWindow 的內容
var currentMarker;//目前Marker
var markers =[];//所有marker
var recordedPositions = [];//路線紀錄(點)
var mapLines = [];//一次紀錄的路線線段
var watchId; //當前位置ID
var options;//地圖精準度 更新當前位置function用

var circle; //當前位置標記 用於每5秒更新(清除、重劃)
var currentLocation;

// 初始化Google Map
function initMap() {
    console.log("進入init");
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
                function(position) {
                    currentLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                     console.log("抓取位置成功 開始建構地圖");
                    // 創建地圖
                    map = new google.maps.Map(document.getElementById('map'), {
                        center: currentLocation,
                        zoom: 18,
                        minZoom: 5, // 設定最小縮放級別
                        maxZoom: 50, // 設定最大縮放級別
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
                    console.log("獲取標記及訊息窗");
                    infoWindow = new google.maps.InfoWindow();

                    // 當前位置標記
                    circle = new google.maps.Marker({
                        position: currentLocation,
                        icon: {
                            path: google.maps.SymbolPath.CIRCLE,
                            scale: 5
                        },
                        map: map
                    });
                    console.log("map finish");
                    if (localStorage.getItem('EmoAppUser')==null) {
                        alert("請重新登入");
                        window.location.href = '/login';
                    }
                    //watchPosition()=>裝置換位置就會自己動
                    watchId = navigator.geolocation.watchPosition(success, error, options);
                    User =JSON.parse(localStorage.getItem('EmoAppUser'));
                    username=User.username;
                    nickname=User.nickname;
                    $('#user').text(nickname);
                    loadEcoRecords(User.userId);//載入環保紀錄
                    loadFootprintData();//載入碳足跡計算
                    $('#logoutAccount').click(logoutAccount);//登出
                    $('#delete').click(deleteAccount);//刪除帳號
                    $('#saveRecord').click(saveRecord);// 添加標記
                    $('#updateRecord').click(updateRecord)//修改紀錄
                    $('#deleteRecord').click(deleteRecord)//刪除紀錄
                    $('#recordListButton').click(showRecord);//查看環保紀錄
                    $('#adminButton').click(showFPdata)
                    $('#settingButton').click(showTotalFootprint);
                    $('#renameBtn').click(modifyNickname);
                    $('#deleteEditRecord').click(deleteMultiRecord);//刪除多筆紀錄
                    $('#startRecording').click(function () {
                        if (!isRecording) {
                            startRecording(); //false
                        } else {
                            stopRecording(); //true
                        }
                    });// 路線紀錄(開始/停止)
                    if(username === 'admin'){
                        document.getElementById('adminButton').style.display = 'block';
                    }else{
                        document.getElementById('adminButton').style.display = 'none';
                    }
                },
                function(error){
                    console.error('Error getting geolocation:', error);
                }
            )
    }
    else{
        alert("瀏覽器不支持地理位置功能");
    }
}


//此處有bug等rui修

function success(pos){
    // distanceThreshold = 0.005; // 五公尺
    //navigator.geolocation.clearWatch(watchId);
    //console.log(pos,currentLocation);
    const newLat = pos.coords.latitude;
    const newLng = pos.coords.longitude;

    //const point1 = new google.maps.LatLng(newLat, newLng);
    //const point2 = new google.maps.LatLng(currentLocation.lat, currentLocation.lng);
    // 計算新位置和當前位置的距離
    //const distance = google.maps.geometry.spherical.computeDistanceBetween(point1, point2);
    // 轉換為公里
    //const distanceInKm = distance / 1000;
    // 只有當距離超過閾值時才更新位置和圓圈 (小於五公尺不更新)
    // if (distance > distanceThreshold) {
    //     currentLocation = {
    //         lat: newLat,
    //         lng: newLng
    //     };
    //     updateCurrentCircle(pos);
    // }

    //更新位置
    if (newLat !== currentLocation.lat || newLng !== currentLocation.lng) {
        currentLocation = {
            lat: newLat,
            lng: newLng
        };
        updateCurrentCircle(pos);
    }
    // 重新啟動位置監測
    //watchId = navigator.geolocation.watchPosition(success, error, options);
}

function error(err) {
    console.error(`ERROR(${err.code}): ${err.message}`);
    navigator.geolocation.clearWatch(watchId);
    watchId = navigator.geolocation.watchPosition(success, error, options);
}

options = {
    enableHighAccuracy: true,//高精準
    timeout: 5000,
    maximumAge: 1000,//緩存位置1秒
};
//更新標記
function updateCurrentCircle(position) {

    // 清除舊位置的圈圈
    if (circle) {
        circle.setMap(null);
    }

    // 在新當前位置上標記圈圈
    circle = new google.maps.Marker({
        position: currentLocation,
        map: map,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 5
        }
    });

    //跑到中心
    map.panTo(currentLocation);
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
    footprint=(data_value * coefficient).toFixed(3);
    return footprint;
}
function modifyNickname() {
    var userDataString = localStorage.getItem('EmoAppUser');
    if (userDataString) {
        var userData = JSON.parse(localStorage.getItem('EmoAppUser'));;
        var newNickname = $('#newName').val();
        if (newNickname !== '') {
            userData.nickname = newNickname;
            var updatedUserDataString = JSON.stringify(userData);
            localStorage.setItem('EmoAppUser', updatedUserDataString);
            User.nick = newNickname;
            nickname = newNickname;
            $('#user').text(nickname);
            alert("修改成功");
            document.getElementById('renameFW').style.display = 'none';
            updateNewNicknameToBackend(newNickname);
        } else {
            alert("暱稱不得為空");
        }
    } else {
        alert("請重新登入");
        window.location.href = '/login';
    }
}
function updateNewNicknameToBackend(newNickname){
    $.ajax({
            type: 'PUT',
            url: '/api/updateNickname?username=' + username +'&nickname='+newNickname,
            success: function(response) {
                console.log(response); // 成功更新時的處理邏輯
            },
            error: function(xhr, status, error) {
                console.error(error); // 更新失敗時的處理邏輯
            }
        });
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
           latitude = position.coords.latitude;
           longitude = position.coords.longitude;
//            抓取真實位置
//             latitude = map.getCenter().lat();
//             longitude = map.getCenter().lng();
//            抓取中心位置 這是備案
            if ($("#trafficRadio").is(":checked")) {
                classType = $("#traffic").text();
                type = $("#trafficMenu option:selected").text();
                data_value = document.getElementById('kilometer').value;
            } else if ($("#dailyRadio").is(":checked")) {
                classType = $("#daily").text();
                type = $("#dailyMenu option:selected").text();
                data_value = document.getElementById('gram').value;
            }
            footprint = calculateFootprint(type,data_value);
            // 保存紀錄到後端
            if(data_value <= 0){
               alert("請輸入正數");
               return;
            }
            if(classType && type && data_value && latitude && longitude && footprint && data_value) {
                var now = new Date();
                //console.log(now);
                var year = now.getFullYear();
                var month = (now.getMonth() + 1).toString().padStart(2, '0');
                var day = now.getDate().toString().padStart(2, '0');
                var hours = now.getHours().toString().padStart(2, '0');
                var minutes = now.getMinutes().toString().padStart(2, '0');
                var seconds = now.getSeconds().toString().padStart(2, '0');

                var formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
                //console.log(formattedDate);
                recordId = now.getTime();
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
            //console.log(response); // 成功上傳時的處理邏輯
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
        recordToAdd.data_value = recordToAdd.data_value.toString();
        recordToAdd.recordId = parseInt(recordToAdd.recordId,10);
        var thisIcon;
        if (recordToAdd.classType === "交通") {
            thisIcon = '/frontend/img/traffic.ico';
        } else if (recordToAdd.classType === "生活用品") {
            thisIcon = '/frontend/img/daily.ico';
        }
        if (map) {
            var currentLocation = {
                lat: recordToAdd.latitude,
                lng: recordToAdd.longitude
            }//抓現在位置
            var marker = new google.maps.Marker({
                position: currentLocation,
                map: map,
                title: recordToAdd.type,
                icon: thisIcon,
                id:recordToAdd.recordId
            });

           //小改
           let infoWindowContent = `
               <div>
                   <h6 style="padding:3px; margin:3px; font-size: 40px; font-family: 'Crimson Pro', serif; font-weight: bold;">${recordToAdd.type}</h6>
                   <p style="padding:3px; margin:3px; font-size: 30px; font-family: 'Crimson Pro', serif;">減少的碳足跡為：${recordToAdd.footprint}g Co2E</p>
                   <p style="padding:3px; margin:3px; font-size: 30px; font-family: 'Crimson Pro', serif;">${recordToAdd.time}</p>
                   <button id="editButton" type="button" style="position: absolute; right: 10px; bottom: 10px; background-color: #6c757d; color: #fff; padding: 6px; border: none; cursor: pointer; border-radius: 5px; font-size: 25px;" onclick="recordModal()">編輯</button>
               </div>`;
               //class="btn btn-secondary"
           let infoWindow = new google.maps.InfoWindow({
               content: infoWindowContent
           });

           marker.infoWindow = infoWindow;
           markers.push(marker);

            // 監聽 marker click 事件
           marker.addListener('click', e => {
                infoWindow.open(this.map, marker);
                currentInfoWindowRecord = recordToAdd;
                currentMarker = marker;
           });
        }
}

//修改懸浮視窗是歷史紀錄
function recordModal(){
    // 顯示懸浮窗
        document.getElementById('recordFW').style.display = 'flex';
        document.getElementById('recordFW').style.position = 'fixed';
        document.getElementById('saveRecord').style.display = 'none';
        document.getElementById('updateRecord').style.display = 'block';
        document.getElementById('deleteRecord').style.display = 'block';

        if(currentInfoWindowRecord.classType === "交通"){
            //console.log(currentInfoWindowRecord.classType);
            document.getElementById('trafficLabel').style.display = 'block'
            document.getElementById('dailyLabel').style.display = 'none'
            document.getElementById('trafficRadio').checked = true;
            document.getElementById('dailyLabel').style.display = 'none';
            document.getElementById('trafficMenu').style.display = 'block';
            document.getElementById('dailyMenu').style.display = 'none';
            document.getElementById('SPACE').style.display = 'none';

            if(currentInfoWindowRecord.type === "公車"){
                document.getElementById('trafficType').value = 'traffic-bus';
            }else if(currentInfoWindowRecord.type === "捷運"){
                document.getElementById('trafficType').value = 'traffic-MRT';
            }else if(currentInfoWindowRecord.type === "火車"){
                document.getElementById('trafficType').value = 'traffic-train';
            }else if(currentInfoWindowRecord.type === "高鐵"){
                document.getElementById('trafficType').value = 'traffic-HSR';
            }

            document.getElementById('kilometer').value = currentInfoWindowRecord.data_value;
            document.getElementById('kilometer').disabled = true;
        }else if(currentInfoWindowRecord.classType === "生活用品"){
            document.getElementById('trafficLabel').style.display = 'none'
            document.getElementById('dailyLabel').style.display = 'block'
            document.getElementById('dailyRadio').checked = true;
            document.getElementById('trafficLabel').style.display = 'none';
            document.getElementById('trafficMenu').style.display = 'none';
            document.getElementById('dailyMenu').style.display = 'block';
            document.getElementById('SPACE').style.display = 'none';
            document.getElementById('gramRadios').style.display = 'flex';
            document.getElementById('customRadio').checked = true;

            if(currentInfoWindowRecord.type === "環保杯"){
                document.getElementById('dailyType').value = 'daily-cup';
            }else if(currentInfoWindowRecord.type === "環保餐具"){
                document.getElementById('dailyType').value = 'daily-tableware';
            }else if(currentInfoWindowRecord.type === "環保袋"){
                document.getElementById('dailyType').value = 'daily-bag';
            }
            document.getElementById('gram').value = currentInfoWindowRecord.data_value;
            document.getElementById('gram').disabled = false;
        }
}
// 修改記錄按鈕事件處理 //test
function updateRecord(){
    event.preventDefault();
    if ($("#trafficRadio").is(":checked")) {
        var classType = $("#traffic").text();
        var type = $("#trafficMenu option:selected").text();
        var data_value = document.getElementById('kilometer').value;
    } else if ($("#dailyRadio").is(":checked")) {
        var classType = $("#daily").text();
        var type = $("#dailyMenu option:selected").text();
        var data_value = document.getElementById('gram').value;
    }
    if(classType && type && data_value && data_value > 0) {
        updateRecordToBackend(classType, type, data_value);
    } else {
        alert("請輸入正數")
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
        document.getElementById('recordFW').style.display = 'none';
    }
    else {
        alert("請重新登入");
        window.location.href = 'frontend/login.html';
    }
    // 上傳紀錄到後端
}
// 將紀錄更新到後端
function modifyRecordToBackend(record) {
    $.ajax({
        type: 'PUT',
        url: '/api/updateRecord',
        contentType: 'application/json',
        data: JSON.stringify(record),
        success: function(response) {
            //console.log(response); // 成功更新時的處理邏輯
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
             <h6 style="padding:3px; margin:3px; font-size: 40px; font-family: 'Crimson Pro', serif; font-weight: bold;">${newContent.type}</h6>
             <p style="padding:3px; margin:3px; font-size: 30px; font-family: 'Crimson Pro', serif;">減少的碳足跡為:${newContent.footprint}gCO2E</p>
             <p style="padding:3px; margin:3px; font-size: 30px; font-family: 'Crimson Pro', serif;">${newContent.time}</p>
             <button id="editButton" type="button" style="position: absolute; right: 5px; bottom: 5px; background-color: #6c757d; color: #fff; padding: 7px; border: none; cursor: pointer; border-radius: 5px; font-size: 25px" onclick="recordModal()">編輯</button>
         </div>`;
         //class="btn btn-secondary"
    if (currentMarker.infoWindow) {
        //console.log("更新infowindow成功");
        var thisIcon;
        if (currentInfoWindowRecord.classType === "交通") {
            thisIcon = '/frontend/img/traffic.ico';
        } else if (currentInfoWindowRecord.classType === "生活用品") {
            thisIcon = '/frontend/img/daily.ico';
        } else{ alert(currentInfoWindowRecord.classType) }
        currentMarker.setIcon(thisIcon);
        currentMarker.infoWindow.setContent(modifyContent);
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
        //console.log('Updated records:', records);
    } else {
        console.log('Record not found');
    }
}
function deleteMultiRecord(){
        var selectedCheckboxes = $('input[type=checkbox].custom-checkbox:checked');
        var selectedRecordIds = [];
        selectedCheckboxes.each(function() {
             var recordIdString = $(this).closest('div').attr('id').split('_')[1];
             var recordId = parseInt(recordIdString, 10);
             deleteRecordInArray(recordId);//刪除records裡的
             deleteRecordToBackend(recordId);//刪除資料庫裡的
             deleteMarker(recordId);
             document.getElementById("record_" + recordId).remove();
             selectedRecordIds.push(recordId);
        });
        if (selectedRecordIds.length > 0) {
            //console.log('要刪除的記錄 ID：', selectedRecordIds);
            var nowType=$("#category option:selected").text();
            showNewChart(records,nowType);
            alert("刪除成功!!");
        } else {
            alert('沒有選中任何記錄');
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
        deleteMarker(currentInfoWindowRecord.recordId);
        //console.log(records);
        document.getElementById("recordFW").style.display = "none";
    } else{
        console.log("取消刪除");
    }
}

//從records刪資料
function deleteRecordInArray(recordId){
    records = records.filter(item => item.recordId !== recordId);

}

//從後端刪資料
function deleteRecordToBackend(recordId) {
    //console.log(records);
    $.ajax({
        type: 'DELETE',
        url: `/api/deleteOneRecord?recordId=${recordId}`,
        contentType: 'application/string',
        success: function(response) {
            //console.log(response); // 成功刪除時的處理邏輯
        },
        error: function(xhr, status, error) {
            console.error(error); // 刪除失敗時的處理邏輯
        }
    });
}

//刪mark
function deleteMarker(markerId){
    //在Markers裡找指定Marker
    var markerToDelete = markers.find(function(marker) {
        return marker.id === markerId;
    });
    if (markerToDelete) {

        markerToDelete.infoWindow.close();
        markerToDelete.setMap(null);

        // 在 markers 移除
        var index = markers.indexOf(markerToDelete);
        if (index > -1) {
            markers.splice(index, 1);
        }
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

// 設定頁面顯示總減碳量
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

// 打開管理員介面
function showFPdata() {
    var thisData = FootprintData;
    //console.log(thisData);
    var container = document.getElementById("adminData");
    container.innerHTML = ""; // 清空容器內容
    container.style.overflowY = "scroll";
    container.style.maxHeight = "150px";
    for (var i = 0; i < thisData.length; i++) {
        // 勾選框
        var checkbox = document.createElement('label');
        checkbox.className = 'checkbox-container';
        var input = document.createElement('input');
        input.type = 'checkbox';
        input.className = 'custom-checkbox';
        input.id = thisData[i].fpid;
        var span = document.createElement('span');
        span.className = 'checkmark';
        checkbox.appendChild(input);
        checkbox.appendChild(span);
        checkbox.style.marginRight = "3px";
        span.style.top = "5px";
        checkbox.style.display = "none";
        // 創建新的<div>元素
        var footprintDiv = document.createElement("div");
        footprintDiv.style.width = "200px";
        footprintDiv.style.background = "white";
        footprintDiv.style.display = "flex";
        footprintDiv.style.alignItems = "center";

        // 創建新的 <input> 元素
        var typeInput = document.createElement("input");
        typeInput.type = 'text';
        typeInput.value = thisData[i].type;
        typeInput.className = 'inputFP';
        typeInput.disabled = true;

        var footprintInput = document.createElement("input");
        footprintInput.type = 'text';
        footprintInput.value = thisData[i].coefficient;
        footprintInput.className = 'inputFP';
        footprintInput.disabled = true;
        footprintInput.id = thisData[i].fpid;

        footprintDiv.appendChild(checkbox);
        footprintDiv.appendChild(typeInput);
        footprintDiv.appendChild(footprintInput);
        container.appendChild(footprintDiv);
    }
    $('#saveFP').click(updateAllFootprint);//一次修改Footprint
    $('#deleteFP').click(deleteSelectedFootprints);
}

//修改footprint
function updateAllFootprint() {
    var footprints = $('.inputFP');
    //console.log(footprints);
    footprints.each(function(index) {
        var type = footprints.eq(index).val();
        var coefficient = footprints.eq(index + 1).val();
        var id = footprints.eq(index + 1).attr('id');

        if (index % 2 === 0) {
            // 使用 AJAX 送出 POST 請求給後端
            $.ajax({
                type: 'PUT',
                url: `/api/updateFootprint?FPId=${id}&coefficient=${coefficient}`,
                contentType: 'application/json',
                success: function (response) {
                    // 成功處理回傳的資料
                    //console.log('FP更新成功:', response);
                    loadFootprintData();
                },
                error: function (xhr, status, error) {
                    // 處理錯誤
                    //console.error('FP更新失敗:', error);
                }
            });
        }
    });
}

//刪除footprint
function deleteSelectedFootprints() {
    $('.custom-checkbox').each(function(index, checkbox) {
        if (checkbox.checked) {
            var footprintID = $(checkbox).attr('id');
            // 將收集到的被勾選的 ID 發送到後端進行刪除操作
            console.log(footprintID);
            $.ajax({
                type: 'DELETE',
                url: `/api/deleteOneFootprint?FPId=${footprintID}`, // 替換成適當的後端路由
                contentType: 'application/json',
                success: function(response) {
                    // 刪除成功，處理回應
                    console.log('成功刪除:', response);
                    // 重新載入或更新資料
                    // 例如，重新呼叫 showFPdata() 或更新資料列表
                    loadFootprintData();
                },
                error: function(xhr, status, error) {
                    // 處理錯誤
                    console.error('刪除失敗:', error);
                }
            });
        }
    });
}


//刪除Emo_User
function deleteAccountToBackend(userId){
    $.ajax({
        type: 'DELETE',
        url: `/api/deleteUserAccount?userId=${userId}`,
        contentType: 'application/string',
        success: function(response) {
            //console.log(response); // 成功刪除時的處理邏輯
        },
        error: function(xhr, status, error) {
            console.error(error); // 刪除失敗時的處理邏輯
        }
    });
    alert("帳號刪除成功");
    localStorage.removeItem('EmoAppUser');
    window.location.href= '/login';
}
//刪除Emo_Record裡面指定用戶的紀錄
function deleteRecordByAccount(userId){
     $.ajax({
            type: 'DELETE',
            url: `/api/deleteSpecificUserRecord?userId=${userId}`,
            contentType: 'application/string',
            success: function(response) {
                //console.log(response); // 成功刪除時的處理邏輯
            },
            error: function(xhr, status, error) {
                console.error(error); // 刪除失敗時的處理邏輯
            }
        });
}
//登出
function logoutAccount(){
    alert("登出成功");
    localStorage.removeItem('EmoAppUser');

    google.accounts.id.disableAutoSelect ();

    window.location.href= '/login';

}
//刪除帳號
function deleteAccount(){
    getEncryptKey().then(function() {
        var encryptPass =encrypt( $('#passwordAuth').val(),key,iv);
       if( encryptPass == User.password){
           deleteAccountToBackend(User.userId);
           deleteRecordByAccount(User.userId);
       }
       else{
          alert("密碼錯誤");
       }
    }).catch(function() {
        console.log("無法取得金鑰和偏移量");
    });
}
////路線紀錄
function startRecording() {
    // 按下變成結束
    $('#startRecording').text('結束');
    isRecording = true;

    // 每1秒記錄一次
    kilometer = 0;
    intervalId = setInterval(function () {
        recordLocation();
    }, 1000);
}

function stopRecording() {
    // 修改按鈕文字和標誌位元
    $('#startRecording').text('路線記錄');
    isRecording = false;

    //這裡存一下recordedPositions 要顯示十一次重畫
    //或在clearMapLines 存mapLines資料
    //好像?抓mapLines就可以直接出現線條(還未確定，等資料庫可新增這筆在測試)
    //存kilometer

    console.log(mapLines);
    console.log("kilometer: "+kilometer.toFixed(3)+" KM");
    // 清除時間間隔
    clearInterval(intervalId);
    // 清空位置紀錄
    recordedPositions = [];
    // 移除地圖上的線條
    clearMapLines();

    // 打開紀錄懸浮窗
    document.getElementById('recordFW').style.display = 'flex';
    document.getElementById('recordFW').style.position = 'fixed';
    document.getElementById('saveRecord').style.display = 'block';
    document.getElementById('deleteRecord').style.display = 'none';
    document.getElementById('updateRecord').style.display = 'none';
    document.getElementById('trafficRadio').checked = 'true';
    document.getElementById('trafficLabel').style.display = 'block';
    document.getElementById('dailyLabel').style.display = 'none';
    document.getElementById('trafficMenu').style.display = 'block';
    document.getElementById('dailyMenu').style.display = 'none';
    document.getElementById('gramRadios').style.display = 'none';
    document.getElementById('SPACE').style.display = 'none';
    document.getElementById('kilometer').value = kilometer.toFixed(3);
    document.getElementById('kilometer').disabled = 'true';

    //清除距離
    kilometer = 0;
}

function recordLocation() {
    // 儲存記錄的位置
    recordedPositions.push(currentLocation);
    //console.log(currentLocation);

    // 在記錄的位置之間繪製線條
    drawLines();
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

        mapLines.push(line);
        //累加計算兩點之間距離
        kilometer += (google.maps.geometry.spherical.computeDistanceBetween(lastTwoPoints[0],lastTwoPoints[1])/1000);
    }
}
//清線
function clearMapLines() {
    for (var i = 0; i < mapLines.length; i++) {
        mapLines[i].setMap(null);
    }
    mapLines = [];
}


//加密金鑰
var key;
//加密偏移量
var iv;

//獲取加密金鑰
function getEncryptKey() {
    return new Promise(function(resolve, reject) {
        $.ajax({
            type: 'GET',
            url: '/api/getEncryptKey',
            contentType: 'application/json',
            success: function (response) {
                key = response.key;
                iv = response.iv;
                resolve();  // 解析 Promise 表示成功取得金鑰和偏移量
            },
            error: function (xhr, status, error) {
                console.log("獲取金鑰失敗");
                reject();  // 拒絕 Promise 表示無法取得金鑰和偏移量
            }
        });
    });
}



//加密
function encrypt(text,key,iv) {
    var encrypted;
 encrypted= CryptoJS.AES.encrypt(text, CryptoJS.enc.Utf8.parse(key), {
         iv: CryptoJS.enc.Utf8.parse(iv),
         mode: CryptoJS.mode.CBC,
         padding: CryptoJS.pad.Pkcs7
     });
    return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
}


//解密
function decrypt(ciphertext,key,iv){
    var decrypt;
     decrypt= CryptoJS.AES.decrypt(ciphertext, CryptoJS.enc.Utf8.parse(key), {
            iv: CryptoJS.enc.Utf8.parse(iv),
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
          return decrypt.toString(CryptoJS.enc.Utf8);
}
