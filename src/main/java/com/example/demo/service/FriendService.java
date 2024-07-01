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
                friendRepository.save(newFriendEntity);
            }
        });
    }


    //新增好友 userId向target使用者發送好友邀請
    public void addFriend(String userId, String target) {

        int idx1 = friendEntityListIndex.containsKey(userId) ? friendEntityListIndex.get(userId) : -1;

        int idx2 = friendEntityListIndex.containsKey(target) ? friendEntityListIndex.get(target) : -1;


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

        FriendEntity user1 = friendEntityList.get(idx1);

        FriendEntity user2 = friendEntityList.get(idx2);

        //userId和target使用者互相為彼此的好友 兩者互相擁有彼此的某些資訊

        // * new FriendInfo() 需要修改成實際資訊 未來需要考慮即時性問題(好友可能會隨時更新數據)
        user1.addNewFriendInfo(target, new FriendInfo());
        user2.addNewFriendInfo(target, new FriendInfo());

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
    public Map<String, FriendInfo> getAllFriend(String userId) {
        return friendEntityListIndex.containsKey(userId) ? friendEntityList.get(friendEntityListIndex.get(userId)).getFriendList() : null;
    }

}
