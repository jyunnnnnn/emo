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
        time = (unfinish[i].current.toFixed(2)/100*100).toString();
        let achieveDescription = $("<div>")
            .text(time.replace(/\B(?=(\d{3})+(?!\d))/g, ',') +  ' / ' + unfinish[i].target.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','))
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
}
$('.card').click(function() {
    $(this).toggleClass('flipped');
});
function achievementClick(achievementId){
    $('#achievementFW').css("display", "none");
    $('#eachAchievementFW').css("display", "flex");
    $('#eachAchievementFW').empty();
    let target = AchievementObj.filter(achievement => achievement.achievementId === achievementId);

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
            .html(target[0].unLockedSvg);
        frontDiv.append(achievementSvg);
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

        time = target[0].current.toFixed(2).toString()
        let achievementText1 = $("<div>")
            .text(User.nickname + "做得很好！繼續加油");
        let achievementText2 = $("<div>")
            .text(time.replace(/\.?0+$/, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',') + " / " + target[0].target.toString().replace(/\.?0+$/, '').replace(/\B(?=(\d{3})+(?!\d))/g, ','));
        textDiv.append(achievementText1, achievementText2);
        backDiv.append(textDiv);

        cardInner.append(frontDiv, backDiv);
        achievementDiv.append(cardInner);
        time = parseInt(target[0].current / target[0].target,10).toString();
        let achieveTime = time.replace(/\.?0+$/, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        let achieveDescription = $("<div>")
            .text("你贏得此獎章" + achieveTime + "次，表揚你" + target[0].achievementDescription)
            .attr('class', 'achievementDescription');

        $('#eachAchievementFW').append(achievementName, achievementDiv, achieveDescription);
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
            .html(target[0].lockedSvg);
        frontDiv.append(achievementSvg);
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
        let achievementText1 = $("<div>")
            .text(User.nickname + "還差一點！繼續加油");
        let achievementText2 = $("<div>")
            .text(time.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + " / " + target[0].target.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
        textDiv.append(achievementText1, achievementText2);
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