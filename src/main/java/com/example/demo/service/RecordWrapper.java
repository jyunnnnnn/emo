package com.example.demo.service;

import java.util.List;
import java.util.Map;

//減碳紀錄類別物件 含比較基準以及此類別的所有減碳紀錄事項
public class RecordWrapper {
    Map<String, Double> base;
    List<RecordItem> content;
    String name;

    @Override
    public String toString() {
        return
                "base=" + base + "\n" +
                        ", content=" + content
                ;
    }
}
