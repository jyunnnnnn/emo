// 記錄按鈕事件處理
function saveRecord(event){
    event.preventDefault();
    let latitude;
    let longitude;
    let classType;
    let type;
    let data_value;
    let footprint;
    let recordId;
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
                let now = new Date();
                //console.log(now);
                let year = now.getFullYear();
                let month = (now.getMonth() + 1).toString().padStart(2, '0');
                let day = now.getDate().toString().padStart(2, '0');
                let hours = now.getHours().toString().padStart(2, '0');
                let minutes = now.getMinutes().toString().padStart(2, '0');
                let seconds = now.getSeconds().toString().padStart(2, '0');

                let formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
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
    let record = {
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
            let thisRecords = records;
            //console.log(records);
             for (let i = 0; i < thisRecords.length; i++) {
                    addMarker(thisRecords[i]);
             }
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
        recordToAdd.data_value = recordToAdd.data_value.toString();
        recordToAdd.recordId = parseInt(recordToAdd.recordId,10);
        let thisIcon;
        if (recordToAdd.classType === "交通") {
            thisIcon = '/frontend/img/traffic.ico';
        } else if (recordToAdd.classType === "生活用品") {
            thisIcon = '/frontend/img/daily.ico';
        }
        if (map) {
            let currentLocation = {
                lat: recordToAdd.latitude,
                lng: recordToAdd.longitude
            }//抓現在位置
            let marker = new google.maps.Marker({
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