let parsedData;
let svgData;
let categories = [];//類別大屬性有哪些
let isAdd = true;   //false=修改 true=新增
let selectedIndex;  //選擇的index名稱 ex daily的cup tableware
let selectedOption; //選擇顯示的是哪個區塊 ex: daily, daily-base
let sendBasicData = []; //  要傳送的一般物件
let sendSvgData = [];   //  要傳送的svg物件
let sendBase = [];   //  要傳送的新增的base物件
let sendColor = [];   //  要傳送的新增的color物件


$(document).ready(function () {
    $("#basic-setting, #svg-setting").click(function() {
        toggleButtons();
    });
    $("#save").click(function() {
        saveData();
    });
    $("#delete").click(function() {
        deleteData();
    });
    $("#complete").click(function() {
    //按鈕回復原本設定
      $('#add, #save').removeClass("d-none");
      $('#complete').addClass("d-none");
      $('.base-group input[type="checkbox"]').addClass('d-none');
      $('.base-group2').css('margin-left', '0');
      $('.base-group input[type="checkbox"]').prop('checked', false);
      checkDelete = 0;
    });
    $.ajax({
        url: '/config/GetAllRecordJson',
        method: 'GET',
        success: function (data) {
            // 處理成功時的邏輯
            parsedData = JSON.parse(data);
            console.log("parsed Data",parsedData);
            //調用函式

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
               console.log("SVG data", svgData);
               //調用函式
                setData(parsedData, svgData);
               setSvgData(svgData);
           },
           error: function(xhr, status, error) {
              let errorData = JSON.parse(xhr.responseText);
              let errorMessage = errorData.message;
              alert(errorMessage);
          }
    });
    $("#add").click(function() {
    //  切換按鈕顯示的新增或修改
//        console.log("isADd",isAdd);
        if(isAdd){
            $(this).text("修改項目");
            $('#save').text("新增");
            $('#delete').prop('disabled', true);
            if(isSvgSetting){
                //svg原本的消失
                $('.svg-group').addClass("d-none");
                //改成輸入框
                let svgInputCard = '<div class="addSvg-group"><div class="form-group">'+
                       '<label>SVG名稱</label>'+
                       '<input type="text" id="svgName">'+
                       ' </div> <br>';
                svgInputCard += '<div class="form-group">'+
                       '<label>SVG</label>'+
                       '<input type="text" id="svgContent">'+
                       '</div> <br></div>';
                $('#manage-container').append(svgInputCard);
            }else{
                for(let i =0; i<categories.length; i++){
                //大類別清空
                    if(categories[i] == "transportation"){
                        $('#icon'+i).val("");
                        $('#icon-svgDisplay'+i).html("");
                        $('#hover'+i).val("");
                        $('#hover-svgDisplay'+i).html("");
                        $('#marker'+i).val("");
                        $('#marker-svgDisplay'+i).html("");
                    }else{
                        $('#big').val("");
                        $('#mid').val("");
                        $('#small').val("");
                    }
                    $('#recordList'+i).val("");
                    $('#recordList-svgDisplay'+i).html("");
                    $('#name'+i).val("");
                    $('#coefficient'+i).val("");
                    $('#description'+i).val("");
//                    $('.icon-group span, .recordList-group span, .marker-group span').css('margin-left', '0');

                    //index選單改成輸入框
                    $('#types'+i).addClass("d-none");
                    let inputCard =  '<input type="text" id="newTypes'+i+'" >';
                    $('#types'+i).parent().append(inputCard);
                    $('#newTypes'+i).attr('placeholder', '請輸入新項目的英文');
                    //base原本的消失
                    $('.base-group2').addClass("d-none");
                    //改成輸入框
                    inputCard = '<div class="addBase-group2"><div class="addBase-group">'+
                              '<label>base名稱</label>'+
                              '<input type="text" id="'+categories[i]+'-baseName">'+
                              ' </div> <br>';
                    inputCard += '<div class="addBase-group">'+
                              '<label>數值</label>'+
                              '<input type="text" id="'+categories[i]+'-baseNumber">'+
                              '</div> <br></div>';
                    $('#'+categories[i]+"-base").append(inputCard);
                }
            }
        }else{
            $(this).text("新增項目");
            $('#save').text("儲存變更");
             $('#delete').prop('disabled', false);
             //切換成修改模式
                for(let i =0; i<categories.length; i++){
                //恢復原本預設數據
                    if(categories[i] == "transportation"){
                        let firstIndex = parsedData[categories[i]].content[0].index;
                        let firstName = parsedData[categories[i]].content[0].name;
                        let temp = firstIndex +"Icon";
                        $('#icon'+i).val(svgData.svgImages[categories[i]][temp]);
                        $('#icon-svgDisplay'+i).html(svgData.svgImages[categories[i]][temp]);
                        temp = firstIndex +"Hover";
                        $('#hover'+i).val(svgData.svgImages[categories[i]][temp]);
                        $('#hover-svgDisplay'+i).html(svgData.svgImages[categories[i]][temp]);
                        $('#recordList'+i).val(svgData.svgImages.recordList[firstName]);
                        $('#recordList-svgDisplay'+i).html(svgData.svgImages.recordList[firstName]);
                        $('#marker'+i).val(svgData.svgImages.marker[firstName]);
                        $('#marker-svgDisplay'+i).html(svgData.svgImages.marker[firstName]);
                    }else{
                        $('#big').val(parsedData[categories[i]].content[0].option.大);
                        $('#mid').val(parsedData[categories[i]].content[0].option.中);
                        $('#small').val(parsedData[categories[i]].content[0].option.小);
                        $('#recordList'+i).val(svgData.svgImages.recordList.環保杯);
                        $('#recordList-svgDisplay'+i).html(svgData.svgImages.recordList.環保杯);
                    }
                    $('#types'+i).val(parsedData[categories[i]].content[0].index);
                    $('#name'+i).val(parsedData[categories[i]].content[0].name);
                    $('#description'+i).val(parsedData[categories[i]].content[0].description);
                    $('#coefficient'+i).val(parsedData[categories[i]].content[0].coefficient);
                    $('#units'+i).val(parsedData[categories[i]].content[0].unit);
                    //console.log("unit", parsedData[categories[i]].content[0].unit);
//                    $('.icon-group span, .recordList-group span, .marker-group span').css('margin-left', '10');
                    $('#baseline'+i).val(parsedData[categories[i]].content[0].baseline);
                    //index選單改回選單
                    $('#newTypes'+i).remove();
                    $('#types'+i).removeClass("d-none");
                    //恢復base
                    $('.base-group2').removeClass("d-none");
                    $('.addBase-group2').remove();
                }
                //恢復svg
                $('.svg-group').removeClass("d-none");
                $('.addSvg-group').remove();
        }

        isAdd = !isAdd;
    });

});
//讀取svg設定檔的資料到頁面
function setSvgData(svgData) {
    //新增svg類別的選項
    let optionCard = ' <select name="options" id="svg-options" class="d-none"></select>';
    $('#manage-container').append(optionCard);
    const svgIndex = Object.keys(svgData.svgImages);//ex: daily transportation recordList
    //新增所有svg大類別的option
    for(let i =0; i<svgIndex.length; i++){
        let svgIndexCard = '`<option value="svg-'+svgIndex[i]+'">'+svgIndex[i]+'</option>';
        $('#svg-options').append(svgIndexCard);
    }
    //切換顯示的區塊
    $('#svg-options').on('change', function() {
        let selectedOption = $(this).val();

        $('.svg-block').addClass('d-none'); // 隱藏所有區塊
        $('#' + selectedOption).removeClass('d-none'); // 顯示所選擇的區塊
    });
    for(let i =0; i<svgIndex.length; i++){
     //新增整塊頁面
        let svgCategoryLength = Object.keys(svgData.svgImages[svgIndex[i]]).length;
        let svgIndex2 = Object.keys(svgData.svgImages[svgIndex[i]]);
        let svgCard = "";
        svgCard = '<div id="svg-'+svgIndex[i]+'" class="svg-block d-none"><br><div class="svg-group">';

        for(let j =0;j< svgCategoryLength; j++){
            //console.log("svgIndex2",svgIndex2[j]);
            svgCard += '<div class="form-group"> '+svgData.svgImages[svgIndex[i]][svgIndex2[j]]+
                    ' <label>'+svgIndex2[j]+'</label>'+
                     //多一個+i因為和svg裡面的id如果一樣會衝突
                    '<input type="text" class="svg-input" id="'+svgIndex2[j]+i+'" >'+
                    '</div> <br>';
        }
        svgCard += '</div></div>';
        $('#manage-container').append(svgCard);
        //初始化
        //$('#dailyIcon').val(svgData.svgImages.daily.dailyIcon);
        for(let j =0;j< svgCategoryLength; j++){
//            console.log("j",j);
//             console.log("svgIndex2",svgIndex2[j]);
//            console.log("svg值",svgData.svgImages[svgIndex[i]][svgIndex2[j]]);
            $('#'+svgIndex2[j]+i).val(svgData.svgImages[svgIndex[i]][svgIndex2[j]]);
        }

     }

}
//讀取一般設定檔的資料到頁面
function setData(parsedData, svgData){
//讀取大類別有哪些  ex.['daily', 'transportation']
    for (let category in parsedData) {
        if (parsedData.hasOwnProperty(category) && typeof parsedData[category] === "object" && parsedData[category].hasOwnProperty('content')) {
            categories.push(category);
        }
    }
    //新增一般類別的選項
    let optionCard = '<select name="options" id="basic-options"></select>';
    $('#manage-container').append(optionCard);
    //新增所有大類別的option
    for(let i =0; i<categories.length; i++){
        let category = '`<option value="'+categories[i]+'">'+categories[i]+'</option>';
//        category += '`<option value="'+categories[i]+'-color">'+categories[i]+'-color</option>';
//        category += '`<option value="'+categories[i]+'-base">'+categories[i]+'-base</option>';
//        category += '`<option value="'+categories[i]+'-units">'+categories[i]+'-units</option>';
        $('#basic-options').append(category);
    }
    optionCard = '<select name="options2" id="basic-options2"></select>';
    $('#manage-container').append(optionCard);
//    for(let i =0; i<categories.length; i++){
        let category = '`<option value="content">content</option>';
        category += '`<option value="color">color</option>';
        category += '`<option value="base">base</option>';
        category += '`<option value="units">units</option>';
        category += '`<option value="svg">svg</option>';
        $('#basic-options2').append(category);
//    }
    //切換顯示的區塊
    //在這裡組合兩個選項的值 上面改成不帶類別名的選項
    $('#basic-options2, #basic-options').on('change', function() {
        selectedOption = $('#basic-options').val();//ex. daily transportaion
        selectedOption2 = $('#basic-options2').val();// ex. content color
//unit color不需要新增 禁用add按鈕
        if (selectedOption2.includes("unit")) {
            $('#add').prop('disabled', true);
             $('#delete').prop('disabled', true);
            $('#save').prop('disabled', true);
        }else if (selectedOption2.includes("color")|| selectedOption2.includes("svg")) {
             $('#add').prop('disabled', true);
             $('#delete').prop('disabled', true);
            if(!isAdd){
              $('#save').prop('disabled', true);
            }
        }else{
            $('#add').prop('disabled', false);
            $('#save').prop('disabled', false);
            $('#delete').prop('disabled', false);
        }
        $('.basic-block').addClass('d-none'); // 隱藏所有區塊
        $('#' + selectedOption+'-'+selectedOption2).removeClass('d-none'); // 顯示所選擇的區塊
    });
    for(let i =0; i<categories.length; i++){
     //新增整塊頁面
         let card ;
         if(categories[i] == "transportation"){
            card = '<div id="'+categories[i]+'-content" class="basic-block d-none"><br>';
            card +='<div class="form-group">'+
                        '<label>項目索引</label>'+
                        '<select name="types" id="types'+i+'">'+
                        '</select>'+
                    '</div> <br>'+
                    '<div class="form-group">'+
                        '<label>項目名稱</label>'+
                        '<input type="text" id="name'+i+'" >'+
                    '</div> <br>'+
                    //個別的svg
                    //icon
                     '<div class="svg-margin"><div class="icon-group"><span id=icon-svgDisplay'+i+'>'+svgData.svgImages[categories[i]].busIcon+
                      '</span><label>Icon svg</label>'+
                        '<input type="text" class="svg-input" id="icon'+i+'" >'+
                      '</div> <br>'+
                    //hover
                     '<div class="icon-group"><span id=hover-svgDisplay'+i+'>'+svgData.svgImages[categories[i]].busHover+
                      '</span><label>Hover svg</label>'+
                        '<input type="text" class="svg-input" id="hover'+i+'" >'+
                      '</div> <br>'+
                      //recordlist
                     '<div class="recordList-group"><span id=recordList-svgDisplay'+i+'>'+svgData.svgImages.recordList.公車+
                      '</span><label>RecordList svg</label>'+
                        '<input type="text" class="svg-input" id="recordList'+i+'" >'+
                      '</div> <br>'+
                    //marker
                     '<div class="marker-group"><span id=marker-svgDisplay'+i+'>'+svgData.svgImages.marker.公車+
                      '</span><label>Marker svg</label>'+
                        '<input type="text" class="svg-input" id="marker'+i+'" >'+
                      '</div> <br></div>'+

                    '<div class="form-group">'+
                      '<label>標籤顏色</label>'+
                      '<input type="color" id="color'+i+'" >'+
                    '</div> <br>'+
                   '<div class="form-group">'+
                       '<label >比較對象</label>'+
                       '<input type="text" class="description" id="description'+i+'">'+
                   '</div><br>'+
                     '<div class="form-group">'+
                         '<label>基準</label>'+
                         '<select name="types" id="baseline'+i+'">'+
                         '</select>'+
                     '</div> <br>'+
                    '<div class="form-group">'+
                        '<label>係數</label>'+
                        '<input type="text" id="coefficient'+i+'">'+
                    '</div><br>'+
                          '<div class="form-group">'+
                             '<label>計算單位</label>'+
                             '<select name="types" id="units'+i+'">'+
                             '</select>'+
                         '</div> <br>'+

                    '</div>';
             let firstIndex = parsedData[categories[i]].content[0].index;
             let firstName = parsedData[categories[i]].content[0].name;
             $('#manage-container').append(card);
             let temp = firstIndex +"Icon";
             $('#icon'+i).attr('placeholder', '此欄位長寬限制為width: 10px height: 10px');
             $('#icon'+i).val(svgData.svgImages[categories[i]][temp]);
             temp = firstIndex +"Hover";
             $('#hover'+i).val(svgData.svgImages[categories[i]][temp]);
             $('#hover'+i).attr('placeholder', '此欄位長寬限制為width: 10px height: 10px');
             $('#recordList'+i).val(svgData.svgImages.recordList[firstName]);
             $('#recordList'+i).attr('placeholder', '此欄位長寬限制為width: 20px height: 20px');
             $('#marker'+i).val(svgData.svgImages.marker[firstName]);
             $('#marker'+i).attr('placeholder', '此欄位長寬限制為width: 50px height: 50px');
         }else{
           //daily
            card = '<div id="'+categories[i]+'-content" class="basic-block"><br>';
            card +='<div class="form-group">'+
                             '<label>項目索引</label>'+
                             '<select name="types" id="types'+i+'">'+
                             '</select>'+
                         '</div> <br>'+
                         '<div class="form-group">'+
                             '<label>項目名稱</label>'+
                             '<input type="text" id="name'+i+'" >'+
                         '</div> <br>'+
                  //svg
                         '<div class="svg-margin"><div class="recordList-group"><span id=recordList-svgDisplay'+i+'>'+svgData.svgImages.recordList.環保杯+
                          '</span><label>RecordList svg</label>'+
                            '<input type="text" class="svg-input" id="recordList'+i+'" >'+
                          '</div> <br></div>'+

                        '<div class="form-group">'+
                          '<label>標籤顏色</label>'+
                          '<input type="color" id="color'+i+'" >'+
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
                               '<label >比較對象</label>'+
                               '<input type="text" class="description" id="description'+i+'">'+
                           '</div><br>'+
                       '<div class="form-group">'+
                           '<label>基準</label>'+
                           '<select name="types" id="baseline'+i+'">'+
                           '</select>'+
                       '</div> <br>'+
                         '<div class="form-group">'+
                             '<label>係數</label>'+
                             '<input type="text" id="coefficient'+i+'">'+
                         '</div><br>'+
                          '<div class="form-group">'+
                             '<label>計算單位</label>'+
                             '<select name="types" id="units'+i+'">'+
                             '</select>'+
                         '</div> <br>'+

                         '</div>';
                //初始化
                $('#manage-container').append(card);
                if (parsedData[categories[i]] && parsedData[categories[i]].content && parsedData[categories[i]].content[0] && parsedData[categories[i]].content[0].option) {
                    $('#big').val(parsedData[categories[i]].content[0].option.大);
                    $('#mid').val(parsedData[categories[i]].content[0].option.中);
                    $('#small').val(parsedData[categories[i]].content[0].option.小);
                }
                $('#recordList'+i).val(svgData.svgImages.recordList.環保杯);
                $('#recordList'+i).attr('placeholder', '此欄位長寬限制為width: 20px height: 20px');
         }
        //初始化
        $('#name'+i).val(parsedData[categories[i]].content[0].name);
        $('#name'+i).attr('placeholder', '請輸入新項目的中文');
        $('#color'+i).val(parsedData[categories[i]].content[0].color);
        //分割description字串
        let str = parsedData[categories[i]].content[0].description;
        let startIndex = str.indexOf("比較對象為") + "比較對象為".length;
        let endIndex = str.indexOf(" ", startIndex);
        let comparisonObject = str.substring(startIndex, endIndex);
//        console.log(comparisonObject);
        $('#description'+i).val(comparisonObject);
        $('#description'+i).attr('placeholder', '比較對象不可與所選基準矛盾');
        $('#coefficient'+i).val(parsedData[categories[i]].content[0].coefficient);
        $('#units'+i).val(parsedData[categories[i]].content[0].unit);
        $('#baseline'+i).val(parsedData[categories[i]].content[0].baseline);
        for(let j =0;j< parsedData[categories[i]].content.length;j++){
            //新增 content 的下拉選項
            let option = '`<option value="'+parsedData[categories[i]].content[j].index+'">'+parsedData[categories[i]].content[j].index+'</option>';
            $('#types'+i).append(option);
        }
        //新增base區塊
        let base = parsedData[categories[i]].base;
        let baseLength = Object.keys(base).length;
        let baseKeys = Object.keys(base);

        let baseCard = '<div id="'+categories[i]+'-base" class="basic-block d-none"><br><div class="base-group2">';
        for(let m =0;m< baseLength;m++){
           baseCard += '<div class="base-group">'+
                      '<input type="checkbox" class="d-none"><label>'+baseKeys[m]+'</label>'+
                            '<input type="text" id="'+baseKeys[m]+'">'+
                           ' </div><br> ';
        }
        baseCard += ' </div></div>';
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
         let colorCard = '<div id="'+categories[i]+'-color" class="basic-block d-none"><br>';
          colorCard += '<div class="form-group">'+
                       '<label>標籤顏色</label>'+
                             '<input type="color" id="'+categories[i]+'-colorInput">'+
                        ' </div> <br> </div> ';
         $('#manage-container').append(colorCard);
         $('#'+categories[i]+'-colorInput').val(parsedData[categories[i]].color);

        //新增svg區塊
         let svgs = svgData.svgImages;
         let svgCategory = Object.keys(svgs); //daily transportation recordList marker
//         console.log("svgCategory:", svgCategory);
        svgCard = '<div id="'+categories[i]+'-svg" class="basic-block d-none"><br>';
         if(categories[i] == "transportation"){
               //transportation只有recordList
               //讀出recordList svg的值
               let recordListSvg;
               let svgKeys = Object.keys(svgData.svgImages.recordList);
//               console.log("svgkey:", svgKeys);
               for(let j = 0; j<svgKeys.length; j++){
                    let checkName =  parsedData[categories[i]].name;
                    if(svgKeys[j] == checkName){ //recordList裡面的交通
                        recordListSvg = svgData.svgImages.recordList[svgKeys[j]];
                        break;
                    }
               }
               svgCard += '<div class="recordList-group">'+recordListSvg+
                          '<label>RecordList svg</label>'+
                            '<input type="text" class="svg-input" id="'+categories[i]+'-recordList">'+
                          '</div> <br>';
               svgCard += ' </div>';
               $('#manage-container').append(svgCard);
               //初始化
               $('#'+categories[i]+'-recordList').val(recordListSvg);
         }else{
          //daily...
               //讀出Icon Hover svg的值
               let icon = categories[i] + "Icon";
               let hover =  categories[i] + "Hover";
               let IconSvg = svgData.svgImages[categories[i]][icon];
               let HoverSvg = svgData.svgImages[categories[i]][hover];
//               console.log("icon:", icon);
//               console.log("iconsvg:", IconSvg);
               //讀出recordList svg的值
               let recordListSvg;
               let svgKeys = Object.keys(svgData.svgImages.recordList);
               for(let j = 0; j<svgKeys.length; j++){
                    let checkName =  parsedData[categories[i]].name;
                    if(svgKeys[j] == checkName){ //recordList裡面的生活用品
                        recordListSvg = svgData.svgImages.recordList[svgKeys[j]];
                        break;
                    }
               }
               //讀出marker svg的值
               let markerSvg;
               svgKeys = Object.keys(svgData.svgImages.marker);
//               console.log("svgkey:", svgKeys);
               for(let j = 0; j<svgKeys.length; j++){
                    let checkName =  parsedData[categories[i]].name;
                    if(svgKeys[j] == checkName){ //marker裡面的生活用品
                        markerSvg = svgData.svgImages.marker[svgKeys[j]];
                        break;
                    }
               }
               svgCard += '<div class="icon-group">'+IconSvg+
                         '<label>Icon svg</label>'+
                           '<input type="text" class="svg-input" id="'+categories[i]+'-icon">'+
                         '</div> <br>';
               svgCard += '<div class="icon-group">'+HoverSvg+
                         '<label>Hover svg</label>'+
                           '<input type="text" class="svg-input" id="'+categories[i]+'-hover">'+
                         '</div> <br>';
               svgCard += '<div class="recordList-group">'+recordListSvg+
                          '<label>RecordList svg</label>'+
                            '<input type="text" class="svg-input" id="'+categories[i]+'-recordList">'+
                          '</div> <br>';
               svgCard += '<div class="marker-group">'+markerSvg+
                         '<label>Marker svg</label>'+
                           '<input type="text" class="svg-input" id="'+categories[i]+'-marker">'+
                         '</div> <br>';
               svgCard += ' </div>';
               $('#manage-container').append(svgCard);
               //初始化
               $('#'+categories[i]+'-icon').val(IconSvg);
               $('#'+categories[i]+'-hover').val(HoverSvg);
               $('#'+categories[i]+'-recordList').val(recordListSvg);
               $('#'+categories[i]+'-marker').val(markerSvg);
         }

        //新增units區塊
        let newUnitId=[];
        let units = parsedData[categories[i]].units;
        let unitsLength = Object.keys(units).length;
        let unitsKeys = Object.keys(units);
        let unitsCard = '<div id="'+categories[i]+'-units" class="basic-block d-none"><br>';
        for(let m =0;m< unitsLength;m++){
           newUnitId[m] = unitsKeys[m].replace(/\//g, '_'); //替換掉底線不然id讀不到
           //console.log("0",newUnitId[m]);
           unitsCard += '<div class="form-group">'+
                      '<label>'+unitsKeys[m]+'</label>'+
                            '<input type="text" id="'+newUnitId[m]+'">'+
                           ' </div> <br>';
        }
        unitsCard += ' </div>';
        $('#manage-container').append(unitsCard);
        //units初始化
        for(let m = 0;m< unitsLength; m++){
            //console.log("1",parsedData[categories[i]].units);
            //console.log("2",parsedData[categories[i]].units[unitsKeys[m]]);
            $('#'+newUnitId[m]).val(parsedData[categories[i]].units[unitsKeys[m]]);
        }
        //把units變成選項
        for(let m = 0;m< unitsLength; m++){
          let option = '`<option value="'+unitsKeys[m]+'">'+unitsKeys[m]+'</option>';
            $('#units'+i).append(option);
        }
        //新增模式時的版面調整
        $("#add").click(function() {
            if(isAdd){
                $('.svg-margin').css({
                    'margin-left': '10px',
                });
            }else{
                $('.svg-margin').css({
                    'margin-left': '0px',
                });
            }
        });
    }

    //所有types開頭都會觸發 在創立元素後使用
    //index發生改變的時候
    $('[id^=types]').on('change', function() {
         // 獲取所選選項的值
        selectedIndex = $(this).val();
        //console.log("selectedIndex",selectedIndex)
        // 根據所選選項的值更新表格的值
        updateTableValues(selectedIndex);
    });
}


//切換的時候更改選項的值
function updateTableValues(selectedIndex) {
    let targetCategory;
    let targetNum;
    //確認哪個大類別(ex daily, transportation)發生改動
    for(let i = 0;i<categories.length;i++){
         if (parsedData[categories[i]].content.some(content => content.index === selectedIndex)) {
             targetCategory = categories[i];
             targetNum = i;
             //console.log(selectedIndex + " 屬於 'daily'");
             //console.log("targetCategory", targetCategory);
             //console.log("targetNum", targetNum);
         }
    }
    let index = parsedData[targetCategory].content.findIndex(content => content.index === selectedIndex);
    if (index !== -1) {
        // 找到了
        //console.log("Index of selectedContent:", index);
        // 根據索引位置更新表格的值
         $('#name'+targetNum).val(parsedData[targetCategory].content[index].name);
         $('#color'+targetNum).val(parsedData[targetCategory].content[index].color);
         let str = parsedData[targetCategory].content[index].description;
         let startIndex = str.indexOf("比較對象為") + "比較對象為".length;
         let endIndex = str.indexOf(" ", startIndex);
         let comparisonObject = str.substring(startIndex, endIndex);
         $('#description'+targetNum).val(comparisonObject);
        // $('#description'+targetNum).val(parsedData[targetCategory].content[index].description);
         $('#coefficient'+targetNum).val(parsedData[targetCategory].content[index].coefficient);
         $('#unit'+targetNum).val(parsedData[targetCategory].content[index].unit);
         $('#baseline'+targetNum).val(parsedData[targetCategory].content[index].baseline);
         let svgName = parsedData[targetCategory].content[index].name;
         $('#recordList'+targetNum).val(svgData.svgImages.recordList[svgName]); //更新input框
         $('#recordList-svgDisplay'+targetNum).html(svgData.svgImages.recordList[svgName]); //更新顯示的圖案
         //只有transportation才有的
         if(targetCategory == "transportation"){
            let svgIconName = parsedData[targetCategory].content[index].index +"Icon";
            $('#icon'+targetNum).val(svgData.svgImages[targetCategory][svgIconName]); //更新input框
            $('#icon-svgDisplay'+targetNum).html(svgData.svgImages[targetCategory][svgIconName]); //更新顯示的圖案
            let svgHoverName = parsedData[targetCategory].content[index].index +"Hover";
            $('#hover'+targetNum).val(svgData.svgImages[targetCategory][svgHoverName]); //更新input框
            $('#hover-svgDisplay'+targetNum).html(svgData.svgImages[targetCategory][svgHoverName]); //更新顯示的圖案
            let svgMarkerName = parsedData[targetCategory].content[index].name;
            $('#marker'+targetNum).val(svgData.svgImages.marker[svgMarkerName]); //更新input框
            $('#marker-svgDisplay'+targetNum).html(svgData.svgImages.marker[svgMarkerName]); //更新顯示的圖案
         }else{
             $('#big').val(parsedData[targetCategory].content[index].option.大);
             $('#mid').val(parsedData[targetCategory].content[index].option.中);
             $('#small').val(parsedData[targetCategory].content[index].option.小);
         }

    } else {
        console.log("selectedContent not found in parsedData.daily.content");
    }
}
//一般 svg按鈕切換
let isSvgSetting = false;
function toggleButtons() {
    //按下一般 button
    if (isSvgSetting) {
        //選單切換
        $('#basic-options').removeClass('d-none');
        $('#basic-options2').removeClass('d-none');
        $('#svg-options').addClass('d-none');
        $('.svgView').addClass('d-none');
        $('.svg-block').addClass('d-none'); //隱藏所有svg區塊
      //新增svg的區塊隱藏
        $('.addSvg-group').remove();
        $('#daily-content').removeClass('d-none');//恢復顯示第一個
        $('#basic-options').val('daily');
        $('#basic-options2').val('content');
        document.getElementById('svg-setting').disabled = false;
        document.getElementById('basic-setting').disabled = true;
        //恢復預設值 輸入框
        for(let i =0; i<categories.length; i++){
         //恢復原本預設數據
             if(categories[i] == "daily"){
                 $('#big').val(parsedData[categories[i]].content[0].option.大);
                 $('#mid').val(parsedData[categories[i]].content[0].option.中);
                 $('#small').val(parsedData[categories[i]].content[0].option.小);
             }
             $('#index'+i).val(parsedData[categories[i]].content[0].index);
             $('#name'+i).val(parsedData[categories[i]].content[0].name);
             $('#description'+i).val(parsedData[categories[i]].content[0].description);
             $('#coefficient'+i).val(parsedData[categories[i]].content[0].coefficient);
             $('#units'+i).val(parsedData[categories[i]].content[0].unit);
             //console.log("unit", parsedData[categories[i]].content[0].unit);
             $('#baseline'+i).val(parsedData[categories[i]].content[0].baseline);
             //index選單改回選單
             $('#newTypes'+i).remove();
             $('#types'+i).removeClass("d-none");
           //恢復base
             $('.base-group2').removeClass("d-none");
             $('.addBase-group2').remove();
         }
         //如果新增模式下切換到一般 改回按鈕
        if(!isAdd){
            $('#add').text("新增項目");
            isAdd = !isAdd;
        }
    } else {
    //按下svg button
    //選單切換
        $('#basic-options').addClass('d-none');
        $('#basic-options2').addClass('d-none');
        $('#svg-options').removeClass('d-none');
        $('.svgView').removeClass('d-none');
        $('.basic-block').addClass('d-none'); //隱藏所有一般區塊
        //恢復顯示第一個
        $('#svg-daily').removeClass('d-none');
        $('#svg-options').val('svg-daily');


        $('.svg-group').removeClass('d-none');
        document.getElementById('svg-setting').disabled = true;
        document.getElementById('basic-setting').disabled = false;
        document.getElementById('add').disabled = false;
        //新增模式下切換到svg 恢復修改模式
        if(!isAdd){
            $('#add').text("新增項目");
            isAdd = !isAdd;
        }
    }
    isSvgSetting = !isSvgSetting;
}
//按下儲存變更
function saveData(){
    if(!isSvgSetting){//是一般設定(環保項目新增、修改)
        createBasicObject(parsedData);  //創立要傳送的物件

        if(selectedOption2.includes("base")){    //傳送新增或修改的base物件
            console.log("傳送base");
            console.log("sendBase",sendBase);
            $.ajax({
                type: 'PUT',
                url: '/config/updateRecordClassBase',
                contentType: 'application/json',
                data: JSON.stringify(sendBase),
                success: function(response) {
                    alert("儲存成功!");
                },
                error: function(xhr, status, error) {
                    console.error(error); // 更新失敗時的處理邏輯
                }
            });
        }else if(selectedOption2.includes("color")){//傳送修改的color物件
            console.log("傳送color");
            console.log("sendColor",sendColor);
            $.ajax({
                type: 'PUT',
                url: '/config/updateRecordClassColor',
                contentType: 'application/json',
                data: JSON.stringify(sendColor),
                success: function(response) {
                    alert("儲存成功!");
                },
                error: function(xhr, status, error) {
                    console.error(error); // 更新失敗時的處理邏輯
                }
            });
        }else if (selectedOption2.includes("svg")){
            console.log("傳送類別的svg物件");
            console.log("sendSvgData",sendSvgData);
            $.ajax({
                type: 'PUT',
                url: '/config/updateRecord',
                contentType: 'application/json',
                data: JSON.stringify(sendSvgData),
                success: function(response) {
                    alert("儲存成功!");
                },
                error: function(xhr, status, error) {
                    console.error(error); // 更新失敗時的處理邏輯
                }
            });
        }else{  //傳送修改或新增的一般物件
            console.log("傳送一般物件");
            console.log("sendBasicData",sendBasicData);
            $.ajax({
                type: 'PUT',
                url: '/config/updateRecord',
                contentType: 'application/json',
                data: JSON.stringify(sendBasicData),
                success: function(response) {
                    alert("儲存成功!");
                },
                error: function(xhr, status, error) {
                    console.error(error); // 更新失敗時的處理邏輯
                }
            });
        }
    }else{//svg相關設定
          createSvgObject(svgData);//創立要傳送的svg物件
          console.log("傳送svg物件");
          console.log("sendSvgData",sendSvgData);
          //傳送新增或修改的svg物件
          $.ajax({
              type: 'PUT',
              url: '/api/updateSvg',
              contentType: 'application/json',
              data: JSON.stringify(sendSvgData),
              success: function(response) {
                    //console.log(response); // 成功更新時的處理邏輯
              },
              error: function(xhr, status, error) {
                  console.error(error); // 更新失敗時的處理邏輯
              }
          });
    }
    //location.reload(); //重新載入頁面
}

function createBasicObject(parsedData){
        selectedOption = $('#basic-options').val();//ex. daily transportaion
        selectedOption2 = $('#basic-options2').val();// ex. content color
        const basicCategory = Object.keys(parsedData);
        let targetCategory;
        let targetNum;
        for(let i =0;i < basicCategory.length; i++){
            if(selectedOption.includes(basicCategory[i])){
                 targetCategory = basicCategory[i];
                 targetNum = i;
            }
        }
        sendBase = {
            [targetCategory]:{
                "base": {},//要設{}不能設定null
                "name": parsedData[targetCategory].name
            }
        };
        //是base修改數據
        if(selectedOption2.includes("base") && isAdd){
            let base = parsedData[targetCategory].base;
           // let baseLength = Object.keys(base).length;
            let baseKeys = Object.keys(base);
            for(let i=0; i<baseKeys.length; i++){
                let currentBase = baseKeys[i];
                sendBase[targetCategory].base[currentBase] = $('#'+baseKeys[i]).val();
            }
        }else{
        //base新增
            let baseName = $('#'+targetCategory+'-baseName').val();
            let baseNumber = $('#'+targetCategory+'-baseNumber').val();
            sendBase = {
                [targetCategory]:{
                    "base":{
                       [baseName]: baseNumber
                    },
                    "name": parsedData[targetCategory].name
                }
            };
        }
        //修改顏色
        if(selectedOption2.includes("color")){
            sendColor =  {
                [targetCategory]:{
                    "color": $('#'+targetCategory+'-colorInput').val(),
                    "name": parsedData[targetCategory].name
                }
            };
        }
        let content;
        let svgObject;
        let index;
         if (selectedOption.includes("daily") && selectedOption2.includes("content")) {//是daily-content發生改變
             if(isAdd){ //修改
                index =  $('#types'+targetNum).val();
             }else{
                 index = $('#newTypes'+targetNum).val();
             }
            svgObject={
               "icon": $('#icon'+targetNum).val(),
               "hover": $('#hover'+targetNum).val(),
               "recordList": $('#recordList'+targetNum).val(),
               "marker": $('#marker'+targetNum).val()
            };
             //組織description
             let compare = $('#description'+targetNum).val();
             let baseCoefficient = parsedData[targetCategory].base[$('#baseline'+targetNum).val()];//base係數
             let newDescription = "比較對象為"+compare+" 當前克數×排放係數("+compare+"["+baseCoefficient+"]-"+$('#name'+targetNum).val()+"["+$('#coefficient'+targetNum).val()+"])";
             console.log("des:", newDescription);
             content= {
                "option":{
                  "大": $('#big').val(),
                  "中": $('#mid').val(),
                  "小": $('#small').val()
                },
                "index": index,
                "name": $('#name'+targetNum).val(),
                "color": $('#color'+targetNum).val(),
                "description":newDescription,
                "coefficient": $('#coefficient'+targetNum).val(),
                "unit": $('#units'+targetNum).val(),
                "baseline": $('#baseline'+targetNum).val()
            };
         } else {  //ex. transportation
              if(isAdd){ //修改
                 index = $('#types'+targetNum).val();
              }else{
                 index = $('#newTypes'+targetNum).val();
              }
               svgObject={
                 "recordList": $('#recordList'+targetNum).val()
               };
               //組織description
               let compare = $('#description'+targetNum).val();
               let baseCoefficient = parsedData[targetCategory].base[$('#baseline'+targetNum).val()];//base係數
               let newDescription = "比較對象為"+compare+" 當前公里數×排放係數("+compare+"["+baseCoefficient+"]-"+$('#name'+targetNum).val()+"["+$('#coefficient'+targetNum).val()+"])";
//               console.log("des:", newDescription);
             content = {
                "index": index,
                "name": $('#name'+targetNum).val(),
                "color": $('#color'+targetNum).val(),
                "description": newDescription,
                "coefficient": $('#coefficient'+targetNum).val(),
                "unit": $('#units'+targetNum).val(),
                "baseline": $('#baseline'+targetNum).val()
            };
         }
        sendBasicData = {
            [targetCategory]:{
                "base":parsedData[targetCategory].base,
                "color": parsedData[targetCategory].color,
                "content": content ,
                "svg": svgObject,
                "name": parsedData[targetCategory].name
            }
        };
        //大類別的svg
         if(selectedOption2.includes("svg")&&selectedOption.includes("transportation")){
            sendSvgData = {
               [targetCategory]:{
                   "recordList": $('#'+targetCategory+'-recordList').val()
               }
            };
         }else{
            sendSvgData = {
               [targetCategory]:{
                   "icon": $('#'+targetCategory+'-icon').val(),
                   "hover": $('#'+targetCategory+'-hover').val(),
                   "recordList": $('#'+targetCategory+'-recordList').val(),
                   "marker": $('#'+targetCategory+'-marker').val()
               }
            };
         }
}

function createSvgObject(svgData){
    let indexForID;
    let svgCategory = $('#svg-options').val();
    svgCategory = svgCategory.replace('svg-', ''); //現在的svg類別ex: daily transportation recordList
    let svgName = $('#svgName').val();
    let svgContent = $('#svgContent').val();
    //是修改數據
    if(isAdd){
        sendSvgData = {
            "svgImages":{
                [svgCategory]:{

                }
            }
        }
         const svgIndex = Object.keys(svgData.svgImages);//ex: daily transportation recordList
         for(let i =0;i <svgIndex.length; i++){
            if(svgCategory == svgIndex[i]){
                indexForID = i;
                break;
            }
         }
         let svgIndex2 = Object.keys(svgData.svgImages[svgCategory]);//dailyIcon dailyHover
        //把該類別全部加進來
        for(let i =0;i<svgIndex2.length ;i++){ //該類別有幾個svg
            sendSvgData.svgImages[svgCategory][svgIndex2[i]] = $('#'+svgIndex2[i]+indexForID).val();
        }
    }else{
        sendSvgData = {
            "svgImages":{
                [svgCategory]:{
                    [svgName]: svgContent
                }
            }
        }
    }
//    console.log("sendSvgData",sendSvgData);
}

//let isDelete = true;
let checkDelete = 0;
function deleteData(){
        selectedOption = $('#basic-options').val();//ex. daily transportaion
        selectedOption2 = $('#basic-options2').val();// ex. content color
        const basicCategory = Object.keys(parsedData);
        let targetCategory;
        let targetNum;
        for(let i =0;i < basicCategory.length; i++){
            if(selectedOption.includes(basicCategory[i])){
                 targetCategory = basicCategory[i];
                 targetNum = i;
            }
        }
        if(selectedOption2.includes("content")){
        //在content下詢問是否刪除該content
            let result = confirm("確定要刪除此項目嗎？");
            if(result){
                let deleteIndex= $('#types'+targetNum).val();
                //傳到後端
                console.log("要刪除的Index",deleteIndex);
                $.ajax({
                    type: 'DELETE',
                    url: '',
                    contentType: 'application/json',
                    data: JSON.stringify(deleteIndex),
                    success: function(response) {
                        alert("刪除成功!");
                    },
                    error: function(xhr, status, error) {
                        console.error(error); // 更新失敗時的處理邏輯
                    }
                });
            }
            //location.reload(); //重新載入頁面
        }else if(selectedOption2.includes("base")){ //刪除base
            if(checkDelete > 0){//第二次點擊按鈕 詢問刪除
               let selectedBase = []; let checkNum = 0;
                $(".base-group input[type='checkbox']").each(function() {
                    if ($(this).prop("checked")) {
                        checkNum += 1;
                        let baseName = $(this).siblings('input[type="text"]').attr('id');
                        selectedBase.push(baseName);
                    }
                });
                let result;
                if(checkNum > 0){
                    result = confirm("確定要刪除所選項目嗎？");
                }else{
                    alert("請先選擇項目！")
                    result = false;
                }
                if(result){//執行刪除
                //創立物件
                    let deleteBaseName = {
                        "name":selectedBase
                    };
                //傳到後端
                console.log("要刪除的base",deleteBaseName);
                $.ajax({
                    type: 'DELETE',
                    url: '',
                    contentType: 'application/json',
                    data: JSON.stringify(deleteBaseName),
                    success: function(response) {
                        alert("刪除成功!");
                    },
                    error: function(xhr, status, error) {
                        console.error(error); // 更新失敗時的處理邏輯
                    }
                });
                //畫面上更新

                }
                //回復設置
               $('#add, #save').removeClass("d-none");
               $('#complete').addClass("d-none");
               $('.base-group input[type="checkbox"]').addClass('d-none');
               $('.base-group2').css('margin-left', '0');
               $('.base-group input[type="checkbox"]').prop('checked', false);
               checkDelete = 0;
            }else{
                //改變按鈕配置
                $('#add, #save').addClass("d-none");
                $('#complete').removeClass("d-none");
                //加上checkbox
                $('.base-group input[type="checkbox"]').removeClass('d-none');
                $('.base-group2').css({
                    'margin-left': '10px'
                });
                checkDelete += 1;
            }
        }
}