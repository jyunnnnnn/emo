var map;
var infoWindow;
var intervalId;
var recordedPositions = [];
var records = [];//進入系統時把該用戶的環保紀錄存進去
var isRecording = false;//false=>開始  true=>結束
var username//使用者名稱

$(document).ready(function() {
    username = localStorage.getItem('EmoAppUser');
    $('#user').text(username);
    loadEcoRecords(username);//載入環保紀錄
    $('#saveRecord').click(saveRecord)// 添加標記
    $('#recordListButton').click(showRecord);//查看環保紀錄
    $('#startRecording').click(function () {
        if (!isRecording) {
            startRecording(); //false
        } else {
            stopRecording(); //true
        }
    });// 路線紀錄(開始/停止)
});
// 記錄按鈕事件處理
function saveRecord(){
    var latitude;
    var longitude;
    if ("geolocation" in navigator) {
        // 當前位置
        navigator.geolocation.getCurrentPosition(function(position) {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
            // 在這裡你可以使用獲取到的經緯度進行相應的操作
            // 假設你有一個保存紀錄的函數
            var classType = $("#classType option:selected").text();; // 替換為實際的類別
            var type = $("#subType option:selected").text();
            var data_value = 1; // 替換為實際的數值
            // 保存紀錄到後端
            if(classType!=null &&type!=null &&data_value!=null &&latitude!=null &&longitude!=null){
                saveRecordToBackend(classType, type, data_value, latitude, longitude);
            }
            //這裡邏輯待討論
        });
    } else {
        alert("不支援定位");
    }
}
//一開始把所有資料拉下來做成標籤 每次新增也要做出新標籤
function loadEcoRecords(username) {
    $.ajax({
        url: '/api/getSpecificUserRecord?userId=' + username,
        method: 'GET',
        success: function (data) {
            // 處理成功時的邏輯
            records = data;
            var thisRecords = records;
            console.log(records);
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
function addMarker(recordToAdd) {
        console.log(recordToAdd);

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
           //var currentTime =new Date() ;
           var now=new Date().toLocaleString();
           /////////////////////////////這邊誰可以救我///////////////////////////////////////////
           let infoWindow = new google.maps.InfoWindow({
                content: `<div>
                <h6 style="padding:3px; margin:3px;">${recordToAdd.type}</h6>
                <p style="padding:3px; margin:3px;">減少的碳足跡為:${recordToAdd.footprint}gCO2E</p>
                <p style="padding:3px; margin:3px;">${now}</p>
                </div>` // 支援html
           });
           //localStorage.setItem("ecoRecord"+currentTime, JSON.stringify({ time: now, content: record.type ,compare:Date.now()}));
            // 監聽 marker click 事件
           marker.addListener('click', e => {
                infoWindow.open(this.map, marker);
           });
        }
        $('#activityModal').modal('hide');
}

//列表顯示環保紀錄
function showRecord() {
    var thisRecords = records;
    var text = "";
    for (var i = 0; i < thisRecords.length; i++) {
        text +=thisRecords[i].time + " " + thisRecords[i].type + " 減少的碳排放: " + thisRecords[i].footprint + "gCo2E" + "<br>";
    }
    document.getElementById("listContent").innerHTML = text;
    $('#activityModal').modal('hide');
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

// 保存紀錄的函數
function saveRecordToBackend(classType, type, data_value, latitude, longitude) {
    var record = {
        userId: localStorage.getItem('EmoAppUser'), // 使用者 ID，這裡使用本地存儲的使用者名稱
        classType: classType,
        type: type,
        data_value: data_value,
        latitude: latitude,
        longitude: longitude
    };
    if(record.userId) {
        uploadRecordToBackend(record);
        records.push(record);
        addMarker(record);
    }
    else {
        alert("請重新登入");
        window.location.href = 'frontend/login.html';
    }
    // 上傳紀錄到後端
}


////////
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

    // 清除時間間隔
    clearInterval(intervalId);
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
        var lineCoordinates = recordedPositions.map(function (position) {
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