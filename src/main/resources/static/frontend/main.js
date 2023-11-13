var map;
var infoWindow;
var activity;
// 初始化Google Map
function initMap() {

    if ("geolocation" in navigator) {
        // 當前位置
        navigator.geolocation.getCurrentPosition(function(position) {
            var currentLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            // 創建地圖
            map = new google.maps.Map(document.getElementById('map'), {
                center: currentLocation,
                zoom: 15,
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
            // 當前位置標記
            var circle = new google.maps.Marker({
                position: currentLocation,
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 5
                },
                map: map
            });
        });

         infoWindow = new google.maps.InfoWindow();

    } else {
        alert("不支援定位");
    }
}


$(document).ready(function() {
    const token = localStorage.getItem('userToken');
     const decodedToken = jwt_decode(token);
     const username = decodedToken.username;
    console.log(username)
    // 記錄按鈕事件處理
    $('#recordButton').click(function() {
        map.setOptions({
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
    });
    $('#saveRecord').click(function(){

        var userEnteredValue = $("#activityInput").val();
        var selectedOption = $("#recordType option:selected").text()
        if (userEnteredValue != "") {
            activity = userEnteredValue;
            addMarker(activity);
        } else if (selectedOption) {
            activity = selectedOption;
            addMarker(activity);
        } else {
            alert("請輸入文字或選擇環保事項。");
        }
    })
    // 添加標記
    function addMarker(activity) {
        if (map) {
            var currentCenter = map.getCenter();
            var marker = new google.maps.Marker({
                position: currentCenter,
                map: map,
                title: activity
            });
           var currentTime = new Date();
           var now=currentTime.toLocaleString();
           let infoWindow = new google.maps.InfoWindow({
                content: `<div>
                <h6 style="padding:3px; margin:3px;">${activity}</h6>
                <p style="padding:3px; margin:3px;">${now}</p>
                </div>` // 支援html
           });
           localStorage.setItem("ecoRecord"+currentTime, JSON.stringify({ time: now, content: activity ,compare:Date.now()}));
            // 監聽 marker click 事件
           marker.addListener('click', e => {
                infoWindow.open(this.map, marker);
           });
        }
        $('#activityModal').modal('hide');
    }
    $('#recordListButton').click(function() {
       var records = [];
       for (var i = 0; i < localStorage.length; i++) {
           var key = localStorage.key(i);
           if (key.startsWith("ecoRecord")) {
               var storedData = localStorage.getItem(key);
               if (storedData) {
                   var ecoRecord = JSON.parse(storedData);
                   records.push(ecoRecord);

               }
           }
       }
       records.sort(function(a, b) {
             return a.compare - b.compare;
       });
       console.log(records)
       var text = "";
       for (var i = 0; i < records.length; i++) {
           var time = records[i].time;
           var content = records[i].content;
           text += content + " " + time + "<br>";
       }
       document.getElementById("listContent").innerHTML = text;
        $('#activityModal').modal('hide');
    });



});


