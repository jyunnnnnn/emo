package com.example.demo.entity;

//管理員頁面更新大類別顏色，傳送至後端的json反序列化物件
public class UpdateRecordClassColorRequest {
    private String color;
    private String name;

    public UpdateRecordClassColorRequest() {
    }

    public UpdateRecordClassColorRequest(String color, String name) {
        this.color = color;
        this.name = name;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "UpdateRecordClassColorRequest{" +
                "color='" + color + '\'' +
                ", name='" + name + '\'' +
                '}';
    }
}
