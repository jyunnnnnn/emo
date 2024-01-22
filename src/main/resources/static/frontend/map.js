var map;
var infoWindow;
var intervalId;//時間間隔
var FootprintData = [];
var records = [];//進入系統時把該用戶的環保紀錄存進去
var isRecording = false;//false=>開始  true=>結束
var username;//使用者名稱
var User;
var nickname;
var currentInfoWindowRecord; // 目前 infoWindow 的內容
var currentMarker;//目前Marker
var markers =[];//所有marker
var recordedPositions = [];//路線紀錄(點)
var mapLines = [];//一次紀錄的路線線段
var watchId; //當前位置ID
var options;//地圖精準度 更新當前位置function用

var circle; //當前位置標記 用於每5秒更新(清除、重劃)
var currentLocation;

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
                    infoWindow = new google.maps.InfoWindow();

                    // 當前位置標記
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
                    }
                    //watchPosition()=>裝置換位置就會自己動
                    watchId = navigator.geolocation.watchPosition(success, error, options);
                    User =JSON.parse(localStorage.getItem('EmoAppUser'));
                    username=User.username;
                    nickname=User.nickname;
                    $('#user').text(nickname);
                    loadEcoRecords(User.userId);//載入環保紀錄
                    loadFootprintData();//載入碳足跡計算
                    $('#logoutAccount').click(logoutAccount);//登出
                    $('#delete').click(deleteAccount);//刪除帳號
                    $('#saveRecord').click(saveRecord);// 添加標記
                    $('#updateRecord').click(updateRecord)//修改紀錄
                    $('#deleteRecord').click(deleteRecord)//刪除紀錄
                    $('#recordListButton').click(showRecord);//查看環保紀錄
                    $('#adminButton').click(showFPdata)
                    $('#settingButton').click(showTotalFootprint);
                    $('#renameBtn').click(modifyNickname);
                    $('#deleteEditRecord').click(deleteMultiRecord);//刪除多筆紀錄
                    $('#startRecording').click(function () {
                        if (!isRecording) {
                            startRecording(); //false
                        } else {
                            stopRecording(); //true
                        }
                    });// 路線紀錄(開始/停止)
                    if(username === 'admin'){
                        document.getElementById('adminButton').style.display = 'block';
                    }else{
                        document.getElementById('adminButton').style.display = 'none';
                    }
                },
                function(error){
                    console.error('Error getting geolocation:', error);
                }
            )
    }
    else{
        alert("瀏覽器不支持地理位置功能");
    }
}



function updateCurrentCircle(position) {
    currentLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
    };

    // 清除舊位置的圈圈
    if (circle) {
        circle.setMap(null);
    }

    // 在新當前位置上標記圈圈
    circle = new google.maps.Marker({
        position: currentLocation,
        map: map,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 5
        }
    });
}
//載入碳足跡計算係數(再來用設定檔)
function loadFootprintData() {
    $.ajax({
            url: '/api/getFootprint',
            method: 'GET',
            success: function (data) {
                // 處理成功時的邏輯
                FootprintData = data;
                //console.log(FootprintData);

            },
            error: function(xhr, status, error) {
               var errorData = JSON.parse(xhr.responseText);
               var errorMessage = errorData.message;
               alert(errorMessage);
           }
        });
}
//透過type找到coefficient(重寫)
function findCoefficientByType(type) {
    var result = FootprintData.find(function(item) {
        return item.type === type;
    });
    // 如果找到對應的 type，返回 coefficient，否則返回 null 或其他預設值
    return result ? result.coefficient : null;
}
//計算footprint(重寫)
function calculateFootprint(type,data_value) {
    var footprint = 0;
    var coefficient = findCoefficientByType(type);
    footprint=(data_value * coefficient).toFixed(3);
    return footprint;
}
//改暱稱(合併)
function modifyNickname() {
    var userDataString = localStorage.getItem('EmoAppUser');
    if (userDataString) {
        var userData = JSON.parse(localStorage.getItem('EmoAppUser'));;
        var newNickname = $('#newName').val();
        if (newNickname !== '') {
            userData.nickname = newNickname;
            var updatedUserDataString = JSON.stringify(userData);
            localStorage.setItem('EmoAppUser', updatedUserDataString);
            User.nick = newNickname;
            nickname = newNickname;
            $('#user').text(nickname);
            alert("修改成功");
            document.getElementById('renameFW').style.display = 'none';
            updateNewNicknameToBackend(newNickname);
        } else {
            alert("暱稱不得為空");
        }
    } else {
        alert("請重新登入");
        window.location.href = '/login';
    }
}
function updateNewNicknameToBackend(newNickname){
    $.ajax({
            type: 'PUT',
            url: '/api/updateNickname?username=' + username +'&nickname='+newNickname,
            success: function(response) {
                console.log(response); // 成功更新時的處理邏輯
            },
            error: function(xhr, status, error) {
                console.error(error); // 更新失敗時的處理邏輯
            }
        });
}


function clearForm(){
    $('input[type="radio"]:checked').each(function() {
        $(this).prop('checked', false);
    });
    document.getElementById('kilometer').value = 'none';
    document.getElementById('trafficMenu').style.display = 'none';
    document.getElementById('dailyMenu').style.display = 'none';
    document.getElementById('SPACE').style.display = 'block';
}

//刪除Emo_User
function deleteAccountToBackend(userId){
    $.ajax({
        type: 'DELETE',
        url: `/api/deleteUserAccount?userId=${userId}`,
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
}
//刪除Emo_Record裡面指定用戶的紀錄
function deleteRecordByAccount(userId){
     $.ajax({
            type: 'DELETE',
            url: `/api/deleteSpecificUserRecord?userId=${userId}`,
            contentType: 'application/string',
            success: function(response) {
                //console.log(response); // 成功刪除時的處理邏輯
            },
            error: function(xhr, status, error) {
                console.error(error); // 刪除失敗時的處理邏輯
            }
        });
}
//登出
function logoutAccount(){
    alert("登出成功");
    localStorage.removeItem('EmoAppUser');

    google.accounts.id.disableAutoSelect ();

    window.location.href= '/login';

}
//刪除帳號
function deleteAccount(){
    getEncryptKey().then(function() {
        var encryptPass =encrypt( $('#passwordAuth').val(),key,iv);
       if( encryptPass == User.password){
           deleteAccountToBackend(User.userId);
           deleteRecordByAccount(User.userId);
       }
       else{
          alert("密碼錯誤");
       }
    }).catch(function() {
        console.log("無法取得金鑰和偏移量");
    });
}
//加密金鑰
var key;
//加密偏移量
var iv;
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
    var encrypted;
 encrypted= CryptoJS.AES.encrypt(text, CryptoJS.enc.Utf8.parse(key), {
         iv: CryptoJS.enc.Utf8.parse(iv),
         mode: CryptoJS.mode.CBC,
         padding: CryptoJS.pad.Pkcs7
     });
    return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
}
//解密
function decrypt(ciphertext,key,iv){
    var decrypt;
     decrypt= CryptoJS.AES.decrypt(ciphertext, CryptoJS.enc.Utf8.parse(key), {
            iv: CryptoJS.enc.Utf8.parse(iv),
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
          return decrypt.toString(CryptoJS.enc.Utf8);
}