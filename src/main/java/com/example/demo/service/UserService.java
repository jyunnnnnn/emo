package com.example.demo.service;

import com.example.demo.repository.UserRepository;
import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
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
    private final UserRepository repository;

    private Map<String, Boolean> passwordChangable;//檢查該帳號是否可以更改密碼 (之後可以改成用重設密碼連結)

    @Autowired
    public UserService(UserRepository repository) {
        this.repository = repository;
        passwordChangable = new HashMap<>();
    }


    //建立新使用者帳號
    public int createUser(User newUser) throws Exception {
        //檢查帳號是否存在
        if (isAccountExists(newUser.getUsername()) == UserService.USER_FOUND) {
            return ACCOUNT_ALREADY_EXIST;
        }
        newUser.setPassword(new AESEncryption().encrypt(newUser.getPassword()));
        this.repository.save(newUser);
        return OK;
    }

    public User findUserDataFromUsername(String username) {
        return this.repository.findByUsername(username);
    }

    //登入帳號
    public int login(String username, String password) {

        User user = this.repository.findByUsername(username);
        if (user == null) return FAIL;
        if (user.getPassword().equals(password)) return OK;
        return FAIL;
    }

    //帳號是否存在
    public int isAccountExists(String username) {
        User result = this.repository.findByUsername(username);
        if (result != null) return USER_FOUND;
        return USER_NOT_FOUND;
    }

    //返回特定信箱的帳號資訊
    public User findSpecificAccountByEmail(String email) {
        return this.repository.findByEmail(email);
    }

    //電子郵件是否存在
    public int isEmailExists(String email) {
        User result = this.repository.findByEmail(email);
        if (result != null) return EXIST;
        return NOT_EXIST;
    }

    //帳號密碼是否正確
    public int isValidUser(String username, String userInputPassword) {
        User user = this.repository.findByUsername(username);
        if (username.equals(user.getUsername()) && userInputPassword.equals(user.getPassword())) {
            return CORRECT;
        }
        return INCORRECT;
    }

    //抓取特定帳號資料
    public User fetchOneUserByUsername(String username) {
        return this.repository.findByUsername(username);
    }

    //修改密碼
    public int updatePassword(String email, String newPassword) {
        User result = this.repository.findByEmail(email);
        if (result != null) {
            User updatedUser = new User(result.getUsername(), newPassword, result.getNickname(), email, result.getUserId());
            this.repository.save(updatedUser);
            return OK;
        }
        return FAIL;

    }

    public User deleteAccountByUserId(String UserId) {
        return this.repository.deleteByUserId(UserId);
    }

    public int updatePasswordByUsername(String username, String newPassword) {
        try {
            User user = fetchOneUserByUsername(username);
            user.setPassword(newPassword);
            this.repository.save(user);
            return OK;
        } catch (Exception err) {
            System.err.println("修改" + username + "密碼過程出現問題");
            return FAIL;
        }
    }


    //檢查該帳號是否可以重設密碼
    public int checkPasswordChangable(String username) {

        //該帳號是否可以修改密碼
        System.out.println(passwordChangable.get(username));
        if (passwordChangable.containsKey(username)) {
            //移除該帳號的修改密碼權限
            System.out.println(username + "可以修改密碼");
            passwordChangable.remove(username);
            return OK;
        }
        return FAIL;
    }

    //切換帳號至可切換密碼模式
    public int allowChangePassword(String username) {
        if (isAccountExists(username) == UserService.USER_NOT_FOUND)
            return FAIL;

        passwordChangable.put(username, Boolean.TRUE);

        return OK;
    }
    public int updateNicknameByUsername(String  username, String nickname) {
        //檢查帳號是否存在
        User result = this.repository.findByUsername(username);
        if (result != null) {
            User updatedUser = new User(result.getUsername(), result.getPassword(), nickname, result.getEmail(), result.getUserId());
            this.repository.save(updatedUser);
            return OK;
        }
        return FAIL;
    }
    public User googleLogin(String googleData) throws Exception {
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

        String password = String.valueOf(jsonNode.get("sub"));
        password = new AESEncryption().encrypt(password.substring(1, password.length() - 1)) ;
        String nickname = String.valueOf(jsonNode.get("name"));
        nickname = nickname.substring(1, nickname.length() - 1);
        String email = String.valueOf(jsonNode.get("email"));
        email = email.substring(1, email.length() - 1);
        String userId = String.valueOf(new Date().getTime());


        User googleUser = new User(username, password, nickname, email, userId);
        //----------------提取使用者資訊----------------

        //建立使用者 or 使用者登入
        int result = createUser(googleUser);

        if (result == OK) {//該google帳戶不存在，註冊帳戶
            return googleUser;
        } else if (result == ACCOUNT_ALREADY_EXIST) {//該帳戶已存在
            return fetchOneUserByUsername(username);
        }

        return null;
    }
}
