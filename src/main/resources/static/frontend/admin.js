let parsedData;
let svgData;
$(document).ready(function () {
    $.ajax({
        url: '/api/GetAllRecordJson',
        method: 'GET',
        success: function (data) {
            // 處理成功時的邏輯
            parsedData = JSON.parse(data);
            console.log(parsedData)
        },
        error: function(xhr, status, error) {
           let errorData = JSON.parse(xhr.responseText);
           let errorMessage = errorData.message;
           alert(errorMessage);
       }
    });
     $.ajax({
            url: '/api/GetAllSvgJson',
            method: 'GET',
            success: function (data) {
                // 處理成功時的邏輯
                svgData = JSON.parse(data);
                console.log(svgData);
                loadSVG();
            },
            error: function(xhr, status, error) {
               let errorData = JSON.parse(xhr.responseText);
               let errorMessage = errorData.message;
               alert(errorMessage);
           }
        });

    //選擇輸入其他類別增加輸入框
    $('#types').on('change', function() {
        var select = $('#types');
        var optionInput = $('#otherOption');
        if (select.val() === 'addNew') {
        optionInput.css('display', 'inline');
        } else {
        optionInput.css('display', 'none');
        }
    });
    $('#types2').on('change', function() {
        var select = $('#types2');
        var optionInput = $('#otherOption2');
        if (select.val() === 'addNew') {
        optionInput.css('display', 'inline');
        } else {
        optionInput.css('display', 'none');
        }
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
