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