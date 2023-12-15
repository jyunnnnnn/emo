

//加密金鑰
var key;
//加密偏移量
var iv;

function getEncryptKey() {
    return new Promise(function(resolve, reject) {
        $.ajax({
            type: 'GET',
            url: '/api/getEncryptKey',
            contentType: 'application/json',
            success: function (response) {
                key = response.key;
                iv = response.iv;
                resolve();  // 解析 Promise 表示成功取得金鑰和偏移量
            },
            error: function (xhr, status, error) {
                console.log("獲取金鑰失敗");
                reject();  // 拒絕 Promise 表示無法取得金鑰和偏移量
            }
        });
    });
}

//加密
function encrypt(text,key,iv) {
    var encrypted;
 encrypted= CryptoJS.AES.encrypt(text, CryptoJS.enc.Utf8.parse(key), {
         iv: CryptoJS.enc.Utf8.parse(iv),
         mode: CryptoJS.mode.CBC,
         padding: CryptoJS.pad.Pkcs7
     });
    return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
}


//解密
function decrypt(ciphertext,key,iv){
    var decrypt;
     decrypt= CryptoJS.AES.decrypt(ciphertext, CryptoJS.enc.Utf8.parse(key), {
            iv: CryptoJS.enc.Utf8.parse(iv),
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
          return decrypt.toString(CryptoJS.enc.Utf8);
}


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

    //註冊頁面 發送驗證碼按鈕
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

        //檢查是否已經寄送過 沒有的話就寄送
        isSend(inputEmail);
    });

    function isSend(inputEmail){
        //檢查是否已經寄送過驗證碼，還沒的話就寄送
        $.ajax({
            type: 'GET',
            url: '/api/sendAgain?userMail=' + inputEmail,
            contentType: 'application/json',
            success: function (response) {
                sendEmail(inputEmail);
            },
            error: function (xhr, status, error) {
                alert("先前已寄送驗證碼，5分鐘後再嘗試");
            }
        });
    }

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
        var now = new Date();
        var userId=now.getTime();
        // nickname default:username
         getEncryptKey().then(function() {
            // 在這裡執行需要 key 和 iv 的程式碼
            inputPassword=encrypt(inputPassword,key,iv);
        }).catch(function() {
            console.log("無法取得金鑰和偏移量");
        });



        var userData = {
            username: inputAccount,
            password: inputPassword,
            nickname: inputAccount,
            email: inputEmail,
            userId: userId
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
        //回到登入頁面註冊好的帳號密碼出現在頁面上
        var AccountField = document.getElementById("exampleInputAccount1");
        AccountField.value = inputAccount;
        var PasswordField = document.getElementById("password-field");
        PasswordField.value = inputPassword;
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

    //寄送驗證碼給特定電子郵件 (現在的寫法寄送很慢)
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

        if(!inputAccount || !inputPassword){
            alert("請確認輸入欄位是否輸入");
            return;
        }

         getEncryptKey().then(function() {
                // 在這裡執行需要 key 和 iv 的程式碼
                inputPassword=encrypt(inputPassword,key,iv);
                //檢驗登入
                $.ajax({
                    type: 'GET',
                    url: encodeURI('/api/login?username=' + inputAccount + '&password=' + inputPassword),
                    contentType: 'application/json',

                    success: function (response) {
                        var userData = response.user;
                        localStorage.setItem('EmoAppUser', userData);
                        alert(response.message);
                        window.location.href = response.location;
                    },
                    error: function (xhr, status, error) {
                        var errorMessage = JSON.parse(xhr.responseText);
                        alert(errorMessage.message);
                    }
                });
            }).catch(function() {
                console.log("無法取得金鑰和偏移量");
            });

    });



    //忘記密碼頁面 送出驗證碼按鈕
    $('#send-email').click(function(e){
        //使用者輸入帳號
        var inputAccount = $('#exampleInputAccount3').val();

        //檢查是否輸入帳號
        if(!inputAccount){
            alert("請輸入帳號");
            return ;
        }

        //檢查帳號是否存在，並抓取該帳號資訊
        $.ajax({
            type: 'GET',
            url: '/api/checkAccountExistByUsername?username=' + inputAccount ,
            contentType: 'application/json',
            success: function (response) {
                //檢查是否已經寄送過
                var email = response.email;
                isSend(email);
            },
            error: function (response) {
               alert("查無該使用者，請確認輸入的帳號是否存在");
            }
        });


    })

    //忘記密碼 驗證碼確認按鈕
    $('#verified-code').click(function (e) {


        //使用者輸入帳號
        var inputAccount = $('#exampleInputAccount3').val();
        //使用者輸入驗證碼
        var inputCode =$('#Input-verify-code').val();


        //檢查是否輸入帳號
        if(!inputAccount){
            alert("請輸入帳號");
            return ;
        }
        //檢查是否輸入驗證碼
        if(!inputCode){
            alert("請輸入驗證碼");
            return ;
        }


        //檢查帳號是否存在
        $.ajax({
            type: 'GET',
            url: '/api/checkAccountExistByUsername?username=' + inputAccount ,
            contentType: 'application/json',
            success: function (response) {
                //檢查驗證碼是否正確
                $.ajax({
                    type: 'GET',
                    url: '/api/matchVerifyingCode?userMail=' + response.email + "&userInput=" + inputCode,
                    contentType: 'application/json',
                    success: function (response) {
                        allowChangePassword(inputAccount);
                       //顯示更改密碼文字框
                       e.preventDefault();
                       $('#login-container').addClass('d-none');
                       $('#set-password-container').removeClass('d-none');
                    },
                    error: function (response) {
                        alert("驗證碼輸入錯誤");
                    }
                });
            },
            error: function (response) {
               alert("請檢查輸入的帳號是否存在");
            }
        });


    });

    //允許帳號可以修改密碼
    function allowChangePassword(username){
        $.ajax({
            type: 'POST',
            url: '/api/allowChangePassword?username=' + username,
            contentType: 'application/json',
            success: function (response) {
            },
            error: function (response) {
            }
        });
    }

    //確認修改密碼按鈕
    $('#login-button2').click(function(e){
        //加這個避免送出按鈕按下去後回到前一頁
        e.preventDefault();

        //使用者輸入的新密碼
        var newPassword = $('#exampleInputPassword3').val();
        //確認新密碼
        var newConfirmedPassword = $('#exampleInputPasswordcheck2').val();
        //密碼欄位是否為空
        if(!newPassword || !newConfirmedPassword ){
            alert("請檢查密碼欄位是否輸入完全");
            return ;
        }
        //新密碼長度是否至少為8
        if(newPassword.length<8){
            alert("密碼長度至少為8位");
            return ;
        }
        //密碼與確認密碼是否相同
        if(newPassword!==newConfirmedPassword){
            alert("請檢查兩個密碼欄位是否相同");
            return ;
        }

        //更新使用者資訊
        var userAccount = $('#exampleInputAccount3').val();
        //檢查帳號欄位是否被刪除或修改為不存在的帳號 (漏洞:可能會先輸入自己的電子郵件帳號 在修改密碼欄位出來以後 更改成別人的電子郵件帳號在進行密碼修改)
        if(!userAccount){
            alert("請輸入帳號");
            return ;
        }

        //檢查該帳號是否可以修改密碼
        $.ajax({
            type: 'GET',
            url: '/api/passwordChangable?username=' + userAccount,
            contentType: 'application/json',
            success: function (response) {
                //修改密碼
               updatePassword(userAccount,newPassword);
            },
            error: function (response) {
                alert("該帳號不得修改密碼");
            }
        });


    })

    //修改特定帳號的密碼
    function updatePassword(username,newPassword){
        let encryptPassword="";
         getEncryptKey().then(function() {
                // 在這裡執行需要 key 和 iv 的程式碼
                encryptPassword=encrypt(newPassword,key,iv);
                $.ajax({
                    type: 'PUT',
                    url: '/api/updateByUsername?username=' + username +"&password="+encryptPassword  ,
                    contentType: 'application/json',
                    success: function (response) {
                        alert("密碼修改成功");
                        window.location.href = "login";
                    },
                    error: function (response) {
                        alert("密碼修改失敗");
                    }
                });
            }).catch(function() {
                console.log("無法取得金鑰和偏移量");
            });

    }
});

//Google登入回呼函式
function handleCallback(response) {
    //使用者資料解碼
   var profile= JSON.parse(decodeURIComponent(escape(window.atob(response.credential.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")))));

    $.ajax({
        type: 'POST',
        url: '/api/googleLogin',
        contentType: 'application/json',
        data: JSON.stringify(profile),
        success: function (response) {
                var userData = response.user;
                localStorage.setItem('EmoAppUser', userData);
                alert(response.message);
                window.location.href = response.location;
        },
        error: function (response) {
            console.log("使用google帳號登入失敗");
        }
    });

 }

