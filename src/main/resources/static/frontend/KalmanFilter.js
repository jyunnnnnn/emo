class KalmanFilter {
    constructor() {
        this.Q_metres_per_second = 1; // 狀態預測誤差(m/s)
        this.TimeStamp_milliseconds = 0;
        this.lat = 0;
        this.lng = 0;
        // variance 變異數 負數表示物件未初始化。 注意：單位無關，只要永遠使用相同的單位即可
        this.variance = -1;
        //console.log("KF以初始化");
    }

    process(lat_measurement, lng_measurement, TimeStamp_milliseconds) {
        if (this.variance < 0) {
            // 如果變異數 < 0，則初始化對象，以目前值初始化
            this.TimeStamp_milliseconds = TimeStamp_milliseconds;
            this.lat = lat_measurement;
            this.lng = lng_measurement;
            this.variance = 1;
        } else {
            // 否則套用卡爾曼濾波器方法
            const TimeInc_milliseconds = TimeStamp_milliseconds - this.TimeStamp_milliseconds;
            if (TimeInc_milliseconds > 0) {
                // 隨時間過去，目前位置的不確定性增加
                this.variance += TimeInc_milliseconds * this.Q_metres_per_second * this.Q_metres_per_second / 1000;
                this.TimeStamp_milliseconds = TimeStamp_milliseconds;
                console.log("TimeStamp_milliseconds: "+TimeStamp_milliseconds);
            }

            // Kalman增益係數 K = Covarariance * Inverse(Covariance + MeasurementVariance)
            const K = this.variance / (this.variance + 5); // K為增益係數，測量值和當前狀態估計值的相對權重(後面數字越小越依賴測量值)
            // apply K
            this.lat += K * (lat_measurement - this.lat);
            this.lng += K * (lng_measurement - this.lng);
            // 新的變異數為 (IdentityMatrix - K) * Covarariance
            this.variance = (1 - K) * this.variance;
        }
    }

    getState() {
        return { lat: this.lat, lng: this.lng };
    }
}