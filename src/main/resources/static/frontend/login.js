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
                        type: 'GET',
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


});
