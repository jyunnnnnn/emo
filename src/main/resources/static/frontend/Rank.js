// 點擊排行按鈕
$('#rankingButton').on('click', function () {
    initUserData()
    // 顯示懸浮窗
    $('#rankingFW').css("display", "flex");
    $('#rankingFW').css("position", "fixed");
});
// 關閉排行懸浮窗
$('#closeRankModal').on('click', function () {
    $('#rankingFW').css("display", "none");
});
function convertTotalFPtoRankColor(total) {
     let result={
        color:null,
        rankType:null,
        FPString:null
     };
     const foundRank = Rank.find(rank => total >= rank.lowerBound);
     result.color=foundRank.rankColor;
     result.rankType=foundRank.rankType;
     result.FPString=convertRankToPresent(foundRank.rankType,total);
     return result;
}

function convertRankToPresent(rankType, total) {
    let totalFPString;
    if (rankType <= 2) {
        totalFPString = (total.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")) + "gCO2e";
    } else {
        if ((total / 1000.0) > 1000000) {
            let exponent = Math.floor(Math.log10(Math.abs((total / 1000.0)))); // Get exponent
            let mantissa = (total / 1000.0) / Math.pow(10, exponent); // Get mantissa
            let notation = mantissa.toFixed(2) + "E" + exponent; // Format in scientific notation with 2 decimal places
            totalFPString=notation+ "kgCO2e";
        }else{
            totalFPString = ((total / 1000).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")) + "kgCO2e";
        }

    }
    return totalFPString;
}
// 動態生成使用者資料
function initUserData() {
     const dropdownElement = $('#rankNType');
     // 清空原有的選項
     dropdownElement.empty();
     // 迭代新的選項，並將它們動態添加到下拉列表中
     const optionElement = $('<a class="item"></a>').text("所有階級");
     optionElement.attr('id', 'all');
     optionElement.on("click", function() {
         $('#selectedRank').text("所有階級");
         showRankByRankType("",1);
     });
     dropdownElement.append(optionElement);
     Rank.forEach(option => {//Rank全域變數 init獲得
         const optionElement = $('<a class="item"></a>').text(option.rankName);
         optionElement.attr('id', option.rankType);
         optionElement.on("click", function() {
            $('#selectedRank').text(option.rankName);
             showRankByRankType(option.rankType,0);
         });
         dropdownElement.append(optionElement);
     });
    showRankByRankType("",1);
}

function showRankByRankType(rankType,all){
    // 清空原有的使用者資料
    const rankingContainer = $('#rankingContent');
    const rowContainer =$('#rowContainer');
    rankingContainer.empty();
    let findUsers={};
    if(all){
        findUsers=AllUsersFp;//AllUsersFp全域變數 init獲得
    }
    else{
        findUsers= AllUsersFp.filter(user => user.rankType === rankType);
    }
    findUsers.sort((a, b) => b.totalFP - a.totalFP);
    console.log(Rank);
    console.log(findUsers);
    let myRankData=findUsers.find(user => user.userId === User.userId);
    let myIndex = findUsers.indexOf(myRankData)+1;

    if(myRankData==null){
        $('#myRankNumber').text("不在此位階");
    }else{
        $('#myRankNumber').text(myIndex);
        if(myRankData.photo){
            $('#myRankPhoto').attr("src",myRankData.photo);
        }
        $('#MyRankName').text(myRankData.nickname);
        $('#myRankCarbon').text("我的總減碳量: "+convertRankToPresent(myRankData.rankType, myRankData.totalFP));
    }


    if (findUsers.length === 0) {
        const rankDiv = $("<div>")
            .addClass("rank-div")
            .text("沒有紀錄")
            .appendTo(rankingContainer);
    }else{
        let count=0;
        findUsers.forEach((user, index) => {
            count++;
            switch (count) {
                case 1:
                    rankNumColor="#FFD306";
                    break;
                case 2:
                    rankNumColor="#8E8E8E";
                    break;
                case 3:
                    rankNumColor="#FF8000";
                    break;
                default:
                    rankNumColor="black"; // 黑色，默認顏色
                    break;
            }
            // 獲取使用者對應的 rankOption
            const rankOption = Rank.find(option => option.rankType === user.rankType);
            const rowDiv=$("<div>")
                .addClass("row-container")
                .appendTo(rankingContainer);
            const rankNum= $("<div>")
                .addClass("rankNum-div")
                .appendTo(rowDiv)
                .css({
                    "color":rankNumColor // 設置文字顏色
                })
                .text(count);
            // 創建 .rank-div 元素，並設置背景顏色
            const rankDiv = $("<div>")
                .addClass("rank-div")
                .css("border-color", rankOption.rankColor)
                .appendTo(rowDiv);
            const photoDiv = $("<div>")
                 .addClass("photoDiv")
                 .css("border-color", rankOption.rankColor)
                 .appendTo(rankDiv);
            const nameAndFPDiv = $("<div>")
                 .addClass("nameAndFPDiv")
                 .css("border-color", rankOption.rankColor)
                 .appendTo(rankDiv);
            // 創建使用者照片
            if (user.photo !== null) {
                const photoImg = $('<img>')
                    .attr({
                        src: user.photo,
                        alt: `${user.nickname}'s Profile Photo`
                    })
                    .appendTo(photoDiv);
            } else {
                const svgIcon = $('<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="black" class="bi bi-person-circle" id="userIcon" viewBox="0 0 16 16"> <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/> <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/> </svg>');
                photoDiv.append(svgIcon);
            }
            // 創建使用者暱稱
            const usernameSpan = $('<div>')
                .addClass("username")
                .text(user.nickname)
                .appendTo(nameAndFPDiv);

            // 創建使用者總減碳量
            const carbonOffsetSpan = $('<div>')
                .addClass("carbon-offset")
                .text(`減碳量: ${convertRankToPresent(user.rankType,user.totalFP)}`)
                .appendTo(nameAndFPDiv);
        });
    }
}

