package com.example.demo.controller;

import com.example.demo.service.MailService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;

import javax.mail.MessagingException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/*
    Mail Controller 測試
 */
@SpringBootTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@DisplayName("Mail Controller Test")
class MailControllerTest {

    @MockBean
    private MailService mailService;

    @Autowired
    private MockMvc mockMvc;

    private String testMail = "test@gmail.com";
    private String testInput = "test";

    /*
        驗證碼寄送測試
     */
    @Test
    @DisplayName("Send Verifying Code Test")
    void sendVerifyingCode() throws Exception {
        //成功寄送驗證馬
        doNothing().when(mailService).sendMail(any(String.class));
        mockMvc.perform(post("/mail/sendVerifyingCode")
                        .param("userMail", testMail))
                .andExpect(status().isOk())
                .andDo(MockMvcResultHandlers.print());

        //季送驗證碼失敗
        doThrow(NullPointerException.class).when(mailService).sendMail(any(String.class));

        mockMvc.perform(post("/mail/sendVerifyingCode")
                        .param("userMail", testMail))
                .andExpect(status().isBadRequest())
                .andDo(MockMvcResultHandlers.print());

    }

    /*
        驗證碼正確性測試
     */
    @Test
    @DisplayName("Match Verifying Code Test")
    void matchVerifyingCode() throws Exception {
        //驗證碼輸入正確
        when(mailService.validCodeVerify(any(String.class), any(String.class)))
                .thenReturn(MailService.MAIL_VALIDCODE_CORRECT);

        mockMvc.perform(get("/mail/matchVerifyingCode")
                        .param("userMail", testMail)
                        .param("userInput", testInput))
                .andExpect(status().isOk())
                .andDo(MockMvcResultHandlers.print());
        //驗證碼輸入錯誤
        when(mailService.validCodeVerify(any(String.class), any(String.class)))
                .thenReturn(MailService.MAIL_VALIDCODE_INCORRECT);
        mockMvc.perform(get("/mail/matchVerifyingCode")
                        .param("userMail", testMail)
                        .param("userInput", testInput))
                .andExpect(status().isBadRequest())
                .andDo(MockMvcResultHandlers.print());

    }

    /*
        該使用者可否在發送驗證碼
     */
    @Test
    @DisplayName("Send Code Permission Test")
    void sendAgain() throws Exception {
        //可再次發送驗證碼
        when(mailService.SendRequest(any(String.class))).thenReturn(MailService.OK);
        mockMvc.perform(get("/mail/sendAgain")
                        .param("userMail", testMail))
                .andExpect(status().isOk())
                .andDo(MockMvcResultHandlers.print());
        //不可發送驗證碼
        when(mailService.SendRequest(any(String.class))).thenReturn(MailService.REJECT);
        mockMvc.perform(get("/mail/sendAgain")
                        .param("userMail", testMail))
                .andExpect(status().isBadRequest())
                .andDo(MockMvcResultHandlers.print());
    }
}