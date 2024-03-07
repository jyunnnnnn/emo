package com.example.demo.entity;

public class DotOfLine {
    private Double TimeStamp_milliseconds;
    private Double accuracy;
    private Double lat;
    private Double lng;
    public DotOfLine(Double TimeStamp_milliseconds, Double accuracy, Double lat, Double lng){
        this.accuracy=accuracy;
        this.lat=lat;
        this.lng=lng;
        this.TimeStamp_milliseconds=TimeStamp_milliseconds;
    }

    public Double getAccuracy() {
        return accuracy;
    }

    public Double getLat() {
        return lat;
    }

    public Double getLng() {
        return lng;
    }

    public Double getTimeStamp_milliseconds() {
        return TimeStamp_milliseconds;
    }

    public void setAccuracy(Double accuracy) {
        this.accuracy = accuracy;
    }

    public void setLat(Double lat) {
        this.lat = lat;
    }

    public void setLng(Double lng) {
        this.lng = lng;
    }

    public void setTimeStamp_milliseconds(Double timeStamp_milliseconds) {
        this.TimeStamp_milliseconds = timeStamp_milliseconds;
    }

    @Override
    public String toString() {
        return "accuracy= "+accuracy+"\n" +
                "TimeStamp_milliseconds= "+TimeStamp_milliseconds+
                "\nlat= "+lat+"\nlng= "+lng;
    }
}
