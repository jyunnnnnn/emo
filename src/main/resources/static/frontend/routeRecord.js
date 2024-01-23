function success(pos){
    // distanceThreshold = 0.005; // 五公尺
    navigator.geolocation.clearWatch(watchId);
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

    if (newLat !== currentLocation.lat || newLng !== currentLocation.lng) {
        currentLocation = {
            lat: newLat,
            lng: newLng
        };
        updateCurrentCircle(pos);
    }
    // 重新啟動位置監測
    watchId = navigator.geolocation.watchPosition(success, error, options);
}

function error(err) {
    console.error(`ERROR(${err.code}): ${err.message}`);
    watchId = navigator.geolocation.watchPosition(success, error, options);
}

options = {
    enableHighAccuracy: true,//高精準
    timeout: 5000,
    maximumAge: 1000,//緩存位置1秒
};

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
    if ("geolocation" in navigator) {
        // 獲取目前位置
        navigator.geolocation.getCurrentPosition(function (position) {
            console.log("1");
           let currentLocation = {
               lat: position.coords.latitude,
               lng: position.coords.longitude
           };
//             let currentLocation = {
//                 lat: map.getCenter().lat(),
//                 lng: map.getCenter().lng()
//             };

            // 儲存記錄的位置
            recordedPositions.push(currentLocation);
            console.log(currentLocation);
            console.log("2");

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
        //累加計算兩點之間距離
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
