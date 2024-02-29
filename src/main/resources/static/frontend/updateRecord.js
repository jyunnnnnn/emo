// 修改記錄按鈕事件處理 
function updateRecord(event, updateFW){
    event.preventDefault();
    let classType;
    let type;
    let data_value;
    if(updateFW === "traffic"){
        classType = "交通";
        type = $('#trafficType option:selected').text();
        data_value = $('#kilometer').val();
    } else {
        classType = $('input[name="typeRadio"]:checked').next('.radio-tile').find('.radio-label').text();
        type =  $('#type option:selected').text();
        data_value = $('#gram').val();
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
    //console.log(footprint,newType,newDataValue)
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
    newContent.footprint = parseFloat(newContent.footprint, 10).toFixed(3) *1000/1000;
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
        if (newContent.classType === "交通") {
            thisIcon = '/frontend/img/traffic.ico';
       } else if (newContent.classType === "生活用品") {
            thisIcon = '/frontend/img/生活用品.svg';
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
