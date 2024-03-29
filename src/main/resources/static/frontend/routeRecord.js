let intervalId;//時間間隔
let recordedPositions = [];//路線紀錄(點)
let mapLines = [];//一次紀錄的路線線段
let isRecording = false;//false=>開始  true=>結束

function success(pos){
    distanceThreshold = 10; // 十公尺
    //console.log(pos,currentLocation);
    const newLat = pos.coords.latitude;
    const newLng = pos.coords.longitude;
    const point1 = new google.maps.LatLng(newLat, newLng);
    const point2 = new google.maps.LatLng(currentLocation.lat, currentLocation.lng);
    //計算新位置和當前位置的距離 meter
    const distance = google.maps.geometry.spherical.computeDistanceBetween(point1, point2);
    // 只有當距離超過閾值時才更新位置和圓圈 (小於10公尺不更新)
    if (distance > distanceThreshold) {
        currentLocation = {
            lat: newLat,
            lng: newLng
        };
        updateCurrentCircle(pos);
    }
}

function error(err) {
    console.error(`ERROR(${err.code}): ${err.message}`);
    navigator.geolocation.clearWatch(watchId);//停止監測
    watchId = navigator.geolocation.watchPosition(success, error, options);//重新監測
}

options = {
    enableHighAccuracy: false,//低精準，較不耗能
    timeout: 5000,//最長等待時間五秒
    maximumAge: 1000,//緩存位置1秒
};
// 路線紀錄(開始/停止)
function checkIsRecording() {
    if (!isRecording) {
        startRecording(); //false
    } else {
        stopRecording(); //true
    }
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

    //console.log(mapLines);
    console.log("kilometer: "+kilometer.toFixed(3)+" KM");
    // 清除時間間隔
    clearInterval(intervalId);
    // 清空位置紀錄
    recordedPositions = [];
    // 移除地圖上的線條
    clearMapLines();

    // 打開路線記錄懸浮窗
    $('#routeFW').css("display", "flex");
    $('#routeFW').css("position", "fixed");
    $('#kilometer').val(kilometer.toFixed(3));

    $('#saveTrafficRecord').css("display", "block");
    $('#updateTrafficRecord').css("display", "none");
    $('#deleteTrafficRecord').css("display", "none");

    let select = $('#trafficType');
    let trafficDatas = FootprintData.filter(function(item) {
        return item.class === "transportation";
    });
    select.empty();
    select.append($('<option>', {
        text: "請選擇一項行為",
        id: "noAction",
        selected: true,
        disabled: true
    }));
    for(let trafficData of trafficDatas){
        select.append($('<option>', {
            text: trafficData.type
        }));
    }

    //清除距離
    kilometer = 0;
}

function recordLocation() {
    // 儲存記錄的位置
    recordedPositions.push(currentLocation);

    // 在記錄的位置之間繪製線條
    if (recordedPositions.length >= 2) {
        //一段一段畫
        let lastTwoPoints = recordedPositions.slice(-2); // 取得最後兩個點
        let lineCoordinates = lastTwoPoints.map(function (position) {
            return new google.maps.LatLng(position.lat, position.lng);
        });
        let line = new google.maps.Polyline({
            path: lineCoordinates,
            geodesic: true,
            strokeColor: '#0D5025',
            strokeOpacity: 1.0,
            strokeWeight: 2
        });

        line.setMap(map);
        mapLines.push(line);
        //累加計算兩點之間距離 KM
        kilometer += (google.maps.geometry.spherical.computeDistanceBetween(lastTwoPoints[0],lastTwoPoints[1])/1000);
    }
}

//清線
function clearMapLines() {
    for (let i = 0; i < mapLines.length; i++) {
        mapLines[i].setMap(null);
    }
    mapLines = [];
}