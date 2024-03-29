let map;//地圖
let infoWindow;//圖標資訊窗
let FootprintData = [];//各環保行為資訊 物件陣列
let records = [];//進入系統時把該用戶的環保紀錄存進去 //改名
let User;//使用者 物件
let currentLocation;//當前經緯度
let watchId; //當前位置ID
let options;//地圖精準度 更新當前位置function用
let circle; //當前位置標記 用於每5秒更新(清除、重劃)
let currentInfoWindowRecord; // 目前 infoWindow 的內容
let currentMarker;//目前Marker
let markers =[];//所有marker
let categories = {};

// 初始化Google Map
function initMap() {
    console.log("進入init");
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                currentLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                 console.log("抓取位置成功 開始建構地圖");
                // 創建地圖
                map = new google.maps.Map(document.getElementById('map'), {
                    center: currentLocation,
                    zoom: 18,
                    minZoom: 5, // 設定最小縮放級別
                    maxZoom: 50, // 設定最大縮放級別
                    mapTypeControl: false,
                    zoomControl: false,
                    scaleControl: false,
                    streetViewControl: false,
                    rotateControl: false,
                    fullscreenControl: false,
                    styles: [
                        {
                            featureType: 'poi',
                            elementType: 'labels',
                            stylers: [
                                { visibility: 'off' }
                            ]
                        }
                    ]
                });
                console.log("獲取標記及訊息窗");
                // 一開始 當前位置標記
                circle = new google.maps.Marker({
                    position: currentLocation,
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 5
                    },
                    map: map
                });
                console.log("map finish");
                if (localStorage.getItem('EmoAppUser')==null) {
                    alert("請重新登入");
                    window.location.href = '/login';
                }else {
                    systemInit();
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
    watchId = navigator.geolocation.watchPosition(success, error, options);
    User = JSON.parse(localStorage.getItem('EmoAppUser'));
    loadEcoRecords(User.userId);//載入環保紀錄
    loadFootprintData();//載入碳足跡計算
    $('#user').text(User.nickname);
    $('#logoutAccount').click(logoutAccount);//登出
    $('#delete').click(deleteAccount);//刪除帳號
    $('#updateRecord').click(updateRecord)// 修改一般紀錄
    $('#deleteRecord').click(deleteSingleRecord)// 刪除一般紀錄
    $('#updateTrafficRecord').click(function(event) {updateRecord(event, "traffic");}); // 修改路線紀錄
    $('#deleteTrafficRecord').click(deleteSingleRecord)// 刪除路線紀錄
    $('#recordListButton').click(showRecord);//查看環保紀錄
    $('#adminButton').click(showFPdata)
    $('#settingButton').click(showSettingPage);
    $('#renameBtn').click(modifyNickname);
    $('#deleteEditRecord').click(deleteMultiRecord);//刪除多筆紀錄
    $('#startRecording').click(checkIsRecording);// 路線紀錄(開始/停止)
    document.getElementById('adminButton').style.display = User.userId === 1702984904982 ? 'block' : 'none';
    //判定管理員待改
}
//更新現在位置
function updateCurrentCircle(position) {
    // 清除舊位置的圈圈
    if (circle) {circle.setMap(null);}
    // 在新當前位置上標記圈圈
    circle = new google.maps.Marker({
        position: currentLocation,
        map: map,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 5
        }
    });
    //跑到中心
    map.panTo(currentLocation);
}
//載入碳足跡計算係數
function loadFootprintData() {
    $.ajax({
            url: '/api/GetAllRecordJson',
            method: 'GET',
            success: function (data) {
                // 處理成功時的邏輯
                const parsedData = JSON.parse(data);
                FPConstructor(parsedData);//待改名
                initCategory();
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
            jsonData[key].content.forEach(({name: type, coefficient, baseline, unit}) => {
                FootprintData.push({ type, coefficient, baseline, baseCoefficient: base[baseline], unit, class:key, classZH: name});
            });
        } else {
            jsonData[key].content.forEach(({name: type,coefficient,baseline,option,unit}) => {
                 FootprintData.push({ type, coefficient, baseline, baseCoefficient: base[baseline], option, unit, class:key, classZH: name});
             });
        }
    }
}
function initCategory(){
    $('#category').append($('<option>', {
        text: "全部",
        value: "all",
        selected: true
    }));
    for (let i = 0; i < FootprintData.length; i++) {
        let currentCategory = FootprintData[i].classZH;
        let currentType = FootprintData[i].type;

        if (!categories[currentCategory]) {
            categories[currentCategory] = {
                footprint: 0,
                action: []
            };
            $('#category').append($('<option>', {
                text: currentCategory,
                value: FootprintData[i].class
            }));
        }
        categories[currentCategory].action.push({
            type: currentType,
            totalFP: 0
        });
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
        if (newNickname !== '') {
            User.nickname = newNickname;
            let updatedUserDataString = JSON.stringify(User);
            localStorage.setItem('EmoAppUser', updatedUserDataString);
            $('#user').text(User.nickname);
            alert("修改成功");
            document.getElementById('renameFW').style.display = 'none';
            $.ajax({
                type: 'PUT',
                url: '/api/updateNickname?username=' + User.username +'&nickname='+ User.nickname,
                success: function(response) {
                    console.log(response); // 成功更新時的處理邏輯
                },
                error: function(xhr, status, error) {
                    console.error(error); // 更新失敗時的處理邏輯
                }
            });
        } else {
            alert("暱稱不得為空");
        }
    } else {
        alert("請重新登入");
        window.location.href = '/login';
    }
}
//刪除帳號
function deleteAccount(){
    getEncryptKey().then(function() {
        let encryptPass =encrypt( $('#passwordAuth').val(),key,iv);
       if( encryptPass == User.password){
           $.ajax({
               type: 'DELETE',
               url: `/api/deleteUserAccount?userId=${User.userId}`,
               contentType: 'application/string',
               success: function(response) {
                   //console.log(response); // 成功刪除時的處理邏輯
               },
               error: function(xhr, status, error) {
                   console.error(error); // 刪除失敗時的處理邏輯
               }
           });
           alert("帳號刪除成功");
           localStorage.removeItem('EmoAppUser');
           window.location.href= '/login';
           //刪除Emo_User
           $.ajax({
               type: 'DELETE',
               url: `/api/deleteSpecificUserRecord?userId=${User.userId}`,
               contentType: 'application/string',
               success: function(response) {
                   //console.log(response); // 成功刪除時的處理邏輯
               },
               error: function(xhr, status, error) {
                   console.error(error); // 刪除失敗時的處理邏輯
               }
           });
           //刪除Emo_Record裡面指定用戶的紀錄
       }
       else{
          alert("密碼錯誤");
       }
    }).catch(function() {
        console.log("無法取得金鑰和偏移量");
    });
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


////////////////////////////////這邊以下不知道哪來的
//登出
function logoutAccount(){
    alert("登出成功");
    localStorage.removeItem('EmoAppUser');
    google.accounts.id.disableAutoSelect ();
    window.location.href= '/login';

}
//加密金鑰
let key;
//加密偏移量
let iv;
//獲取加密金鑰
function getEncryptKey() {
    return new Promise(function(resolve, reject) {
        $.ajax({
            type: 'GET',
            url: '/api/getEncryptKey',
            contentType: 'application/json',
            success: function (response) {
                key = response.key;
                iv = response.iv;
                resolve();  // 解析 Promise 表示成功取得金鑰和偏移量
            },
            error: function (xhr, status, error) {
                console.log("獲取金鑰失敗");
                reject();  // 拒絕 Promise 表示無法取得金鑰和偏移量
            }
        });
    });
}
//加密
function encrypt(text,key,iv) {
    let encrypted;
 encrypted= CryptoJS.AES.encrypt(text, CryptoJS.enc.Utf8.parse(key), {
         iv: CryptoJS.enc.Utf8.parse(iv),
         mode: CryptoJS.mode.CBC,
         padding: CryptoJS.pad.Pkcs7
     });
    return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
}
//解密
function decrypt(ciphertext,key,iv){
    let decrypt;
     decrypt= CryptoJS.AES.decrypt(ciphertext, CryptoJS.enc.Utf8.parse(key), {
            iv: CryptoJS.enc.Utf8.parse(iv),
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
          return decrypt.toString(CryptoJS.enc.Utf8);
}