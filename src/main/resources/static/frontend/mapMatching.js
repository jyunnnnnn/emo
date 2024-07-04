const batch_size = 90; // roads api處理點上限
let processedBatchCount = 0;
let processedBatches = [];
function getApiKeyAndProcessBatchOfPoints(batch, batchIndex,points) {
    return fetch('/api/getApiKey')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(apiKey => {
            return processBatchOfPoints(batch, apiKey, batchIndex,points);
        })
        .catch(error => {
            console.error('Error getting API key:', error);
        });
}

function processBatchOfPoints(batch, apiKey, batchIndex,points) {
    const endpoint = 'https://roads.googleapis.com/v1/snapToRoads';

    const params = new URLSearchParams({
        interpolate: true, // 是否要進行線性插值
        key: apiKey
    });

    // 將每個點的座標轉換成格式為 'lat,lng' 的字符串
    const pointStrings = batch.map(point => `${point.lat},${point.lng}`).join('|');

    // 構建 POST 請求的 body
    const body = { path: pointStrings };

    return fetch(`${endpoint}?${params.toString()}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // 將數據存入 testFixPoints 中
            // 將 data.snappedPoints 中的元素直接添加到 testFixPoints 中
            processedBatches[batchIndex] = data.snappedPoints;
            console.log('Processed batch:', data.snappedPoints);
            processedBatchCount++;
            if (processedBatchCount === Math.ceil(points.length / batch_size)) {
                // 所有batch處理完
                handleProcessedBatches();
                processedBatchCount = 0;
                processedBatches = [];
            }
        })
        .catch(error => {
            console.error('Error processing batch:', error);
        });
}

function handleProcessedBatches() {
    // 按照原順序處理結果
    for (const batch of processedBatches) {
        testFixPoints.push(...batch);
    }
    recordedPositions =[];
    recordedPositions = testFixPoints.map(point => {
        return {
            lat: point.location.latitude,
            lng: point.location.longitude
        };
    });
    testFixPoints =[];
}
// 分批(上限100個點)
function processAllPoints(points) {
    // Promise確定處理完才返回
    return new Promise((resolve, reject) => {
        processedBatchCount = 0;
        processedBatches = [];
        const num_points = points.length;
        const num_batches = Math.ceil(num_points / batch_size);
        const batchPromises = [];

        for (let i = 0; i < num_batches; i++) {
            const start_index = i * batch_size;
            const end_index = Math.min((i + 1) * batch_size, num_points);
            const batch = points.slice(start_index, end_index);

            batchPromises.push(getApiKeyAndProcessBatchOfPoints(batch,i,points));
        }

        Promise.all(batchPromises)
            .then(() => {
                resolve();
            })
            .catch(error => {
                reject(error);
            });
    });
}

//------------------------------------------------------------------------------------------
//大眾運輸  direction api
function directionsDraw(rec, mode, whichRoad, callback) {
    console.log("mode ", mode);
    let directionsService = new google.maps.DirectionsService();
    let request = {
        origin: {lat: rec[0].lat, lng: rec[0].lng},
        destination: {lat: rec[rec.length - 1].lat, lng: rec[rec.length - 1].lng},
        travelMode: 'TRANSIT',
        transitOptions: {
            modes: [mode]
        },
        provideRouteAlternatives: true, //多條路徑
    };
    directionsService.route(request, function (response, status) {
        if (status === 'OK') {
            console.log(response.routes);
            let route = response.routes[whichRoad];
            // 移除步行部分，只保留乘坐大眾運輸工具的路線
            let transitSteps = route.legs[0].steps.filter(step => step.travel_mode !== 'WALKING');
            // 行經路線經緯度
            let pathCoordinates = [];
            transitSteps.forEach(step => {
                step.path.forEach(coord => {
                    pathCoordinates.push({lat: coord.lat(), lng: coord.lng()});
                });
            });
            console.log('Path coordinates:', pathCoordinates);
            callback(pathCoordinates);
        } else {
            console.error('Directions request failed due to ' + status);
            callback([]);
        }
    });
}