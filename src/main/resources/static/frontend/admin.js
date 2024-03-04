let svgData;
let categories = [];//類別大屬性有哪些

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
    $.ajax({
           url: '/api/GetAllSvgJson',
           method: 'GET',
           success: function (data) {
               // 處理成功時的邏輯
               parsedData = JSON.parse(data);
               //調用函式
               setSvgData(parsedData);
           },
           error: function(xhr, status, error) {
              let errorData = JSON.parse(xhr.responseText);
              let errorMessage = errorData.message;
              alert(errorMessage);
          }
    });
//切換顯示的區塊
    $('#options').on('change', function() {
        let selectedOption = $(this).val();

        $('.content-block').addClass('d-none'); // 隱藏所有區塊
        $('#' + selectedOption).removeClass('d-none'); // 顯示所選擇的區塊
    });
});

function setSvgData(parsedData) {
    svgData=parsedData;
    console.log(svgData);
}
//讀取設定檔的資料到頁面
function setData(parsedData){
//讀取大類別有哪些  ex.['daily', 'transportation']
    for (let category in parsedData) {
        if (parsedData.hasOwnProperty(category) && typeof parsedData[category] === "object" && parsedData[category].hasOwnProperty('content')) {
            categories.push(category);
        }
    }
    //新增所有大類別的option
    for(let i =0; i<categories.length; i++){
        let category = '`<option value="'+categories[i]+'">'+categories[i]+'</option>';
        category += '`<option value="'+categories[i]+'-color">'+categories[i]+'-color</option>';
        category += '`<option value="'+categories[i]+'-base">'+categories[i]+'-base</option>';
        category += '`<option value="'+categories[i]+'-units">'+categories[i]+'-units</option>';
        $('#options').append(category);
    }
    for(let i =0; i<categories.length; i++){
     //新增整塊頁面
         let card ;
         if(categories[i] == "daily"){
           card = '<div id="'+categories[i]+'" class="content-block"><br>';
            card +='<div class="form-group">'+
                             '<label>index</label>'+
                             '<select name="types" id="types'+i+'">'+
                             '</select>'+
                         '</div> <br>'+
                         '<div class="form-group">'+
                             '<label>name</label>'+
                             '<input type="text" id="name'+i+'" >'+
                         '</div> <br>'+
                          '<div class="option-set d-lg-flex">'+
                              '<div class="form-group">'+
                                  '<label>大</label>'+
                                  '<input type="text" id="big">'+
                              '</div><br>'+
                              '<div class="form-group">'+
                                  '<label>中</label>'+
                                  '<input type="text" id="mid">'+
                              '</div><br>'+
                              '<div class="form-group">'+
                                 '<label>小</label>'+
                                  '<input type="text" id="small">'+
                              '</div>'+
                          '</div><br>'+
                         '<div class="form-group">'+
                             '<label>coefficient</label>'+
                             '<input type="text" id="coefficient'+i+'">'+
                         '</div><br>'+
                          '<div class="form-group">'+
                             '<label>units</label>'+
                             '<select name="types" id="units'+i+'">'+
                             '</select>'+
                         '</div> <br>'+
                       '<div class="form-group">'+
                           '<label>baseline</label>'+
                           '<select name="types" id="baseline'+i+'">'+
                           '</select>'+
                       '</div> <br>'+
                         '</div>';
                //初始化
               $('#manage-container').append(card);

                $('#name'+i).val(parsedData[categories[i]].content[0].name);
                $('#big').val(parsedData[categories[i]].content[0].option.大);
                $('#mid').val(parsedData[categories[i]].content[0].option.中);
                $('#small').val(parsedData[categories[i]].content[0].option.小);
                $('#coefficient'+i).val(parsedData[categories[i]].content[0].coefficient);
                $('#unit'+i).val(parsedData[categories[i]].content[0].unit);
                $('#baseline'+i).val(parsedData[categories[i]].content[0].baseline);
         }else{
            card = '<div id="'+categories[i]+'" class="content-block d-none"><br>';
            card +='<div class="form-group">'+
                        '<label>index</label>'+
                        '<select name="types" id="types'+i+'">'+
                        '</select>'+
                    '</div> <br>'+
                    '<div class="form-group">'+
                        '<label>name</label>'+
                        '<input type="text" id="name'+i+'" >'+
                    '</div> <br>'+

                    '<div class="form-group">'+
                        '<label>coefficient</label>'+
                        '<input type="text" id="coefficient'+i+'">'+
                    '</div><br>'+
                          '<div class="form-group">'+
                             '<label>units</label>'+
                             '<select name="types" id="units'+i+'">'+
                             '</select>'+
                         '</div> <br>'+
                      '<div class="form-group">'+
                          '<label>baseline</label>'+
                          '<select name="types" id="baseline'+i+'">'+
                          '</select>'+
                      '</div> <br>'+
                    '</div>';
             $('#manage-container').append(card);
              $('#name'+i).val(parsedData[categories[i]].content[0].name);
              $('#coefficient'+i).val(parsedData[categories[i]].content[0].coefficient);
              $('#unit'+i).val(parsedData[categories[i]].content[0].unit);
              $('#baseline'+i).val(parsedData[categories[i]].content[0].baseline);
         }

        for(let j =0;j< parsedData[categories[i]].content.length;j++){
            //新增 content 的下拉選項
            let option = '`<option value="'+parsedData[categories[i]].content[j].index+'">'+parsedData[categories[i]].content[j].index+'</option>';
            $('#types'+i).append(option);
        }
        //新增 base區塊
        let base = parsedData[categories[i]].base;
        let baseLength = Object.keys(base).length;
        let baseKeys = Object.keys(base);
        console.log("base 的長度為：" + baseLength);
        let baseCard = '<div id="'+categories[i]+'-base" class="content-block d-none"><br>';
        for(let m =0;m< baseLength;m++){
           baseCard += '<div class="form-group">'+
                      '<label>'+baseKeys[m]+'</label>'+
                            '<input type="text" id="'+baseKeys[m]+'">'+
                           ' </div> <br>';
        }
        baseCard += ' </div>';
        $('#manage-container').append(baseCard);
        //base初始化
        for(let m = 0;m< baseLength; m++){
            $('#'+baseKeys[m]).val(parsedData[categories[i]].base[baseKeys[m]]);
        }
        //把baseline變成選項
        for(let m = 0;m< baseLength; m++){
          let option = '`<option value="'+baseKeys[m]+'">'+baseKeys[m]+'</option>';
            $('#baseline'+i).append(option);
        }
        //新增color區塊
         let colorCard = '<div id="'+categories[i]+'-color" class="content-block d-none"><br>';
          colorCard += '<div class="form-group">'+
                       '<label>color</label>'+
                             '<input type="text" id="color'+i+'">'+
                        ' </div> <br> </div> ';
         $('#manage-container').append(colorCard);
         $('#color'+i).val(parsedData[categories[i]].color);
        //新增units區塊
        let newUnitId=[];
        let units = parsedData[categories[i]].units;
        let unitsLength = Object.keys(units).length;
        let unitsKeys = Object.keys(units);
        console.log("base 的長度為：" + unitsLength);
        let unitsCard = '<div id="'+categories[i]+'-units" class="content-block d-none"><br>';
        for(let m =0;m< unitsLength;m++){
           newUnitId[m] = unitsKeys[m].replace(/\//g, '_'); //替換掉底線不然id讀不到
           console.log("0",newUnitId[m]);
           unitsCard += '<div class="form-group">'+
                      '<label>'+unitsKeys[m]+'</label>'+
                            '<input type="text" id="'+newUnitId[m]+'">'+
                           ' </div> <br>';
        }
        unitsCard += ' </div>';
        $('#manage-container').append(unitsCard);
        //units初始化
        for(let m = 0;m< unitsLength; m++){
//            console.log("0",unitsKeys[m]);
            console.log("1",parsedData[categories[i]].units);
            console.log("2",parsedData[categories[i]].units[unitsKeys[m]]);
            $('#'+newUnitId[m]).val(parsedData[categories[i]].units[unitsKeys[m]]);
        }
        //把units變成選項
        for(let m = 0;m< unitsLength; m++){
          let option = '`<option value="'+unitsKeys[m]+'">'+unitsKeys[m]+'</option>';
            $('#units'+i).append(option);
        }
    }

    //所有types開頭都會觸發 在創立元素後使用
    $('[id^=types]').on('change', function() {
         // 獲取所選選項的值
        const selectedIndex = $(this).val();
        console.log("selectedIndex",selectedIndex)
        // 根據所選選項的值更新表格的值
        updateTableValues(selectedIndex);
    });
}


//切換的時候更改選項的值
function updateTableValues(selectedIndex) {
    let targetCategory;
    let targetNum;
    //確認哪個大類別發生改動
    for(let i = 0;i<categories.length;i++){
         if (parsedData[categories[i]].content.some(content => content.index === selectedIndex)) {
             targetCategory = categories[i];
             targetNum = i;
             console.log(selectedIndex + " 屬於 'daily'");
             console.log("targetCategory", targetCategory);
             console.log("targetNum", targetNum);
         }
    }
//     console.log("0",parsedData);
    let index = parsedData[targetCategory].content.findIndex(content => content.index === selectedIndex);
    if (index !== -1) {
        // 找到了
        console.log("Index of selectedContent:", index);
        // 根據索引位置更新表格的值
         $('#name'+targetNum).val(parsedData[targetCategory].content[index].name);
         $('#coefficient'+targetNum).val(parsedData[targetCategory].content[index].coefficient);
         $('#unit'+targetNum).val(parsedData[targetCategory].content[index].unit);
         $('#baseline'+targetNum).val(parsedData[targetCategory].content[index].baseline);
         //只有daily才有的
         if(targetCategory == "daily"){
             $('#big').val(parsedData[targetCategory].content[index].option.大);
             $('#mid').val(parsedData[targetCategory].content[index].option.中);
             $('#small').val(parsedData[targetCategory].content[index].option.小);
         }
    } else {
        console.log("selectedContent not found in parsedData.daily.content");
    }
}


