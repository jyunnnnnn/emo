package com.example.demo.service;


import com.example.demo.entity.FriendEntity;
import com.example.demo.entity.FriendInfo;
import com.example.demo.repository.FriendRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Service
public class FriendService {


    @Autowired
    private FriendRepository friendRepository;


    //所有使用者的好友相關訊息
    private List<FriendEntity> friendEntityList;


    //快速查找某位使用者的好友資訊index
    private Map<String, Integer> friendEntityListIndex;


    //Thread Pool
    private ExecutorService executorService = Executors.newCachedThreadPool();

    @Autowired
    public FriendService(FriendRepository friendRepository) {
        this.friendRepository = friendRepository;
        friendEntityList = friendRepository.findAll();
        friendEntityListIndex = new HashMap<>();

        //Create Index Table
        for (int i = 0; i < friendEntityList.size(); i++) {
            friendEntityListIndex.put(friendEntityList.get(i).getUserId(), i);
        }

    }

    //非同步執行緒執行 好友資料庫內容
    private void FriendRepositoryThread(FriendEntity newFriendEntity) {
        executorService.submit(new Runnable() {
            @Override
            public void run() {
                System.out.println(newFriendEntity);
                friendRepository.save(newFriendEntity);
            }
        });
    }


    //新增好友 userId向target使用者發送好友邀請
    public void addFriend(String userId, String target) {

        int idx1 = friendEntityListIndex.containsKey(userId) ? friendEntityListIndex.get(userId) : -1;

        int idx2 = friendEntityListIndex.containsKey(target) ? friendEntityListIndex.get(target) : -1;

        System.out.println(userId + "正向" + target + "發送好友邀請");
        //該使用者尚未建立好友資料庫
        if (idx1 == -1) {
            friendEntityList.add(new FriendEntity(userId));
            friendEntityListIndex.put(userId, friendEntityList.size() - 1);

            idx1 = friendEntityListIndex.get(userId);
        }

        //該使用者尚未建立好友資料庫
        if (idx2 == -1) {
            friendEntityList.add(new FriendEntity(target));
            friendEntityListIndex.put(target, friendEntityList.size() - 1);

            idx2 = friendEntityListIndex.get(target);
        }


        //當前使用者需要紀錄發送好友邀請對象的id
        friendEntityList.get(idx1).addNewRequesting(target);


        //目標使用者需要紀錄發送邀請人
        friendEntityList.get(idx2).addNewRequsted(userId);


        //非同步更新發送者和接受者的好友資料庫內容
        this.FriendRepositoryThread(friendEntityList.get(idx1));
        this.FriendRepositoryThread(friendEntityList.get(idx2));

        return;
    }

    //userId使用者取消向target使用者發送好友邀請
    public void cancelFriend(String userId, String target) {

        int idx1 = friendEntityListIndex.containsKey(userId) ? friendEntityListIndex.get(userId) : -1;

        int idx2 = friendEntityListIndex.containsKey(target) ? friendEntityListIndex.get(target) : -1;

        System.out.println(userId + "正向" + target + "取消發送好友邀請");

        //userId使用者要刪除發送好友邀請對象的id
        friendEntityList.get(idx1).removeRequesting(target);
        //target使用者要刪除發送邀請人的id
        friendEntityList.get(idx2).removeRequested(userId);

        //非同步更新發送者和接受者的好友資料庫內容
        this.FriendRepositoryThread(friendEntityList.get(idx1));
        this.FriendRepositoryThread(friendEntityList.get(idx2));
    }

    //userId使用者確認target的好友邀請
    public void confirmFriend(String userId, String target) {


        //看接受好友後要不要websocket回傳通知給使用者

        int idx1 = friendEntityListIndex.containsKey(userId) ? friendEntityListIndex.get(userId) : -1;

        int idx2 = friendEntityListIndex.containsKey(target) ? friendEntityListIndex.get(target) : -1;
        System.out.println(userId + "確認" + target + "的好友邀請");

        FriendEntity user1 = friendEntityList.get(idx1);

        FriendEntity user2 = friendEntityList.get(idx2);

        //userId和target使用者互相為彼此的好友 兩者互相擁有彼此的某些資訊

        // * new FriendInfo() 需要修改成實際資訊 未來需要考慮即時性問題(好友可能會隨時更新數據)
        user1.addNewFriendInfo(new FriendInfo(target));
        user2.addNewFriendInfo(new FriendInfo(target));

        //userId使用者需要刪除尚未回覆列表內的內容
        user1.removeRequested(target);
        //target對象需要刪除發送好友邀請的內容
        user2.removeRequesting(userId);

        //非同步更新發送者和接受者的好友資料庫內容
        this.FriendRepositoryThread(user1);
        this.FriendRepositoryThread(user2);

    }

    //userId使用者拒絕target的好友邀請
    public void rejectFriend(String userId, String target) {


        int idx1 = friendEntityListIndex.containsKey(userId) ? friendEntityListIndex.get(userId) : -1;

        int idx2 = friendEntityListIndex.containsKey(target) ? friendEntityListIndex.get(target) : -1;
        System.out.println(userId + "拒絕了" + target + "發送的好友邀請");

        FriendEntity user1 = friendEntityList.get(idx1);

        FriendEntity user2 = friendEntityList.get(idx2);

        //拒絕對方，兩者不需加入到對方的好友列表內


        //刪除好友邀請請求

        //userId使用者需要刪除尚未回覆列表內的內容
        user1.removeRequested(target);
        //target對象需要刪除發送好友邀請的內容
        user2.removeRequesting(userId);

        //非同步更新發送者和接受者的好友資料庫內容
        this.FriendRepositoryThread(user1);
        this.FriendRepositoryThread(user2);

    }


    //刪除好友 userId使用者要刪除target使用者
    public void deleteFriend(String userId, String target) {
        System.out.println(userId + "刪除" + target);

        int idx1 = friendEntityListIndex.containsKey(userId) ? friendEntityListIndex.get(userId) : -1;

        int idx2 = friendEntityListIndex.containsKey(target) ? friendEntityListIndex.get(target) : -1;


        //雙方互相刪除對方好友
        friendEntityList.get(idx1).deleteFriend(target);
        friendEntityList.get(idx2).deleteFriend(userId);

        //非同步更新發送者和接受者的好友資料庫內容
        this.FriendRepositoryThread(friendEntityList.get(idx1));
        this.FriendRepositoryThread(friendEntityList.get(idx2));
    }

    //獲取某位使用者的所有好友
    public FriendEntity getFriendData(String userId) {

        //回傳測試用資料 測試版本結束後註解這行
//        if (!friendEntityListIndex.containsKey(userId))
//            return getTestFriendData();

        return friendEntityList.get(friendEntityListIndex.get(userId));
    }

    //測試資料
    private FriendEntity getTestFriendData() {
        //建立測試資料
        FriendEntity user = new FriendEntity("1714997093687");
        //建立測試用好友名單
        user.addNewFriendInfo(new FriendInfo("1714038743812"));
        user.addNewFriendInfo(new FriendInfo("1714993712835"));

        //建立正在邀請好友名單
        user.addNewRequesting("1714149099003");
        user.addNewRequesting("1713973819396");

        //建立尚未回覆對方好友邀請名單
        user.addNewRequsted("1714997405296");
        user.addNewRequsted("1714997093687");

        //將測試用資料放入資料庫
        this.FriendRepositoryThread(user);

        return user;
    }

}
