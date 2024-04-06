package com.example.demo.entity;

import java.util.Map;

//管理員頁面更新大類別基準，傳送至後端的json反序列化物件
public class UpdateRecordClassBaseRequest {
    private Map<String, Double> base;
    private String name;

    public UpdateRecordClassBaseRequest() {
    }

    public UpdateRecordClassBaseRequest(Map<String, Double> base, String name) {
        this.base = base;
        this.name = name;
    }

    public Map<String, Double> getBase() {
        return base;
    }

    public void setBase(Map<String, Double> base) {
        this.base = base;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "UpdateRecordClassBaseRequest{" +
                "base=" + base +
                ", name='" + name + '\'' +
                '}';
    }
}
