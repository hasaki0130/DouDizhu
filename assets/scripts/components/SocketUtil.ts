import { Game, game } from "cc";
import gameManager from "./gameManager";
import eventListener from "./eventListener";
import { defines } from "./define";
const io = (window as any).io || {}
gameManager.Instance.eventlistener = new eventListener();

export default class SocketUtil {

    ip = "";
    sio = null;
    connected = false;
    fnDisconnect = null;
    isPing = false;
    lastSendTime = null;
    lastReciveTime = null;
    private responseMap = {};
    private callIndex = 0;
    private event = gameManager.Instance.eventlistener;
    
    private _sendmsg(cmdtype, req, callIndex) {
        if (!this.sio) {
            console.error("Socket is not connected.");
            return;
        }
        this.sio.emit("notify", { cmd: cmdtype, data: req, callIndex: callIndex });
        // console.log("notify", { cmd: cmdtype, data: req, callIndex: callIndex })
    }

   
    private _request(cmdType, req?, callback?) {
        // console.log(`Send cmd: ${cmdType}     ${JSON.stringify(req)}`);

        this.callIndex++;
        this.responseMap[this.callIndex] = callback;
        this._sendmsg(cmdType, req, this.callIndex);

    }



    connect() {
        let opts = {
            'reconnection': false,
            'force new connection': true,
            'transports': ['websocket', 'polling']
        }
        this.sio = io.connect(defines.serverUrl, opts)
        this.sio.on("connect", (data) => {
            console.log("服務端：connect success!")
            this.connected = true
            this.StartHeartBeat();
        })

        this.sio.on("notify", (res) => {
            console.log("收到來自伺服器的通知:",JSON.stringify(res));
            // 檢查回應對象中是否有名為 callBackIndex 的屬性，
            // 如果有，則這表明這個通知是之前某個請求的回應。
            if (this.responseMap.hasOwnProperty(res.callBackIndex)) {
                // 從回應映射中獲取對應的回調函數。
                const callback = this.responseMap[res.callBackIndex];
                // 執行回調函數，並將服務器返回的結果和數據作為參數傳遞給它。
                if (callback) {
                    callback(res.result, res.data)
                }
            } else {
                // 如果回應對象中沒有 callBackIndex，則認為這是一個獨立的通知，
                // 而不是對之前請求的回應。
                // 在這種情況下，根據通知的類型，觸發對應的事件。
                const type = res.type;
                this.event.fire(type, res.data);
            }
        });


        this.sio.on("disconnect", () => {
            this.connected = false;
            console.log("disconnect")
            this.close();
        });

        this.sio.on("connect_failed", () => {
            console.log("connect_failed")

        })


    }
    send(event, data?) {
        if (this.connected) {
            this.sio.emit(event, data);
        }
        console.log("觸發時間: " + (new Date()).toLocaleTimeString() + "，請求事件：" + event);
    }


    

    requestLogin(req, callback) {
        this._request("login", req, callback)
    }

    requestCreateRoom(req, callback) {
        this._request("createroom_req", req,callback);
    }


    requestJoin(req, callback) {
        this._request("joinroom_req", req, callback);
    }


    requestEnterRoom(req, callback) {
        this._request("enterroom_req", req, callback);
    }

    requestbuchuCard(req, callback) {
        this._request("bu_chu_card_req", req, callback);
    }

    requestChuCard(req, callback) {
        this._request("chu_card_req", req, callback);
    }

    // 註冊事件監聽
    onPlayerJoinRoom(callback) {
        this.event.on("player_joinroom_notify", callback);
    }

    onPlayerReady(callback) {
        this.event.on("player_ready_notify", callback);
    }


    onGameStart(callback) {
        if (callback) {
            this.event.on("gameStart_notify", callback);
        }
    }

    // 監聽房主變更的消息
    onChangeHouseManage(callback) {
        if (callback) {
            this.event.on("changehousemanage_notify", callback);
        }
    }

    // 發送準備好的消息
    requestReady() {
        this._request("player_ready_notify", {}, null);
    }

    // 發送開始遊戲的請求
    requestStart(callback) {
        this._request("player_start_notify", {}, callback);
    }

    // 發送搶地主的消息
    requestRobState(state) {
        this._request("player_rob_notify", state, null);
    }

    // 監聽發牌的消息
    onPushCards(callback) {
        if (callback) {
            this.event.on("pushcard_notify", callback);
        }
    }

    // 監聽開始搶地主的消息
    onCanRobState(callback) {
        if (callback) {
            this.event.on("canrob_notify", callback);
        }
    }

    // 監聽搶地主操作的消息
    onRobState(callback) {
        if (callback) {
            this.event.on("canrob_state_notify", callback);
        }
    }

    // 監聽確定地主的消息
    onChangeMaster(callback) {
        if (callback) {
            this.event.on("change_master_notify", callback);
        }
    }

    // 監聽顯示底牌的消息
    onShowBottomCard(callback) {
        if (callback) {
            this.event.on("change_showcard_notify", callback);
        }
    }

    // 監聽可以出牌的消息
    onCanChuCard(callback) {
        if (callback) {
            this.event.on("can_chu_card_notify", callback);
        }
    }

    // 監聽房間狀態變化的消息
    onRoomChangeState(callback) {
        if (callback) {
            this.event.on("room_state_notify", callback);
        }
    }

    // 監聽其他玩家出牌的消息
    onOtherPlayerChuCard(callback) {
        if (callback) {
            this.event.on("other_chucard_notify", callback);
        }
    }

    StartHeartBeat() {
        this.sio.on("game_pong", () => {
            console.log("game_pong")
            this.lastReciveTime = Date.now();
        })
        this.lastReciveTime = Date.now();

        setInterval(() => {
            if (this.sio && this.connected) {
                this.sio.emit("game_ping")
                console.log("game_ping")
            }
        }, 5000)

        // setInterval(() => {
        //     if (this.sio && this.connected) {
        //         if (Date.now() - this.lastReciveTime > 10000) {
        //             this.connected = false;
        //             this.sio.disconnect();
        //             this.sio = null;
        //         }
        //     }
        // }, 500)
    }




    ping() {
        this.lastSendTime = Date.now();
        console.log("game_ping");
        this.send("game_ping")
    }


    close() {
        if (this.sio && this.connected) {
            this.connected = false;
            this.sio.disconnect();
            this.sio = null;
        }
        if (this.fnDisconnect) {
            this.fnDisconnect();
            this.fnDisconnect = null;
        }


    }

}
