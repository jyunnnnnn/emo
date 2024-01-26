function deleteMultiRecord(){
        var selectedCheckboxes = $('input[type=checkbox].custom-checkbox:checked');
        var selectedRecordIds = [];
        selectedCheckboxes.each(function() {
             var recordIdString = $(this).closest('div').attr('id').split('_')[1];
             var recordId = parseInt(recordIdString, 10);
             deleteRecordInArray(recordId);//刪除records裡的
             deleteRecordToBackend(recordId);//刪除資料庫裡的
             deleteMarker(recordId);
             document.getElementById("record_" + recordId).remove();
             selectedRecordIds.push(recordId);
        });
        if (selectedRecordIds.length > 0) {
            //console.log('要刪除的記錄 ID：', selectedRecordIds);
            var nowType=$("#category option:selected").text();
            showNewChart(records,nowType);
            alert("刪除成功!!");
        } else {
            alert('沒有選中任何記錄');
        }
}
//刪除資料
function deleteRecord(){
    //我先用confirm做:0
    event.preventDefault();
    let result = confirm("確定要刪除目前資料嗎？");
    if (result) {
        deleteRecordInArray(currentInfoWindowRecord.recordId);//更新record[]
        deleteRecordToBackend(currentInfoWindowRecord.recordId);
        deleteMarker(currentInfoWindowRecord.recordId);
        //console.log(records);
        $('recordFW').css("display", "none");
        $('routeFW').css("display", "none");
    } else{
        console.log("取消刪除");
    }
}

//從records刪資料
function deleteRecordInArray(recordId){
    records = records.filter(item => item.recordId !== recordId);

}

//從後端刪資料
function deleteRecordToBackend(recordId) {
    //console.log(records);
    $.ajax({
        type: 'DELETE',
        url: `/api/deleteOneRecord?recordId=${recordId}`,
        contentType: 'application/string',
        success: function(response) {
            //console.log(response); // 成功刪除時的處理邏輯
        },
        error: function(xhr, status, error) {
            console.error(error); // 刪除失敗時的處理邏輯
        }
    });
}

//刪mark
function deleteMarker(markerId){
    //在Markers裡找指定Marker
    var markerToDelete = markers.find(function(marker) {
        return marker.id === markerId;
    });
    if (markerToDelete) {

        markerToDelete.infoWindow.close();
        markerToDelete.setMap(null);

        // 在 markers 移除
        var index = markers.indexOf(markerToDelete);
        if (index > -1) {
            markers.splice(index, 1);
        }
    }
}

