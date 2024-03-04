class KalmanFilter {
    constructor() {
        this.minAccuracy = 1;
        this.Q_metres_per_second = 0; // 狀態預測誤差(m/s)，越小越依賴測量值 (3是別人提供的走路時的數值，速度快要跟著變大)
        this.TimeStamp_milliseconds = 0; // 記錄位置獲取時間(ms)
        this.lat = 0;
        this.lng = 0;
        // variance 變異數 負數表示物件未初始化。 注意：單位無關，只要永遠使用相同的單位即可
        this.variance = -1;
        //console.log("KF以初始化");
    }

    process(lat_measurement, lng_measurement, TimeStamp_milliseconds, accuracy) {
        if (accuracy < this.minAccuracy) accuracy = this.minAccuracy;
        console.log("accuracy "+accuracy);
        if (this.variance < 0) {
            // 如果變異數 < 0，則初始化對象，以目前值初始化
            this.TimeStamp_milliseconds = TimeStamp_milliseconds;
            this.lat = lat_measurement;
            this.lng = lng_measurement;
            this.variance = accuracy * accuracy;
        } else {
            // 否則套用卡爾曼濾波器方法
            const TimeInc_milliseconds = TimeStamp_milliseconds - this.TimeStamp_milliseconds;
            // 試一下加入速度判斷設置Q，預測會不會好一點
            const point1 = new google.maps.LatLng(lat_measurement, lng_measurement);
            const point2 = new google.maps.LatLng(this.lat, this.lng);
            const distance = google.maps.geometry.spherical.computeDistanceBetween(point1, point2);
            const speed = distance / (TimeInc_milliseconds / 1000);
            if(speed >= 20) this.Q_metres_per_second = 20;
            else if (speed >= 60) this.Q_metres_per_second = 60;
            else this.Q_metres_per_second = 3;
            if (TimeInc_milliseconds > 0) {
                // 隨時間過去，目前位置的不確定性增加
                // 對上個位置做預測
                this.lat += (TimeInc_milliseconds/ 1000) * this.Q_metres_per_second;
                this.lng += (TimeInc_milliseconds/ 1000) * this.Q_metres_per_second;
                // console.log("variance: "+this.variance);
                this.variance += (TimeInc_milliseconds / 1000) * this.Q_metres_per_second* this.Q_metres_per_second;
                // console.log("this.Q_metres_per_second: "+this.Q_metres_per_second);
                this.TimeStamp_milliseconds = TimeStamp_milliseconds;
                // console.log("variance: "+this.variance);
            }

            // Kalman增益係數 K = Covarariance * Inverse(Covariance + MeasurementVariance) K越大越相信測量值(0-1)
            const K = this.variance / (this.variance + (accuracy * accuracy)); // K為增益係數，測量值和當前狀態估計值的相對權重
            // console.log(K);
            // apply K 輸出=預測+K*(測量-預測)
            this.lat += K * (lat_measurement - this.lat);
            this.lng += K * (lng_measurement - this.lng);
            // console.log("lat "+lat_measurement,"lng"+lng_measurement);
            // console.log("latt "+this.lat,"lngg "+this.lng);
            // 新的變異數為 (IdentityMatrix - K) * Covarariance
            this.variance *= (1 - K);
        }
    }

    getState() {
        return { lat: this.lat, lng: this.lng };
    }
}