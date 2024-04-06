package com.example.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class IndexController {
    //index page url setting
    @GetMapping("/index")
    public String showIndex() {
        return "index";
    }

    @GetMapping("/")
    public String Index() {
        return "index";
    }

}
