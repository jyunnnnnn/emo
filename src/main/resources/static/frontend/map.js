var map;
var infoWindow;
var activity;

var intervalId;
var recordedPositions = [];
var isRecording = false;//false=>開始  true=>結束

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
$(document).ready(function() {
    var username = localStorage.getItem('EmoAppUser');
    console.log(username)
    $('#user').text(username);
    // 記錄按鈕事件處理
    $('#recordButton').click(function() {
        map.setOptions({
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
    });

    $('#saveRecord').click(function(){
        var latitude;
        var longitude;
        if ("geolocation" in navigator) {
            // 當前位置
            navigator.geolocation.getCurrentPosition(function(position) {
                latitude = position.coords.latitude;
                longitude = position.coords.longitude;
                // 在這裡你可以使用獲取到的經緯度進行相應的操作
                console.log("Latitude: " + latitude);
                console.log("Longitude: " + longitude);
                // 假設你有一個保存紀錄的函數
                var classType = "交通or生活用品 待補"; // 替換為實際的類別
                var type = $("#recordType option:selected").text();
                var data_value = 1; // 替換為實際的數值
                // 保存紀錄到後端
                saveRecordToBackend(classType, type, data_value, latitude, longitude);
            });
        } else {
            alert("不支援定位");
        }


        var userEnteredValue = $("#activityInput").val();
        var selectedOption = $("#recordType option:selected").text()
        if (userEnteredValue != "") {
            activity = userEnteredValue;
            addMarker(activity);
        } else if (selectedOption) {
            activity = selectedOption;
            addMarker(activity);
        } else {
            alert("請輸入文字或選擇環保事項。");
        }
    })
    // 添加標記

    $('#recordListButton').click(function() {
       var records = [];
       for (var i = 0; i < localStorage.length; i++) {
           var key = localStorage.key(i);
           if (key.startsWith("ecoRecord")) {
               var storedData = localStorage.getItem(key);
               if (storedData) {
                   var ecoRecord = JSON.parse(storedData);
                   records.push(ecoRecord);

               }
           }
       }
       records.sort(function(a, b) {
             return a.compare - b.compare;
       });
       console.log(records)
       var text = "";
       for (var i = 0; i < records.length; i++) {
           var time = records[i].time;
           var content = records[i].content;
           text += content + " " + time + "<br>";
       }
       document.getElementById("listContent").innerHTML = text;
        $('#activityModal').modal('hide');
    });

    // 路線紀錄(開始/停止)
    $('#startRecording').click(function () {
        if (!isRecording) {
            startRecording(); //false
        } else {
            stopRecording(); //true
        }
    });



});
//一開始把所有資料拉下來做成標籤 每次新增也要做出新標籤
function addMarker(activity) {
        if (map) {
            var currentCenter = map.getCenter();
            var marker = new google.maps.Marker({
                position: currentCenter,
                map: map,
                title: activity
            });
           var currentTime = new Date();
           var now=currentTime.toLocaleString();
           let infoWindow = new google.maps.InfoWindow({
                content: `<div>
                <h6 style="padding:3px; margin:3px;">${activity}</h6>
                <p style="padding:3px; margin:3px;">${now}</p>
                </div>` // 支援html
           });
           localStorage.setItem("ecoRecord"+currentTime, JSON.stringify({ time: now, content: activity ,compare:Date.now()}));
            // 監聽 marker click 事件
           marker.addListener('click', e => {
                infoWindow.open(this.map, marker);
           });
        }
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
    console.log(record);
    // 上傳紀錄到後端
    uploadRecordToBackend(record);
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

