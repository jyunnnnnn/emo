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
    let friendIds =  FriendObj.friendList.map(friend => friend.userId);
    let rankedFriend = rankedUser.filter(user =>friendIds.includes(user.userId));
    let friendListDiv = $('#friendList');
    friendListDiv.empty();

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
        let moreButton = $('<button>', { class: 'ts-button is-ghost is-icon' });
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
}
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
    console.log(target)
    if(nowInput == ""){
        $('#unfind').css('display', 'none');
        $('#find').css('display', 'none');
    } else if(target.length != 0){
        if(target[0].photo != null){
            $('#searchPhoto').attr('src', target[0].photo);
            $('#searchPhoto').css('display', 'block');
            $('#searchPhotoNull').css('display', 'none');
            $('#searchName').text(target[0].nickname);
            $('#find').css('display', 'block');
            $('#unfind').css('display', 'none');
        } else {
            $('#searchPhotoNull').css('display', 'block');
            $('#searchPhoto').css('display', 'none');
        }
    } else {
        $('#unfind').css('display', 'block');
        $('#find').css('display', 'none');
    }
})
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
            let cancelButton = $('<button>', { class: 'ts-button is-negative is-outlined' });
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
    }
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
            let acceptButton = $('<button>', { class: 'ts-button is-ghost is-icon' });
            let acceptSpan = $('<span>', { class: 'ts-icon is-large is-user-check-icon'})
                .css('color', 'var(--ts-positive-500)');
            acceptButton.append(acceptSpan);
            acceptDiv.append(acceptButton);
            let refuseDiv = $('<div>', { class: 'column is-2-wide' });
            let refuseButton = $('<button>', { class: 'ts-button is-ghost is-icon' });
            let refuseSpan = $('<span>', { class: 'ts-icon is-large is-user-xmark-icon is-negative' });
            refuseButton.append(refuseSpan);
            refuseDiv.append(refuseButton);

            UserDiv.append(UserPhoto, UserNameDiv, acceptDiv, refuseDiv);
            requestedDiv.append(UserDiv);
        });
    } else {
        let textDiv = $('<div>', {
            class: 'ts-segment column ts-grid is-middle-aligned',
            css: { display: 'flex' }
        })
            .text('沒有任何待確認的好友邀請');
    }
}
