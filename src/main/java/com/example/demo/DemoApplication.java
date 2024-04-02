package com.example.demo;


import com.example.demo.service.AchievementService;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
//@ComponentScan(basePackages = "com.example.demo")
public class DemoApplication {
    public static void main(String[] args) throws Exception {
	 SpringApplication.run(DemoApplication.class, args);
    }

}
