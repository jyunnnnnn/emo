$(document).ready(function () {
    // 按下註冊切換表單
    $('#switch-to-signup').click(function (e) {
        e.preventDefault();
        $('#login-container').addClass('d-none');
        $('#signup-container').removeClass('d-none');
    });

    $('#return-to-login-button').click(function (e) {
        e.preventDefault();
        $('#login-container').removeClass('d-none');
        $('#signup-container').addClass('d-none');
    });

    $('#return-to-login-button2').click(function (e) {
        e.preventDefault();
        $('#login-container').removeClass('d-none');
        $('#forgetPassword-container').addClass('d-none');
    });

    //按下忘記密碼切換到忘記密碼的選單
    $('#no-account').click(function (e) {
        e.preventDefault();
        $('#login-container').addClass('d-none');
        $('#forgetPassword-container').removeClass('d-none');
    });

    //發送驗證碼
    $('#sendVerifyingCodeButton').click(function (e) {
        var inputEmail = $('#exampleInputEmail').val();

        //檢查是否有輸入電子郵件
        if (!inputEmail) {
            alert('請輸入電子郵件');
            return;
        }

        //檢查電子郵件格式
        if (!IsEmail(inputEmail)) {
            alert('請輸入正確的電子郵件格式');
            return;
        }

        //檢查是否已經寄送過
        $.ajax({
            type: 'GET',
            url: '/api/sendAgain?userMail=' + inputEmail,
            contentType: 'application/json',
            success: function (response) {
                alert("驗證碼寄送成功");
                sendEmail(inputEmail);
            },
            error: function (xhr, status, error) {
                alert("先前已寄送驗證碼，5分鐘後再嘗試");
            }
        });
    });

    // 註冊
    $('#return-to-login').click(function (e) {
        e.preventDefault();
        var inputAccount = $('#exampleInputAccount2').val();
        var inputPassword = $('#exampleInputPassword2').val();
        var inputConfirmedPassword = $('#exampleInputPasswordcheck').val();

        // userID

        //檢查是否輸入帳號
        if (!inputAccount) {
            alert("請輸入帳號");
            return;
        }

        // email
        var inputEmail = $('#exampleInputEmail').val();



        //檢查密碼長度
        if (inputPassword.length < 8) {
            alert('密碼長度不得小於8位');
            return;
        }

        //檢查密碼與確認密碼
        if (inputPassword !== inputConfirmedPassword || !inputPassword) {
            alert('請確認是否輸入密碼或確認密碼是否正確');
            return;
        }

        // nickname default:username
        var userData = {
            username: inputAccount,
            password: inputPassword,
            nickname: inputAccount,
            email: inputEmail,
            userID: "demo"
        };

        var verifyingCode = $('#exampleInputCheckCode').val();

        //檢查驗證碼是否正確或是否為空
        if (!verifyingCode) {
            alert("請輸入驗證碼");
            return;
        } else {
            $.ajax({
                type: 'GET',
                url: '/api/matchVerifyingCode?userMail=' + inputEmail + "&userInput=" + verifyingCode,
                contentType: 'application/json',
                success: function (xhr, status, error) {
                    //建立新使用者
                    $.ajax({
                        type: 'POST',
                        url: '/api/register',
                        contentType: 'application/json',
                        data: JSON.stringify(userData),
                        success: function (response) {
                            alert(response.message);
                            $('#login-container').removeClass('d-none');
                            $('#signup-container').addClass('d-none');
                        },
                        error: function (xhr, status, error) {
                            var errorData = JSON.parse(xhr.responseText);
                            var errorMessage = errorData.message;
                            alert(errorMessage);
                        }
                    });
                },
                error: function (response) {
                    alert("驗證碼輸入錯誤");
                }
            });
        }
    });

    //檢查是否為email格式
    function IsEmail(email) {
        var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (!regex.test(email)) {
            return false;
        } else {
            return true;
        }
    }

    function sendEmail(email) {
        $.ajax({
            type: 'POST',
            url: '/api/sendVerifyingCode?userMail=' + email,
            contentType: 'application/json',
            success: function (response) {
                alert("驗證碼寄送成功");
            },
            error: function (response) {
                alert("驗證碼寄送失敗");
            }
        });
    }

    // 登入
    $('#login-button').click(function (e) {
        e.preventDefault();

        var inputAccount = $('#exampleInputAccount1').val();
        var inputPassword = $('#password-field').val();

        $.ajax({
            type: 'GET',
            url: encodeURI('/api/login?username=' + inputAccount + '&password=' + inputPassword),
            contentType: 'application/json',

            success: function (response) {
                localStorage.setItem('EmoAppUser', response.username);
                alert(response.message);
                window.location.href = response.location;
            },
            error: function (xhr, status, error) {
                var errorMessage = JSON.parse(xhr.responseText);
                alert(errorMessage.message);
            }
        });
    });

    //忘記密碼時驗證完按下確認 下方跑出設定新密碼的表單
    $('#verified-code').click(function (e) {
        //要再加一個if(驗證成功才執行下面的切換)

        e.preventDefault();
        $('#login-container').addClass('d-none');
        $('#set-password-container').removeClass('d-none');
        
    });
});
