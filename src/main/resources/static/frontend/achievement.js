// 顯示更多成就
$('#moreAchievement').on('click', function (){
    $('#achievementFW').css("display", "flex");
    $('#achievementFW').css("position", "fixed");
    $('#historyFW').css("display", "none");
});
$('#achievementReturn').on('click', function (){
    $('#historyFW').css("display", "flex");
    $('#historyFW').css("position", "fixed");
    $('#achievementFW').css("display", "none");
});

function reloadAchievement(){
    $('#achievementContainer').empty();


    let finish = AchievementObj.filter(achievement => achievement.achieve === true);
    let unfinish = AchievementObj.filter(achievement => achievement.achieve === false);
    let outside = 6;
    $('#achievement').empty();

    for(let i=0; i<finish.length; i++){
        let achievementDiv = $("<div>")
            .attr({
                'class': 'achievementDiv',
                'id': 'achievement_' + finish[i].achievementId
            });
        let achievementSvg = $("<svg>")
            .html(finish[i].unLockedSvg);
        let achievementName = $("<div>")
            .text(finish[i].achievementName)
            .attr('class', 'achievementName');
        let time = parseInt(finish[i].current / finish[i].target,10)
        let achieveTime = $("<div>")
            .text(time.toString().replace(/\.?0+$/, '').replace(/\B(?=(\d{3})+(?!\d))/g, ','))
            .attr('class', 'achieveTime');

        achievementDiv.append(achievementSvg, achievementName, achieveTime);
        $('#achievementContainer').append(achievementDiv);

        if(outside != 0){
            let cloneDiv = $("<div>")
                .attr({
                    'class': 'showAchievement'
                });
            cloneDiv.append(achievementSvg.clone(), achievementName.clone(), achieveTime.clone());
            $('#achievement').append(cloneDiv);
            outside--;
        }

        (function(achievementId) {
            achievementDiv.on('click', function() {
                achievementClick(achievementId);
            });
        })(finish[i].achievementId);
    }
    for(let i=0; i<unfinish.length; i++){
        let achievementDiv = $("<div>")
            .attr({
                'class': 'achievementDiv',
                'id': 'achievement_' + unfinish[i].achievementId
            });
        let achievementSvg = $("<svg>")
            .html(unfinish[i].lockedSvg);
        let achievementName = $("<div>")
            .text(unfinish[i].achievementName)
            .attr('class', 'achievementName');
        let time = ((unfinish[i].current.toFixed(2)*100)/100);
        let achieveDescription = $("<div>")
            .text(time.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') +  ' / ' + unfinish[i].target.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','))
            .attr('class', 'achieveDescription');
        let progress = $("<progress>")
            .attr({
                'max': unfinish[i].target,
                'value': unfinish[i].current,
                'class': 'progress'
            })

        achievementDiv.append(achievementSvg, achievementName, achieveDescription, progress);
        $('#achievementContainer').append(achievementDiv);

        if(outside != 0){
            let cloneDiv = $("<div>")
                .attr({
                    'class': 'showAchievement'
                });
            cloneDiv.append(achievementSvg.clone(), achievementName.clone(), achieveDescription.clone(), progress.clone());
            $('#achievement').append(cloneDiv);
            outside--;
        }

        (function(achievementId) {
            achievementDiv.on('click', function() {
                achievementClick(achievementId);
            });
        })(unfinish[i].achievementId);
    }
    $('#achievementSum').text(finish.length + ' / ' + AchievementObj.length);
}
$('.card').click(function() {
    $(this).toggleClass('flipped');
});
function achievementClick(achievementId){
    $('#achievementFW').css("display", "none");
    $('#eachAchievementFW').css("display", "flex");
    $('#eachAchievementFW').empty();
    let target = AchievementObj.filter(achievement => achievement.achievementId === achievementId);
    $('#ACPhoto').empty();
    if(target[0].accomplishTime!=null) generatePhoto(target);
    let IMGdataUrl;
    domtoIMG().then(imgDU => {
        IMGdataUrl=imgDU;
        $('#shareLink').prop('disabled', false);
        $('#shareLinkTxt').removeClass('downloadLoader').text('分享');
        $('#downloadLink').prop('disabled', false);
        $('#downloadLinkTxt').removeClass('downloadLoader').text('下載');
    }).catch(error => {
        // 還不知道放甚麼
        console.error(error);
    });

    if(target[0].achieve === true){
        let achievementName = $("<div>")
            .text(target[0].achievementName)
            .attr('class', 'eachAchievementName');
        let achievementDiv = $("<div>")
            .attr({
                'class': 'achievementCard',
                'id': 'achievementCard'
            });
        let cardInner = $("<div>")
            .attr({
                'class': 'cardInner',
            });
        let frontDiv = $("<div>")
            .attr({
                'class': 'front',
            });
        let achievementSvg = $("<svg>")
            .html(target[0].unLockedSvg)
            .css('top','20px');
        let femoSvg = $("<img>")
            .attr("src", emoLogo)
            .css({
                'margin-right': '2px',
                'top': '18px',
                'width': '15px'
            });

        let femoIcon = $("<span>").text("EMO")
            .attr('class', 'achievementText')
            .css({
            'font-weight': 'bold',
            'color': 'gray',
            'margin-top': '10px',
            'font-size': '10px',
            'top': '20px'
        });

        let femoDiv = $("<div>")
            .css('top','12px');
        femoDiv.append(femoSvg,femoIcon);
        frontDiv.append(achievementSvg,femoDiv);
        let backDiv = $("<div>")
            .attr({
                'class': 'back',
            });
        let textDiv = $("<div>")
            .css({
                'height': '190px',
                'display': 'flex',
                'display': 'flex',
                'flex-direction': 'column',
                'justify-content': 'center'
            });

        time = (target[0].current.toFixed(2)*100/100).toString()
        let userName = $("<div>")
            .text(User.nickname)
            .attr('class', 'achievementText');
        let achievementText1 = $("<div>")
            .text("做得很好！繼續加油")
            .attr('class', 'achievementText');
        let datePart = target[0].accomplishTime.substring(0, 10).split("-");
        let achievementText2 = $("<div>")
            .text(datePart[0] + "年" + datePart[1] + "月" + datePart[2] + "日")
            .attr('class', 'achievementText');

        let emoSvg = $("<img>")
            .attr("src", emoLogo)
            .css({
                'margin-right': '2px',
                'top': '18px',
                'width': '15px'
            });

        let emoIcon = $("<span>").text("EMO")
            .attr('class', 'achievementText')
            .css({
                'font-weight': 'bold',
                'color': 'gray',
                'margin-top': '10px',
                'font-size': '10px',
                'top': '20px'
            });

        let emoDiv = $("<div>")
            .css('top','10px');
        emoDiv.append(emoSvg,emoIcon);

        textDiv.append(userName, achievementText1, achievementText2,emoDiv);
        backDiv.append(textDiv);

        cardInner.append(frontDiv, backDiv);
        achievementDiv.append(cardInner);
        time = parseInt(target[0].current / target[0].target,10).toString();
        let achieveTime = time.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        let achieveDescription1 = $("<div>")
            .text("你贏得此獎章" + achieveTime + "次")
            .attr('class', 'achievementDescription');
        let achieveDescription2 = $("<div>")
            .text("表揚你" + target[0].achievementDescription)
            .attr('class', 'achievementDescription');

        let downloadLink = $("<button>")
            .click(function (){
                downlodACPhoto(IMGdataUrl);
            })
            .attr({
                'id':'downloadLink',
                'class': 'setBtn'
            })
            .prop('disabled', true)
            .css({
                'background-color': 'rgba(183,188,189,0.3)',
                'width': '70px',
                'height': '30px',
                'margin':'10px'
            });

        let downloadBtnText = $("<div>")
            .text("")
            .attr({
                'id': 'downloadLinkTxt',
                'class': 'setText downloadLoader'
            })
            .css({
                'right': '10%',
                'font-size': '15px'
            });
        downloadLink.append(downloadBtnText);

        let shareLink = $("<button>")
            .click(function (){
                shareImage(IMGdataUrl);
            })
            .attr({
                'id':'shareLink',
                'class': 'setBtn'
            })
            .prop('disabled', true)
            .css({
                'background-color': 'rgba(183,188,189,0.3)',
                'width': '70px',
                'height': '30px',
                'margin':'10px'
            });

        let shareBtnText = $("<div>")
            .text("")
            .attr({
                'id': 'shareLinkTxt',
                'class': 'setText  downloadLoader'
            })
            .css({
                'right': '10%',
                'font-size': '15px'
            });
        shareLink.append(shareBtnText);

        let buttonDiv = $("<div>")
            .css({
                'display': 'flex',
                'flex-direction': 'row',
                'justify-content': 'center'
            });
        buttonDiv.append(downloadLink, shareLink);
        $('#eachAchievementFW').append(achievementName, achievementDiv, achieveDescription1, achieveDescription2, buttonDiv);
    } else {
        let achievementName = $("<div>")
            .text(target[0].achievementName)
            .attr('class', 'eachAchievementName');
        let achievementDiv = $("<div>")
            .attr({
                'class': 'achievementCard',
                'id': 'achievementCard'
            });
        let cardInner = $("<div>")
            .attr({
                'class': 'cardInner',
            });
        let frontDiv = $("<div>")
            .attr({
                'class': 'front',
            });
        let achievementSvg = $("<svg>")
            .html(target[0].lockedSvg)
            .css('top','20px');
        let femoSvg = $("<img>")
            .attr("src", emoLogoUnlock)
            .css({
                'margin-right': '2px',
                'top': '18px',
                'width': '15px'
            });

        let femoIcon = $("<span>").text("EMO")
            .attr('class', 'achievementText')
            .css({
                'font-weight': 'bold',
                'color': 'gray',
                'margin-top': '10px',
                'font-size': '10px',
                'top': '20px'
            });

        let femoDiv = $("<div>")
            .css('top','10px');
        femoDiv.append(femoSvg,femoIcon);
        frontDiv.append(achievementSvg,femoDiv);
        let backDiv = $("<div>")
            .attr({
                'class': 'back',
            });
        let textDiv = $("<div>")
            .css({
                'height': '190px',
                'display': 'flex',
                'display': 'flex',
                'flex-direction': 'column',
                'justify-content': 'center'
            });
        let time = (target[0].current.toFixed(2)*100/100).toString();
        let userName = $("<div>")
            .text(User.nickname)
            .attr('class', 'achievementText');
        let achievementText1 = $("<div>")
            .text("還差一點！繼續加油")
            .attr('class', 'achievementText');
        let achievementText2 = $("<div>")
            .text(time.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + " / " + target[0].target.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','))
            .attr('class', 'achievementText');
        let emoSvg = $("<img>")
            .attr("src", emoLogoUnlock)
            .css({
                'margin-right': '2px',
                'top': '18px',
                'width': '15px'
            });

        let emoIcon = $("<span>").text("EMO")
            .attr('class', 'achievementText')
            .css({
                'font-weight': 'bold',
                'color': 'gray',
                'margin-top': '10px',
                'font-size': '10px',
                'top': '20px'
            });

        let emoDiv = $("<div>")
            .css('top','10px');
        emoDiv.append(emoSvg,emoIcon);

        textDiv.append(userName, achievementText1, achievementText2, emoDiv);
        backDiv.append(textDiv);

        cardInner.append(frontDiv, backDiv);
        achievementDiv.append(cardInner);

        let achieveDescription = $("<div>")
            .text(target[0].achievementDescription)
            .attr('class', 'achieveDescription')
            .css({
                'color': 'white'
            });
        let progress = $("<progress>")
            .attr({
                'max': target[0].target,
                'value': target[0].current,
                'class': 'progress'
            })
            .css({
                'height': '10px',
                'margin': '5px'
            });

        $('#eachAchievementFW').append(achievementName, achievementDiv, achieveDescription, progress);
    }
}

let now = 0
function firstTimeAchieve(target){
    $('#firstTimeAchieveFW').empty();
    $('#ACPhoto').empty();
    if(target[0].accomplishTime!=null) generatePhoto(target);
    let IMGdataUrl;
    domtoIMG().then(imgDU => {
        IMGdataUrl=imgDU;
        $('#shareLink').prop('disabled', false);
        $('#shareLinkTxt').removeClass('downloadLoader').text('分享');
    }).catch(error => {
        // 還不知道放甚麼
        console.error(error);
    });

    let achievementName = $("<div>")
        .text(target[now].achievementName)
        .attr('class', 'eachAchievementName');
    let achievementDiv = $("<div>")
        .attr({
            'class': 'achievementCard',
            'id': 'achievementCard'
        });
    let cardInner = $("<div>")
        .attr({
            'class': 'cardInner'
        })
        .css({
            'animation': 'rotateAchievement 7s infinite linear'
        });
    let frontDiv = $("<div>")
        .attr({
            'class': 'front',
        });
    let achievementSvg = $("<svg>")
        .html(target[now].unLockedSvg)
        .css('top','20px');
    let femoSvg = $("<img>")
        .attr("src", emoLogo)
        .css({
            'margin-right': '2px',
            'top': '18px',
            'width': '15px'
        });

    let femoIcon = $("<span>").text("EMO")
        .attr('class', 'achievementText')
        .css({
            'font-weight': 'bold',
            'color': 'gray',
            'margin-top': '10px',
            'font-size': '10px',
            'top': '20px'
        });

    let femoDiv = $("<div>")
        .css('top','12px');
    femoDiv.append(femoSvg,femoIcon);
    frontDiv.append(achievementSvg,femoDiv);
    let backDiv = $("<div>")
        .attr({
            'class': 'back',
        });
    let textDiv = $("<div>")
        .css({
            'height': '190px',
            'display': 'flex',
            'display': 'flex',
            'flex-direction': 'column',
            'justify-content': 'center'
        });

    time = (target[now].current.toFixed(2)*100/100).toString()
    let userName = $("<div>")
        .text(User.nickname)
        .attr('class', 'achievementText');
    let achievementText1 = $("<div>")
        .text("做得很好！繼續加油")
        .attr('class', 'achievementText');
    let datePart = target[now].accomplishTime.substring(0, 10).split("-");
    let achievementText2 = $("<div>")
        .text(datePart[0] + "年" + datePart[1] + "月" + datePart[2] + "日")
        .attr('class', 'achievementText');
    let emoSvg = $("<img>")
        .attr("src", emoLogo)
        .css({
            'margin-right': '2px',
            'top': '18px',
            'width': '15px'
        });

    let emoIcon = $("<span>").text("EMO")
        .attr('class', 'achievementText')
        .css({
            'font-weight': 'bold',
            'color': 'gray',
            'margin-top': '10px',
            'font-size': '10px',
            'top': '20px'
        });

    let emoDiv = $("<div>")
        .css('top','10px');
    emoDiv.append(emoSvg,emoIcon);

    let radiance = $("<div>")
        .html("<svg xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\" viewBox=\"0 0 100000 100000\" x=\"0px\" y=\"0px\" fill-rule=\"evenodd\" clip-rule=\"evenodd\" width=\"250px\" height=\"250px\" style=\"&#10;\"><defs><style type=\"text/css\">\n" +
            "   \n" +
            "    .fil0 {fill:rgba(255, 215, 0, 0.3)}\n" +
            "   \n" +
            "  </style></defs><g><g><path class=\"fil0\" d=\"M51927.92 1220.77l-1951.8 29089.95 -1905.32 -29089.95c-13.95,-1595.85 3843.16,-1595.85 3857.12,0z\"/><path class=\"fil0\" d=\"M64323.71 3784.85l-12199.78 38821.5 8885.37 -39709.59c565.27,-2157.58 3879.68,-1269.49 3314.41,888.09z\"/><path class=\"fil0\" d=\"M75822.23 8308.92l-15881.9 24982 13720.15 -26230.09c803.43,-1409.65 2965.18,-161.56 2161.75,1248.09z\"/><path class=\"fil0\" d=\"M85439.11 17046.89l-30320.18 27836.43 27866.01 -30290.6c1586.33,-1604.09 4040.5,850.08 2454.17,2454.17z\"/><path class=\"fil0\" d=\"M93088.88 26768.11l-25727.12 13423.81 24503.66 -15542.89c1372.98,-802.91 2596.43,1316.17 1223.46,2119.08z\"/><path class=\"fil0\" d=\"M97121.5 39016.34l-39501.94 8796.81 38618.72 -12093c2139.33,-586.01 3022.54,2710.18 883.22,3296.19z\"/><path class=\"fil0\" d=\"M98781.23 51975.68l-29041.46 -1951.79 29041.46 -1905.32c1593.19,-13.96 1593.19,3843.16 0,3857.11z\"/><path class=\"fil0\" d=\"M96227.14 64371.84l-38602.86 -12131.07 39485.95 8835.33c2145.43,562.08 1262.34,3857.83 -883.09,3295.74z\"/><path class=\"fil0\" d=\"M91709.92 75871.77l-24729.99 -15721.69 25965.49 13581.75c1395.43,795.33 159.93,2935.27 -1235.5,2139.94z\"/><path class=\"fil0\" d=\"M82999.02 85494.79l-27407.17 -29852.62 29823.49 27436.29c1579.35,1561.87 -836.97,3978.2 -2416.32,2416.33z\"/><path class=\"fil0\" d=\"M73633.1 93009.52l-13638.3 -26138.18 15791.24 24895.18c815.74,1394.91 -1337.2,2637.91 -2152.94,1243z\"/><path class=\"fil0\" d=\"M60937.58 97152.43l-8917.23 -40042.71 12258.55 39147.41c594.03,2168.61 -2747.28,3063.92 -3341.32,895.3z\"/><path class=\"fil0\" d=\"M48024.32 98827.26l1951.79 -29083.62 1905.32 29083.62c13.96,1595.5 -3843.16,1595.5 -3857.11,0z\"/><path class=\"fil0\" d=\"M35628.36 96268.15l12169.79 -38726.05 -8863.52 39611.96c-563.89,2152.28 -3870.15,1266.36 -3306.27,-885.91z\"/><path class=\"fil0\" d=\"M24129.08 91748.72l15797.95 -24849.96 -13647.63 26091.45c-799.19,1402.2 -2949.51,160.71 -2150.32,-1241.49z\"/><path class=\"fil0\" d=\"M14507.45 83033.79l29984.95 -27528.66 -27557.91 29955.7c-1568.79,1586.35 -3995.83,-840.69 -2427.04,-2427.04z\"/><path class=\"fil0\" d=\"M6986.18 73697.28l25954.34 -13542.36 -24720.08 15680.16c-1385.1,810 -2619.36,-1327.8 -1234.26,-2137.8z\"/><path class=\"fil0\" d=\"M2830.64 61031.7l39498.77 -8796.1 -38615.63 12092.02c-2139.16,585.97 -3022.3,-2709.96 -883.14,-3295.92z\"/><path class=\"fil0\" d=\"M1170.84 48072.08l29037.56 1951.8 -29037.56 1905.32c-1592.97,13.95 -1592.97,-3843.16 0,-3857.12z\"/><path class=\"fil0\" d=\"M3746.42 35676.57l38991.8 12253.3 -39883.79 -8924.35c-2167.04,-567.75 -1275.05,-3896.7 891.99,-3328.95z\"/><path class=\"fil0\" d=\"M8273.63 24178.95l25149.03 15988.08 -26405.46 -13811.88c-1419.08,-808.8 -162.64,-2985.01 1256.43,-2176.2z\"/><path class=\"fil0\" d=\"M16967.85 14555.5l27544.02 30001.67 -29972.41 -27573.28c-1587.24,-1569.66 841.15,-3998.05 2428.39,-2428.39z\"/><path class=\"fil0\" d=\"M26582.33 6941.86l13481.75 25838.16 -15609.98 -24609.43c-806.38,-1378.9 1321.85,-2607.64 2128.23,-1228.73z\"/><path class=\"fil0\" d=\"M39005.66 2892.05l8893.73 39937.2 -12226.24 -39044.26c-592.47,-2162.89 2740.04,-3055.84 3332.51,-892.94z\"/></g></g></svg>")
        .css({
            'animation': 'rotateRadiance 30s infinite linear',
            'width': 'fit-content',
            'height': 'fit-content',
            'top': '-30px',
            'left': '-40px',
            'margin-left': '10px',
            'z-index': '-1',
            'position': 'absolute'
        })
    textDiv.append(userName, achievementText1, achievementText2, emoDiv);
    backDiv.append(textDiv);

    cardInner.append(frontDiv, backDiv);
    achievementDiv.append(cardInner,radiance);
    time = parseInt(target[now].current / target[now].target,10).toString();
    let achieveTime = time.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    let achieveDescription1 = $("<div>")
        .text("這是你第一次贏得此獎章！")
        .attr('class', 'achievementDescription');
    let achieveDescription2 = $("<div>")
        .text("表揚你" + target[now].achievementDescription)
        .attr('class', 'achievementDescription');

    $('#firstTimeAchieveFW').append(achievementName, achievementDiv, achieveDescription1, achieveDescription2);

    let closeBtn = $("<button>")
        .attr({
            'class': 'setBtn'
        })
        .css({
            'background-color': 'rgba(183,188,189,0.3)',
            'width': '70px',
            'height': '30px',
            'margin':'10px'
        });

    let closeBtnText = $("<div>")
        .text("關閉")
        .attr({
            'class': 'setText'
        })
        .css({
            'right': '10%',
            'font-size': '15px'
        });
    closeBtn.append(closeBtnText);

    let shareLink = $("<button>")
        .click(function (){
            shareImage(IMGdataUrl);
        })
        .attr({
            'id':'shareLink',
            'class': 'setBtn'
        })
        .prop('disabled', true)
        .css({
            'background-color': 'rgba(183,188,189,0.3)',
            'width': '70px',
            'height': '30px',
            'margin':'10px'
        });

    let shareBtnText = $("<div>")
        .text("")
        .attr({
            'id': 'shareLinkTxt',
            'class': 'setText downloadLoader'
        })
        .css({
            'right': '10%',
            'font-size': '15px'
        });
    shareLink.append(shareBtnText);

    let buttonDiv = $("<div>")
        .css({
            'display': 'flex',
            'flex-direction': 'row',
            'justify-content': 'center'
        });
    buttonDiv.append(shareLink, closeBtn);


    $('#firstTimeAchieveFW').append(buttonDiv);

    if(now == 0){
        $('#firstTimeAchieveFW').css('display', 'flex').hide();
        $('#firstTimeAchieveFW').fadeIn(2000);
    } else {
        $('#firstTimeAchieveFW').css('display', 'flex');
    }


    if(target.length == now+1){
        now = 0;
        closeBtn.on('click', function () {
            $('#firstTimeAchieveFW').css("display", "none");
        });
    } else {
        closeBtn.on('click', function () {
            $('#firstTimeAchieveFW').css("display", "none");
            if(target.length != now+1){
                now++;
                firstTimeAchieve(target);
            }
        });
    }
}

function generatePhoto(target) {
    let achievementName = $("<div>")
        .text(target[0].achievementName)
        .attr({'class': 'eachAchievementName', 'style': 'text-align: center;'});
    let achievementDiv = $("<div>")
        .attr({
            'class': 'achievementCard',
            'id': 'achievementCard'
        });
    let cardInner = $("<div>")
        .attr({
            'class': 'cardInner',
            'style': 'text-align: center;'
        });
    let frontDiv = $("<div>")
        .attr({
            'style': 'align-content: center;\n' +
                '    width: 190px;\n' +
                '    height: 190px;\n' +
                '    background: white;\n' +
                '    border-radius: 50%;\n' +
                '    box-shadow: inset 0 -3em 3em rgba(0,0,0,0.1),\n' +
                '    0 0  0 2px rgb(190, 190, 190),\n' +
                '    0.3em 0.3em 1em rgba(0,0,0,0.3);\n' +
                '    position: relative;\n' +
                '    margin-left: 95px;\n' +
                '    margin-top: 20px;\n' +
                '    margin-bottom: 20px;'});

    // 轉乘img，html2canvas無法正確轉換svg圖
    let img = new Image();
    img.src = 'data:image/svg+xml;base64,' + btoa(target[0].unLockedSvg);
    img.style.position='absolute';
    img.style.top='0';
    img.style.right='0';
    img.style.left='0';
    img.style.bottom='0';
    img.style.margin='auto';

    let emoSvg = $("<img>")
        .attr("src", emoLogo)
        .css({
            'margin-right': '2px',
            'top': '18px',
            'width': '15px'
        });

    let emoIcon = $("<span>").text("EMO")
        .attr('class', 'achievementText')
        .css({
            'font-weight': 'bold',
            'color': 'gray',
            'margin-top': '10px',
            'font-size': '10px',
            'top': '20px'
        });

    let emoDiv = $("<div>")
        .css({
            'top': '50px',
            'text-align': 'center'
        });
    emoDiv.append(emoSvg,emoIcon);

    frontDiv.append(img,emoDiv);

    time = (target[0].current.toFixed(2) * 100 / 100).toString()

    let datePart = target[0].accomplishTime.substring(0, 10).split("-");
    let achievementText2 = $("<div>")
        .text(datePart[0] + "年" + datePart[1] + "月" + datePart[2] + "日")
        .attr({'class': 'achievementText', 'style': 'text-align: center;'});

    cardInner.append(frontDiv);
    achievementDiv.append(cardInner);
    time = parseInt(target[0].current / target[0].target, 10).toString();
    let achieveTime = time.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    let achieveDescription1 = $("<div>")
        .text(User.nickname+" 贏得此獎章" + achieveTime + "次")
        .attr({'class': 'achievementDescription','style':'color: black;'});
    let achieveDescription2 = $("<div>")
        .text("表揚你" + target[0].achievementDescription)
        .attr({'class': 'achievementDescription','style':'color: black;'});

    $('#ACPhoto').append(achievementName, frontDiv, achievementText2, achieveDescription1, achieveDescription2);

    if (achievementName && frontDiv && achievementText2 && achieveDescription1 && achieveDescription2) {
        let ACPhoto2Png = document.getElementById('ACPhoto');

        ACPhoto2Png.style.backgroundColor='#fff'
        ACPhoto2Png.style.display = 'block';
        ACPhoto2Png.style.position = 'fixed';
        ACPhoto2Png.style.zIndex = -1000;
    } else {
        console.error("One or more elements are not found or undefined.");
    }
}
function downlodACPhoto(dataUrl){
    let img = new Image();
    img.src = dataUrl;
    let link = document.createElement('a');
    link.download = 'image.jpg';
    link.href = dataUrl;
    link.click();
}

function domtoIMG() {
    return new Promise((resolve, reject) => {
        let ACPhoto2toJpeg = document.getElementById('ACPhoto');
        // 使用 dom-to-image 轉html為png
        domtoimage.toJpeg(ACPhoto2toJpeg).then(function (dataUrlTmp) {
            domtoimage.toJpeg(ACPhoto2toJpeg).then(function (dataUrl) {
                resolve(dataUrl);
            }).catch(function (error) {
                alert("暫不支援此功能，請在等等><")
                reject(error);
            });
        });
    });
}

function shareImage(dataUrl) {
    const blob = dataURItoBlob(dataUrl);
    const filesArray = [
        new File(
            [blob],
            'meme.jpg',
            {
                type: "image/jpeg",
                lastModified: new Date().getTime()
            }
        )
    ];
    const shareData = {
        files: filesArray,
    };
    navigator.share(shareData).catch(function (error) {
        if (!error.toString().includes('AbortError')) {
            $('#shareError').css("display", "flex");
            console.error('dom-to-image error:', error);
        }
    });
}

function dataURItoBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    let byteString = atob(dataURI.split(',')[1]);

    // write the bytes of the string to an ArrayBuffer
    let ab = new ArrayBuffer(byteString.length);
    let ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    // write the ArrayBuffer to a blob, and you're done
    let bb = new Blob([ab]);
    return bb;
}