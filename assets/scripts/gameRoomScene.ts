import { _decorator, Component, Node, AudioSource, Button, SpriteFrame, Prefab, instantiate, SpriteAtlas, director, Label, game } from 'cc';

import gameManager from './components/gameManager';
import { RoomState } from './components/define';
import PlayerPrefab from './components/PlayerPrefab';




const { ccclass, property } = _decorator;

@ccclass('gameroom')
export class gameRoomScene extends Component {
    @property(Node) setting: Node = null;
    @property(Button) MusicButton: Button = null;
    @property(Button) AudioButton: Button = null;
    @property(SpriteFrame) onImage: SpriteFrame = null;
    @property(SpriteFrame) offImage: SpriteFrame = null;
    @property(AudioSource) bgMusic: AudioSource = null;
    @property(Prefab) PlayerPrefab: Prefab = null;
    @property(Node) Players_Seat: Node = null;
    @property(Label) bottomLabel: Label = null;
    @property(Label) rateLabel: Label = null;
    @property(Label) roomidLabel: Label = null;
   
    playerNodeList = []
    public openMenu = false;
    private MusicIsOn: boolean = !false;
    private AudioIsOn: boolean = !false;
    roomstate = null;
    playerdata_list_pos = [];

    gameEnd(){

    }
    
    onLoad() {

        this.openMenu = false;
        this.setting.active = false;
        this.playerNodeList = [];
        this.Players_Seat.active = true
        this.bottomLabel.string = "底分:" + gameManager.Instance.userDetails.bottom
        this.rateLabel.string = "倍率:" + gameManager.Instance.userDetails.rate
        this.roomstate = RoomState.ROOM_INVALID
        this.node.on("pushcard_other_event", function () {
            console.log("gamescene pushcard_other_event")
            for (let i = 0; i < this.playerNodeList.length; i++) {
                let node = this.playerNodeList[i]
                if (node) {
                    //给playernode节点发送事件
                    node.emit("push_card_event")
                }
            }
        }.bind(this))

        

        gameManager.Instance.socketUtil.onRoomChangeState((data) => {
            console.log("onRoomChangeState:" + data)
            this.roomstate = data
        })

        this.node.on("canrob_event", function (event) {
            console.log("gamescene canrob_event:" + event)
            //通知给playernode子节点
            for (let i = 0; i < this.playerNodeList.length; i++) {
                let node = this.playerNodeList[i]
                if (node) {
                    //给playernode节点发送事件
                    node.emit("playernode_canrob_event", event)
                }
            }
        }.bind(this))

        this.node.on("choose_card_event", function (event) {
            console.log("--------choose_card_event-----------")
            let gameui_node = this.node.getChildByName("gamingUI")
            if (gameui_node == null) {
                console.log("get childrdn name gameingUI")
                return
            }
            gameui_node.emit("choose_card_event", event)

        }.bind(this))

        this.node.on("unchoose_card_event", function (event) {
            console.log("--------unchoose_card_event-----------")
            let gameui_node = this.node.getChildByName("gamingUI")
            if (gameui_node == null) {
                console.log("get childer name gameingUI")
                return
            }
            gameui_node.emit("unchoose_card_event", event)
        }.bind(this))

        gameManager.Instance.socketUtil.requestEnterRoom({}, (err, result) => {
            // console.log("enter_room_resp"+ JSON.stringify(result))
            if (err != 0) {
                console.log("enter_room_resp err:" + err)
            } else {

                //enter_room成功
                let seatid = result.seatindex //自己在房间里的seatid
                this.playerdata_list_pos = []  //3个用户创建一个空用户列表
                this.setPlayerSeatPos(seatid)

                let playerdata_list = result.playerdata
                let roomid = result.roomid
                this.roomidLabel.string = "房間號: " + roomid
                gameManager.Instance.userDetails.housemanageid = result.housemanageid

                for (let i = 0; i < playerdata_list.length; i++) {
                    // console.log("this----"+this)
                    this.addPlayerNode(playerdata_list[i])
                }

                // if(isopen_sound){
                //     cc.audioEngine.stopAll()
                //     cc.audioEngine.play(cc.url.raw("resources/sound/bg.mp3"),true) 
                //  }
            }
            let gamebefore_node = this.node.getChildByName("gamebeforeUI")
            gamebefore_node.emit("init")
        })

        gameManager.Instance.socketUtil.onPlayerJoinRoom((join_playerdata) => {
            console.log("onPlayerJoinRoom:" + JSON.stringify(join_playerdata))
            this.addPlayerNode(join_playerdata)
        })

        gameManager.Instance.socketUtil.onPlayerReady((data) => {
            console.log("-------onPlayerReady:" + data)
            for (let i = 0; i < this.playerNodeList.length; i++) {
                let node = this.playerNodeList[i]
                if (node) {
                    node.emit("player_ready_notify", data)
                }
            }
        })

        gameManager.Instance.socketUtil.onGameStart(() => {
            for (let i = 0; i < this.playerNodeList.length; i++) {
                let node = this.playerNodeList[i]
                if (node) {
                    node.emit("gamestart_event")
                }
            }

            //隐藏gamebeforeUI节点
            let gamebeforeUI = this.node.getChildByName("gamebeforeUI")
            if (gamebeforeUI) {
                gamebeforeUI.active = false
            }
        })
        gameManager.Instance.socketUtil.onRobState((event) => {
            console.log("-----onRobState" + JSON.stringify(event))
            //onRobState{"accountid":"2162866","state":1}
            for (let i = 0; i < this.playerNodeList.length; i++) {
                let node = this.playerNodeList[i]
                if (node) {
                    //给playernode节点发送事件
                    node.emit("playernode_rob_state_event", event)
                }
            }
        })

        gameManager.Instance.socketUtil.onChangeMaster((event) => {
            console.log("onChangeMaster" + event)
            //保存一下地主id
            gameManager.Instance.userDetails.master_username = event
            for (let i = 0; i < this.playerNodeList.length; i++) {
                let node = this.playerNodeList[i]
                if (node) {
                    //给playernode节点发送事件
                    node.emit("playernode_changemaster_event", event)
                }
            }
        })

        gameManager.Instance.socketUtil.onShowBottomCard((event) => {
            console.log("onShowBottomCard---------" + event)
            let gameui_node = this.node.getChildByName("gamingUI")
            if (gameui_node == null) {
                console.log("get childer name gameingUI")
                return
            }
            gameui_node.emit("show_bottom_card_event", event)
        })
    }



    setPlayerSeatPos(seat_index) {
        if (seat_index < 1 || seat_index > 3) {
            console.log("seat_index error" + seat_index)
            return
        }

        console.log("setPlayerSeatPos seat_index:" + seat_index)

        //界面位置转化成逻辑位置
        switch (seat_index) {
            case 1:
                this.playerdata_list_pos[1] = 0
                this.playerdata_list_pos[2] = 1
                this.playerdata_list_pos[3] = 2
                break
            case 2:


                this.playerdata_list_pos[2] = 0
                this.playerdata_list_pos[3] = 1
                this.playerdata_list_pos[1] = 2
                break
            case 3:
                this.playerdata_list_pos[3] = 0
                this.playerdata_list_pos[1] = 1
                this.playerdata_list_pos[2] = 2
                break
            default:
                break
        }

    }



    addPlayerNode(player_data) {

        let playernode_inst = instantiate(this.PlayerPrefab)
        playernode_inst.active = true
        playernode_inst.parent = this.node

        //创建的节点存储在gameroom的列表中
        this.playerNodeList.push(playernode_inst)
        
        //玩家在room里的位置索引(逻辑位置)
        let index = this.playerdata_list_pos[player_data.seatindex]
        console.log("index " + player_data.seatindex + " " + index)
        playernode_inst.getComponent(PlayerPrefab).init_data(player_data, index)
        const localPosition = this.Players_Seat.children[index].position.clone();
        playernode_inst.setPosition(localPosition);
        
    }

    getUserOutCardPosByAccount(username) {
        console.log("getUserOutCardPosByAccount username:" + username)
        for (let i = 0; i < this.playerNodeList.length; i++) {
            let node = this.playerNodeList[i]
            if (node) {
                //获取节点绑定的组件
                let node_script = node.getComponent(PlayerPrefab)
                //如果accountid和player_node节点绑定的accountid相同
                //接获取player_node的子节点
                if (node_script.username === username) {
                    let seat = this.Players_Seat.children[node_script.seat_index]
                    let index_name = "cardzone" + node_script.seat_index
                    //console.log("getUserOutCardPosByAccount index_name:"+index_name)
                    let out_card_node = seat.getChildByName(index_name)
                    //console.log("OutZone:"+ out_card_node.name)
                    return out_card_node
                }
            }
        }

        return null
    }

    

    // 

    // 返回按鈕
    public onBack() {
        this.setting.active = false;
        this.openMenu = false;
    }
    // 設定按鈕
    public onSetting() {
        if (!this.openMenu)
            this.setting.active = !false,
                this.openMenu = !false;
    }
    //返回大廳按鈕
    public onleaveRoom() {
        director.loadScene('hall')
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
    
}


