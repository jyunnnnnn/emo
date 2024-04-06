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
