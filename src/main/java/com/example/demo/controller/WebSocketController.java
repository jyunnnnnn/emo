package com.example.demo.controller;


import org.apache.logging.log4j.message.SimpleMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.HashMap;
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
    @MessageMapping("/sendFriendInfo")
    public void friendRequest(Principal principal, Map<String, String> message) {

        String sender = principal.getName();

        String senderNickname = message.get("senderName");
        String receiver = message.get("receiver");

        Map<String, String> content = new HashMap<>();
        content.put("senderUserId",message.get("senderUserId"));
        content.put("message", message.get("message"));
        content.put("flag", message.get("flag"));

        System.out.println(senderNickname + "正在發送訊息給" + receiver);

        //這裡要 將receiver的動態消息加入到資料庫內

        // 發送消息給特定使用者
        simpMessagingTemplate.convertAndSendToUser(
                receiver,
                "/queue/sendFriendInfo",  // 或使用 "/topic/friendRequest"
                content
        );
    }
}

