package com.example.demo.service;

import com.example.demo.entity.AESEncryption;
import com.example.demo.entity.UserInfo;
import com.example.demo.repository.RecordRepository;
import com.example.demo.repository.UserRecordCounterRepository;
import com.example.demo.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@SpringBootTest
@DisplayName("UserInfo Service Layer Test")
class UserInfoServiceTest {

    @Spy
    private UserRepository repository;
    @Spy
    private UserRecordCounterRepository userRecordCounterRepository;
    @Spy
    private RecordRepository recordRepository;
    @Mock
    private AESEncryption aesEncryption;
    @InjectMocks
    private UserService userService;
    @Mock
    private Map<String, Boolean> passwordChangable;

    private UserInfo testUserInfo;

    @BeforeEach
    public void setUp() {
        testUserInfo = new UserInfo("test", "test001", "testUserInfo@gmail.com", "testUserId");
    }

    @Test
    @DisplayName("Create New UserInfo Test")
    void createUser() throws Exception {
        String targetUser = "test";

        when(this.repository.findByUsername(anyString())).thenReturn(testUserInfo);

        //測試已存在的使用者
        int result = this.userService.createUser(testUserInfo);

        //回傳已存在使用者常數
        assertEquals(result, userService.ACCOUNT_ALREADY_EXIST);

        //測試尚未註冊的使用者
        when(this.repository.findByUsername(anyString())).thenReturn(null);
        result = this.userService.createUser(testUserInfo);
        assertEquals(result, userService.OK);
    }

    @Test
    @DisplayName("Find UserInfo Data Using Username Test")
        //找尋特定使用者資訊
    void findUserDataFromUsername() {
        String target = "test";
        when(this.repository.findByUsername(target)).thenReturn(testUserInfo);
        UserInfo result = userService.findUserDataFromUsername(target);
        assertEquals(result.getUsername(), target);
    }

    @Test
    @DisplayName("Login Test")
    void login() {
        String target = "test";
        String targetPass = "test001";
        String targetPassFail = "test01";
        //成功登入
        when(this.repository.findByUsername(target)).thenReturn(testUserInfo);
        int result = this.userService.login(target, targetPass);

        assertEquals(result, this.userService.OK);
        //登入失敗
        result = this.userService.login(target, targetPassFail);
        assertEquals(result, this.userService.FAIL);//因密碼錯誤而失敗

        when(this.repository.findByUsername(target)).thenReturn(null);
        result = this.userService.login(target, targetPass);
        assertEquals(result, this.userService.FAIL);//因使用者不存在而失敗
    }

    @Test
    @DisplayName("Account Exists Test")
        //測試查詢帳號是否存在功能
    void isAccountExists() {
        String target = "test";
        when(this.repository.findByUsername(target)).thenReturn(testUserInfo);
        int result = this.userService.isAccountExists(target);
        //測試存在帳號
        assertEquals(result, this.userService.USER_FOUND);

        when(this.repository.findByUsername(target)).thenReturn(null);
        result = this.userService.isAccountExists(target);
        //測試不存在帳號
        assertEquals(result, this.userService.USER_NOT_FOUND);

    }

    @Test
    @DisplayName("Find UserInfo Using Email Test")
        //使用電子郵件查詢使用者資訊測試
    void findSpecificAccountByEmail() {
        String targetEmail = "testUserInfo@gmail.com";
        when(this.repository.findByEmail(targetEmail)).thenReturn(testUserInfo);
        UserInfo result = this.userService.findSpecificAccountByEmail(targetEmail);
        //查到該電子郵件對應的使用者
        assertEquals(result.getUserId(), testUserInfo.getUserId());

        //該電子郵件尚未被註冊
        when(this.repository.findByEmail(targetEmail)).thenReturn(null);
        result = this.userService.findSpecificAccountByEmail(targetEmail);
        assertEquals(result, null);
    }

    @Test
    @DisplayName("Email Exist Check Test")
        //查詢該電子郵件是否存在
    void isEmailExists() {
        String targetEmail = "testUserInfo@gmail.com";
        when(this.repository.findByEmail(targetEmail)).thenReturn(testUserInfo);
        int result = this.userService.isEmailExists(targetEmail);
        //查到該電子郵件對應的使用者
        assertEquals(result, this.userService.EXIST);

        //該電子郵件尚未被註冊
        when(this.repository.findByEmail(targetEmail)).thenReturn(null);
        result = this.userService.isEmailExists(targetEmail);
        assertEquals(result, this.userService.NOT_EXIST);
    }


    @Test
    @DisplayName("Update Password Test")
        //修改密碼功能測試
    void updatePassword() {
        String newPass = "test002";
        String targetEmail = "testUserInfo@gmail.com";
        UserInfo newUserInfo = testUserInfo;
        newUserInfo.setPassword(newPass);
        when(this.repository.findByEmail(targetEmail)).thenReturn(testUserInfo);
        int result = this.userService.updatePassword(targetEmail, newPass);
        //修改密碼成功
        assertEquals(result, this.userService.OK);

        //修改密碼失敗
        when(this.repository.findByEmail(targetEmail)).thenReturn(null);
        result = this.userService.updatePassword(targetEmail, newPass);
        assertEquals(result, this.userService.FAIL);
    }

    @Test
    @DisplayName("Delete Account Using UserId")
        //使用userId刪除特定帳號資訊
    void deleteAccountByUserId() {
        String target = "testUserId";
        when(this.repository.deleteByUserId(target)).thenReturn(testUserInfo);
        doNothing()
                .when(this.userRecordCounterRepository)
                .deleteById(target);
        doNothing()
                .when(this.recordRepository)
                .deleteByUserId(any(String.class));
        UserInfo result = this.userService.deleteAccountByUserId(target);
        //刪除對象為目標對象
        assertEquals(result.getUserId(), target);
    }

    @Test
    @DisplayName("Update Password Using Username Test")
        //使用帳號修改密碼
    void updatePasswordByUsername() {
        String target = "test";
        String newPass = "test002";
        when(this.repository.findByUsername(target)).thenReturn(testUserInfo);
        when(this.repository.save(any())).thenReturn(null);
        int result = this.userService.updatePasswordByUsername(target, newPass);
        //修改密碼成功
        assertEquals(result, this.userService.OK);

        //測試修改密碼過程出現錯誤
        when(this.repository.findByUsername(target)).thenThrow(new RuntimeException("Exception throwing test"));
        result = this.userService.updatePasswordByUsername(target, newPass);
        assertEquals(result, this.userService.FAIL);
    }

    @Test
    @DisplayName("Check if the password can be changed Test")
    void checkPasswordChangable() {
        String target = "test";
        when(passwordChangable.containsKey(target)).thenReturn(true);
        int result = this.userService.checkPasswordChangable(target);
        //可修改密碼帳號測試
        assertEquals(result, this.userService.OK);

        when(passwordChangable.containsKey(target)).thenReturn(false);
        result = this.userService.checkPasswordChangable(target);
        //不可修改密碼
        assertEquals(result, this.userService.FAIL);
    }

    @Test
    @DisplayName("Grant UserInfo to Change Password Test")
        //給予修改密碼權限測試
    void allowChangePassword() {
        String target = "test";
        when(this.repository.findByUsername(target)).thenReturn(testUserInfo);
        int result = this.userService.allowChangePassword(target);
        //成功賦予修改密碼權限
        assertEquals(result, this.userService.OK);

        when(this.repository.findByUsername(target)).thenReturn(null);
        result = this.userService.allowChangePassword(target);
        //賦予權限失敗 帳號不存在
        assertEquals(result, this.userService.FAIL);
    }

    @Test
    @DisplayName("Update Nickname Using Username Test")
        //修改暱稱測試
    void updateNicknameByUsername() {
        String target = "test";
        String newNickname = "testNewNickName";
        when(this.repository.findByUsername(target)).thenReturn(testUserInfo);
        when(this.repository.save(testUserInfo)).thenReturn(testUserInfo);
        int result = this.userService.updateNicknameByUsername(target, newNickname);
        //修改暱稱成功
        assertEquals(result, this.userService.OK);


        when(this.repository.findByUsername(target)).thenReturn(null);
        result = this.userService.updateNicknameByUsername(target, newNickname);
        //修改暱稱失敗
        assertEquals(result, this.userService.FAIL);
    }


}