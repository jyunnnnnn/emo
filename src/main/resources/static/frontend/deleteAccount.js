//刪除帳號
function isSendVerifyCode(){
    //檢查是否已經寄送過 沒有的話就寄送
    $.ajax({
        type: 'GET',
        url: '/mail/sendAgain?userMail=' + User.email,
        contentType: 'application/json',
        success: function (response) {
            $.ajax({
                type: 'POST',
                url: '/mail/sendVerifyingCode?userMail=' + User.email,
                contentType: 'application/json',
                success: function (response) {
                    alert("驗證碼寄送成功");
                },
                error: function (response) {
                    alert("驗證碼寄送失敗");
                }
            });
        },
        error: function (xhr, status, error) {
            alert("先前已寄送驗證碼，5分鐘後再嘗試");
        }
    });
}
function deleteAccount(){
    let inputCode=$('#deleteAccount_matchVerifyCode').val();
    //檢查驗證碼是否正確
    $.ajax({
        type: 'GET',
        url: '/mail/matchVerifyingCode?userMail=' + User.email + "&userInput=" + inputCode,
        contentType: 'application/json',
        success: function (response) {
            alert("驗證碼輸入正確");
            $.ajax({
                type: 'DELETE',
                url: `/user/deleteUserAccount?userId=${User.userId}`,
                contentType: 'application/string',
                success: function(response) {
                    //console.log(response); // 成功刪除時的處理邏輯
                },
                error: function(xhr, status, error) {
                    console.error(error); // 刪除失敗時的處理邏輯
                }
            });
            alert("帳號刪除成功");
            localStorage.removeItem('EmoAppUser');
            localStorage.removeItem('username');
            $('#logoutAccount').click();
            //刪除Emo_User
            $.ajax({
                type: 'DELETE',
                url: `/eco/deleteSpecificUserRecord?userId=${User.userId}`,
                contentType: 'application/string',
                success: function(response) {
                    //console.log(response); // 成功刪除時的處理邏輯
                },
                error: function(xhr, status, error) {
                    console.error(error); // 刪除失敗時的處理邏輯
                }
            });
            //刪除Emo_Record裡面指定用戶的紀錄
        },
        error: function (response) {
            alert("驗證碼輸入錯誤");
        }
    });
}