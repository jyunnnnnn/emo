class smoothTracking {
    constructor(data) {
        this.rawData = data;
    }

    smoothData() {
        for (let i = 2; i < this.rawData.length; i++) {
            let current = this.rawData[i];
            let previous = this.rawData[i - 1];
            let pre_previous = this.rawData[i - 2];

            // 對lat修正
            if (previous.lat === pre_previous.lat && previous.lng !== pre_previous.lng) {
                this.rawData[i - 1].lat =  (current.lat + pre_previous.lat)/2;
            }else if (previous.lng === pre_previous.lng && previous.lat !== pre_previous.lat) {
                // 對lng修正
                this.rawData[i - 1].lng =  (current.lng + pre_previous.lng)/2;
            }
        }
    }
    getData(){
        return this.rawData;
    }
}