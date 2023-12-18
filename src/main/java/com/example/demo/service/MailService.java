package com.example.demo.service;

import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.security.SecureRandom;
import java.util.*;

import javax.mail.Authenticator;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

@Service
public class MailService {

    private final String SenderEmail = "penny85946256@gmail.com";//寄送者mail
    private final String senderName ="EmoTeam";//寄件人名稱
    private Map<String, String> validCode = new HashMap<>();//紀錄電子郵件驗證碼
    private Map<String, Boolean> valid = new HashMap<>();//紀錄某電子郵件是否可以再寄送驗證碼
    private Map<String,TimerTask> timer = new HashMap<>();
    private final Timer cTimer = new Timer();
    private final String APIKey = "gznpcmfhredpnfhk";// 電子郵件API金鑰
    public static final int MAIL_VALIDCODE_CORRECT = 0;// 電子郵件驗證碼正確
    public static final int MAIL_VALIDCODE_INCORRECT = 1;// 電子郵件驗證碼錯誤

    // 檢查是否可以寄送驗證碼
    public static final int OK = 2;
    public static final int REJECT = 3;


    public MailService() {//Null constructor

    }

    // 產生驗證碼
    private String generateValidCode() {

        SecureRandom random = new SecureRandom();

        String validCode = "";// 儲存產生的驗證碼

        String digits;

        for (int i = 0; i < 6; i++) {
            digits = String.format("%d", random.nextInt(10));
            validCode = validCode + digits;
        }
        return validCode;

    }

    // 寄送驗證碼(email)
    public void sendMail(String userMail) throws MessagingException {

        Properties props = new Properties();
        // Setting mail proctocol detail
        props.put("mail.smtp.ssl.protocols", "TLSv1.2");
        props.put("mail.smtp.host", "smtp.gmail.com");
        props.put("mail.smtp.port", "465");
        props.put("mail.smtp.socketFactory.port", "465");
        props.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.ssl.enable", "true");

        Session session = Session.getInstance(props, new Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(SenderEmail, APIKey);
            }
        });

        try {

            Message message = new MimeMessage(session);

            message.setFrom(new InternetAddress(SenderEmail,senderName));

            message.setRecipients(Message.RecipientType.TO,
                    InternetAddress.parse(userMail));

            message.setSubject("EMO-App驗證碼寄送 ");

            String genCode = generateValidCode();

            message.setText("歡迎使用EMO app環保地圖應用程式，這是您的驗證碼:" + genCode + "，請在5分鐘內使用");

            validCode.put(userMail, genCode);//記錄某電子郵件驗證碼
            valid.put(userMail, Boolean.FALSE);//該電子郵件5分鐘內不得再寄送驗證碼

            Transport.send(message);

            System.out.println(userMail + "電子郵件驗證碼寄送成功!");
            TimerTask task = new Expired(userMail);
            timer.put(userMail,task);
            cTimer.schedule(task, 5 * 60 * 1000);// 啟動計時器 5分鐘後讓驗證碼失效

        } catch (MessagingException e) {
            e.printStackTrace();
            throw new MessagingException();
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }

    }

    //    驗證是否可以再次發送驗證碼至特定電子郵件
    public int SendRequest(String userMail) {

        if (valid.get(userMail) == Boolean.FALSE)//不可再次發送驗證碼
            return REJECT;
        return OK;
    }

    //     驗證驗證碼是否正確
    public int validCodeVerify(String userMail, String userInput) {


        try {
            if (validCode.get(userMail).equals(userInput)) {//使用者輸入驗證碼正確
                validCode.remove(userMail);//清除該使用者的驗證碼
                valid.remove(userMail);//不再限制該使用者傳送驗證碼
                timer.get(userMail).cancel();//取消計時計時器
                timer.remove(userMail);//移除計時器
                return MAIL_VALIDCODE_CORRECT;
            }
        } catch (Exception e) {// 找不到該電子郵件的驗證碼
            return MAIL_VALIDCODE_INCORRECT;
        }

        return MAIL_VALIDCODE_INCORRECT;
    }

    //計時時間到後，使用者可再次要求發送驗證碼
    class Expired extends TimerTask {

        private String userMail;

        public Expired(String userMail) {
            this.userMail = userMail;
        }

        public void run() {
            System.out.println(userMail + "時間已到，可再次發送驗證碼");
            valid.remove(userMail);
            timer.get(userMail).cancel();
            timer.remove(userMail);
        }
    }
}
