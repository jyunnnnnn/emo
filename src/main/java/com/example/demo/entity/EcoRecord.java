package com.example.demo.entity;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import java.util.List;

//紀錄物件
@Document(collection = "Emo_Record")
public class EcoRecord {
    @Id
    private String recordId;//紀錄id
    private String userId;//使用者id(哪個使用者的紀錄)
    private String classType;//紀錄類別 (EX:生活用品)
    private String type;//紀錄項目 (EX:環保杯)
    private double data_value; //紀錄項目數據 (EX:交通=>KM,環保餐具=>1個)
    private double latitude;//紀錄位置經度
    private double longitude;//紀錄位置緯度
    private String time;//紀錄時間

    private double footprint;//碳足跡

    private List<DotOfLine> lineOnMap; // 路線
    private List<userDefined_line> userDefinedLine;

    private double trafficKM; // 路線距離

    //constructor
    public EcoRecord(String userId, String classType, String type, double data_value, double latitude, double longitude,double footprint,String time,String recordId,List<DotOfLine> lineOnMap,List<userDefined_line> userDefinedLine) {
        this.recordId = recordId; ;
        this.userId = userId;
        this.classType = classType;
        this.type = type;
        this.data_value = data_value;
        this.latitude = latitude;
        this.longitude = longitude;
        this.time = time;
        this.footprint = footprint;
        this.lineOnMap = lineOnMap;
        this.userDefinedLine = userDefinedLine;
    }

    public String getRecordId() {
        return recordId;
    }

    public void setRecordId(String recordId) {
        this.recordId = recordId;
    }

    public String getClassType() {
        return classType;
    }

    public void setClassType(String classType) {
        this.classType = classType;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public double getData_value() {
        return data_value;
    }

    public void setData_value(double data_value) {
        this.data_value = data_value;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String user_id) {this.userId = user_id;}

    public void setFootprint(double Footprint) {
        this.footprint = Footprint;
    }

    public double getFootprint() {return footprint;}

    public List<DotOfLine> getLineOnMap(){
        return lineOnMap;
    }

    public List<userDefined_line> getUserDefinedLine() {
        return userDefinedLine;
    }

    public void setLineOnMap(List<DotOfLine> lineOnMap) {
        this.lineOnMap = lineOnMap;
    }

    public void setUserDefinedLine(List<userDefined_line> userDefinedLine) {
        this.userDefinedLine = userDefinedLine;
    }

    public String toString(){
        return "{" + '\n'+
                "recordId: " + recordId + '\n'+
                "userId: " + userId  +'\n'+
                "classType: "+classType +'\n'+
                "type: "+type+'\n'+
                "data_value: " +data_value+'\n'+
                "latitude: "+latitude+'\n'+
                "longitude: "+longitude +'\n'+
                "footprint: "+footprint +'\n'+
                "time: "+time+"}";
    }
}
