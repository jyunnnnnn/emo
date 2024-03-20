package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;
import java.util.Map;

//更新單一紀錄項目
public class updateRecordRequest {
    @JsonProperty("base")
    private Map<String, Double> base;
    @JsonProperty("color")
    private String color;

    @JsonProperty("content")
    private RecordItem content;
    @JsonProperty("name")
    private String name;

    public updateRecordRequest(Map<String, Double> base, String color, RecordItem content, String name) {
        this.base = base;
        this.color = color;
        this.content = content;
        this.name = name;
    }
    public updateRecordRequest(){

    }
    public Map<String, Double> getBase() {
        return base;
    }

    public void setBase(Map<String, Double> base) {
        this.base = base;
    }


    public RecordItem getContent() {
        return content;
    }

    public void setContent(RecordItem content) {
        this.content = content;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getColor() {
        return this.color;
    }

    public void setColor(String color) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "updateRecordRequest{" +
                "base=" + base +
                ", color='" + color + '\'' +
                ", content=" + content +
                ", name='" + name + '\'' +
                '}';
    }
}
