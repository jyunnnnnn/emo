// 點擊好友按鈕
$('#friendButton').on('click', function () {
    // 顯示懸浮窗
    $('#friendFW').css("display", "flex");
    $('#friendFW').css("position", "fixed");
});
// 關閉好友懸浮窗
$('#closeFriendModal').on('click', function () {
    $('#friendFW').css("display", "none");
});
// 監聽copyID
$('#copyID').on('click', function(event) {
    let textToCopy = $('#myUserID').text().replace('我的ID：','');

    let snackbar = $('<div>', {
        class: 'content',
        id: 'copyMSG'
    })
    navigator.clipboard.writeText(textToCopy).then(function() {
        snackbar.text('複製成功');
    }).catch(function(error) {
        snackbar.text('複製失敗');
    });

    $('#snackbar').append(snackbar);
    $('#snackbar').css('display', '');

    setTimeout(function() {
        $('#snackbar').fadeOut(1000, function() {
            $('#copyMSG').remove();
            $('#snackbar').css('display', 'none');
        });
    }, 3000);
})

// 顯示好友列表
function showFriendList(friendList){
    $('#searchFriendList').val('');
    $('#searchFriendList').trigger('input');
    let friendListDiv = $('#friendList');
    if(friendList.length != 0){
        let friendIds =  FriendObj.friendList.map(friend => friend.userId);
        let friends = AllUsersFp.filter(user => friendIds.includes(user.userId));
        friendListDiv.empty();

        friendListDiv.css('display', '');
        $('#noFriend').css('display', 'none');
        friends.forEach(friend => {
            let friendDiv = $('<div>', {
                class: 'ts-segment column ts-grid is-4-columns is-middle-aligned',
                css: { display: 'flex' }
            });

            let friendPhoto = $('<div>', { class: 'column is-3-wide' });
            let photoSpan = $('<span>', { class: 'ts-avatar is-circular is-large is-bordered' });
            let photoImg = $('<img>', { src: friend.photo });
            photoSpan.append(photoImg);
            friendPhoto.append(photoSpan);

            let friendNameFP = $('<div>', { class: 'column is-8-wide' });
            let friendName = $('<div>', {
                text: friend.nickname,
                css: { 'font-size': '18px' }
            });
            const friendFP = $('<div>').text(convertRankToPresent(friend.rankType, friend.totalFP));
            friendNameFP.append(friendName, friendFP);

            // 刪除按鈕
            let deleteDiv = $('<div>', { class: 'column is-2-wide' });
            let deleteButton = $('<button>', {
                class: 'ts-button is-ghost is-icon',
                id: 'delete' + friend.userId
            });
            deleteButton.on('click', function() {
                let target = this.id.replace('delete', '');
                $(this).addClass('is-loading');
                deleteFriendButton(target);
            });
            let deleteSpan = $('<span>', { class: 'ts-icon is-large is-trash-icon is-negative' });
            deleteButton.append(deleteSpan);
            deleteDiv.append(deleteButton);
            // 好友成就
            let friendAchievement = $('<div>', { class: 'column is-2-wide' });
            let moreButton = $('<button>', {
                class: 'ts-button is-ghost is-icon',
                id: 'MORE' + friend.userId
            });
            moreButton.on('click', function() {
                let target = this.id.replace('MORE', '');
                $(this).addClass('is-loading');
                loadAchievementObj(target, 'friend');
            });
            let moreSpan = $('<span>', { class: 'ts-icon is-large is-eye-icon' });
            moreButton.append(moreSpan);
            friendAchievement.append(moreButton);
            // 戳一下
            let friendAlert = $('<div>', { class: 'column is-2-wide' });
            let alertButton = $('<button>', {
                class: 'ts-button is-ghost is-icon' ,
                id: 'alert' + friend.userId
            });
            alertButton.on('click', function() {
                let target = this.id.replace('alert', '');
                $(this).addClass('is-loading');
                alertFriendButton(target);

                let name = AllUsersFp.filter(friend => friend.userId === target)[0].nickname;
                $('#alertMSG').remove();
                let msg = "你戳了" + name +"一次";
                let snackbar = $('<div>', {
                    class: 'content',
                    id: 'alertMSG'
                })
                    .text(msg);
                $('#snackbar').append(snackbar);
                $('#snackbar').css('display', '');

                timeoutId = setTimeout(function() {
                    $('#snackbar').fadeOut(1000, function() {
                        $('#alertMSG').remove();
                        $('#snackbar').css('display', 'none');
                    });
                }, 3000);
            });
            let alertSpan = $('<span>', { class: 'ts-icon is-large is-hand-point-left-icon' });
            alertButton.append(alertSpan);
            friendAlert.append(alertButton);

            friendDiv.append(friendPhoto, friendNameFP, deleteDiv, friendAchievement, friendAlert);
            friendListDiv.append(friendDiv);
        });
    } else {
        friendListDiv.css('display', 'none');
        $('#noFriend').css('display', '');
    }
}
// 刪除好友
function deleteFriendButton(target){
    $.ajax({
        url: '/FR/deleteFriend?sender=' + User.userId +'&receiver=' + target,
        method: 'PUT',
        success: function(response) {
            loadFriendObj(User.userId, 'change');
            sendFriendInfo(target,4);
        },
        error: function(xhr, status, error) {
            console.error('Error:', error);
        }
    });
}
// 戳一下好友
function alertFriendButton(target){
    $.ajax({
        url: '/FR/addNotification?sender=' + User.userId +'&receiver=' + target,
        method: 'POST',
        success: function(response) {
            sendFriendInfo(target,6);
            $('#alert' + target).removeClass('is-loading');
        },
        error: function(xhr, status, error) {
            console.error('Error:', error);
        }
    });
}
// 上線顯示誰戳我
// 檢查是否有重疊
function getCircleProperties(element) {
    let radius = element[0].offsetWidth / 2;
    let centerX = element[0].offsetLeft + radius;
    let centerY = element[0].offsetTop + radius;
    return { centerX, centerY, radius };
}
function areCirclesOverlapping(circle1, circle2) {
    let { centerX: x1, centerY: y1, radius: r1 } = getCircleProperties(circle1);
    let { centerX: x2, centerY: y2, radius: r2 } = getCircleProperties(circle2);

    let distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    return distance < (r1 + r2);
}
let cx;
let cy;
let cr;
let layerR = 0;
let biggest = false;
let layer = [];
let nowDegree = 45;
function arrangePhotos(photos) {
    let now = 0;
    photos.forEach(photo=> {
        let px = photo[0].clientWidth;
        if(now == 0){
            photo.css('left', (window.innerWidth - px)/2 + 'px');
            photo.css('top', (window.innerHeight * 0.8 - px)/2 + 'px');
            layer.push(photo);

            cr = px/2;
            cx = photo[0].offsetLeft + cr;
            cy = photo[0].offsetTop + cr;
        } else {
            let place = false;
            let count = 0;
            while(count < 360){
                let angleInRadians = (nowDegree + count)%360 * Math.PI / 180;
                let x = cx + (cr + px/2) * Math.cos(angleInRadians) - px/2;
                let y = cy + (cr + px/2) * Math.sin(angleInRadians) - px/2;
                photo.css('left', x + 'px');
                photo.css('top',  y + 'px');

                for(let i=0; i<layer.length; i++){
                    if(areCirclesOverlapping(photo, layer[i])){
                        //重疊了
                        count++;
                        $('#friendsPhoto').remove(photo);
                        break;
                    } else if (i == layer.length - 1) {
                        if(!biggest){
                            layerR = px;
                            biggest = true;
                            place = true;
                            layer.push(photo);
                        } else {
                            place = true;
                            layer.push(photo);
                        }
                        break;
                    }
                }
                if(place) break;
            }
            if(count != 0) nowDegree += count + 1;
            else nowDegree++;

            if(!place){
                cr += layerR;
                let angleInRadians = (nowDegree + count * Math.PI)%360 / 180;
                let x = cx + (cr + px)/2 * Math.cos(angleInRadians) - px/2;
                let y = cy + (cr + px)/2 * Math.sin(angleInRadians) - px/2;
                photo.css('left', x + 'px');
                photo.css('top',  y + 'px');
                layerR = px;
                layer.push(photo);
            }
        }
        now++;
    })
}
let photos = [];
function whoAlertMe(list){
    list.sort((a, b) => b.count - a.count);
    list.forEach(friend=>{
        let px;
        if(friend.count >= 27){
            px = 46 + friend.count*5;
        } else {
            px = 46 + friend.count*5;
        }
        let friendPhoto = $('<div>', {
            class: 'column is-3-wide',
            id: 'alertMe' + friend.userId
        })
            .css('position', 'absolute')
            .css('width', 'fit-content')
            .css('height', 'fit-content');
        friendPhoto.on('click', function() {
            let target = this.id.replace('alertMe', '');
            alertFriendButton(target);

            let name = AllUsersFp.filter(friend => friend.userId === target)[0].nickname;
            $('#alertMSG').remove();
            let msg = "你戳了" + name +"一次";
            let snackbar = $('<div>', {
                class: 'content',
                id: 'alertMSG'
            })
                .text(msg);
            $('#snackbar').append(snackbar);
            $('#snackbar').css('display', '');

            timeoutId = setTimeout(function() {
                $('#snackbar').fadeOut(1000, function() {
                    $('#alertMSG').remove();
                    $('#snackbar').css('display', 'none');
                });
            }, 3000);
        });

        let photoSpan;
        if(friend.photo == null){
            photoSpan = $('<span>', {class: 'ts-icon is-huge is-circular is-user-icon'})
                .css('width', px + 'px !important')
                .css('height', px + 'px !important');
            let photoImg = $('<img>', { src: friend.photo });
            photoSpan.append(photoImg);
        } else {
            photoSpan = $('<span>', {class: 'ts-avatar is-circular is-large is-bordered', })
                .css('width', px + 'px')
                .css('height', px + 'px');
            let photoImg = $('<img>', { src: friend.photo });
            photoSpan.append(photoImg);
        }
        friendPhoto.append(photoSpan);
        $('#friendsPhoto').append(friendPhoto);
        photos.push(friendPhoto);
    });
    arrangePhotos(photos);
    $('#friendAlertText').html("共有" + list.length + "位好友在催你做環保！<br>其中" + list[0].nickname + "共戳了你" + list[0].count + "次<br>（點擊頭貼可回戳）");

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
    closeBtn.on('click', function () {
        $('#friendAlertMeFW').css("display", "none");
    });

    let buttonDiv = $("<div>")
        .css({
            'display': 'flex',
            'flex-direction': 'row',
            'justify-content': 'center'
        });
    buttonDiv.append(closeBtn);


    $('#closeAlert').append(buttonDiv);
    $('#friendAlertMeFW').css('z-index', '999');
}
// 點擊好友成就圖鑑
function moreButtonClick(userId){
    let target = AllUsersFp.filter(user => user.userId == userId);
    $('#friendAchievementReturn').text('〈 ' + target[0].nickname);
    $('#MORE' + userId).removeClass('is-loading');

    $('#friendAchievementFW').css("display", "flex");
    $('#friendFW').css("display", "none");

    let friendAchievement = FriendAchievementObj.filter(achievement => achievement.accomplishTime != null);
    let timelineDiv = $('#friendTimeline');
    if(friendAchievement.length != 0){
        friendAchievement.sort((a, b) => new Date(b.accomplishTime) - new Date(a.accomplishTime));
        timelineDiv.empty();
        friendAchievement.forEach(achievement => {
            let item = $('<div>', { class: 'item' });

            let date = achievement.accomplishTime.split(' ');
            let time = date[1].split(':');
            let timeDiv = $('<div>', { class: 'aside' });
            let timeText = $('<div>', {
                class: 'ts-text is-description',
                html: date[0] + '<br>' + time[0] + ':' + time[1]
            });
            timeDiv.append(timeText);

            let svgDiv = $('<div>', { class: 'indicator' });
            let svgIcon = $('<span>', { class: 'ts-icon' });
            achievement.unLockedSvg = achievement.unLockedSvg.replace('width="100px"', 'width="20px"');
            achievement.unLockedSvg = achievement.unLockedSvg.replace('height="100px"', 'height="20px"');
            let svg = $("<svg>")
                .html(achievement.unLockedSvg)
            svgIcon.append(svg);
            svgDiv.append(svgIcon);

            let achievementDiv = $('<div>', { class: 'content'});
            let achievementClass = $('<span>', {
                class: 'ts-text is-mark is-tiny',
                text: achievement.achievementClass
            })
                .css('margin-right', '3%');
            let achievementName = $('<span>', { class: 'ts-text is-heavy is-large'})
                .html(achievement.achievementName + '<br>');
            let achievementDescription = $('<span>', {
                class: 'ts-text is-disabled is-small',
                text: achievement.achievementDescription
            });
            achievementDiv.append(achievementClass, achievementName, achievementDescription)

            item.append(timeDiv, svgDiv, achievementDiv);
            timelineDiv.append(item);
        });
    } else {
        timelineDiv.css('display', 'none');
        $('#noAchievement').css('display', '');
    }
}
// 關閉好友成就圖鑑
$('#friendAchievementReturn').on('click', function () {
    $('#friendAchievementFW').css("display", "none");
    $('#friendFW').css("display", "flex");
});
// 監聽好友列表搜尋
$('#searchFriendList').on('input', function(event) {
    let nowInput = $('#searchFriendList').val().toLowerCase();
    $('#friendList .ts-segment').each(function() {
        if(nowInput != ""){
            let friendName = $(this).find('.is-8-wide > div:first-child').text().toLowerCase();
            if (friendName.includes(nowInput)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        } else {
            $(this).show();
        }
    });
})

// 點擊新增好友
$('#addFriendButton').on('click', function () {
    // 顯示懸浮窗
    $('#searchNewFriend').val('');
    $('#searchNewFriend').trigger('input');
    $('#addFriendFW').css("display", "flex");
    $('#addFriendFW').css("position", "fixed");
    $('#friendFW').css("display", "none");
});
// 關閉新增好友懸浮窗
$('#closeAddFriendModal').on('click', function () {
    $('#addFriendFW').css("display", "none");
    $('#friendFW').css("display", "flex");
});
// 監聽新增好友搜尋
$('#searchNewFriend').on('input', function(event) {
    let nowInput = $('#searchNewFriend').val();
    let target = AllUsersFp.filter(user =>nowInput.includes(user.userId));
    let alreadyFriend = FriendObj.friendList.filter(user =>nowInput.includes(user.userId));

    if(nowInput == ""){
        $('#unfind').css('display', 'none');
        $('#find').css('display', 'none');
        return 0;
    } else if(target.length != 0){
        if(target[0].userId == User.userId || alreadyFriend.length != 0){
            $('#sendRequestButton').css('display', 'none');
        } else {
            $('#sendRequestButton').css('display', 'unset');
            let alreadySent = FriendObj.requestingList.filter(user =>target[0].userId.includes(user));
            if(alreadySent.length != 0){
                $('#sendRequestButton').removeClass('is-loading is-start-labeled-icon');
                $('#sendRequestButton').addClass('is-end-labeled-icon is-secondary');
                $('#sendRequestButton').empty();
                $('#sendRequestButton').text('已送出');
                let span = $('<span>', { class: 'ts-icon is-check-icon' });
                $('#sendRequestButton').append(span);
                $('#sendRequestButton').attr('disabled', true);
            } else {
                $('#sendRequestButton').removeClass('is-loading is-end-labeled-icon is-secondary');
                $('#sendRequestButton').addClass('is-start-labeled-icon');
                $('#sendRequestButton').empty();
                $('#sendRequestButton').text('送出邀請');
                let span = $('<span>', { class: 'ts-icon is-paper-plane-icon' });
                $('#sendRequestButton').append(span);
                $('#sendRequestButton').attr('disabled', false);
            }
        }

        if(target[0].photo != null){
            $('#searchPhoto').attr('src', target[0].photo);
            $('#searchPhoto').css('display', 'block');
            $('#searchPhotoNull').css('display', 'none');
        } else {
            $('#searchPhotoNull').css('display', 'block');
            $('#searchPhoto').css('display', 'none');
        }
        $('#searchName').text(target[0].nickname);
        $('#find').css('display', 'block');
        $('#unfind').css('display', 'none');
    } else {
        $('#unfind').css('display', 'block');
        $('#find').css('display', 'none');
    }
})
// 監聽送出邀請按鈕
$('#sendRequestButton').on('click', function() {
    $('#sendRequestButton').addClass('is-loading');
    let targetID = $('#searchNewFriend').val();

    sendFriendInfo(targetID,1);

    $.ajax({
        url: '/FR/addFriend?sender=' + User.userId +'&receiver=' + targetID,
        method: 'POST',
        success: function(response) {
            $('#sendRequestButton').removeClass('is-loading is-start-labeled-icon');
            $('#sendRequestButton').addClass('is-end-labeled-icon is-secondary');
            $('#sendRequestButton').text('已送出');
            let span = $('<span>', { class: 'ts-icon is-check-icon' });
            $('#sendRequestButton').append(span);
            $('#sendRequestButton').attr('disabled', true);
            loadFriendObj(User.userId, 'change');
        },
        error: function(xhr, status, error) {
            console.error('Error:', error);
        }
    });
});

// 顯示已寄出的邀請
function showSentRequest(sentRequest){
    let sentUser = AllUsersFp.filter(user =>sentRequest.includes(user.userId));
    let sentRequestDiv = $('#sentRequest');
    sentRequestDiv.empty();
    if(sentUser.length != 0){
        sentUser.forEach(User => {
            let UserDiv = $('<div>', {
                class: 'ts-segment column ts-grid is-4-columns is-middle-aligned',
                css: { display: 'flex' }
            });

            let UserPhoto = $('<div>', { class: 'column is-3-wide' });
            let photoSpan = $('<span>', { class: 'ts-avatar is-circular is-large is-bordered' });
            let photoImg = $('<img>', { src: User.photo });
            photoSpan.append(photoImg);
            UserPhoto.append(photoSpan);

            let UserNameDiv = $('<div>', { class: 'column is-8-wide' });
            let UserName = $('<div>', {
                text: User.nickname,
                css: { 'font-size': '18px' }
            });
            UserNameDiv.append(UserName);

            let cancelRequest = $('<div>', { class: 'column is-2-wide' });
            let cancelButton = $('<button>', {
                class: 'ts-button is-negative is-outlined',
                id: 'cancel' + User.userId
            });
            cancelButton.on('click', function() {
                let target = this.id.replace('cancel', '');
                $(this).addClass('is-loading');
                cancelRequestButton(target);
            });
            let cancelSpan = $('<span>', { class: 'ts-icon is-small is-x-icon is-end-spaced' });
            let cancelText = $('<span>', { text: '取消' });
            cancelButton.append(cancelSpan, cancelText);
            cancelRequest.append(cancelButton);

            UserDiv.append(UserPhoto, UserNameDiv, cancelRequest);
            sentRequestDiv.append(UserDiv);
        });
    } else {
        let textDiv = $('<div>', {
            class: 'ts-segment column ts-grid is-middle-aligned',
            css: { display: 'flex' }
        })
            .text('沒有任何已送出的好友邀請');
        sentRequestDiv.append(textDiv);
    }
}
// 取消已寄出的邀請
function cancelRequestButton(target){
    $.ajax({
        url: '/FR/cancelFriend?sender=' + User.userId +'&receiver=' + target,
        method: 'PUT',
        success: function(response) {
            loadFriendObj(User.userId, 'change');
            sendFriendInfo(target,5);
        },
        error: function(xhr, status, error) {
            console.error('Error:', error);
        }
    });
}

// 點擊好友邀請
$('#friendRequestButton').on('click', function () {
    // 顯示懸浮窗
    $('#friendRequestFW').css("display", "flex");
    $('#friendRequestFW').css("position", "fixed");
    $('#friendFW').css("display", "none");
});
// 關閉新增好友懸浮窗
$('#closeFriendRequestModal').on('click', function () {
    $('#friendRequestFW').css("display", "none");
    $('#friendFW').css("display", "flex");
});
// 顯示好友邀請
function showRequestedUser(requestedUser){
    let strangers = AllUsersFp.filter(user =>requestedUser.includes(user.userId));
    let requestedDiv = $('#friendRequestList');
    requestedDiv.empty();

    if(strangers.length != 0){
        $('#requestedNum').css('display', '');
        $('#requestedNum').text(strangers.length);
        strangers.forEach(stranger => {
            let UserDiv = $('<div>', {
                class: 'ts-segment column ts-grid is-4-columns is-middle-aligned',
                css: { display: 'flex' }
            });

            let UserPhoto = $('<div>', { class: 'column is-3-wide' });
            let photoSpan = $('<span>', { class: 'ts-avatar is-circular is-large is-bordered' });
            let photoImg = $('<img>', { src: stranger.photo });
            photoSpan.append(photoImg);
            UserPhoto.append(photoSpan);

            let UserNameDiv = $('<div>', { class: 'column is-8-wide' });
            let UserName = $('<div>', {
                text: stranger.nickname,
                css: { 'font-size': '18px' }
            });
            UserNameDiv.append(UserName);

            let acceptDiv = $('<div>', { class: 'column is-2-wide' });
            let acceptButton = $('<button>', {
                class: 'ts-button is-ghost is-icon',
                id: 'accept' + stranger.userId
            });
            acceptButton.on('click', function() {
                let target = this.id.replace('accept', '');
                $(this).addClass('is-loading');
                acceptRequestButton(target);
            });
            let acceptSpan = $('<span>', { class: 'ts-icon is-large is-user-check-icon'})
                .css('color', 'var(--ts-positive-500)');
            acceptButton.append(acceptSpan);
            acceptDiv.append(acceptButton);
            let refuseDiv = $('<div>', { class: 'column is-2-wide' });
            let refuseButton = $('<button>', {
                class: 'ts-button is-ghost is-icon',
                id: 'refuse' + stranger.userId
            });
            refuseButton.on('click', function() {
                let target = this.id.replace('refuse', '');
                $(this).addClass('is-loading');
                refuseRequestButton(target);
            });
            let refuseSpan = $('<span>', { class: 'ts-icon is-large is-user-xmark-icon is-negative' });
            refuseButton.append(refuseSpan);
            refuseDiv.append(refuseButton);

            UserDiv.append(UserPhoto, UserNameDiv, acceptDiv, refuseDiv);
            requestedDiv.append(UserDiv);
        });
    } else {
        $('#requestedNum').css('display', 'none');
        let textDiv = $('<div>', {
            class: 'ts-segment column ts-grid is-middle-aligned',
            css: { display: 'flex' }
        })
            .text('沒有任何待確認的好友邀請');
        requestedDiv.append(textDiv);
    }
}
// 批准好友邀請
function acceptRequestButton(target){
    $.ajax({
        url: '/FR/confirmFriend?sender=' + User.userId +'&receiver=' + target,
        method: 'PUT',
        success: function(response) {
            loadFriendObj(User.userId, 'change');
            sendFriendInfo(target,2);
        },
        error: function(xhr, status, error) {
            console.error('Error:', error);
        }
    });
}
// 拒絕好友邀請
function refuseRequestButton(target){
    $.ajax({
        url: '/FR/rejectFriend?sender=' + User.userId +'&receiver=' + target,
        method: 'PUT',
        success: function(response) {
            loadFriendObj(User.userId, 'change');
            sendFriendInfo(target,3);
        },
        error: function(xhr, status, error) {
            console.error('Error:', error);
        }
    });
}