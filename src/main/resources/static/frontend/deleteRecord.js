//刪除多筆資料
function deleteMultiRecord(){
    let result = confirm("確定要刪除目前資料嗎？");
    if (result) {
        let selectedCheckboxes = $('input[type=checkbox].custom-checkbox:checked');
        let selectedRecordIds = [];
        selectedCheckboxes.each(function() {
             let recordIdString = $(this).closest('div').attr('id').split('_')[1];
             let recordId = parseInt(recordIdString, 10);
             deleteRecord(recordId);
             document.getElementById("record_" + recordId).remove();
             selectedRecordIds.push(recordId);
        });
        if (selectedRecordIds.length > 0) {
            //console.log('要刪除的記錄 ID：', selectedRecordIds);
            let nowType=$("#category option:selected").text();
            showNewChart(records,nowType);
            alert("刪除成功!!");
        } else {
            alert('沒有選中任何記錄');
        }
        console.log(records);
    } else{
        console.log("取消刪除");
    }    
}
//刪除單筆資料
function deleteSingleRecord(){
    event.preventDefault();
    let result = confirm("確定要刪除目前資料嗎？");
    if (result) {
        deleteRecord(currentInfoWindowRecord.recordId);
        $('#recordFW').css("display", "none");
        $('#routeFW').css("display", "none");
        console.log(records);
    } else{
        console.log("取消刪除");
    }
}
//透過recordId刪資料
function deleteRecord(recordId){
    records = records.filter(item => item.recordId !== recordId);//更新系統內record[]
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
    });//刪除資料庫裡的record
    let markerToDelete = markers.find(function(marker) {
        return marker.id === recordId;
    });//在Markers裡找指定Marker
    if (markerToDelete) {
        markerToDelete.infoWindow.close();
        markerToDelete.setMap(null);
        // 在 markers 移除
        let index = markers.indexOf(markerToDelete);
        if (index > -1) {
            markers.splice(index, 1);
        }
    }//刪mark
}
