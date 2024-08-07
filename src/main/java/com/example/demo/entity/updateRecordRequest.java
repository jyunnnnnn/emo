package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;
import java.util.Map;

//更新單一紀錄項目
public class updateRecordRequest {

    @JsonProperty("content")
    private RecordItem content;

    @JsonProperty("svg")
    private Map<String,String> svg;

    public updateRecordRequest(RecordItem content) {
        this.content = content;
    }
    public updateRecordRequest(){

    }

    public Map<String, String> getSvg() {
        return svg;
    }

    public void setSvg(Map<String, String> svg) {
        this.svg = svg;
    }

    public RecordItem getContent() {
        return content;
    }

    public void setContent(RecordItem content) {
        this.content = content;
    }


    @Override
    public String toString() {
        return "updateRecordRequest{" +
                "content=" + content +
                '}';
    }
}
