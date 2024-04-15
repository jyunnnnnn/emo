//刪除多筆資料
function deleteMultiRecord(){
    let result = confirm("確定要刪除目前資料嗎？");
    if (result) {
        let selectedCheckboxes = $('input[type=checkbox].deleteCheckbox:checked');
        let selectedRecordIds = [];
        selectedCheckboxes.each(function() {
             let recordIdString = $(this).attr('id').split('_')[1];
             let recordId = parseInt(recordIdString, 10);
             deleteRecord(recordId);
             document.getElementById("record_" + recordId).remove();
             selectedRecordIds.push(recordId);
        });
        if (selectedRecordIds.length > 0) {
            $('#editRecord').css("display", "block");
            $('#saveEditRecord').css("display", "none");
            $('#deleteEditRecord').css("display", "none");
            //console.log('要刪除的記錄 ID：', selectedRecordIds);
            let nowType = $("#selectClass input[type=\"radio\"]:checked").next('label').text();

            //console.log(nowType);
            let sortedRecords = records;
            if (nowType != "全部") {
                sortedRecords = sortedRecords.filter(record => record.classType === nowType);
            }
            let startDate = dateArray[0];
            let endDate = dateArray[1];
            sortedRecords = sortedRecords.filter(record =>{
                let recordDate = new Date(record.time.split(' ')[0]); // 提取日期部分
                return recordDate >= new Date(startDate) && recordDate <= new Date(endDate);
            });
            showNewChart(records, "全部");
            sortRecordsBySelectedOption($('#selectedMethod').text());

            // 更新外面的最新紀錄
            console.log(records[records.length - 1]);
            let time = records[records.length - 1].time.split(" ");
            let icon = $('<svg>')
                .html(svgData.svgImages.recordList[records[records.length - 1].classType])
                .attr('class', 'recordListSvg');

            // 每一筆紀錄的div
            let recordDiv = $("<div>")
                .addClass('recordDiv')
                .hover(
                    function() {
                        $(this).css('background-color', categories[records[records.length - 1].classType].color);
                    },
                    function() {
                        $(this).css('background-color', 'rgba(235, 237, 239, 0.87)');
                    }
                );

            // 紀錄項目及減碳量div
            let recordElement = $("<div>")
                .css({
                    'width': '200px',
                });
            let typeDiv = $("<div>")
                .text(records[records.length - 1].type)
                .css({
                    'font-size': '20px',
                    'margin-left' : '5px'
                });
            let footprintDiv = $("<div>")
                .text(parseFloat(records[records.length - 1].footprint).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + " gCO2e")
                .css({
                    'color': '#28a745',
                    'font-size': '25px',
                    'margin-left': '5px',
                    'font-weight': 'bold'
                });
            recordElement.append(typeDiv, footprintDiv);

            // 時間div
            let timeElement = $("<div>")
                .css({
                    'text-align': 'right',
                    'align-self': 'flex-end',
                    'margin-left': '20px',
                    'margin-bottom': '5px',
                    'font-size': '12px'
                });
            let dateSpan = $("<div>")
                .text(time[0]);
            let timeSpan = $("<div>")
                .text(time[1]);
            timeElement.append(dateSpan, timeSpan);

            recordDiv.append(icon, recordElement, timeElement);
            recordDiv.attr('id', 'newest');
            $('#newestRecord').empty();
            $('#newestRecord').append(recordDiv);

            alert("刪除成功!!");
        } else {
            alert('沒有選中任何記錄');
        }
        //console.log(records);
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
        //console.log(records);
    } else{
        console.log("取消刪除");
    }
}
//透過recordId刪資料
function deleteRecord(recordId){
    let thisDelete = records.filter(item => item.recordId == recordId);
    records = records.filter(item => item.recordId !== recordId);//更新系統內record[]
    $.ajax({
        type: 'DELETE',
        url: `/eco/deleteOneRecord?recordId=${recordId}`,
        contentType: 'application/string',
        success: function(response) {
            loadAchievementObj(User.userId);
            //console.log(response); // 成功刪除時的處理邏輯
        },
        error: function(xhr, status, error) {
            console.error(error); // 刪除失敗時的處理邏輯
        }
    });//刪除資料庫裡的record
    let markerToDelete = markers.find(function(marker) {
        return marker.id === recordId; //在Markers裡找指定Marker
    });

    if (markerToDelete) {
        markerToDelete.infoWindow.close();
        markerToDelete.setMap(null);
        //刪除時刪掉打開的路線
        removeDirections();
        clearMapLines();
        // 在 markers 移除
        let index = markers.indexOf(markerToDelete);
        if (index > -1) {
            markers.splice(index, 1);
        }
    }//刪mark
    showTotalFP();
}
