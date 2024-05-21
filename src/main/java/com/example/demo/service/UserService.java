package com.example.demo.service;

import com.example.demo.config.SecurityConfig;
import com.example.demo.entity.Authority;
import com.example.demo.entity.UserInfo;
import com.example.demo.repository.RecordRepository;
import com.example.demo.repository.UserRecordCounterRepository;
import com.example.demo.repository.UserRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.awt.image.BufferedImage;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class UserService {
    public static final int USER_NOT_FOUND = 0;//使用者不存在
    public static final int USER_FOUND = 1;//使用者存在

    public static final int CORRECT = 2;//登入資訊正確
    public static final int INCORRECT = 3;//登入資訊錯誤

    public static final int EXIST = 4;//存在
    public static final int NOT_EXIST = 5;//不存在

    public static final int ACCOUNT_ALREADY_EXIST = 6;//帳號已存在

    public static final int OK = 7;

    public static final int FAIL = 8;
    private UserRepository repository;
    private UserRecordCounterRepository userRecordCounterRepository;
    private RecordRepository recordRepository;



    private Map<String, Boolean> passwordChangable;//檢查該帳號是否可以更改密碼 (之後可以改成用重設密碼連結)

    public UserService() {
    }

    @Autowired
    public UserService(UserRepository repository, UserRecordCounterRepository userRecordCounterRepository, RecordRepository recordRepository) {
        this.repository = repository;
        passwordChangable = new HashMap<>();
        this.userRecordCounterRepository = userRecordCounterRepository;
        this.recordRepository = recordRepository;

    }


    //建立新使用者帳號
    public int createUser(UserInfo newUserInfo) throws Exception {
        //檢查帳號是否存在
        if (isAccountExists(newUserInfo.getUsername()) == UserService.USER_FOUND) {
            return ACCOUNT_ALREADY_EXIST;
        }
        newUserInfo.setPassword(SecurityConfig.passwordEncoder().encode(newUserInfo.getPassword()));
        //設定新帳戶為一般使用者
        newUserInfo.setAuthority(Authority.NORMAL.name());
        //儲存至雲端伺服器
        this.repository.save(newUserInfo);



        return OK;
    }

    public UserInfo findUserDataFromUsername(String username) {
        return this.repository.findByUsername(username);
    }

    //登入帳號
    public int login(String username, String password) {

        UserInfo userInfo = this.repository.findByUsername(username);
        if (userInfo == null) return FAIL;
        if (userInfo.getPassword().equals(password)) return OK;
        return FAIL;
    }

    //帳號是否存在
    public int isAccountExists(String username) {
        try {
            UserInfo result = this.repository.findByUsername(username);
            if (result != null) return USER_FOUND;
            return USER_NOT_FOUND;
        } catch (Exception err) {
            return USER_NOT_FOUND;
        }


    }

    //返回特定信箱的帳號資訊
    public UserInfo findSpecificAccountByEmail(String email) {
        return this.repository.findByEmail(email);
    }

    //電子郵件是否存在
    public int isEmailExists(String email) {
        UserInfo result = this.repository.findByEmail(email);
        if (result != null) return EXIST;
        return NOT_EXIST;
    }


    //抓取特定帳號資料
    public UserInfo fetchOneUserByUsername(String username) {
        return this.repository.findByUsername(username);
    }

    //修改密碼
    public int updatePassword(String email, String newPassword) {
        UserInfo result = this.repository.findByEmail(email);
        if (result != null) {
            UserInfo updatedUserInfo = new UserInfo(result.getUsername(), newPassword, result.getNickname(), email, result.getUserId(), result.getAuthority());
            this.repository.save(updatedUserInfo);
            return OK;
        }
        return FAIL;

    }

    public UserInfo deleteAccountByUserId(String UserId) {
        this.userRecordCounterRepository.deleteById(UserId);
        this.recordRepository.deleteByUserId(UserId);
        return this.repository.deleteByUserId(UserId);
    }

    public int updatePasswordByUsername(String username, String newPassword) {
        try {
            UserInfo userInfo = fetchOneUserByUsername(username);
            userInfo.setPassword(newPassword);
            this.repository.save(userInfo);
            return OK;
        } catch (Exception err) {
            System.err.println("修改" + username + "密碼過程出現問題");
            return FAIL;
        }
    }


    //檢查該帳號是否可以重設密碼
    public int checkPasswordChangable(String username) {

        //該帳號是否可以修改密碼
//        System.out.println(passwordChangable.get(username));
        if (passwordChangable.containsKey(username)) {
            //移除該帳號的修改密碼權限
            System.out.println(username + "可以修改密碼");
            passwordChangable.remove(username);
            return OK;
        }
        System.out.println(username + "不可修改密碼");
        return FAIL;
    }

    //切換帳號至可切換密碼模式
    public int allowChangePassword(String username) {
        if (isAccountExists(username) == UserService.USER_NOT_FOUND)
            return FAIL;

        passwordChangable.put(username, Boolean.TRUE);

        return OK;
    }

    public int updateNicknameByUsername(String username, String nickname) {
        //檢查帳號是否存在
        UserInfo result = this.repository.findByUsername(username);
        if (result != null) {
            UserInfo updatedUserInfo = new UserInfo(result.getUsername(), result.getPassword(), nickname, result.getEmail(), result.getUserId(), result.getAuthority(), result.getPhoto());
            this.repository.save(updatedUserInfo);
            return OK;
        }
        return FAIL;
    }

    public UserInfo googleLogin(String googleData) throws Exception {
        /*
            帳號:@ + 電子郵件去除@之後的字串
            密碼:jsonNode.get('sub') 以Google帳號特殊ID為密碼
            nickname:jsonNode.get('name') 以該Google帳號名稱作為暱稱
            email:email
            userId:getTime()
         */
        ObjectMapper objectMapper = new ObjectMapper();

        // 轉換json字串
        JsonNode jsonNode = objectMapper.readTree(googleData);


        //----------------提取使用者資訊----------------
        String username = String.valueOf(jsonNode.get("email"));
        username = "@Google-" + username.substring(1, username.indexOf('@'));


        String password = SecurityConfig.passwordEncoder().encode("dummy");

        String nickname = String.valueOf(jsonNode.get("name"));
        nickname = nickname.substring(1, nickname.length() - 1);
        String email = String.valueOf(jsonNode.get("email"));
        email = email.substring(1, email.length() - 1);
        String userId = String.valueOf(new Date().getTime());

        UserInfo googleUserInfo = new UserInfo(username, password, nickname, email, userId, Authority.NORMAL.name());
        //----------------提取使用者資訊----------------

        if (repository.findByUsername(username) == null) {
            repository.save(googleUserInfo);
            return googleUserInfo;
        } else
            return repository.findByUsername(username);


    }

    public int updatePhoto(String username, String photo) {
        UserInfo result = this.repository.findByUsername(username);
        if (result != null) {
            UserInfo updatedUserInfo = new UserInfo(result.getUsername(), result.getPassword(), result.getNickname(), result.getEmail(), result.getUserId(), result.getAuthority(), photo);
            this.repository.save(updatedUserInfo);
            return OK;
        }
        return FAIL;
    }

}
