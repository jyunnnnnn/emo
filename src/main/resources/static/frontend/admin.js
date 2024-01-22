// 打開管理員介面
function showFPdata() {
    var thisData = FootprintData;
    //console.log(thisData);
    var container = document.getElementById("adminData");
    container.innerHTML = ""; // 清空容器內容
    container.style.overflowY = "scroll";
    container.style.maxHeight = "150px";
    for (var i = 0; i < thisData.length; i++) {
        // 勾選框
        var checkbox = document.createElement('label');
        checkbox.className = 'checkbox-container';
        var input = document.createElement('input');
        input.type = 'checkbox';
        input.className = 'custom-checkbox';
        input.id = thisData[i].fpid;
        var span = document.createElement('span');
        span.className = 'checkmark';
        checkbox.appendChild(input);
        checkbox.appendChild(span);
        checkbox.style.marginRight = "3px";
        span.style.top = "5px";
        checkbox.style.display = "none";
        // 創建新的<div>元素
        var footprintDiv = document.createElement("div");
        footprintDiv.style.width = "200px";
        footprintDiv.style.background = "white";
        footprintDiv.style.display = "flex";
        footprintDiv.style.alignItems = "center";

        // 創建新的 <input> 元素
        var typeInput = document.createElement("input");
        typeInput.type = 'text';
        typeInput.value = thisData[i].type;
        typeInput.className = 'inputFP';
        typeInput.disabled = true;

        var footprintInput = document.createElement("input");
        footprintInput.type = 'text';
        footprintInput.value = thisData[i].coefficient;
        footprintInput.className = 'inputFP';
        footprintInput.disabled = true;
        footprintInput.id = thisData[i].fpid;

        footprintDiv.appendChild(checkbox);
        footprintDiv.appendChild(typeInput);
        footprintDiv.appendChild(footprintInput);
        container.appendChild(footprintDiv);
    }
    $('#saveFP').click(updateAllFootprint);//一次修改Footprint
    $('#deleteFP').click(deleteSelectedFootprints);
}
//修改footprint
function updateAllFootprint() {
    var footprints = $('.inputFP');
    //console.log(footprints);
    footprints.each(function(index) {
        var type = footprints.eq(index).val();
        var coefficient = footprints.eq(index + 1).val();
        var id = footprints.eq(index + 1).attr('id');

        if (index % 2 === 0) {
            // 使用 AJAX 送出 POST 請求給後端
            $.ajax({
                type: 'PUT',
                url: `/api/updateFootprint?FPId=${id}&coefficient=${coefficient}`,
                contentType: 'application/json',
                success: function (response) {
                    // 成功處理回傳的資料
                    //console.log('FP更新成功:', response);
                    loadFootprintData();
                },
                error: function (xhr, status, error) {
                    // 處理錯誤
                    //console.error('FP更新失敗:', error);
                }
            });
        }
    });
}
//刪除footprint
function deleteSelectedFootprints() {
    $('.custom-checkbox').each(function(index, checkbox) {
        if (checkbox.checked) {
            var footprintID = $(checkbox).attr('id');
            // 將收集到的被勾選的 ID 發送到後端進行刪除操作
            console.log(footprintID);
            $.ajax({
                type: 'DELETE',
                url: `/api/deleteOneFootprint?FPId=${footprintID}`, // 替換成適當的後端路由
                contentType: 'application/json',
                success: function(response) {
                    // 刪除成功，處理回應
                    console.log('成功刪除:', response);
                    // 重新載入或更新資料
                    // 例如，重新呼叫 showFPdata() 或更新資料列表
                    loadFootprintData();
                },
                error: function(xhr, status, error) {
                    // 處理錯誤
                    console.error('刪除失敗:', error);
                }
            });
        }
    });
}