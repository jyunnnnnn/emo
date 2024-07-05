package com.example.demo.entity;

public class userDefined_line {
    private Double lat;
    private Double lng;
    public userDefined_line(Double lat, Double lng){
        this.lat=lat;
        this.lng=lng;
    }

    public Double getLat() {
        return lat;
    }

    public Double getLng() {
        return lng;
    }

    public void setLat(Double lat) {
        this.lat = lat;
    }

    public void setLng(Double lng) {
        this.lng = lng;
    }

    @Override
    public String toString() {
        return
                "\nlat= "+lat+"\nlng= "+lng;
    }
}
