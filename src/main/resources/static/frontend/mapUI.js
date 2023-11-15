$(document).ready(function() {
    changeSubType()
    $('#recordButton').click(function() {
        map.setOptions({
            styles: [
                {
                    featureType: 'poi',
                    elementType: 'labels',
                    stylers: [
                        { visibility: 'off' }
                    ]
                }
            ]
        });
    });
    $('#classType').change(function() {
                var selectedValue = $(this).val();
                if (selectedValue === 'dailyType') {
                    $('#dailyTypeDiv').show();
                    $('#translationTypeDiv').hide();
                } else if (selectedValue === 'translationType') {
                    $('#dailyTypeDiv').hide();
                    $('#translationTypeDiv').show();
                }
            });



});
function changeSubType() {
        var classType = document.getElementById("classType").value;
        var subTypeSelect = document.getElementById("subType");

        // 清除現有選項
        subTypeSelect.innerHTML = "";

        if (classType === 'dailyType') {
            // 如果選擇 "生活用品"
            var options = ["使用環保杯", "使用環保餐具", "使用購物袋"];
            generateOptions(options);
        } else if (classType === 'translationType') {
            // 如果選擇 "交通"
            var options = ["搭公車", "搭捷運", "搭火車(台鐵)", "搭高鐵"];
            generateOptions(options);
        }
}

 function generateOptions(options) {
        var subTypeSelect = document.getElementById("subType");
        for (var i = 0; i < options.length; i++) {
            var option = document.createElement("option");
            option.value = options[i];
            option.text = options[i];
            subTypeSelect.add(option);
        }
}