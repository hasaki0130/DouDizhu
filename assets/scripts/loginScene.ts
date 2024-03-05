import { _decorator, Component, director, Node, AudioSource, AudioClip, find, EditBox, Label } from 'cc';
import gameManager from './components/gameManager';
import SocketUtil from './components/SocketUtil';
import { Api } from './components/urlAPI';
import HTTP from './components/HTTP';
const { ccclass, property } = _decorator;
const eventTarget = new EventTarget;
gameManager.Instance.socketUtil = new SocketUtil();
@ccclass('login')
export class loginScene extends Component {
    @property(Node) singUp: Node = null;
    @property(Node) singIn: Node = null;
    @property(EditBox) accountInput: EditBox = null;
    @property(EditBox) passwdInput: EditBox = null;
    @property(EditBox) regNameInput: EditBox = null;
    @property(EditBox) regAccountInput: EditBox = null;
    @property(EditBox) regPasswdInput: EditBox = null;
    @property(EditBox) confirmregPasswdInput: EditBox = null;
    @property(Node) Label: Node = null;
    
    _Label: Label = null;
    public openMenu = false;

    onLoad() {
        this.singUp.active = false;
        this.singIn.active = false;
        gameManager.Instance.http = new HTTP();

        gameManager.Instance.socketUtil.connect();
        this._Label = this.Label.getComponent(Label);
        this.Label.active = false

    }


    start() {


    }



    public onTest() {
        director.loadScene("hall");
    }






    // -----------登入場景按鈕----------

    // 會員註冊按鈕
    public onMemberregist() {
        if (!this.openMenu)
            this.singUp.active = !false,
                this.openMenu = !false;


    }

    // 會員登入按鈕
    public onMemberLogin() {
        if (!this.openMenu)
            this.singIn.active = !false,
                this.openMenu = !false;
    }


    // -----------註冊頁按鈕------------
    //確認兩次密碼是否相同
    onPasswordChanged(editBox: EditBox) {
        const password = this.regPasswdInput.string;
        const confirmPassword = this.confirmregPasswdInput.string;

        if (password !== confirmPassword) {
            this.Label.active = true;
            this._Label.string = "密碼不相同";
        } else {
            this.Label.active = false;
        }
    }

    // 確認會員是否重複按鈕
    public onCheckName() {
        let checkName = this.regNameInput.string;
        if (checkName.length < 1) {
            gameManager.Instance.alert.show("提示", "尚未輸入名稱!");
            return;
        }
        let data = { "username": checkName }
        gameManager.Instance.loading.show();


        gameManager.Instance.http.getRequest(Api.confirmname, data, (ret) => {


            if (ret.message === '用戶名已被占用') {
                gameManager.Instance.loading.hide();
                gameManager.Instance.alert.show("警告", "這個名稱已經被使用了!");

            } else {
                gameManager.Instance.loading.hide();
                gameManager.Instance.alert.show("提示", "這個名稱可以使用!");
            }
        });
    }



    // 確定註冊按鈕
    public onConfirmregist() {
        let regname = this.regNameInput.string;;
        let regemail = this.regAccountInput.string;
        let regpassword = this.regPasswdInput.string;
        let confirmRegPassword = this.confirmregPasswdInput.string;
        console.log("註冊姓名:", regname, "帳號:", regemail, "密碼:", regpassword);

        if (regname.length < 1 || regemail.length < 1 || regpassword.length < 1) {
            gameManager.Instance.alert.show("註冊失敗", "輸入內容不能為空");
            return;
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(regemail)) {
            gameManager.Instance.alert.show("註冊失敗", "無效的電子郵件格式");
            return;
        }

        if (regpassword !== confirmRegPassword) {
            gameManager.Instance.alert.show("註冊失敗", "輸入的二次密碼有誤!");
            return;
        }

        let data = { "username": regname, "email": regemail, "password": regpassword };
        gameManager.Instance.http.postRequest(Api.register, data, (ret) => {


            if (ret.message === '註冊成功') {
                gameManager.Instance.loading.hide();
                gameManager.Instance.alert.show("註冊成功", "請到信箱收取驗證信!");
                this.regNameInput.string = ''
                this.regAccountInput.string = ''
                this.regPasswdInput.string = ''
                this.confirmregPasswdInput.string = ''
            } else {
                gameManager.Instance.loading.hide();
                gameManager.Instance.alert.show("註冊失敗", "您的資料有誤，請核實。");
            }
        });
    }

    // 返回按鈕
    public onBack() {
        this.singUp.active = false;
        this.singIn.active = false;
        this.openMenu = false;
    }

    // -----------登入頁按鈕------------


    // 確定登入按鈕
    public onConfirmLogin() {

        let email = this.accountInput.string;
        let password = this.passwdInput.string;
        // console.log("發送的帳號:", email, "密碼:", password);

        if (email.length < 1 || password.length < 1) {
            gameManager.Instance.alert.show("登入失敗", "帳號與或密碼為空");
            return;
        }

        let data = { "email": email, "password": password };

        gameManager.Instance.loading.show();

        // 調用 postRequest 方法，並傳入數據
        gameManager.Instance.http.postRequest(Api.login, data, (ret) => {

            if (ret.message === '登錄成功') {
                gameManager.Instance.loading.hide();
                gameManager.Instance.userDetails = ret.userDetails;
                
                gameManager.Instance.socketUtil.requestLogin(gameManager.Instance.userDetails, (err, result) => {
                    if (err) {
                        // 處理錯誤
                        console.error("Socket 登入失敗", err);
                    } else {
                        // 處理登入成功的邏輯
                        console.log("Socket 登入成功", result);
                    }
                });

                director.loadScene("hall");
            } else {
                gameManager.Instance.loading.hide();
                gameManager.Instance.alert.show("登入失敗", "帳號或密碼輸入錯誤...");
            }
        });

    }
    // 找回密碼按鈕
    public onFindpw() {
        console.log("確定按鈕被點擊");
    }




}

