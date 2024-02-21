package com.example.demo;


import com.example.demo.service.AESEncryption;
import com.example.demo.service.ConfigService;
import com.example.demo.service.RecordItem;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.SpringBootVersion;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;


@SpringBootApplication
//@ComponentScan(basePackages = "com.example.demo")
public class DemoApplication {
    public static void main(String[] args) throws Exception {
//		SpringApplication.run(DemoApplication.class, args);
        ConfigService configService = new ConfigService();
        RecordItem newItem = new RecordItem("car", "DiaryProduct", 1.02, "KgCo2", "plastic", null);
        configService.updateNewContent("daily", newItem);
    }

}
