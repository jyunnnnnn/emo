package com.example.demo.controller;

import com.example.demo.entity.UserInfo;
import com.example.demo.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


/*
    測試user controller
 */
@SpringBootTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@DisplayName("UserInfo Controller Test")
class UserInfoControllerTest {

    @Autowired
    private MockMvc mockMvc;
    @MockBean
    private UserService userService;

    @Autowired
    private ObjectMapper objectMapper;

    private UserInfo userInfo = new UserInfo("test", "test", "test", "Test", "test");


    /*
        測試註冊帳號
     */
    @Test
    @DisplayName("Register UserInfo Controller Test")
    void registerUser() throws Exception {
        //測試成功註冊帳號
        when(userService.createUser(any(UserInfo.class))).thenReturn(UserService.OK);
        mockMvc.perform(post("/user/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(userInfo)))
                .andExpect(status().isOk())
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

        mockMvc.perform(put("/user/update")
                        .param("userMail", userInfo.getEmail())
                        .param("password", userInfo.getPassword()))
                .andExpect(status().isOk())
                .andDo(MockMvcResultHandlers.print());
        //測試密碼修改失敗
        when(userService.updatePassword(any(String.class), any(String.class)))
                .thenReturn(UserService.FAIL);
        mockMvc.perform(put("/user/update")
                        .param("userMail", userInfo.getEmail())
                        .param("password", userInfo.getPassword()))
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

        mockMvc.perform(put("/user/updateByUsername")
                        .param("username", userInfo.getUsername())
                        .param("password", userInfo.getPassword()))
                .andExpect(status().isOk())
                .andDo(MockMvcResultHandlers.print());

        when(userService.updatePasswordByUsername(any(String.class), any(String.class)))
                .thenReturn(UserService.FAIL);
        mockMvc.perform(put("/user/updateByUsername")
                        .param("username", userInfo.getUsername())
                        .param("password", userInfo.getPassword()))
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
        mockMvc.perform(get("/user/accountExist")
                        .param("userMail", userInfo.getEmail()))
                .andExpect(status().isOk())
                .andDo(MockMvcResultHandlers.print());

        when(userService.isAccountExists(any(String.class)))
                .thenReturn(UserService.USER_NOT_FOUND);
        mockMvc.perform(get("/user/accountExist")
                        .param("userMail", userInfo.getEmail()))
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
        mockMvc.perform(delete("/user/deleteUserAccount")
                        .param("userId", userInfo.getUserId()))
                .andExpect(status().isOk())
                .andDo(MockMvcResultHandlers.print());
        //帳號刪除過程失敗測試
        when(userService.deleteAccountByUserId(any(String.class)))
                .thenThrow(NullPointerException.class);

        mockMvc.perform(delete("/user/deleteUserAccount")
                        .param("userId", userInfo.getUserId()))
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
                .thenReturn(userInfo);
        mockMvc.perform(get("/user/checkAccountExistByUsername")
                        .param("username", userInfo.getUsername()))
                .andExpect(status().isOk())
                .andDo(MockMvcResultHandlers.print());
        //帳號查詢失敗
        when(userService.fetchOneUserByUsername(any(String.class)))
                .thenReturn(null);
        mockMvc.perform(get("/user/checkAccountExistByUsername")
                        .param("username", userInfo.getUsername()))
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
                .thenReturn(userInfo);
        mockMvc.perform(get("/user/checkSpecificAccountByEmail")
                        .param("userMail", userInfo.getEmail()))
                .andExpect(status().isOk())
                .andDo(MockMvcResultHandlers.print());
        //使用者不存在
        when(userService.findSpecificAccountByEmail(any(String.class)))
                .thenReturn(null);
        mockMvc.perform(get("/user/checkSpecificAccountByEmail")
                        .param("userMail", userInfo.getEmail()))
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
        mockMvc.perform(get("/user/passwordChangable")
                        .param("username", userInfo.getUsername()))
                .andExpect(status().isOk())
                .andDo(MockMvcResultHandlers.print());

        //不可修改密碼
        when(userService.checkPasswordChangable(any(String.class)))
                .thenReturn(UserService.FAIL);
        mockMvc.perform(get("/user/passwordChangable")
                        .param("username", userInfo.getUsername()))
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
        mockMvc.perform(post("/user/allowChangePassword")
                        .param("username", userInfo.getUsername()))
                .andExpect(status().isOk())
                .andDo(MockMvcResultHandlers.print());

        //不可修改密碼
        when(userService.allowChangePassword(any(String.class)))
                .thenReturn(UserService.FAIL);
        mockMvc.perform(post("/user/allowChangePassword")
                        .param("username", userInfo.getUsername()))
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
        mockMvc.perform(put("/user/updateNickname")
                        .param("username", userInfo.getUsername())
                        .param("nickname", userInfo.getNickname()))
                .andExpect(status().isOk())
                .andDo(MockMvcResultHandlers.print());
        //修改暱稱失敗
        when(userService.updateNicknameByUsername(any(String.class), any(String.class)))
                .thenReturn(UserService.FAIL);
        mockMvc.perform(put("/user/updateNickname")
                        .param("username", userInfo.getUsername())
                        .param("nickname", userInfo.getNickname()))
                .andExpect(status().isBadRequest())
                .andDo(MockMvcResultHandlers.print());
    }


}