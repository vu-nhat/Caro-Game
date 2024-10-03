const boardSizeCol = 50;
const boardSizeRow = 25;
const token = sessionStorage.getItem('token');
document.addEventListener('DOMContentLoaded', function() {
    // Kiểm tra token trong sessionStorage
    
    const username = sessionStorage.getItem('username');
    const email = sessionStorage.getItem('email');

    if (!token || !username || !email) {
        // Nếu không có token, chuyển hướng về trang đăng nhập
        window.location.href = '/templates/login.html';
    } else {
        // Hiển thị thông tin tài khoản từ sessionStorage
        document.getElementById('account-details').innerHTML = 
            `Username: ${username}<br>Email: ${email}<br>`;
    }
});

function playWithMachine() {
    fetch(`http://127.0.0.1:8080/game/playWithBot?row=${boardSizeRow}&col=${boardSizeCol}`,
         { method: 'POST', headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        } })
        .then(response => response.text())
        .then(data => {
            if (data.includes('Init success')) {
                window.location.href = '/templates/gameOffline.html';
            }
            else {
                alert("Có lỗi xảy ra!");
            }
        });
    
}

function playOnline() {
    alert("Bắt đầu chơi online!");
    // Điều hướng tới trang chơi online, ví dụ:
    // window.location.href = '/play-online.html';
}
