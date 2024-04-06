package com.example.demo.service;
import java.util.Map;
public class SvgConfigurationWrapper {
    private Map<String, Map<String, String>> svgImages;

    public Map<String, Map<String, String>> getSvgImages() {
        return svgImages;
    }

    public void setSvgImages(Map<String, Map<String, String>> svgImages) {
        this.svgImages = svgImages;
    }
}