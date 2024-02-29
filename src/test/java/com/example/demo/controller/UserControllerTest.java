package com.example.demo.controller;

import com.example.demo.repository.UserRepository;
import com.example.demo.entity.User;
import com.example.demo.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import net.minidev.json.JSONArray;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


/*
    測試user controller
 */
@SpringBootTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@DisplayName("User Controller Test")
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;
    @MockBean
    private UserService userService;

    @Autowired
    private ObjectMapper objectMapper;

    private User user = new User("test", "test", "test", "Test", "test");


    /*
        測試註冊帳號
     */
    @Test
    @DisplayName("Register User Controller Test")
    void registerUser() throws Exception {
        //測試成功註冊帳號
        when(userService.createUser(any(User.class))).thenReturn(UserService.OK);
        mockMvc.perform(post("/api/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(user)))
                .andExpect(status().isOk())
                .andDo(MockMvcResultHandlers.print());


    }

    /*
        測試登入帳號
     */
    @Test
    @DisplayName("Login Test")
    void loginUser() throws Exception {

        //測試登入已存在的使用者
        when(userService.login(any(String.class), any(String.class))).thenReturn(UserService.OK);
        when(userService.findUserDataFromUsername(any(String.class))).thenReturn(user);
        mockMvc.perform(get("/api/login")
                        .param("username", user.getUsername())
                        .param("password", user.getPassword()))
                .andExpect(status().isOk())
                .andDo(MockMvcResultHandlers.print());
        //測試登入不存在使用者
        when(userService.login(any(String.class), any(String.class))).thenReturn(UserService.FAIL);
        when(userService.findUserDataFromUsername(any(String.class))).thenReturn(null);
        mockMvc.perform(get("/api/login")
                        .param("username", user.getUsername())
                        .param("password", user.getPassword()))
                .andExpect(status().isBadRequest())
                .andDo(MockMvcResultHandlers.print());
    }

    /*
        測試使用email和密碼更新密碼
     */
    @Test
    @DisplayName("Update Password Test")
    void updatePassword() throws Exception {
        //測試成功更新密碼
        when(userService.updatePassword(any(String.class), any(String.class)))
                .thenReturn(UserService.OK);

        mockMvc.perform(put("/api/update")
                        .param("userMail", user.getEmail())
                        .param("password", user.getPassword()))
                .andExpect(status().isOk())
                .andDo(MockMvcResultHandlers.print());
        //測試密碼修改失敗
        when(userService.updatePassword(any(String.class), any(String.class)))
                .thenReturn(UserService.FAIL);
        mockMvc.perform(put("/api/update")
                        .param("userMail", user.getEmail())
                        .param("password", user.getPassword()))
                .andExpect(status().isBadRequest())
                .andDo(MockMvcResultHandlers.print());
    }

    /*
    測試使用帳號更新密碼
    */
    @Test
    @DisplayName("Update Password By Username Test")
    void updateByUsername() throws Exception {
        when(userService.updatePasswordByUsername(any(String.class), any(String.class)))
                .thenReturn(UserService.OK);

        mockMvc.perform(put("/api/updateByUsername")
                        .param("username", user.getUsername())
                        .param("password", user.getPassword()))
                .andExpect(status().isOk())
                .andDo(MockMvcResultHandlers.print());

        when(userService.updatePasswordByUsername(any(String.class), any(String.class)))
                .thenReturn(UserService.FAIL);
        mockMvc.perform(put("/api/updateByUsername")
                        .param("username", user.getUsername())
                        .param("password", user.getPassword()))
                .andExpect(status().isBadRequest())
                .andDo(MockMvcResultHandlers.print());
    }

    /*
        測試帳號是否存在
     */
    @Test
    @DisplayName("Account Exist Test")
    void accountExist() throws Exception {
        //使用者存在測試
        when(userService.isAccountExists(any(String.class)))
                .thenReturn(UserService.USER_FOUND);
        mockMvc.perform(get("/api/accountExist")
                        .param("userMail", user.getEmail()))
                .andExpect(status().isOk())
                .andDo(MockMvcResultHandlers.print());

        when(userService.isAccountExists(any(String.class)))
                .thenReturn(UserService.USER_NOT_FOUND);
        mockMvc.perform(get("/api/accountExist")
                        .param("userMail", user.getEmail()))
                .andExpect(status().isOk())
                .andDo(MockMvcResultHandlers.print());
    }

    /*
        刪除帳號測試
     */
    @Test
    @DisplayName("Delete Account Test")
    void deleteUserAccount() throws Exception {
        //帳號刪除過程成功測試
        when(userService.deleteAccountByUserId(any(String.class)))
                .thenReturn(null);
        mockMvc.perform(delete("/api/deleteUserAccount")
                        .param("userId", user.getUserId()))
                .andExpect(status().isOk())
                .andDo(MockMvcResultHandlers.print());
        //帳號刪除過程失敗測試
        when(userService.deleteAccountByUserId(any(String.class)))
                .thenThrow(NullPointerException.class);

        mockMvc.perform(delete("/api/deleteUserAccount")
                        .param("userId", user.getUserId()))
                .andExpect(status().isBadRequest())
                .andDo(MockMvcResultHandlers.print());
    }

    /*
        使用帳號查詢用戶
     */
    @Test
    @DisplayName("Check Account Existence By Username Test")
    void chekcAccountExistByUsername() throws Exception {
        //帳號查詢成功
        when(userService.fetchOneUserByUsername(any(String.class)))
                .thenReturn(user);
        mockMvc.perform(get("/api/checkAccountExistByUsername")
                        .param("username", user.getUsername()))
                .andExpect(status().isOk())
                .andDo(MockMvcResultHandlers.print());
        //帳號查詢失敗
        when(userService.fetchOneUserByUsername(any(String.class)))
                .thenReturn(null);
        mockMvc.perform(get("/api/checkAccountExistByUsername")
                        .param("username", user.getUsername()))
                .andExpect(status().isBadRequest())
                .andDo(MockMvcResultHandlers.print());
    }

    /*
        使用email檢查該使用者是否存在
     */
    @Test
    @DisplayName("Check Account By Email Test")
    void fetchSpecificAccountByEmail() throws Exception {
        //使用者存在
        when(userService.findSpecificAccountByEmail(any(String.class)))
                .thenReturn(user);
        mockMvc.perform(get("/api/checkSpecificAccountByEmail")
                        .param("userMail", user.getEmail()))
                .andExpect(status().isOk())
                .andDo(MockMvcResultHandlers.print());
        //使用者不存在
        when(userService.findSpecificAccountByEmail(any(String.class)))
                .thenReturn(null);
        mockMvc.perform(get("/api/checkSpecificAccountByEmail")
                        .param("userMail", user.getEmail()))
                .andExpect(status().isBadRequest())
                .andDo(MockMvcResultHandlers.print());
    }

    /*
        可否修改密碼
     */
    @Test
    @DisplayName("Password whether can be changed Test")
    void passwordChangable() throws Exception {
        //可修改密碼
        when(userService.checkPasswordChangable(any(String.class)))
                .thenReturn(UserService.OK);
        mockMvc.perform(get("/api/passwordChangable")
                        .param("username", user.getUsername()))
                .andExpect(status().isOk())
                .andDo(MockMvcResultHandlers.print());

        //不可修改密碼
        when(userService.checkPasswordChangable(any(String.class)))
                .thenReturn(UserService.FAIL);
        mockMvc.perform(get("/api/passwordChangable")
                        .param("username", user.getUsername()))
                .andExpect(status().isBadRequest())
                .andDo(MockMvcResultHandlers.print());
    }

    /*
        給予密碼修改權限
     */
    @Test
    @DisplayName("Permit Password can be changed Test")
    void allowChangePassword() throws Exception {
        //可修改密碼
        when(userService.allowChangePassword(any(String.class)))
                .thenReturn(UserService.OK);
        mockMvc.perform(post("/api/allowChangePassword")
                        .param("username", user.getUsername()))
                .andExpect(status().isOk())
                .andDo(MockMvcResultHandlers.print());

        //不可修改密碼
        when(userService.allowChangePassword(any(String.class)))
                .thenReturn(UserService.FAIL);
        mockMvc.perform(post("/api/allowChangePassword")
                        .param("username", user.getUsername()))
                .andExpect(status().isBadRequest())
                .andDo(MockMvcResultHandlers.print());
    }

    /*
        修改暱稱
     */
    @Test
    @DisplayName("Nickname Update Test")
    void updateNickname() throws Exception {
        //修改暱稱成功
        when(userService.updateNicknameByUsername(any(String.class), any(String.class)))
                .thenReturn(UserService.OK);
        mockMvc.perform(put("/api/updateNickname")
                        .param("username", user.getUsername())
                        .param("nickname", user.getNickname()))
                .andExpect(status().isOk())
                .andDo(MockMvcResultHandlers.print());
        //修改暱稱失敗
        when(userService.updateNicknameByUsername(any(String.class), any(String.class)))
                .thenReturn(UserService.FAIL);
        mockMvc.perform(put("/api/updateNickname")
                        .param("username", user.getUsername())
                        .param("nickname", user.getNickname()))
                .andExpect(status().isBadRequest())
                .andDo(MockMvcResultHandlers.print());
    }

    /*
        Google登入
     */
    @Test
    @DisplayName("Google Login Test")
    void googleLogin() throws Exception {
        //google登入成功
        when(userService.googleLogin(any(String.class))).thenReturn(user);
        mockMvc.perform(post("/api/googleLogin")
                        .content(String.valueOf(user)))
                .andExpect(status().isOk())
                .andDo(MockMvcResultHandlers.print());
        //google登入失敗
        when(userService.googleLogin(any(String.class))).thenReturn(null);
        mockMvc.perform(post("/api/googleLogin")
                        .content(String.valueOf(user)))
                .andExpect(status().isBadRequest())
                .andDo(MockMvcResultHandlers.print());
    }
}