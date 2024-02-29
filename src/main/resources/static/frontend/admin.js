let parsedData;
$(document).ready(function () {
    $.ajax({
        url: '/api/GetAllRecordJson',
        method: 'GET',
        success: function (data) {
            // 處理成功時的邏輯
            parsedData = JSON.parse(data);
            console.log(parsedData);
            //調用函式
            setData(parsedData);
        },
        error: function(xhr, status, error) {
           let errorData = JSON.parse(xhr.responseText);
           let errorMessage = errorData.message;
           alert(errorMessage);
       }
    });
    //daily types改變時下方值改變
    $('#types').on('change', function() {
        // 獲取所選選項的值
        const selectedIndex = $(this).val();
        // 根據所選選項的值更新表格的值
        updateTableValues(selectedIndex);
    });
    //traffic types改變時下方值改變
    $('#types2').on('change', function() {
        // 獲取所選選項的值
        const selectedIndex = $(this).val();
        // 根據所選選項的值更新表格的值
        updateTableValues2(selectedIndex);
    });

    $('#options').on('change', function() {

        if ($('#options').val() === 'daily') {
            $('#daily').removeClass('d-none');
            $('#dailybase').addClass('d-none');
            $('#traffic').addClass('d-none');
            $('#trafficbase').addClass('d-none');
        } else if ($('#options').val() === 'daily-base') {
            $('#daily').addClass('d-none');
            $('#dailybase').removeClass('d-none');
            $('#traffic').addClass('d-none');
            $('#trafficbase').addClass('d-none');
         } else if  ($('#options').val() === 'traffic') {
            $('#daily').addClass('d-none');
            $('#dailybase').addClass('d-none');
            $('#traffic').removeClass('d-none');
            $('#trafficbase').addClass('d-none');
        }else if  ($('#options').val() === 'traffic-base') {
            $('#daily').addClass('d-none');
            $('#dailybase').addClass('d-none');
            $('#traffic').addClass('d-none');
            $('#trafficbase').removeClass('d-none');
        }
    });
});
//重寫
$(document).ready(function() {
  $('#addNewContent').click(function() {
    let newContent = {
      index: $('#index').val(),
      name: $('#name').val(),
      coefficient: $('#coefficient').val(),
      unit: $('#unit').val(),
      option: {
          "大": $('#option1').val(),
          "中": $('#option2').val(),
          "小": $('#option3').val()
      },
      baseline: $('#baseline').val()

    };
    $.ajax({
        type: 'PUT',
        url: '/api/addNewContent?index='+ newContent.index, // 替換成適當的後端路由
        contentType: 'application/json',
        data: JSON.stringify(newContent),
        success: function(response) {
            console.log('新增成功:', response);
        },
        error: function(xhr, status, error) {
            console.error('新增失敗:', error);
        }
    });
    console.log(newContent);
  });
});
//讀取設定檔的資料到頁面
function setData(parsedData){
//daily
    for(let i=0; i <parsedData.daily.content.length ; i++){
        let option = '`<option value="'+parsedData.daily.content[i].index+'">'+parsedData.daily.content[i].index+'</option>';
        $('#types').append(option);
    }
    //初始化為第一個選項的值
    $('#name1').val(parsedData.daily.content[0].name);
    $('#big').val(parsedData.daily.content[0].option.大);
    $('#mid').val(parsedData.daily.content[0].option.中);
    $('#small').val(parsedData.daily.content[0].option.小);
    $('#coefficient1').val(parsedData.daily.content[0].coefficient);
    $('#unit1').val(parsedData.daily.content[0].unit);
    $('#baseline1').val(parsedData.daily.content[0].baseline);
//daily base
    $('#paper').val(parsedData.daily.base.paper);
    $('#plastic').val(parsedData.daily.base.plastic);
//traffic
    for(let i=0; i <parsedData.transportation.content.length ; i++){
        let option = '`<option value="'+parsedData.transportation.content[i].index+'">'+parsedData.transportation.content[i].index+'</option>';
        $('#types2').append(option);
    }
      //初始化為第一個選項的值
      $('#name').val(parsedData.transportation.content[0].name);
      $('#coefficient').val(parsedData.transportation.content[0].coefficient);
      $('#unit').val(parsedData.transportation.content[0].unit);
      $('#baseline').val(parsedData.transportation.content[0].baseline);
//traffic base
        $('#car').val(parsedData.transportation.base.car);
        $('#scooter').val(parsedData.transportation.base.scooter);
}

// 更新daily表格的值
function updateTableValues(selectedIndex) {
    // 根據所選選項的值從 parsedData 中獲取相應的內容
    console.log(parsedData);
    const index = parsedData.daily.content.findIndex(content => content.index === selectedIndex);
    if (index !== -1) {
        // 找到了
        console.log("Index of selectedContent:", index);
        // 根據索引位置更新表格的值
         $('#name1').val(parsedData.daily.content[index].name);
         $('#big').val(parsedData.daily.content[index].option.大);
         $('#mid').val(parsedData.daily.content[index].option.中);
         $('#small').val(parsedData.daily.content[index].option.小);
         $('#coefficient1').val(parsedData.daily.content[index].coefficient);
         $('#unit1').val(parsedData.daily.content[index].unit);
         $('#baseline1').val(parsedData.daily.content[index].baseline);
    } else {
        console.log("selectedContent not found in parsedData.daily.content");
    }
}
// 更新traffic表格的值
function updateTableValues2(selectedIndex) {
    // 根據所選選項的值從 parsedData 中獲取相應的內容
    console.log(parsedData);
    const index = parsedData.transportation.content.findIndex(content => content.index === selectedIndex);
    if (index !== -1) {
        // 找到了
        console.log("Index of selectedContent:", index);
        // 根據索引位置更新表格的值
      $('#name').val(parsedData.transportation.content[index].name);
      $('#coefficient').val(parsedData.transportation.content[index].coefficient);
      $('#unit').val(parsedData.transportation.content[index].unit);
      $('#baseline').val(parsedData.transportation.content[index].baseline);
    } else {
        console.log("selectedContent not found in parsedData.daily.content");
    }
}

