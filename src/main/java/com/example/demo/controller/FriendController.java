package com.example.demo.controller;


import com.example.demo.service.FriendService;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.Collections;

@Controller
@RequestMapping("/FR")
public class FriendController {


    @Autowired
    private FriendService friendService;

    @Autowired
    public FriendController(FriendService friendService) {
        this.friendService = friendService;
    }


    //新增好友(發送者按下好友申請按鈕) userId使用者發送好友邀請給target
    // url : ~/FR/addFriend?sender=testUserId&receiver=targetId
    @PostMapping("/addFriend")
    public ResponseEntity<?> addFriend(@RequestParam("sender") String userId, @RequestParam("receiver") String target) {

        this.friendService.addFriend(userId, target);

        return null;
    }

    //取消發送好友邀請(發送者收回好友邀請) userId使用者取消發送好友邀請給target
    // url : ~/FR/cancelFriend?sender=testUserId&receiver=targetId
    @PutMapping("/cancelFriend")
    public ResponseEntity<?> cancelFriend(@RequestParam("sender") String userId, @RequestParam("receiver") String target) {


        this.friendService.cancelFriend(userId, target);

        return null;
    }


    //確認好友邀請(收件者確認好友邀請) userId接受target的好友邀請
    // url : ~/FR/confirmFriend?sender=testUserId&receiver=targetId
    @PutMapping("/confirmFriend")
    public ResponseEntity<?> confirmFriend(@RequestParam("sender") String userId, @RequestParam("receiver") String target) {
        this.friendService.confirmFriend(userId, target);
        return null;
    }

    //刪除好友 (有人想刪掉好友)
    // url : ~/FR/deleteFriend?sender=testUserId&receiver=targetId
    @PutMapping("/deleteFriend")
    public ResponseEntity<?> deleteFriend(@RequestParam("sender") String userId, @RequestParam("receiver") String target) {
        this.friendService.deleteFriend(userId, target);
        return null;
    }

    //獲取某位使用者的所有好友資訊
    @GetMapping("/getFriend")
    public ResponseEntity<?> getFriend(@RequestParam("userId") String userId) {
        return ResponseEntity.ok(Collections.singletonMap("data", this.friendService.getAllFriend(userId)));
    }


}
