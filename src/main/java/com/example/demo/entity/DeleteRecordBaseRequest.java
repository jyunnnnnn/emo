package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class DeleteRecordBaseRequest {

    @JsonProperty("className")
    private String className;
    @JsonProperty("name")
    private List<String> targets;

    public String getClassName() {
        return className;
    }

    public void setClassName(String className) {
        this.className = className;
    }

    public List<String> getTargets() {
        return targets;
    }

    public void setTargets(List<String> targets) {
        this.targets = targets;
    }

    public DeleteRecordBaseRequest() {
    }

    public DeleteRecordBaseRequest(String className, List<String> targets) {
        this.className = className;
        this.targets = targets;
    }

    @Override
    public String toString() {
        return "DeleteRecordBaseRequest{" +
                "className='" + className + '\'' +
                ", targets=" + targets +
                '}';
    }
}
