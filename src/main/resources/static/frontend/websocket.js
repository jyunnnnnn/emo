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
        stompClient.debug = null;
        stompClient.connect({}, function(frame) {
//            console.log('Connected: ' + frame);

            // 連接成功後進行訂閱
            stompClient.subscribe('/user/queue/sendFriendInfo', function(response) {

                console.log( response.body);
                //回傳資訊
                let responseData;


                responseData = JSON.parse(response.body);


                //判斷為何種訊息
                //flag = 1 新增好友
                //flag = 2 被接受好友
                //flag = 3 被拒絕好友
                //flag = 4 被刪除好友
                //flag = 5 被取消發送好友邀請
                let flag = responseData.flag;
                //對應flag的訊息
                let message = responseData.message;

                let  senderUserId = responseData.senderUserId;

//                console.log("flag: " + flag);
//                console.log("message: " +message);
                console.log(flag, message)


                //新增好友
                if(flag==1){
                    console.log(senderUserId+"發送好友邀請給您");

                    loadFriendObj(User.userId, 'change');
                    let msg = message;
                    let snackbar = $('<div>', {
                        class: 'content',
                        id: 'newfriendMSG'
                    })
                        .text(msg);
                    $('#snackbar').append(snackbar);
                    $('#snackbar').css('display', '');

                    setTimeout(function() {
                        $('#snackbar').fadeOut(1000, function() {
                            $('#newfriendMSG').remove();
                            $('#snackbar').css('display', 'none');
                        });
                    }, 3000);
                } else if(flag==2){
                   console.log(senderUserId+"接受您成為好友");

                    loadFriendObj(User.userId, 'change');
                    let msg = message;
                    let snackbar = $('<div>', {
                        class: 'content',
                        id: 'acceptFriendMSG'
                    })
                        .text(msg);
                    $('#snackbar').append(snackbar);
                    $('#snackbar').css('display', '');

                    setTimeout(function() {
                        $('#snackbar').fadeOut(1000, function() {
                            $('#acceptFriendMSG').remove();
                            $('#snackbar').css('display', 'none');
                        });
                    }, 3000);
                } else if(flag==3){
                    // 被拒絕
                    loadFriendObj(User.userId, 'change');
                } else if(flag==4){
                    // 被刪除
                    loadFriendObj(User.userId, 'change');
                } else if(flag==5){
                    // 被取消好友邀請
                    loadFriendObj(User.userId, 'change');
                }
            });

            resolve(stompClient);
        }, function(error) {
            console.error('STOMP protocol error: ' + error);
            reject(error);
        });
    });
}

//即時發送通知給好友的function target為目標使用者的userId
function sendFriendInfo(target,flag) {
    //檢驗websocket連接狀態
    if (!stompClient || !stompClient.connected) {
        console.error("WebSocket 連接尚未建立或已斷開");
        return;
    }

    //flag = 1 新增好友
    //flag = 2 被接受好友
    //flag = 3 被拒絕好友
    //flag = 4 被刪除好友
    //flag = 5 被取消發送好友邀請

    let message = "";
    //不同動作所需要寄送的訊息
    if(flag==1){
        //當按下發送好友邀請時
        message = User.nickname + "想要與你成為好友";
    }else if(flag==2){
        //當對方接受好友邀請時
        message = User.nickname + "接受與您成為好友";
    }
    else if(flag==3){
        //當對方拒絕成為好友
        message = User.nickname + "拒絕與您成為好友";
    }else if(flag==4){
        //當對方刪除好友
        message = User.nickname+"已將您從好友中刪除";
    }
    //flag=5 暫定沒有訊息 (直接將對方的好友邀請內將該使用者刪除即可)


    //message: 傳送給對方的訊息內容 ,flag: 當前為何種操作(新增好友、刪除...etc
    var msg = {
        senderUserId: User.userId,
        senderName: User.nickname,
        receiver: target,
        message:message,
        flag:flag
    };

    //發送請求給後端伺服器
    stompClient.send("/app/sendFriendInfo", {}, JSON.stringify(msg));
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
