let intervalId;//時間間隔
let recordedPositions = [];//路線紀錄(點)
let mapLines = [];//一次紀錄的路線線段
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
            accuracyThreshold = 50;
            currentLocation = {
                lat: newLat,
                lng: newLng,
                TimeStamp_milliseconds: pos.timestamp,
                accuracy: accuracy
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
    // 按下變成結束
    $('#startRecording').text('結束');
    isRecording = true;

    recordedPositions = []; // 清空上一個路線紀錄
    mapLines =[];
    //清除上一次距離
    kilometer = 0;

    // 每1秒記錄一次
    intervalId = setInterval(function () {
        // 減少記憶體浪費
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
    //一次平滑所有資料(KF)
    // const kf = new KalmanFilter();
    // let smoothedPositions = [];
    // recordedPositions.forEach(position => {
    //     kf.process(position.lat, position.lng, position.timestamp, position.accuracy);
    //     smoothedPositions.push(kf.getState());
    // });
    // let oldDataString = JSON.stringify(recordedPositions);
    // let newDataString = JSON.stringify(smoothedPositions);
    // console.log("舊資料"+oldDataString +"\n新資料"+newDataString);
    // alert("舊資料"+recordedPositions.length +"\n新資料"+smoothedPositions.length);
    // let smoothedPath = new google.maps.Polyline({
    //     path: smoothedPositions.map(position => ({ lat: position.lat, lng: position.lng })),
    //     geodesic: true,
    //     strokeColor: '#FF0000',
    //     strokeOpacity: 1.0,
    //     strokeWeight: 2
    // });
    //
    // smoothedPath.setMap(map);
    // console.log("紅線為修正後路線");

    // 用大葉大學的方法
    // const sm = new smoothTracking(recordedPositions);
    // sm.smoothData();
    // smoothedPositions = sm.getData();
    // let oldDataString = JSON.stringify(recordedPositions);
    // let newDataString = JSON.stringify(smoothedPositions);
    // alert("舊資料"+oldDataString +"\n新資料"+newDataString);
    // let smoothedPath = new google.maps.Polyline({
    //     path: smoothedPositions.map(position => ({ lat: position.lat, lng: position.lng })),
    //     geodesic: true,
    //     strokeColor: '#FF0000',
    //     strokeOpacity: 1.0,
    //     strokeWeight: 2
    // });
    // smoothedPath.setMap(map);
    // console.log("紅線為修正後路線");

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


    // 打開路線記錄懸浮窗
    $('#routeFW').css("display", "flex");
    $('#routeFW').css("position", "fixed");
    $('#kilometer').val(kilometer.toFixed(3));

    $('#saveTrafficRecord').css("display", "block");
    $('#updateTrafficRecord').css("display", "none");
    $('#deleteTrafficRecord').css("display", "none");

    let checked = $('input[name="engine"]:checked');
    let checkedVal = $('input[name="engine"]:checked').val();
    if(checkedVal != undefined){
        $('#' + checkedVal + 'Icon').html(svgData.svgImages.transportation[checkedVal + 'Icon']);
        checked.prop('checked', false);
    }
    // 清空位置紀錄
    recordedPositions = []; // 放在開始記錄清，以免存資料不同步
    // smoothedPositions = [];
    // 移除地圖上的線條
    clearMapLines(mapLines);
}

function recordLocation() {
    // 儲存記錄的位置
    recordedPositions.push(currentLocation);
    //只有在路線紀錄時強制跑到中心
    cL ={
        lat: currentLocation.lat,
        lng: currentLocation.lng,
    }
    map.panTo(cL);
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
            strokeOpacity: 1,
            strokeWeight: 4
        });

        line.setMap(map);
        mapLines.push(line);
        //累加計算兩點之間距離 KM
        kilometer += (google.maps.geometry.spherical.computeDistanceBetween(lastTwoPoints[0],lastTwoPoints[1])/1000);
    }
}

//地圖路線一次重畫
function drawLine(tracking){
    //console.log(tracking);
    let path = new google.maps.Polyline({
        path: tracking.map(position => ({ lat: position.lat, lng: position.lng })),
        geodesic: true,
        strokeColor: '#0D5025',
        strokeOpacity: 1,
        strokeWeight: 4
    });
    path.setMap(map);
    mapLines.push(path);
}

//清線
function clearMapLines(line) {
    for (let i = 0; i < line.length; i++) {
        line[i].setMap(null);
    }
    mapLines = [];
}