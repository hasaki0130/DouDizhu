import { _decorator, Component, Node } from 'cc';
import gameManager from './components/gameManager';
const { ccclass, property } = _decorator;

@ccclass('gameRoomSceneBefore')
export class gameRoomSceneBefore extends Component {
    @property(Node) btn_ready: Node = null;
    @property(Node) btn_gamestart: Node = null;

    onLoad() {
        this.btn_ready.active = false
        this.btn_gamestart.active = false

        this.node.on("init", function () {
            console.log("game beforeui init")
            console.log("housemanageid:" + gameManager.Instance.userDetails.housemanageid)
            console.log("username:" + gameManager.Instance.userDetails.username)
            if (gameManager.Instance.userDetails.housemanageid == gameManager.Instance.userDetails.username) {
                //自己就是房主
                this.btn_gamestart.active = true
                this.btn_ready.active = false
            } else {
                this.btn_gamestart.active = false
                this.btn_ready.active = true
            }
        }.bind(this))

        gameManager.Instance.socketUtil.onGameStart(function () {
            console.log("gamebrforeUI on GameStart revice")
            this.node.active = false
        }.bind(this))

        gameManager.Instance.socketUtil.onChangeHouseManage(function (data) {
            console.log("gamebrforeUI onChangeHouseManage revice" + JSON.stringify(data))
            gameManager.Instance.userDetails.housemanageid = data
            if (gameManager.Instance.userDetails.housemanageid == gameManager.Instance.userDetails.username) {
                //自己就是房主
                this.btn_gamestart.active = true
                this.btn_ready.active = false
            } else {
                this.btn_gamestart.active = false
                this.btn_ready.active = true
            }

        }.bind(this))
    }
    start() {

    }
    
    onButtonClick(event,customData){
        switch(customData){
            case "btn_ready":
                console.log("btn_ready")
                gameManager.Instance.socketUtil.requestReady()
                break
            case "btn_start":
                // if(isopen_sound){
                //    cc.audioEngine.play(cc.url.raw("resources/sound/start_a.ogg")) 
                //  }
                 console.log("btn_start")
                 gameManager.Instance.socketUtil.requestStart(function(err,data){
                    if(err!=0){
                        console.log("requestStart err"+err)
                    }else{
                        console.log("requestStart data"+ JSON.stringify(data))
                        
                    }
                 })
                 break    
            default:
                break
        }
    }

   
}


