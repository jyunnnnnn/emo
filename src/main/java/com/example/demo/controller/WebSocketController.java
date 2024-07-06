package com.example.demo.controller;


import org.apache.logging.log4j.message.SimpleMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.Map;

@Controller

public class WebSocketController {

    /*
        可透過simpMessagingTemplate向前端頁面發送訊息
     */
    @Autowired
    private final SimpMessagingTemplate simpMessagingTemplate;


    @Autowired
    public WebSocketController(SimpMessagingTemplate simpMessagingTemplate) {
        this.simpMessagingTemplate = simpMessagingTemplate;
    }


    //接收前端websocket路徑為 /app/friendRequest的資訊 ， 前端使用者發送好友邀請給userId使用者
    @MessageMapping("/friendRequest")
    public void friendRequest(Principal principal, Map<String, String> message) {

        String sender = principal.getName();
        String senderNickname = message.get("senderName");
        String receiver = message.get("receiver");
        String content = senderNickname + "想要與您成為好友~";

        System.out.println(senderNickname + "正在發送邀請給" + receiver);

        //這裡要 將receiver的動態消息加入到資料庫內

        // 發送消息給特定使用者
        simpMessagingTemplate.convertAndSendToUser(
                receiver,
                "/queue/friendRequest",  // 或使用 "/topic/friendRequest"
                "好友請求來自 " + senderNickname + ": " + content
        );
    }
}

