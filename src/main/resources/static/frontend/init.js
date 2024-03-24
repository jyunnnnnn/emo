//let map;//地圖
let infoWindow;//圖標資訊窗
let FootprintData = [];//各環保行為資訊 物件陣列
let svgData;
let records = [];//進入系統時把該用戶的環保紀錄存進去 //改名
let User;//使用者 物件
let currentLocation;//當前經緯度
let cL; // currentLocation的經緯
let watchId; //當前位置ID
let options;//地圖精準度 更新當前位置function用
let circle; //當前位置標記 用於每5秒更新(清除、重劃)
let currentInfoWindowRecord; // 目前 infoWindow 的內容
let currentMarker;//目前Marker
let markers =[];//所有marker
let categories = {};
let recordedPositions = [];//路線紀錄(點)
let testFixPoints=[]; // 路線修正後的點點
let mapLines = [];//紀錄的路線線段們(紀錄時用[line]
let directionsDisplay;
let questionMark = {};
// 初始化Google Map
function initMap() {
    console.log("進入init");
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async function(position) {
                currentLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                 console.log("抓取位置成功 開始建構地圖");
                // 創建地圖
                const { Map } = await google.maps.importLibrary("maps");
                map = new Map(document.getElementById("map"), {
                        center: currentLocation,
                        zoom: 18,
                        minZoom: 5, // 設定最小縮放級別
                        maxZoom: 20, // 設定最大縮放級別
                        mapTypeControl: false,
                        zoomControl: false,
                        scaleControl: false,
                        streetViewControl: false,
                        rotateControl: false,
                        fullscreenControl: false,
                        //mapId: "92b0df6f653781da",
                        styles: [
                              {
                                 featureType: 'poi',
                                 elementType: 'labels',
                                 stylers: [
                                    { visibility: 'off' }
                                 ]
                              },
                              {
                                 "elementType": "geometry",
                                 "stylers": [
                                   {
                                     "color": "#1d2c4d"
                                   }
                                 ]
                               },
                               {
                                 "elementType": "labels.text.fill",
                                 "stylers": [
                                   {
                                     "color": "#8ec3b9"
                                   }
                                 ]
                               },
                               {
                                 "elementType": "labels.text.stroke",
                                 "stylers": [
                                   {
                                     "color": "#1a3646"
                                   }
                                 ]
                               },
                               {
                                 "featureType": "administrative.country",
                                 "elementType": "geometry.stroke",
                                 "stylers": [
                                   {
                                     "color": "#4b6878"
                                   }
                                 ]
                               },
                               {
                                 "featureType": "administrative.land_parcel",
                                 "elementType": "labels.text.fill",
                                 "stylers": [
                                   {
                                     "color": "#64779e"
                                   }
                                 ]
                               },
                               {
                                 "featureType": "administrative.province",
                                 "elementType": "geometry.stroke",
                                 "stylers": [
                                   {
                                     "color": "#4b6878"
                                   }
                                 ]
                               },
                               {
                                 "featureType": "landscape.man_made",
                                 "elementType": "geometry.stroke",
                                 "stylers": [
                                   {
                                     "color": "#334e87"
                                   }
                                 ]
                               },
                               {
                                 "featureType": "landscape.natural",
                                 "elementType": "geometry",
                                 "stylers": [
                                   {
                                     "color": "#023e58"
                                   }
                                 ]
                               },
                               {
                                 "featureType": "landscape.natural.landcover",
                                 "elementType": "labels.text.fill",
                                 "stylers": [
                                   {
                                     "color": "#27539b"
                                   }
                                 ]
                               },
                               {
                                 "featureType": "landscape.natural.terrain",
                                 "elementType": "labels.text.fill",
                                 "stylers": [
                                   {
                                     "color": "#1d2e49"
                                   }
                                 ]
                               },
                               {
                                 "featureType": "poi",
                                 "elementType": "geometry",
                                 "stylers": [
                                   {
                                     "color": "#283d6a"
                                   }
                                 ]
                               },
                               {
                                 "featureType": "poi",
                                 "elementType": "labels.text.fill",
                                 "stylers": [
                                   {
                                     "color": "#6f9ba5"
                                   }
                                 ]
                               },
                               {
                                 "featureType": "poi",
                                 "elementType": "labels.text.stroke",
                                 "stylers": [
                                   {
                                     "color": "#1d2c4d"
                                   }
                                 ]
                               },
                               {
                                 "featureType": "poi.park",
                                 "elementType": "geometry.fill",
                                 "stylers": [
                                   {
                                     "color": "#023e58"
                                   }
                                 ]
                               },
                               {
                                 "featureType": "poi.park",
                                 "elementType": "labels.text.fill",
                                 "stylers": [
                                   {
                                     "color": "#3C7680"
                                   }
                                 ]
                               },
                               {
                                 "featureType": "road",
                                 "elementType": "geometry",
                                 "stylers": [
                                   {
                                     "color": "#304a7d"
                                   }
                                 ]
                               },
                               {
                                 "featureType": "road",
                                 "elementType": "labels.text.fill",
                                 "stylers": [
                                   {
                                     "color": "#98a5be"
                                   }
                                 ]
                               },
                               {
                                 "featureType": "road",
                                 "elementType": "labels.text.stroke",
                                 "stylers": [
                                   {
                                     "color": "#1d2c4d"
                                   }
                                 ]
                               },
                               {
                                 "featureType": "road.highway",
                                 "elementType": "geometry",
                                 "stylers": [
                                   {
                                     "color": "#2c6675"
                                   }
                                 ]
                               },
                               {
                                 "featureType": "road.highway",
                                 "elementType": "geometry.stroke",
                                 "stylers": [
                                   {
                                     "color": "#255763"
                                   }
                                 ]
                               },
                               {
                                 "featureType": "road.highway",
                                 "elementType": "labels.text.fill",
                                 "stylers": [
                                   {
                                     "color": "#b0d5ce"
                                   }
                                 ]
                               },
                               {
                                 "featureType": "road.highway",
                                 "elementType": "labels.text.stroke",
                                 "stylers": [
                                   {
                                     "color": "#023e58"
                                   }
                                 ]
                               },
                               {
                                 "featureType": "transit",
                                 "elementType": "labels.text.fill",
                                 "stylers": [
                                   {
                                     "color": "#98a5be"
                                   }
                                 ]
                               },
                               {
                                 "featureType": "transit",
                                 "elementType": "labels.text.stroke",
                                 "stylers": [
                                   {
                                     "color": "#1d2c4d"
                                   }
                                 ]
                               },
                               {
                                 "featureType": "transit.line",
                                 "elementType": "geometry.fill",
                                 "stylers": [
                                   {
                                     "color": "#283d6a"
                                   }
                                 ]
                               },
                               {
                                 "featureType": "transit.station",
                                 "elementType": "geometry",
                                 "stylers": [
                                   {
                                     "color": "#3a4762"
                                   }
                                 ]
                               },
                               {
                                 "featureType": "water",
                                 "elementType": "geometry",
                                 "stylers": [
                                   {
                                     "color": "#0e1626"
                                   }
                                 ]
                               },
                               {
                                 "featureType": "water",
                                 "elementType": "geometry.fill",
                                 "stylers": [
                                   {
                                     "color": "#4d6193"
                                   }
                                 ]
                               },
                               {
                                 "featureType": "water",
                                 "elementType": "labels.text.fill",
                                 "stylers": [
                                   {
                                     "color": "#4e6d70"
                                   }
                                 ]
                               }
                        ],
                    });
                console.log("獲取標記及訊息窗");
                // 一開始 當前位置標記
                circle = new google.maps.Marker({
                    map,
                    position: cL,
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 5
                    }
                });
                console.log("map finish");
               $.ajax({
                   type:'GET',
                   url:'/user/init?username='+localStorage.getItem("username")+"",
                   success: function(response){
                        //console.log(response.user);
                       let userData=response.user;
                       localStorage.setItem("EmoAppUser",userData);

                       console.log("獲取使用者資料成功");
                       systemInit();
                   },
                   error: function(response){
                       console.log("獲取使用者資料失敗");
                   }
               });


            },
            function(error){ console.error('Error getting geolocation:', error);}
        )
    }
    else{
        alert("瀏覽器不支持地理位置功能");
    }
}


function systemInit(){
    //watchPosition()=>裝置換位置就會自己動
    watchId = navigator.geolocation.watchPosition(success, error, options);
    User =JSON.parse(localStorage.getItem('EmoAppUser'));
    loadEcoRecords(User.userId);//載入環保紀錄
    loadSVG();//載入svg
    $('#user').text( User.nickname);
    $('#logoutAccount').click(logoutAccount);//登出
    $('#deleteAccount_delete').click(deleteAccount);//刪除帳號
    $('#deleteAccount_sendVerifyCode').click(isSendVerifyCode);
    $('#updateRecord').click(updateRecord)// 修改一般紀錄
    $('#deleteRecord').click(deleteSingleRecord)// 刪除一般紀錄
    $('#updateTrafficRecord').click(function(event) {updateRecord(event, "traffic");}); // 修改路線紀錄
    $('#deleteTrafficRecord').click(deleteSingleRecord)// 刪除路線紀錄
    $('#recordListButton').click(showRecord);//查看環保紀錄
    $('#renameBtn').click(modifyNickname);
    $('#deleteEditRecord').click(deleteMultiRecord);//刪除多筆紀錄
    $('#startRecording').click(checkIsRecording);// 路線紀錄(開始/停止)
}
//更新現在位置
function updateCurrentCircle() {
    // 清除舊位置的圈圈
    if (circle) {circle.setMap(null);}
    // 在新當前位置上標記圈圈
    circle = new google.maps.Marker({
        map,
        position: currentLocation,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 5
        }
    });
}
//載入svg
function loadSVG(){
    $.ajax({
        url: '/api/GetAllSvgJson',
        method: 'GET',
        success: function (data) {
            // 處理成功時的邏輯
            svgData = JSON.parse(data);
            loadFootprintData();//載入碳足跡計算
        },
        error: function(xhr, status, error) {
            let errorData = JSON.parse(xhr.responseText);
            let errorMessage = errorData.message;
            alert(errorMessage);
        }
    });
}
//載入碳足跡計算係數
function loadFootprintData() {
    $.ajax({
            url: '/config/GetAllRecordJson',
            method: 'GET',
            success: function (data) {
                // 處理成功時的邏輯
                const parsedData = JSON.parse(data);
                FPConstructor(parsedData);//待改名
                questionMarkConstructor(parsedData);
            },
            error: function(xhr, status, error) {
               let errorData = JSON.parse(xhr.responseText);
               let errorMessage = errorData.message;
               alert(errorMessage);
           }
        });
}
function FPConstructor(jsonData) {
    FootprintData = [];
    for(let [key,value] of Object.entries(jsonData)){
        let base = jsonData[key].base;
        let name = jsonData[key].name;
        if(key === "transportation"){
            jsonData[key].content.forEach(({name: type, index, coefficient, baseline, unit, color}) => {
                FootprintData.push({ type, index,coefficient, baseline, baseCoefficient: base[baseline], unit, class:key, classZH: name, color});
            });
        } else {
            jsonData[key].content.forEach(({name: type, coefficient, baseline, option, unit, color}) => {
                 FootprintData.push({ type, coefficient, baseline, baseCoefficient: base[baseline], option, unit, class:key, classZH: name, color});
             });
        }
    }
    initCategory(jsonData);
}
// 載入小問號
function questionMarkConstructor(jsonData) {
    questionMark = {};
    for(let [key,value] of Object.entries(jsonData)){
        for(let [num,detail] of Object.entries(value.content)){
            questionMark[detail.name] = detail.description;
        }
    }
}
function initCategory(jsonData){
    $('#category').append($('<option>', {
        text: "全部",
        value: "all",
        selected: true
    }));
    for (let i = 0; i < FootprintData.length; i++) {
        let currentCategory = FootprintData[i].classZH;
        let currentType = FootprintData[i].type;

        if (!categories[currentCategory]) {
            if(currentCategory != "交通"){
                // 建立類別按鈕
                let divElement = $('<div></div>');
                divElement.addClass('radio-inputs');
                divElement.attr('name', 'radio');
                divElement.attr('id', FootprintData[i].class + 'Radio');

                let labelElement = $('<label></label>');
                labelElement.attr('id', FootprintData[i].class + 'Label');

                let inputElement = $('<input>');
                inputElement.attr({
                    'id': FootprintData[i].class + 'Input',
                    'class': 'radio-input',
                    'type': 'radio',
                    'name': 'typeRadio',
                    'value': FootprintData[i].class
                });

                let spanElement = $('<span></span>');
                spanElement.addClass('radio-tile');
                let svgSpan = $('<span></span>');
                svgSpan.addClass('radio-icon');
                svgSpan.attr('id', FootprintData[i].class + 'Icon');

                let textSpan = $('<span>' + currentCategory + '</span>');
                textSpan.addClass('radio-label');
                textSpan.attr('id', FootprintData[i].class);

                spanElement.append(svgSpan, textSpan);
                labelElement.append(inputElement, spanElement);
                divElement.append(labelElement);

                $('#classType').append(divElement);
            }

            categories[currentCategory] = {
                class: FootprintData[i].class,
                footprint: 0,
                color: jsonData[FootprintData[i].class].color,
                action: []
            };
            $('#category').append($('<option>', {
                text: currentCategory,
                value: FootprintData[i].class
            }));
        }

        if(currentCategory === "交通"){
            // 建立類別按鈕
            let divElement = $('<div></div>');
            divElement.addClass('radio-inputs');
            divElement.attr('name', 'radio');
            divElement.attr('id', FootprintData[i].index + 'Radio');
            divElement.css({
                'width': '50%'
            });

            let labelElement = $('<label></label>');
            labelElement.attr('id', FootprintData[i].index + 'Label');

            let inputElement = $('<input>');
            inputElement.attr({
                'id': FootprintData[i].index + 'Input',
                'class': 'radio-input',
                'type': 'radio',
                'name': 'engine',
                'value': FootprintData[i].index
            });

            let spanElement = $('<span></span>');
            spanElement.addClass('radio-tile');
            let svgSpan = $('<span></span>');
            svgSpan.addClass('radio-icon');
            svgSpan.attr('id', FootprintData[i].index + 'Icon');

            let textSpan = $('<span>' + FootprintData[i].type + '</span>');
            textSpan.addClass('radio-label');
            textSpan.attr('id', FootprintData[i].index);

            spanElement.append(svgSpan, textSpan);
            labelElement.append(inputElement, spanElement);
            divElement.append(labelElement);

            $('#trafficClassType').append(divElement);
        }
        categories[currentCategory].action.push({
            type: currentType,
            color: FootprintData[i].color,
            index: FootprintData[i].index,
            totalFP: 0
        });
    }

    // 等按鈕建好再放照片跟 + 監聽器
    svgConstructor(svgData);
    typeListener();
}
let trafficChecked = null;
let dailyChecked = null;
function svgConstructor(svgData) {
    for(let [key, value] of Object.entries(categories)){
        if(value.class != "transportation"){
            $('#' + value.class + 'Icon').html(svgData.svgImages[value.class][value.class + 'Icon']);
            $('#' + value.class + 'Input').on('change', function() {
                if ($(this).is(':checked')) {
                    if(value.class != dailyChecked && dailyChecked != null){
                        $('#' + dailyChecked + 'Icon').html(svgData.svgImages[value.class][dailyChecked + 'Icon']);
                    }
                    $('#' + value.class + 'Icon').html(svgData.svgImages[value.class][value.class + 'Hover']);
                    dailyChecked = value.class;
                } else {
                    $('#' + value.class + 'Icon').html(svgData.svgImages[value.class][value.class + 'Icon']);
                }
            });
        } else {
            for(let [key, val] of Object.entries(value.action)){
                $('#' + val.index + 'Icon').html(svgData.svgImages[value.class][val.index + 'Icon']);
                $('#' + val.index + 'Input').on('change', function() {
                    if ($(this).is(':checked')) {
                        if(val.index != trafficChecked && trafficChecked != null){
                            $('#' + trafficChecked + 'Icon').html(svgData.svgImages[value.class][trafficChecked + 'Icon']);
                        }
                        $('#' + val.index + 'Icon').html(svgData.svgImages[value.class][val.index + 'Hover']);
                        trafficChecked = val.index;

                        let type = val.type;
                        let data_value = $('#kilometer').val();
                        let showExpectedFP = 0;
                        if (data_value > 0){
                            showExpectedFP = parseFloat(calculateFootprint(type, data_value)).toFixed(2);
                        }
                        $('#routeCalculate').text(showExpectedFP + " gCo2E");
                         let target = FootprintData.find(item => item.type === type);
                         let description = questionMark[target.type].split(" ");
                         $("#routeCompare").text(description[0]);
                         $("#routeFormula").text(description[1]);
                    } else {
                        $('#' + val.index + 'Icon').html(svgData.svgImages[value.class][val.index + 'Icon']);
                    }
                });
            }
        }
    }
}
// 計算footprint
function calculateFootprint(type,data_value) {
    let findTarget = FootprintData.find(function(item) {
        return item.type === type;
    });
    let baseCoefficient = findTarget.baseCoefficient; // 基準係數值
    let nowCoefficient = findTarget.coefficient; // 現在係數值
    let footprint = 0;
    footprint = (data_value * (baseCoefficient-nowCoefficient)).toFixed(3);
    // console.log(nowCoefficient,typeof(nowCoefficient),baseCoefficient,typeof(baseCoefficient),footprint);
    return footprint;
}

// 改暱稱
function modifyNickname() {
    if (User) {
        let newNickname = $('#newName').val();
        if (newNickname == '' || newNickname.length > 10) {
            alert("暱稱不得為空且長度不得大於10個字");
        } else {
            User.nickname = newNickname;
            let updatedUserDataString = JSON.stringify(User);
            localStorage.setItem('EmoAppUser', updatedUserDataString);
            $('#user').text(User.nickname);
            alert("修改成功");
            document.getElementById('renameFW').style.display = 'none';
            $.ajax({
                type: 'PUT',
                url: '/user/updateNickname?username=' + User.username +'&nickname='+ User.nickname,
                success: function(response) {
                    console.log(response); // 成功更新時的處理邏輯
                },
                error: function(xhr, status, error) {
                    console.error(error); // 更新失敗時的處理邏輯
                }
            });
        }
    } else {
        alert("請重新登入");
        window.location.href = '/login';
    }
}

function getFormattedDate(){
        let now = new Date();
        let year = now.getFullYear();
        let month = (now.getMonth() + 1).toString().padStart(2, '0');
        let day = now.getDate().toString().padStart(2, '0');
        let hours = now.getHours().toString().padStart(2, '0');
        let minutes = now.getMinutes().toString().padStart(2, '0');
        let seconds = now.getSeconds().toString().padStart(2, '0');
        let formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return formattedDate;
}
//登出
function logoutAccount(){
    localStorage.removeItem('EmoAppUser');
    localStorage.removeItem("username");
    google.accounts.id.disableAutoSelect();
}
function directionsDraw(rec){
    let directionsService = new google.maps.DirectionsService();
    let request = {
        origin: {lat:rec[0].lat,
                lng:rec[0].lng},
        destination: {lat:rec[rec.length-1].lat,
                      lng:rec[rec.length-1].lng},
        travelMode: 'TRANSIT',
        transitOptions: {
            modes: ['SUBWAY']
        },
    };
    directionsService.route(request, function(response) {
            // 移除步行部分，只保留乘坐大眾運輸工具的路線
            let transitSteps = response.routes[0].legs[0].steps.filter(step => step.travel_mode !== 'WALKING');

            // 重新構建路線
            let newRoute = {
                request: request,
                routes: [{
                    legs: [{
                        steps: transitSteps
                    }]
                }]
            };
        directionsDisplay = new google.maps.DirectionsRenderer({
            map: map,
            directions: newRoute,
            suppressMarkers: true,
              polylineOptions: {
                strokeColor: '#FFFFFF',
                strokeOpacity: 1,
                strokeWeight: 4
              }
        });
    });
}
function removeDirections() {
    if (directionsDisplay) {
        directionsDisplay.setMap(null);
    }
}