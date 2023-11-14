package com.example.demo.service;

import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    public static final int USER_NOT_FOUND = 0;//使用者不存在
    public static final int USER_FOUND = 1;//使用者存在
    private final UserRepository repository;

    @Autowired
    public UserService(UserRepository repository) {
        this.repository = repository;
    }

    //建立新使用者帳號
    public void createUser(String account, String password) {
        User user = new User(account, password);
        this.repository.save(user);
    }

    //帳號是否存在
    public int isAccountExists(String account) {
        User result = this.repository.findByAccount(account);
        if (result != null) return USER_FOUND;
        return USER_NOT_FOUND;
    }

    //帳號密碼是否正確
    public boolean isValidUser(String account, String password) {

        if (account.equals(this.repository.findByAccount(account).getAccount()) && password.equals(this.repository.findByAccount(account).getPassword())) {

            return true;
        }
        return false;
    }

}
