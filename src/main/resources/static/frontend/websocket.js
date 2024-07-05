var socket;
var stompClient;

// 監聽使用者初始化事件 當User變數初始化完後才進行websocket初始化的動作
EventEmitter.on('userInitialized', function(user) {
//    console.log('User initialized:', user);
    websocketInit();
});


//websocket初始化
function websocketInit() {
    return new Promise((resolve, reject) => {
        socket = new SockJS('/ws?userId=' + User.userId);
        stompClient = Stomp.over(socket);

        //關閉websocket的console內容顯示
//        stompClient.debug = null;
        stompClient.connect({}, function(frame) {
            console.log('Connected: ' + frame);

            // 連接成功後進行訂閱
            stompClient.subscribe('/user/queue/friendRequest', function(response) {

                console.log( response.body);
                //response.body為後端伺服器回傳的訊息(目前是預設為 好友請求來自 xxx: xxx想要與您成為好友~)
                //收到來自伺服器的即時訊息之後的操作
                loadFriendObj(User.userId, 'change');
                let msg = response.body.split(' ');
                let snackbar = $('<div>', {
                    class: 'content',
                    id: 'newfriendMSG'
                })
                    .text(msg[2]);
                $('#snackbar').append(snackbar);
                $('#snackbar').css('display', '');

                setTimeout(function() {
                    $('#newfriendMSG').remove();
                    $('#snackbar').css('display', 'none');
                }, 3000);

            });

            resolve(stompClient);
        }, function(error) {
            console.error('STOMP protocol error: ' + error);
            reject(error);
        });
    });
}

//即時發送好友邀請通知的function target為目標使用者的userId
function sendFriendRequest(target) {
    //檢驗websocket連接狀態
    if (!stompClient || !stompClient.connected) {
        console.error("WebSocket 連接尚未建立或已斷開");
        return;
    }

    console.log("發送好友邀請給 :" + target);

    var msg = {
        senderName: User.nickname,
        receiver: target
    };
    //發送請求給後端伺服器
    stompClient.send("/app/friendRequest", {}, JSON.stringify(msg));
}


// 使用方式
function initializeWebSocket() {
    websocketInit().then(() => {
        console.log("WebSocket 連接已就緒");
        // 這裡可以放置需要在連接建立後執行的代碼
    }).catch(error => {
        console.error("WebSocket 連接失敗:", error);
        // 這裡可以處理連接失敗的情況
    });
}
