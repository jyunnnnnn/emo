let intervalId;//時間間隔
let isRecording = false;//false=>開始  true=>結束
let distanceThreshold = -1; // 初始化地圖位置
let accuracyThreshold = 100000; //

function success(pos){

    const newLat = pos.coords.latitude;
    const newLng = pos.coords.longitude;
    const point1 = new google.maps.LatLng(newLat, newLng);
    const point2 = new google.maps.LatLng(currentLocation.lat, currentLocation.lng);
    //計算新位置和當前位置的距離 meter
    const distance = google.maps.geometry.spherical.computeDistanceBetween(point1, point2);
    const accuracy = pos.coords.accuracy;
//    console.log(pos,currentLocation);
//    console.log(accuracy); // accuracy 經緯度的水平誤差(平面距離)(m)
//    console.log(distance);

    // 只有當距離超過閾值時才更新位置和圓圈 (小於2公尺不更新)，且定位精準度不超過閾值
    // 有些裝置不提供speed 訊息
    if(distance > distanceThreshold) {
        if (accuracy < accuracyThreshold) { // 超過精準度直接判掉當作異常資料(先這樣，我也不知道可不可以):))
            distanceThreshold = 5;
            // 50m ，估狗官方寫誤差不超過20m，但沒標示是否為移動時誤差，反正我先設50，超過可能是出現飄移
            // 缺點是，在gps信號不好時，位置就不會改變.......
            accuracyThreshold = 500;//這邊要改回50
            currentLocation = {
                lat: newLat,
                lng: newLng,
            };
            updateCurrentCircle();
        }else {
            // alert("精準度太低:)，accuracy: " + accuracy);
        }
    }
}

function error(err) {
    console.error(`ERROR(${err.code}): ${err.message}`);
    navigator.geolocation.clearWatch(watchId);//停止監測
    watchId = navigator.geolocation.watchPosition(success, error, options);//重新監測
}

options = {
    enableHighAccuracy: true,//高精準，但耗能
    timeout: Infinity,// 設備必須要在多少時間內回應位置資訊(ms)
    maximumAge: 5000,// 緩存位置5秒
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
    $("#routeCompare").text("選擇行為以獲得基準值");
    $("#routeFormula").text("選擇行為以獲得計算公式");
    // 按下變成結束
    $('#startRecording').text('結束');
    isRecording = true;

    kilometer = 0; //清除上一次距離
    recordedPositions = []; // 清空上一個路線紀錄
    showNowLines=[];// 清空上一個路線紀錄[line]
    if (typeof currentMarker!='undefined') {
        currentMarker.infoWindow.close();
        removeDirections();
        clearMapLines();
        clearNowLines();
    }

    // 每1秒記錄一次
    intervalId = setInterval(function () {
        // 減少記憶體浪費 後來我沒做很精細:)
        lastPosition = recordedPositions.slice(-1)[0];
        if(lastPosition) lp = lastPosition;
        else {
            lp = {
                lat: null,
                lng: null
            };
        }
        // console.log(lp , currentLocation.lat);
        if(lp.lat != currentLocation.lat && lp.lng != currentLocation.lng) {
            recordLocation();
        }
    }, 1000);
}

function stopRecording() {
    // 修改按鈕文字和標誌位元
    $('#startRecording').text('路線記錄');
    isRecording = false;
    //console.log("kilometer: "+kilometer.toFixed(3)+" KM");
    // 清除時間間隔
    clearInterval(intervalId);
    // 清空位置紀錄
    // 移除地圖上的線條
    if (typeof currentMarker!='undefined') {
        currentMarker.infoWindow.close();
        removeDirections();
        clearMapLines();
        clearNowLines();
    }
    // 修正路線
    processAllPoints(recordedPositions);

    // 打開路線記錄懸浮窗
    $('#recordCalculate').text("0 gCO2e");
    $("#routeDetail").html("<span id=\"routeCompare\" style=\"background-color: #166a29; color: #ffffff; border-radius: 20px; font-weight: bold; padding: 5px; padding-left: 8px;\">\n" +
        "                        選擇行為以獲得基準值\n" +
        "                        </span>\n" +
        "<span style=\"font-weight: bold; font-size: 15px; margin-left: 5px;\">"+
        "                            計算公式如下</span>"+
        "                        <span id=\"routeFormula\" style=\"display: block; text-align: center;\">\n" +
        "                        選擇行為以獲得計算公式\n" +
        "                        </span>");
    $('#routeFW').css("display", "flex");
    $('#routeFW').css("position", "fixed");
    $('#kilometer').val(kilometer.toFixed(3));

    $('#saveTrafficRecord').css("display", "block");
    $('#updateTrafficRecord').css("display", "none");
    $('#deleteTrafficRecord').css("display", "none");
    let type = $('input[name="engine"]:checked').next().find('.radio-label').text();
    let data_value = $('#kilometer').val();
    let showExpectedFP = 0;
    $('#routeCalculate').text(showExpectedFP + " gCO2e");
    let checked = $('input[name="engine"]:checked');
    let checkedVal = $('input[name="engine"]:checked').val();
    if(checkedVal != undefined){
        $('#' + checkedVal + 'Icon').html(svgData.svgImages.transportation[checkedVal + 'Icon']);
        checked.prop('checked', false);
    }
}

function recordLocation() {
    // 儲存記錄的位置
    recordedPositions.push(currentLocation);
    //只有在路線紀錄時強制跑到中心
    map.panTo(currentLocation);
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
            strokeColor: '#166a29',
            strokeOpacity: 1,
            strokeWeight: 4
        });

        line.setMap(map);
        showNowLines.push(line);
        //累加計算兩點之間距離 KM
        kilometer += (google.maps.geometry.spherical.computeDistanceBetween(lastTwoPoints[0],lastTwoPoints[1])/1000);
    }
}

//點擊紀錄時畫路線圖
function drawLine(cRecord){
    //console.log(tracking);
    let tracking = cRecord.lineOnMap;
    let path = new google.maps.Polyline({
        path: tracking.map(position => ({ lat: position.lat, lng: position.lng })),
        geodesic: true,
        strokeColor: '#166a29',
        strokeOpacity: 1,
        strokeWeight: 4
    });
    path.setMap(map);
    mapLines.push(path);
}

//清線(除了正在紀錄的)
function clearMapLines() {
    for (let i = 0; i < mapLines.length; i++) {
        mapLines[i].setMap(null);
    }
    mapLines=[];
}
//清除正在紀錄的路線
function clearNowLines() {
    for (let i = 0; i < showNowLines.length; i++) {
        showNowLines[i].setMap(null);
    }
    showNowLines=[];
}

function toggleDrawingMode() {
    if (isDrawingEnabled) {
        // 停止繪製
        drawingManager.setDrawingMode(null);
        isDrawingEnabled = false;

        //輸出座標
        polylines.forEach(function(polyline, index) {
            const path = polyline.getPath();
            const coordinates = [];
            for (let i = 0; i < path.getLength(); i++) {
                const latLng = path.getAt(i);
                coordinates.push({ lat: latLng.lat(), lng: latLng.lng() });
            }
            console.log('繪製座標:', coordinates);
            processAllPoints(coordinates);
            let tracking = recordedPositions;
            let pathh = new google.maps.Polyline({
                path: tracking.map(position => ({ lat: position.lat, lng: position.lng })),
                geodesic: true,
                strokeColor: '#166a29',
                strokeOpacity: 1,
                strokeWeight: 4
            });
            pathh.setMap(map);
            mapLines.push(pathh);
        });

    } else {
        // 啟用繪製
        drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYLINE);
        isDrawingEnabled = true;
    }
}