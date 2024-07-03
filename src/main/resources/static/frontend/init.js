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
let showNowLines; //紀錄的路線線段們(紀錄時用[line]  記錄時用的線段
let mapLines = [];// 點擊紀錄的路線
let directionsDisplay;
let questionMark = {};
let AchievementObj={};
let FriendObj={};
let Rank={};//減碳量等級判定物件
let AllUsersFp={};//所有使用者排行物件陣列
let no1="frontend/img/1.png";
let no2="frontend/img/2.png";
let no3="frontend/img/3.png";
let base64no1, base64no2, base64no3;
let MAP_OK=0;
let DATA_OK=0;
let emoLogo="frontend/img/emoLogo.png";
let emoLogoUnlock="frontend/img/emoLogoUnlock.png"

// 定義一個事件發射器
const EventEmitter = {
    events: {},
    on(event, listener) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(listener);
    },
    emit(event, data) {
        if (this.events[event]) {
            this.events[event].forEach(listener => listener(data));
        }
    }
};

// 初始化Google Map
function initMap() {
    console.log("進入init");
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
                        gestureHanding: "greedy",
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
                                    "elementType": "geometry.stroke",
                                    "stylers": [
                                        {
                                            "color": "#cae0fc"
                                        }
                                    ]
                                },
                                {
                                    "featureType": "landscape",
                                    "stylers": [
                                        {
                                            "color": "#7fe647"
                                        },
                                        {
                                            "saturation": -25
                                        },
                                        {
                                            "lightness": 55
                                        }
                                    ]
                                },
                                {
                                    "featureType": "landscape",
                                    "elementType": "labels.text",
                                    "stylers": [
                                        {
                                            "color": "#20644a"
                                        },
                                        {
                                            "visibility": "simplified"
                                        }
                                    ]
                                },
                                {
                                    "featureType": "landscape.natural.landcover",
                                    "stylers": [
                                        {
                                            "weight": 1
                                        }
                                    ]
                                },
                                {
                                    "featureType": "landscape.natural.terrain",
                                    "stylers": [
                                        {
                                            "visibility": "off"
                                        }
                                    ]
                                },
                                {
                                    "featureType": "poi",
                                    "elementType": "labels.text",
                                    "stylers": [
                                        {
                                            "visibility": "off"
                                        }
                                    ]
                                },
                                {
                                    "featureType": "poi.business",
                                    "stylers": [
                                        {
                                            "visibility": "off"
                                        }
                                    ]
                                },
                                {
                                    "featureType": "road",
                                    "elementType": "labels.icon",
                                    "stylers": [
                                        {
                                            "visibility": "off"
                                        }
                                    ]
                                },
                                {
                                    "featureType": "road.arterial",
                                    "elementType": "geometry.fill",
                                    "stylers": [
                                        {
                                            "saturation": -80
                                        },
                                        {
                                            "lightness": 35
                                        }
                                    ]
                                },
                                {
                                    "featureType": "road.highway",
                                    "elementType": "geometry.fill",
                                    "stylers": [
                                        {
                                            "color": "#ffe9c2"
                                        },
                                        {
                                            "visibility": "on"
                                        }
                                    ]
                                },
                                {
                                    "featureType": "road.local",
                                    "elementType": "geometry.fill",
                                    "stylers": [
                                        {
                                            "saturation": -80
                                        }
                                    ]
                                },
                                {
                                    "featureType": "water",
                                    "elementType": "geometry.fill",
                                    "stylers": [
                                        {
                                            "color": "#91dbee"
                                        },
                                        {
                                            "saturation": 35
                                        },
                                        {
                                            "lightness": 15
                                        },
                                        {
                                            "weight": 1
                                        }
                                    ]
                                },
                                {
                                    "featureType": "water",
                                    "elementType": "labels.text",
                                    "stylers": [
                                        {
                                            "color": "#0f5dc2"
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
                MAP_OK=1;
                console.log(MAP_OK,DATA_OK,"map");
                if(MAP_OK && DATA_OK){
                    loadEcoRecords(User.userId);//載入環保紀錄
                    $('#preloader').fadeOut(1500);
                }

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
    User =JSON.parse(localStorage.getItem('EmoAppUser'));
    // 發出用戶已初始化的事件
    EventEmitter.emit('userInitialized', User);
    $('#myUserID').text('我的ID：' + User.userId);
    loadSVG();//載入svg
    loadAchievementObj(User.userId);
    loadFriendObj(User.userId);
    loadRank();
    loadAllUsersFp(0);
    watchId = navigator.geolocation.watchPosition(success, error, options);
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
    $('#upLoadUserPhoto').click(uploadPhoto);
    // 幫current初始化
    currentInfoWindowRecord = undefined;
    currentMarker = undefined;
    // 顯示使用者照片
    if(User.photo){
        $('#photoContainer').css("display", "block");
        // console.log(User.photo);
        $('#photoDisplay').attr('src', User.photo);
    }else {
        $('#userPhoto').css("display", "block");
    }
    //排行照片123照片
    Promise.all([imageToBase64(no1),imageToBase64(no2),imageToBase64(no3),imageToBase64(emoLogo),imageToBase64(emoLogoUnlock)]).then(base64Images => {
        base64no1 = base64Images[0];
        base64no2 = base64Images[1];
        base64no3 = base64Images[2];
        emoLogo = base64Images[3];
        emoLogoUnlock = base64Images[4];
        // 現在可以在這裡使用 base64Image1、base64Image2、base64Image3
    }).catch(error => {
        console.error("An error occurred:", error);
    });
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
//載入好友列表
function loadFriendObj(userId){
    console.log('get')
    $.ajax({
        url: '/FR/getFriend?userId='+userId,
        method: 'GET',
        success: function(response) {
            FriendObj=response;
            console.log(FriendObj);
        },
        error: function(xhr, status, error) {
            console.error('Error:', error);
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
            jsonData[key].content.forEach(({name: type, index, coefficient, baseline, option, unit, color}) => {
                 FootprintData.push({ type, index, coefficient, baseline, baseCoefficient: base[baseline], option, unit, class:key, classZH: name, color});
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
    $('#all').on('click', function() {
        $(this).toggleClass('is-selected');
        let selectElement = $('#allClass');
        if ($(this).hasClass('is-selected')) {
            selectElement.css('display', 'inline-flex');
        } else {
            selectElement.css('display', 'none');
        }
    });

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

            $('#classNType').append(
                $('<a>', {
                    class: "item",
                    id: FootprintData[i].class + 'NClass',
                    text: '- ' + FootprintData[i].classZH,
                })
            )

            $('#selectedClass').append(
                $('<div>', {
                    class: 'ts-chip is-circular',
                    id: FootprintData[i].class + 'Class',
                    text: FootprintData[i].classZH,
                    css: { display: 'none' }
                })
            )
            $('#' + FootprintData[i].class + 'NClass').on('click', function() {
                $(this).toggleClass('is-selected');
                let selectElement = $('#' + FootprintData[i].class + 'Class');
                if ($(this).hasClass('is-selected')) {
                    selectElement.css('display', 'inline-flex');
                } else {
                    selectElement.css('display', 'none');
                }
            });
        }

        $('#classNType').append(
            $('<a>', {
                class: "item",
                id: FootprintData[i].index + 'N' + FootprintData[i].class,
                text: FootprintData[i].type
            })
        )
        $('#selectedClass').append(
            $('<div>', {
                class: 'ts-chip is-circular is-outlined',
                id: FootprintData[i].index + 'and' + FootprintData[i].class,
                text: FootprintData[i].type,
                css: { display: 'none' }
            })
        )
        $('#' + FootprintData[i].index + 'N' + FootprintData[i].class).on('click', function() {
            $(this).toggleClass('is-selected');
            let selectElement = $('#' + FootprintData[i].index + 'and' + FootprintData[i].class);
            if ($(this).hasClass('is-selected')) {
                selectElement.css('display', 'inline-flex');
            } else {
                selectElement.css('display', 'none');
            }
        });

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
    $('#selectClass input[type="radio"]').on("change", sortRecordsBySelectedOption);
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
                        $('#routeCalculate').text(showExpectedFP + " gCO2e");
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
            const index = AllUsersFp.findIndex(user => user.userId === User.userId);
            AllUsersFp[index].nickname = User.nickname ;
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
function directionsDraw(rec, mode){
    console.log("mode ",mode);
    let directionsService = new google.maps.DirectionsService();
    let request = {
        origin: {lat:rec[0].lat,lng:rec[0].lng},
        destination: {lat:rec[rec.length-1].lat,lng:rec[rec.length-1].lng},
        travelMode: 'TRANSIT',
        transitOptions: {
            modes: [mode]
        },
        provideRouteAlternatives: true, //多條路徑
    };
    directionsService.route(request, function(response, status) {
        if (status === 'OK') {
            console.log(response.routes);
            route =response.routes[0];
            // response.routes.forEach(route => {
                // 移除步行部分，只保留乘坐大眾運輸工具的路線
                let transitSteps = route.legs[0].steps.filter(step => step.travel_mode !== 'WALKING');

                // 重新構建路線
                let newLeg = {
                    steps: transitSteps,
                    start_location: route.legs[0].start_location,
                    end_location: route.legs[0].end_location,
                    duration: transitSteps.reduce((sum, step) => sum + step.duration.value, 0),
                    distance: transitSteps.reduce((sum, step) => sum + step.distance.value, 0),
                    start_address: route.legs[0].start_address,
                    end_address: route.legs[0].end_address
                };

                let newRoute = {
                    request: request,
                    routes: [{
                        legs: [newLeg],
                        overview_path: route.overview_path,
                        bounds: route.bounds
                    }]
                };

                directionsDisplay = new google.maps.DirectionsRenderer({
                    map: map,
                    directions: newRoute,
                    suppressMarkers: true,
                    polylineOptions: {
                        strokeColor: '#166a29',
                        strokeOpacity: 1,
                        strokeWeight: 4
                    }
                });
            // });
        } else {
            console.error('Directions request failed due to ' + status);
        }
    });
}
function removeDirections() {
    if (directionsDisplay) {
        directionsDisplay.setMap(null);
    }
}

function uploadPhoto() {
        if (!croppedImageUrl) {
            alert('請選擇檔案');
            return;
        }

        const formData = new FormData();
        formData.append('username', User.username);
        formData.append('photo', croppedImageUrl);

        // Send data to server using AJAX
        $.ajax({
            url: '/user/updatePhoto',
            type: 'PUT',
            data: formData,
            processData: false,  // 不要將 FormData 轉換為字串
            contentType: false,  // 不設定內容類型，讓瀏覽器自動設定
            success: function(response) {
                User.photo = croppedImageUrl;
                const index = AllUsersFp.findIndex(user => user.userId === User.userId);
                AllUsersFp[index].photo = User.photo ;
                $('#photoContainer').css("display","block");
                $('#photoDisplay').attr('src', User.photo);
                $('#originalPhoto').attr('src', User.photo);
                $('#userPhoto').css("display","none");
                alert(response.message);
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
                alert('上傳失敗');
            }
        });
    $('#uploadUserPhotoFW').css("display", "none");
}
function loadAchievementObj(userId){
    $.ajax({
        url: '/AC/getUserAchievementStateObj?userId='+userId,
        type: 'GET',
        success: function(response) {
            AchievementObj=response;


            //console.log(AchievementObj);
            /*
            let target = AchievementObj.filter(achievement => achievement.accomplishTime != null);
            firstTimeAchieve(target);
             */
        },
        error: function(xhr, status, error) {
            console.error('Error:', error);
        }
    });
}

function loadAllUsersFp(a){
    //使用者欲更新排行狀態
    if(a==1){
        $.ajax({
                url: '/rank/updateRankObj',
                type: 'PUT',
                success: function(response) {
                    //console.log(response);
                    AllUsersFp=response;
                    //console.log(AllUsersFp);
                    initUserData();
                    if(a==1){
                        $("#rotateURBtn").removeClass("rotateUpdateBtn");
                        $('#updateRanking').prop("disabled", false);
                        alert("排名更新成功");
                    }
                },
                error: function(xhr, status, error) {
                    console.error('Error:', error);
                }
            });
    }else{
        $.ajax({
                url: '/rank/getRankObj',
                type: 'GET',
                success: function(response) {
                    //console.log(response);
                    AllUsersFp=response;
                    //console.log(AllUsersFp);
                    initUserData();
                    if(a==1){
                        $("#rotateURBtn").removeClass("rotateUpdateBtn");
                        $('#updateRanking').prop("disabled", false);
                        alert("排名更新成功");
                    }
                },
                error: function(xhr, status, error) {
                    console.error('Error:', error);
                }
            });
    }

}
function loadRank(){
    $.ajax({
        url: '/rank/getUsersRankData',
        type: 'GET',
        success: function(response) {
            // console.log(response);
            Rank=response;
            DATA_OK=1;
            console.log(MAP_OK,DATA_OK,"DATA");
            if(MAP_OK && DATA_OK){
                loadEcoRecords(User.userId);//載入環保紀錄
                $('#preloader').fadeOut(1500);
            }
            //console.log(Rank);
            // 調用生成使用者資料函數
        },
        error: function(xhr, status, error) {
            console.error('Error:', error);
        }
    });
}

// 將圖片轉換為 Base64 編碼的函數
async function imageToBase64(url) {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}
