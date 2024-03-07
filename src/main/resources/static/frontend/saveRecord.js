// 記錄按鈕事件處理
function saveRecord(classType, type, data_value){
    let record={
        userId: User.userId, // 使用者 ID，這裡使用本地存儲的使用者名稱
        classType: null,
        type: null,
        data_value: null,
        latitude: currentLocation.lat,
        longitude: currentLocation.lng,
        footprint:null,
        time: getFormattedDate(),
        recordId:null,
        lineOnMap: recordedPositions,
        trafficKM:kilometer
    }
    let now = new Date();
    record.recordId = now.getTime();
    record.classType = classType;
    record.type = type;
    record.data_value = data_value;
    console.log(record);
    record.footprint = calculateFootprint(type,data_value);
    if(Object.values(record).includes(null)){
       alert("請重新登入");
       window.location.href = '/login';
       console.log(record);
       return;
    }else{
        uploadRecordToBackend(record);
        records.push(record);
        addMarker(record);
        showTotalFP();
    }
    //按下save，強制跳到中心
    cL ={
        lat: currentLocation.lat,
        lng: currentLocation.lng,
    }
    map.panTo(cL);
}
// 將紀錄上傳到後端
function uploadRecordToBackend(record) {
    $.ajax({
        type: 'POST',
        url: '/eco/addRecord',
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
        url: '/eco/getSpecificUserRecord?userId=' + userId,
        method: 'GET',
        success: function (data) {
            // 處理成功時的邏輯
            records = data;
            let thisRecords = records;
            //console.log(records);
             for (let i = 0; i < thisRecords.length; i++) {
                    addMarker(thisRecords[i]);
             }
            showTotalFP();
        },
        error: function(xhr, status, error) {
           let errorData = JSON.parse(xhr.responseText);
           let errorMessage = errorData.message;
           alert(errorMessage);
       }
    });

}
//新增標記
function addMarker(recordToAdd) {
    recordToAdd.footprint = parseFloat(recordToAdd.footprint,10).toFixed(3) *1000/1000;
    recordToAdd.recordId = parseInt(recordToAdd.recordId,10);
    let thisIcon;
    if (recordToAdd.classType === "交通") {
        thisIcon = '/frontend/img/' + recordToAdd.type +'.svg';
    } else if (recordToAdd.classType === "生活用品") {
        thisIcon = '/frontend/img/生活用品.svg';
    }
    if (map) {
        let currentLocation = {
            lat: recordToAdd.latitude,
            lng: recordToAdd.longitude
        }//抓現在位置
        let marker = new google.maps.Marker({
            map,
            position: currentLocation,
            title: recordToAdd.type,
            icon: thisIcon,
            id:recordToAdd.recordId
        });

       //小改
       let infoWindowContent = `
           <div>
               <h6 style="padding:3px; margin:3px; font-size: 30px; font-family: 'cwTeXYen', 'Mandali', sans-serif; font-weight: bold;">${recordToAdd.type}</h6>
               <p style="padding:3px; margin:3px; font-size: 20px; font-family: 'cwTeXYen', 'Mandali', sans-serif;">減少的碳足跡為：${recordToAdd.footprint}g Co2E</p>
               <p style="padding:3px; margin:3px; font-size: 15px; font-family: 'cwTeXYen', 'Mandali', sans-serif;">${recordToAdd.time}</p>
               <button id="editButton" type="button" style="position: absolute; right: 20px; bottom: 15px; background-color: #6c757d; color: #fff; padding: 6px; border: none; cursor: pointer; border-radius: 5px; font-size: 20px; font-family: 'cwTeXYen', 'Mandali', sans-serif;" onclick="recordModal()">編輯</button>
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
            if (currentInfoWindowRecord.classType=="交通"){
             drawLine(currentInfoWindowRecord.lineOnMap);
            }
       });

        // 監聽 infoWindow 關閉事件
        infoWindow.addListener('closeclick', function() {
            clearMapLines(mapLines);
        });
    }
}


