


var username = 'admin', password = '12345';


function checkAdmin(account, password) {
    if (this.username === account && this.password === password) {
        data = {
            account: account,
            password: password
        }
        $.ajax({
            type: "put",
            url: "/CMS_main",
            data: data,
            success: function (res) {
                window.location.assign(res);
            },
            error: function (err) {
                alert("登入失敗，請檢查使用者名稱和密碼。");
            }
        })
        
    } else {
        return alert("登入失敗，請檢查使用者名稱和密碼。");
    }
}