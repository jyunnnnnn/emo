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
        let classType = $("#traffic").text();
        let type = $("#trafficMenu option:selected").text();
        let data_value = document.getElementById('kilometer').value;
    } else if ($("#dailyRadio").is(":checked")) {
        let classType = $("#daily").text();
        let type = $("#dailyMenu option:selected").text();
        let data_value = document.getElementById('gram').value;
    }
    if(classType && type && data_value && data_value > 0) {
        updateRecordToBackend(classType, type, data_value);
    } else {
        alert("請輸入正數")
    }
}
// 更新紀錄的函數
function updateRecordToBackend(newClassType, newType, newDataValue) {
    let footprint = calculateFootprint(newType,newDataValue);
    let record = {
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
        let thisIcon;
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
    let recordIndex = records.findIndex(record => record.recordId === currentInfoWindowRecord.recordId);
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
