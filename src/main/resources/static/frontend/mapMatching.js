const batch_size = 100; // roads api處理點上限

async function getApiKeyAndProcessBatchOfPoints(batch) {
    try {
        const response = await fetch('/api/getApiKey');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const apiKey = await response.text();
        await processBatchOfPoints(batch, apiKey);
    } catch (error) {
        console.error('Error getting API key:', error);
    }
}

async function processBatchOfPoints(batch, apiKey) {
    const endpoint = 'https://roads.googleapis.com/v1/snapToRoads';

    const params = new URLSearchParams({
        interpolate: true, // 是否要進行線性插值
        key: apiKey
    });

    // 將每個點的座標轉換成格式為 'lat,lng' 的字符串
    const pointStrings = batch.map(point => `${point.lat},${point.lng}`).join('|');

    // 構建 POST 請求的 body
    const body = { path: pointStrings };

    try {
        const response = await fetch(`${endpoint}?${params.toString()}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        // 將數據存入 testFixPoints 中
        // 將 data.snappedPoints 中的元素直接添加到 testFixPoints 中
        testFixPoints = testFixPoints.concat(data.snappedPoints);
        // console.log('Processed batch:', data.snappedPoints);
    } catch (error) {
        console.error('Error processing batch:', error);
    }
}

// 分批(上限100個點)
function processAllPoints(points) {
    // Promise確定處理完才返回
    return new Promise((resolve, reject) => {
        const num_points = points.length;
        const num_batches = Math.ceil(num_points / batch_size);
        const batchPromises = [];

        for (let i = 0; i < num_batches; i++) {
            const start_index = i * batch_size;
            const end_index = Math.min((i + 1) * batch_size, num_points);
            const batch = points.slice(start_index, end_index);

            batchPromises.push(getApiKeyAndProcessBatchOfPoints(batch));
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
