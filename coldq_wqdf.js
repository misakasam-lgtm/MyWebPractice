function passcode(user_password) {
    user_password = document.getElementById("passcode").value;
    if (btoa(user_password) =="YmluZ3Rhbmd4dWVsaQ=="){
        window.location.href = "MainPage.html"
    }
    else {
        alert("密码错误")
    }
}