$(document).ready(function () {
    // 切換到登入頁面
    $('#goto-login').click(function (e) {
        e.preventDefault();
        window.location.href = 'login';
    });
});
document.addEventListener("DOMContentLoaded", function () {
    // 監聽滾動事件
    window.addEventListener("scroll", function () {
        // 取得滾動的垂直位置
        let scrollPosition = window.scrollY || document.documentElement.scrollTop;

        // 設定滾動位置的閾值
        let scrollThreshold = 20;

        // 判斷是否超過閾值，超過則增加底色，否則移除底色
        if (scrollPosition > scrollThreshold) {
            document.getElementById("navbar").style.backgroundColor = "#62ac71";
        } else {
            document.getElementById("navbar").style.backgroundColor = "transparent";
        }
    });
});

//navbar背景顏色
// var checkNavbar = true;
function toggleNavbarColor() {
    // checkNavbar = ! checkNavbar;
    // document.getElementById("navbar").style.backgroundColor =  checkNavbar ? "transparent": "#01310b";
    document.getElementById("navbar").style.backgroundColor = "#01310b";
}

// 手機模式不要用slider
document.addEventListener('DOMContentLoaded', function () {
    function checkScreenWidth() {
        var screenWidth = window.innerWidth || document.documentElement.clientWidth;
        var elements = document.querySelectorAll(".showSlider");

        elements.forEach(function(element) {
            if (screenWidth > 700) {
                element.classList.add("carousel-item");
            } else {
                element.classList.remove("carousel-item");
            }
        });
        // console.log(screenWidth);
    }

    // 初次加載時檢查一次
    checkScreenWidth();

    // 窗口大小變化時檢查
    window.addEventListener('resize', checkScreenWidth);
});

document.addEventListener("DOMContentLoaded", function() {
    const questions = document.querySelectorAll('.question');

    questions.forEach(question => {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const arrow = this.querySelector('.arrow');

            if (answer.style.display === 'block') {
                answer.style.display = 'none';
                arrow.classList.remove('down');
            } else {
                answer.style.display = 'block';
                arrow.classList.add('down');
            }
        });
    });
});

$('.navbar-nav>li>a').on('click', function(){
    $('.navbar-collapse').collapse('hide');
});