package com.example.demo.service;

import org.springframework.stereotype.Service;

@Service
public class UserService {
    public void createUser(String account, String password) {
        User user = new User();
    }

    public boolean isAccountExists(String account) {
        if (account.equals("test")){
            return  true;
        }
        return false;
    }

    public boolean isValidUser(String account, String password) {
        if (account!="" && password !=""){
            return true;
        }
        return false;
    }

}
