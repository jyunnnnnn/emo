$(document).ready(function() {
    // 按下註冊切換表單
    $('#switch-to-signup').click(function(e) {
        e.preventDefault();
        $('#login-container').addClass('d-none');
        $('#signup-container').removeClass('d-none');
    });
    $('#return-to-login-button').click(function(e) {
        e.preventDefault();
       $('#login-container').removeClass('d-none');
       $('#signup-container').addClass('d-none');
    });
    $('#return-to-login-button2').click(function(e) {
        e.preventDefault();
       $('#login-container').removeClass('d-none');
       $('#forgetPassword-container').addClass('d-none');
    });
    //按下忘記密碼切換到忘記密碼的選單
    $('#no-account').click(function(e) {
        e.preventDefault();
       $('#login-container').addClass('d-none');
       $('#forgetPassword-container').removeClass('d-none');
    });

    //忘記密碼時驗證完按下確認 下方跑出設定新密碼的表單
    $('#verified-code').click(function(e) {
        //要再加一個if(驗證成功才執行下面的切換)
        e.preventDefault();
       $('#login-container').addClass('d-none');
       $('#set-password-container').removeClass('d-none');
    });

    // 註冊
    $('#return-to-login').click(function(e) {
        e.preventDefault();
        var inputAccount = $('#exampleInputAccount2').val();
        var inputPassword = $('#exampleInputPassword2').val();
        var inputConfirmPassword = $('#exampleInputPasswordcheck').val();
        var userData = {
            account: inputAccount,
            password: inputPassword,
            confirmPassword: inputConfirmPassword
        };

        $.ajax({
            type: 'POST',
            url: '/api/register',
            contentType: 'application/json',
            data: JSON.stringify(userData),
            success: function(response) {
                alert(response.message);
                $('#login-container').removeClass('d-none');
                $('#signup-container').addClass('d-none');
            },
            error: function(xhr, status, error) {
                var errorData = JSON.parse(xhr.responseText);
                var errorMessage = errorData.message;
                alert(errorMessage);
            }
        });
    });

    // 登入
    $('#login-button').click(function(e) {
        e.preventDefault();

        var inputAccount = $('#exampleInputAccount1').val();
        var inputPassword = $('#exampleInputPassword1').val();
        var loginData = {
                account: inputAccount,
                password: inputPassword
        };
        $.ajax({
                    type: 'POST',
                    url: '/api/login',
                    contentType: 'application/json',
                    data: JSON.stringify(loginData),
                    success: function(response) {
                        localStorage.setItem('EmoAppUser', response.username.toString());
                        alert(response.message);
                        window.location.href = response.location;

                    },
                    error: function(xhr, status, error) {
                        var errorMessage = JSON.parse(xhr.responseText);
                        alert(errorMessage.message);
                    }

        });

    });
    //忘記密碼



});
