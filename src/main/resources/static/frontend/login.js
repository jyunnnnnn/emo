$(document).ready(function() {
    // 按下註冊切換表單
    $('#switch-to-signup').click(function(e) {
        e.preventDefault();
        $('#login-container').addClass('d-none');
        $('#signup-container').removeClass('d-none');
    });

    // 註冊button
    $('#return-to-login').click(function(e) {
        e.preventDefault();

        var account = $('#exampleInputAccount2').val();
        var password = $('#exampleInputPassword2').val();
        var confirmPassword = $('#exampleInputPasswordcheck').val();

        // 帳號只能數字跟英文
        if (!/^[A-Za-z0-9]+$/.test(account)) {
            alert('帳號必須由英文或數字组成。');
            return;
        }

        // 檢查密碼和確認密碼是否相同
        if (password !== confirmPassword) {
            alert('密碼跟確認密碼不相同。');
            return;
        }

        // 唯一鍵
        var uniqueKey = 'user_' + account;

        // 先存loaclstorage
        localStorage.setItem(uniqueKey + '_account', account);
        localStorage.setItem(uniqueKey + '_password', password);

        alert('註冊成功！');
        $('#login-container').removeClass('d-none');
        $('#signup-container').addClass('d-none');
    });

    // 登入
    $('#login-button').click(function(e) {
        e.preventDefault();

        var inputAccount = $('#exampleInputAccount1').val();
        var inputPassword = $('#exampleInputPassword1').val();
        var storedAccount = localStorage.getItem('user_' + inputAccount + '_account');
        var storedPassword = localStorage.getItem('user_' + inputAccount + '_password');

        if (inputAccount === storedAccount && inputPassword === storedPassword) {

            window.location.href = 'test.html';
             alert('登入成功！');
        } else {
            alert('登入失敗，帳號或密碼錯誤。');
        }
    });
});
