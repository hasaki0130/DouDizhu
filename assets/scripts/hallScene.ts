import { _decorator, Component, Node, AudioSource, Button, SpriteFrame, Label, director, game, Prefab, instantiate, labelAssembler, EditBox } from 'cc';
import { createRoomConfig } from "./components/define"
import gameManager from './components/gameManager';
import Util from './components/Util';

import HTTP from './components/HTTP'; // 假設HTTP類被定義在'HTTP.ts'文件中

import { Api } from './components/urlAPI';


const { ccclass, property } = _decorator;

@ccclass('hall')
export class hallScene extends Component {
    @property(Node) mall: Node = null;
    @property(Node) record: Node = null;
    @property(Node) feedback: Node = null;
    @property(Node) rule: Node = null;
    @property(Node) setting: Node = null;
    @property(Node) face: Node = null;
    @property(Node) mail: Node = null;
    @property(Button) MusicButton: Button = null;
    @property(Button) AudioButton: Button = null;
    @property(SpriteFrame) onImage: SpriteFrame = null;
    @property(SpriteFrame) offImage: SpriteFrame = null;
    @property(Button) mailButton: Button = null;
    @property(SpriteFrame) mailOnImage: SpriteFrame = null;
    @property(SpriteFrame) mailOffImage: SpriteFrame = null;
    @property(AudioSource) bgMusic: AudioSource = null;
    @property(Node) personalInfo: Node = null;
    //sammykym:
    @property(Node) recordFrame: Node = null;
    @property(Prefab) recordText: Prefab = null;
    //-----------
    @property(Node) lbFace: Node = null;
    @property(Node) lbname: Node = null;
    @property(Node) lbMoney: Node = null;
    _lbname: Label = null;
    _lbMoney: Label = null;
    @property(Node) pIname: Node = null;
    @property(Node) pIemail: Node = null;
    @property(Node) pIip: Node = null;
    @property(Node) feedbackname: Node = null;
    _pIname: Label = null;
    _pIemail: Label = null;
    _pIip: Label = null;
    _feedbackname: Label = null;
    public openMenu = false;
    private MusicIsOn: boolean = !false;
    private AudioIsOn: boolean = !false;
    @property(Node) recordMail: Node = null;
    @property(Prefab) mailText: Prefab = null;
    @property(Node) userMessage: Node = null;
    @property(Node) replyMessage: Node = null;
    @property(Node) EnterWindow: Node = null;
    @property(EditBox) roomId: EditBox = null;
    private _roomId: string = "";
    private cur_input_count: number = -1;
    @property(EditBox) feedbackInput: EditBox = null;
    

    onLoad() {

        this._lbname = this.lbname.getComponent(Label);
        this._lbMoney = this.lbMoney.getComponent(Label);
        this._pIname = this.pIname.getComponent(Label);
        this._pIemail = this.pIemail.getComponent(Label);
        this._pIip = this.pIip.getComponent(Label);
        this.mall.active = false;
        this.record.active = false;
        this.feedback.active = false;
        this.rule.active = false;
        this.setting.active = false;
        this.face.active = false;
        this.mail.active = false;
        this.EnterWindow.active = false;
        this.openMenu = false;
        this._feedbackname = this.feedbackname.getComponent(Label)


        gameManager.Instance.util = new Util();


        this.init();
    }



    init() {
        let userDetails = gameManager.Instance.userDetails;

        if (userDetails) {

            this._feedbackname.string = userDetails.username;
            this._lbname.string = userDetails.username;
            this._lbMoney.string = userDetails.money
            this._pIname.string = userDetails.username;
            this._pIemail.string = userDetails.email;

            //sammykym:
            this.recordFrame.removeAllChildren();
            userDetails.user_playway.forEach(record => {
                let record_text = instantiate(this.recordText);
                record.money > 0 ? record_text.getComponentsInChildren(Label)[0].string = '勝' : record_text.getComponentsInChildren(Label)[0].string = '負';
                record_text.getComponentsInChildren(Label)[1].string = record.date;
                record.identity == 'banker' ? record_text.getComponentsInChildren(Label)[2].string = '地主' : record_text.getComponentsInChildren(Label)[2].string = '農民';
                record_text.getComponentsInChildren(Label)[3].string = record.money;
                this.recordFrame.addChild(record_text);

            });
            //-----------
            //郵箱:


            this.recordMail.removeAllChildren();
            userDetails.feedback.forEach(record => {
                let text = instantiate(this.mailText);
                let labels = text.getComponentsInChildren(Label);
                labels[0].string = new Date(record.user_message_date._seconds * 1000).toLocaleString();
                // labels[1].string=record.user_message;
                this.recordMail.addChild(text);
                let button = text.getComponent(Button);
                text.on('click', () => this.onTextClicked(record, button), this);
            });

        }

    }
    onTextClicked(record, button) {
        let userMessage = this.userMessage.getComponent(Label);
        let replyMessage = this.replyMessage.getComponent(Label);
        userMessage.string = record.user_message
        replyMessage.string = record.reply_message
        console.log(this.mailText);
        this.recordMail.children.forEach(child => {
            let childButton = child.getComponent(Button);
            if (childButton) {
                childButton.normalSprite = this.mailOffImage;
                childButton.pressedSprite = this.mailOffImage;
            }
        });
        button.normalSprite = this.mailOnImage;
        button.pressedSprite = this.mailOnImage;
    }




    // ----------上方功能列-------------
    // 頭像按鈕
    public onFace() {
        if (!this.openMenu)
            this.face.active = !false,
                this.openMenu = !false;
        console.log("確定按鈕被點擊");
    }
    // 郵件按鈕
    public onMail() {
        if (!this.openMenu)
            this.mail.active = !false,
                this.openMenu = !false;
    }


    // 返回按鈕
    public onBack() {
        this.mall.active = false;
        this.mail.active = false;
        this.record.active = false;
        this.feedback.active = false;
        this.rule.active = false;
        this.setting.active = false;
        this.face.active = false;
        this.EnterWindow.active = false;
        this.openMenu = false;
        console.log("確定按鈕被點擊");
    }
    // ----------中間功能列-------------

    // 創建房間按鈕
    onEnterRoom(roominfo) {

        const config = createRoomConfig[roominfo];
        if (config) {
            // 創建房間請求

            gameManager.Instance.socketUtil.requestCreateRoom(config, (err, result) => {
                if (err) {
                    // 處理錯誤
                    console.error("Socket 失敗", err);
                } else {
                    // 處理創建成功的邏輯
                    console.log("Socket 成功", result);
                    gameManager.Instance.userDetails.bottom = config.bottom
                    gameManager.Instance.userDetails.rate = config.rate
                    // console.log(gameManager.Instance.userDetails)
                    director.loadScene('gameroom')

                }
            });
        } else {
            console.error("無效的房間等級");
        }
    }

    public onInRookieRoom() {
        this.onEnterRoom('1')

    }

    // 加入房間按鈕




    public onEnter() {
        if (!this.openMenu)
            this.EnterWindow.active = !false,
                this.openMenu = !false;
    }

    public onEnterWindow() {
        this._roomId = this.roomId.string;
        //console.log("joinid.length:"+this.joinid.length)
        if (this._roomId.length >= 6) {
            
            //判断加入房间逻辑
            var room_para = {
                roomid: this._roomId
            }
            console.log(room_para);
            gameManager.Instance.socketUtil.requestJoin(room_para, (err, result) => {
                // console.log("err", err, "result", result)
                if (err) { 
                    console.log("error joining room:" + err);
                    gameManager.Instance.loading.show();
                    
                } else { 
                    console.log("join room success" + JSON.stringify(result));
                    gameManager.Instance.userDetails.bottom = result.bottom;
                    gameManager.Instance.userDetails.rate = result.rate;
                    director.loadScene('gameroom');
                }
                
            });
            return
        }
    }
    // ----------下方功能列-------------

    // 商城按鈕
    public onMall() {
        // 切換商城菜單的顯示狀態
        if (!this.openMenu) {//openMenu是一個控制菜單是否打開的布林值
            this.mall.active = true; // 啟用商城菜單節點
            this.openMenu = true; // 標記菜單為打開狀態
            // 可以在這裡進一步初始化商城菜單，例如更新金額顯示等
        } else {
            this.mall.active = false; // 關閉商城菜單節點
            this.openMenu = false; // 標記菜單為關閉狀態
        }
    }

    http: HTTP = new HTTP(); // 創建HTTP類的實例

    // 商城內儲值金額1按鈕
    public onAddValue150() {
        console.log("確定金額150按鈕被點擊");
        this.http.postAmount(150); // 調用http.postAmount並傳入金額150
    }

    // 商城內儲值金額2按鈕
    public onAddValue300() {
        console.log("確定金額300按鈕被點擊");
        this.http.postAmount(300); // 調用http.postAmount並傳入金額300
    }

    // 商城內儲值金額3按鈕
    public onAddValue500() {
        console.log("確定金額500按鈕被點擊");
        this.http.postAmount(500); // 調用http.postAmount並傳入金額500
    }

    // 商城內儲值金額4按鈕
    public onAddValue1000() {
        console.log("確定金額1000按鈕被點擊");
        this.http.postAmount(1000); // 調用http.postAmount並傳入金額1000
    }

    // 商城內儲值金額5按鈕
    public onAddValue2000() {
        console.log("確定金額2000按鈕被點擊");
        this.http.postAmount(2000); // 調用http.postAmount並傳入金額2000
    }

    // 商城內儲值金額6按鈕
    public onAddValue8888() {
        console.log("確定金額8888按鈕被點擊");
        this.http.postAmount(8888); // 調用http.postAmount並傳入金額8888
    }


    // 戰績按鈕
    public onRecord() {
        if (!this.openMenu)
            this.record.active = !false,
                this.openMenu = !false;
    }

    // 反饋按鈕
    public onFeedback() {
        if (!this.openMenu)
            this.feedback.active = !false,
                this.openMenu = !false;
    }

    //反饋內提交按鈕
    public onFbSummit() {
        let check = this.feedbackInput.string;
        let username = gameManager.Instance.userDetails.username
        if (check.length < 1) {
            gameManager.Instance.alert.show("系統提示","請輸入內容!")
            return;
        }
        
        let data = { "mailtext": check, "username": username }
        gameManager.Instance.http.postRequest(Api.mail, data, (ret) => {
            if (ret.message === '發送成功') { 
                console.log('OK');
                gameManager.Instance.alert.show("系統提示","您的反饋已成功發送!");
                this.feedbackInput.string = "";
            } else {
                console.log('error');
            }
        });
    }
    // 設定按鈕
    public onSetting() {
        if (!this.openMenu)
            this.setting.active = !false,
                this.openMenu = !false;
    }


    // 設定內音樂開關按鈕
    public onMusic() {
        this.MusicIsOn = !this.MusicIsOn;
        if (this.MusicIsOn) {
            this.MusicButton.normalSprite = this.onImage;
            this.MusicButton.pressedSprite = this.onImage;
            this.bgMusic.volume = 1;
            // this.bgMusic.play();
        } else {
            this.MusicButton.normalSprite = this.offImage;
            this.MusicButton.pressedSprite = this.offImage;
            this.bgMusic.volume = 0;
            // this.bgMusic.stop();
        }
        console.log("確定按鈕被點擊");
    }

    // 設定內音效開關按鈕
    public onAudio() {
        this.AudioIsOn = !this.AudioIsOn;
        if (this.AudioIsOn) {
            this.AudioButton.normalSprite = this.onImage;
            this.AudioButton.pressedSprite = this.onImage;
            // this.bgMusic.volume = 1;
        } else {
            this.AudioButton.normalSprite = this.offImage;
            this.AudioButton.pressedSprite = this.offImage;
            // this.bgMusic.volume = 0;
        }
        console.log("確定按鈕被點擊");
    }

    // 設定內登出按鈕
    public onLogout() {

        gameManager.Instance.util.logout();

    }
    //// 玩法按鈕
    public onRule() {
        if (!this.openMenu)
            this.rule.active = !false,
                this.openMenu = !false;
    }
}


