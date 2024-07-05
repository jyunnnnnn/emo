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
// 顯示好友列表
function showFriendList(rankedUser){
    $('#searchFriendList').val('');
    $('#searchFriendList').trigger('input');

    let friendIds =  FriendObj.friendList.map(friend => friend.userId);
    let rankedFriend = rankedUser.filter(user =>friendIds.includes(user.userId));
    let friendListDiv = $('#friendList');
    friendListDiv.empty();

    if(rankedFriend.length != 0){
        friendListDiv.css('display', '');
        $('#noFriend').css('display', 'none');
        rankedFriend.forEach(friend => {
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

            let friendAchievement = $('<div>', { class: 'column is-2-wide' });
            let moreButton = $('<button>', {
                class: 'ts-button is-ghost is-icon',
                id: friend.nickname + 'MORE' + friend.userId
            });
            moreButton.on('click', function() {
                let target = this.id.split('MORE');
                $(this).addClass('is-loading');
                $('#friendAchievementReturn').text('〈' + target[0]);
                loadAchievementObj(target[1], 'friend');
            });
            let moreSpan = $('<span>', { class: 'ts-icon is-large is-eye-icon' });
            moreButton.append(moreSpan);
            friendAchievement.append(moreButton);
            let friendAlert = $('<div>', { class: 'column is-2-wide' });
            let alertButton = $('<button>', { class: 'ts-button is-ghost is-icon' });
            let alertSpan = $('<span>', { class: 'ts-icon is-large is-hand-point-left-icon' });
            alertButton.append(alertSpan);
            friendAlert.append(alertButton);

            friendDiv.append(friendPhoto, friendNameFP, friendAchievement, friendAlert);
            friendListDiv.append(friendDiv);
        });
    } else {
        friendListDiv.css('display', 'none');
        $('#noFriend').css('display', '');
    }
}
// 點擊好友成就圖鑑
function moreButtonClick(userId){
    let name = $('#friendAchievementReturn').text().replace('〈','');
    $('#' + name + 'MORE' + userId).removeClass('is-loading');
    console.log('#' + name + 'more' + userId)

    $('#friendAchievementFW').css("display", "flex");
    $('#friendFW').css("display", "none");

    let friendAchievement = FriendAchievementObj.filter(achievement => achievement.accomplishTime != null);
    friendAchievement.sort((a, b) => new Date(a.accomplishTime) - new Date(b.accomplishTime));
    console.log(friendAchievement)
    let timelineDiv = $('#friendTimeline');
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

    if(nowInput == ""){
        $('#unfind').css('display', 'none');
        $('#find').css('display', 'none');
        return 0;
    } else if(target.length != 0){
        if(target[0].userId == User.userId){
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
        },
        error: function(xhr, status, error) {
            console.error('Error:', error);
        }
    });
}
// 拒絕好友邀請
function refuseRequestButton(target){
}