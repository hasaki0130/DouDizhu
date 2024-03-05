import { _decorator, Component, instantiate, Label, Node, Prefab, Sprite, tween, UITransform, v2, v3, Vec2, Vec3 } from 'cc';
import gameManager from './components/gameManager';
import Card from './Card/Card';
import { gameRoomScene } from './gameRoomScene';
import { CardsValue, qian_state } from './components/define';
const { ccclass, property } = _decorator;

@ccclass('gameRoomSceneUI')
export class gameRoomSceneUI extends Component {
    @property(Node) gamingUI: Node = null;
    @property(Prefab) PokerPrefab: Prefab = null;
    @property(Node) robUI: Node = null;
    @property(Node) bottem_card_pos: Node = null;
    @property(Node) playingUI: Node = null;
    @property(Label) roomMsg: Label = null;
    cards_nods = []
    card_width = 0
    rob_player_username = null;
    fapai_end = false
    bottom_card = []
    bottom_card_data = []
    choose_card_data = []
    cur_index_card = 0
    outcar_zone = []
    push_card_tmp = []
    onLoad() {
        this.robUI.active = false
        this.playingUI.active = false
        
        gameManager.Instance.socketUtil.onPushCards(function (data) {
            console.log("onPushCards" + JSON.stringify(data))
            this.card_data = data
            this.cur_index_card = data.length - 1
            this.pushCard(data)
            // if(isopen_sound){
            //     //循环播放发牌音效
            //    // this.fapai_audioID = cc.audioEngine.play(cc.url.raw("resources/sound/fapai1.mp3"),true)
            //     console.log("start fapai_audioID"+this.fapai_audioID) 
            // }
            //左边移动定时器
            this.scheduleOnce(this._runactive_pushcard.bind(this), 0.3)
            this.node.parent.emit("pushcard_other_event")

        }.bind(this))

        gameManager.Instance.socketUtil.onCanRobState(function (data) {
            console.log("onCanRobState" + JSON.stringify(data))
            //这里需要2个变量条件：自己是下一个抢地主，2发牌动画结束
            this.rob_player_username = data
            if (data == gameManager.Instance.userDetails.username && this.fapai_end == true) {
                this.robUI.active = true
            }
        }.bind(this))

        gameManager.Instance.socketUtil.onCanChuCard(function (data) {
            console.log("can_chu_card_notify:" + JSON.stringify(data))
            //判断是不是自己能出牌
            if (data == gameManager.Instance.userDetails.username) {
                //先清理出牌区域
                this.clearOutZone(gameManager.Instance.userDetails.username)
                //先把自己出牌列表置空
                // this.choose_card_data = []
                //显示可以出牌的UI
                this.playingUI.active = true

            }
        }.bind(this))

        gameManager.Instance.socketUtil.onOtherPlayerChuCard(function (data) {
            //{"username":"2357540","cards":[{"cardid":4,"card_data":{"index":4,"value":1,"shape":1}}]}
            console.log("onOtherPlayerChuCard" + JSON.stringify(data))

            let username = data.username
            let gameroom_script = this.node.parent.getComponent(gameRoomScene)
            //获取出牌区域节点
            let outCard_node = gameroom_script.getUserOutCardPosByAccount(username)
            if (outCard_node == null) {
                return
            }

            let node_cards = []
            for (let i = 0; i < data.cards.length; i++) {
                let card = instantiate(this.PokerPrefab)
                card.getComponent(Card).showCards(data.cards[i].card_data, gameManager.Instance.userDetails.username)
                node_cards.push(card)
            }
            this.appendOtherCardsToOutZone(outCard_node, node_cards, 0)


        }.bind(this))

        //内部事件:显示底牌事件,data是三张底牌数据
        this.node.on("show_bottom_card_event", function (data) {
            console.log("----show_bottom_card_event", data)

            this.bottom_card_data = data

            for (let i = 0; i < data.length; i++) {
                let card = this.bottom_card[i]
                let show_data = data[i];
                let call_data = {
                    "obj": card,
                    "data": show_data,
                }
                console.log("bottom show_data:" + JSON.stringify(show_data));

                tween(card)
                    .to(0, { eulerAngles: new Vec3(0, 0, 180) }) // 立即旋转180度
                    .to(0.2, { eulerAngles: new Vec3(0, 0, 90) }) // 0.2秒内旋转至90度
                    .call(() => { card.getComponent(Card).showCards(show_data), this, call_data })
                    .to(0.2, { eulerAngles: new Vec3(0, 0, 0) }) // 再次旋转回0度
                    .to(1, { scale: new Vec3(0.8, 0.8, 0) }) // 1秒内缩放至0.8倍
                    .start();

                // if (isopen_sound) {
                //     audioEngine.play(url.raw("resources/sound/start.mp3"))
                // }
            }

            //如果自己地主，给加上三张底牌
            if (gameManager.Instance.userDetails.username == gameManager.Instance.userDetails.master_username) {

                console.log("--------------getbottemcard---------------")
                this.scheduleOnce(this.pushThreeCard.bind(this), 0.2)
            }


        }.bind(this))

        //注册监听一个选择牌消息 
        this.node.on("choose_card_event", function (event) {
            console.log("choose_card_event:" + JSON.stringify(event))
            let detail = event
            this.choose_card_data.push(detail)
        }.bind(this))

        this.node.on("unchoose_card_event", function (event) {
            console.log("unchoose_card_event:" + event)
            let detail = event
            for (let i = 0; i < this.choose_card_data.length; i++) {
                if (this.choose_card_data[i].cardid == detail) {
                    this.choose_card_data.splice(i, 1)
                }
            }
        }.bind(this))

    }

    _runactive_pushcard() {
        //console.log("_runactive_pushcard:"+this.cur_index_card)
        if (this.cur_index_card < 0) {
            console.log("pushcard end")
            //发牌动画完成，显示抢地主按钮
            //this.robUI.active = true
            this.fapai_end = true
            if (this.rob_player_username == gameManager.Instance.userDetails.username) {
                this.robUI.active = true
            }

            // if (isopen_sound) {
            //     //console.log("start fapai_audioID"+this.fapai_audioID) 
            //     cc.audioEngine.stop(this.fapai_audioID)
            // }


            //通知gamescene节点，倒计时
            let sendevent = this.rob_player_username
            this.node.parent.emit("canrob_event", sendevent)

            return
        }

        //原有逻辑  
        // let move_node = this.cards_nods[this.cur_index_card]
        // move_node.active = true
        // let newx = move_node.x + (this.card_width * 0.4*this.cur_index_card) - (this.card_width * 0.4)
        // let action = cc.moveTo(0.1, cc.v2(newx, -250));
        // move_node.runAction(action)
        // this.cur_index_card--
        // this.scheduleOnce(this._runactive_pushcard.bind(this),0.3)


        let move_node = this.cards_nods[this.cards_nods.length - this.cur_index_card - 1]
        move_node.active = true
        this.push_card_tmp.push(move_node)
        // this.fapai_audioID = cc.audioEngine.play(cc.url.raw("resources/sound/fapai1.mp3"))
        for (let i = 0; i < this.push_card_tmp.length - 1; i++) {
            let move_node = this.push_card_tmp[i]
            let newx = move_node.position.x - (this.card_width * 0.4)
            tween(move_node)
                .to(0.1, { position: new Vec3(newx, -250, 0) })
                .start();
        }

        this.cur_index_card--
        this.scheduleOnce(this._runactive_pushcard.bind(this), 0.1)
    }

    sortCard() {
        this.cards_nods.sort(function (x, y) {
            let a = x.getComponent(Card).card_data;
            let b = y.getComponent(Card).card_data;
            if (a.hasOwnProperty('king') && !b.hasOwnProperty('king')) {
                return 1;
            }
            if (!a.hasOwnProperty('king') && b.hasOwnProperty('king')) {
                return -1;
            }

            if (a.hasOwnProperty('king') && b.hasOwnProperty('king')) {
                return a.king - b.king;
            }

            if (a.hasOwnProperty('value') && b.hasOwnProperty('value')) {
                return a.value - b.value; // 改为小到大排序
            }


        })

        let x = this.cards_nods[0].position.x;
        console.log("sort x:" + x)
        for (let i = 0; i < this.cards_nods.length; i++) {
            let card = this.cards_nods[i];
            card.parent = this.node
            card.setSiblingIndex(i);; //设置牌的叠加次序,zindex越大显示在上面
            let width = card.getComponent(UITransform).width
            card.position.x = x + i * width * 0.4;
        }


    }


    pushCard(data) {
        if (data) {
            data.sort(function (a, b) {
                if (a.hasOwnProperty('king') && !b.hasOwnProperty('king')) {
                    return 1;
                }
                if (!a.hasOwnProperty('king') && b.hasOwnProperty('king')) {
                    return -1;
                }

                if (a.hasOwnProperty('king') && b.hasOwnProperty('king')) {
                    return a.king - b.king;
                }

                if (a.hasOwnProperty('value') && b.hasOwnProperty('value')) {
                    return a.value - b.value; // 改为小到大排序
                }
            });
        }
        //创建card预制体
        this.cards_nods = []
        for (let i = 0; i < 17; i++) {

            let card = instantiate(this.PokerPrefab)
            card.setScale(0.8, 0.8, 0)
            card.parent = this.node.parent

            let width = card.getComponent(Sprite).spriteFrame.rect.width;
            let xPos = 300;
            card.setPosition(xPos, -250, 0)
            card.active = false
            card.getComponent(Card).showCards(data[i], gameManager.Instance.userDetails.username)
            //存储牌的信息,用于后面发牌效果
            this.cards_nods.push(card)
            this.card_width = width
        }

        //创建3张底牌
        this.bottom_card = []
        for (let i = 0; i < 3; i++) {
            let di_card = instantiate(this.PokerPrefab)
            di_card.setScale(0.6, 0.6, 0)
            di_card.position = this.bottem_card_pos.position
            //三张牌，中间坐标就是bottom_card_pos_node节点坐标，
            //0,和2两张牌左右移动windth*0.4
            if (i == 0) {
                const width = di_card.getComponent(UITransform).width;
                di_card.setPosition(di_card.position.x - width * 0.4, di_card.position.y, di_card.position.z);
            } else if (i == 2) {
                const width = di_card.getComponent(UITransform).width;
                di_card.setPosition(di_card.position.x + width * 0.4, di_card.position.y, di_card.position.z);
            }


            //di_card.x = di_card.width-i*di_card.width-20
            //di_card.y=60
            di_card.parent = this.node.parent
            //存储在容器里
            this.bottom_card.push(di_card)
        }
    }

    schedulePushThreeCard() {
        for (var i = 0; i < this.cards_nods.length; i++) {
            var card = this.cards_nods[i]
            if (card.position.y === -230) {
                card.setPosition(card.position.x, -250, card.position.z);
            }
        }
    }

    pushThreeCard() {
        //每张牌的起始位置 
        let last_card_x = this.cards_nods[this.cards_nods.length - 1].position.x
        console.log(last_card_x)
        for (let i = 0; i < this.bottom_card_data.length; i++) {
            let card = instantiate(this.PokerPrefab)
            card.setScale(0.8, 0.8, 0)
            card.parent = this.node.parent

            let xPos = last_card_x + ((i + 1) * this.card_width * 0.4);
            card.setPosition(xPos, -230, 0)
            // card.x = last_card_x + ((i + 1) * this.card_width * 0.4)
            // card.y = -230  //先把底牌放在-230，在设置个定时器下移到-250的位置

            //console.log("pushThreeCard x:"+card.x)
            card.getComponent(Card).showCards(this.bottom_card_data[i], gameManager.Instance.userDetails.username)
            card.active = true
            this.cards_nods.push(card)
        }

        this.sortCard()
        this.scheduleOnce(this.schedulePushThreeCard.bind(this), 1)


    }

    destoryCard(username, choose_card) {
        if (choose_card.length == 0) {
            return
        }

        /*出牌逻辑
          1. 将选中的牌 从父节点中移除
          2. 从this.cards_nods 数组中，删除 选中的牌 
          3. 将 “选中的牌” 添加到出牌区域
              3.1 清空出牌区域
              3.2 添加子节点
              3.3 设置scale
              3.4 设置position
          4.  重新设置手中的牌的位置  this.updateCards();
        */
        //1/2步骤删除自己手上的card节点 
        let destroy_card = []
        for (let i = 0; i < choose_card.length; i++) {
            for (let j = 0; j < this.cards_nods.length; j++) {
                let card_id = this.cards_nods[j].getComponent(Card).card_id
                if (card_id == choose_card[i].cardid) {
                    console.log("destroy card id:" + card_id)
                    //this.cards_nods[j].destroy()
                    this.cards_nods[j].removeFromParent(true);
                    destroy_card.push(this.cards_nods[j])
                    this.cards_nods.splice(j, 1)
                }
            }
        }

        this.appendCardsToOutZone(username, destroy_card)
        this.updateCards()

    }

    //清除显示出牌节点全部子节点(就是把出牌的清空)
    clearOutZone(username) {
        let gameroom_script = this.node.parent.getComponent(gameRoomScene)
        let outCard_node = gameroom_script.getUserOutCardPosByAccount(username)

        let children = outCard_node.children;
        for (let i = 0; i < children.length; i++) {
            let card = children[i];
            card.destroy()
        }
        outCard_node.removeAllChildren();
    }

    pushCardSort(cards) {
        if (cards.length == 1) {
            return
        }
        cards.sort(function (x, y) {
            let a = x.getComponent(Card).card_data;
            let b = y.getComponent(Card).card_data;

            if (a.hasOwnProperty('king') && !b.hasOwnProperty('king')) {
                return 1;
            }
            if (!a.hasOwnProperty('king') && b.hasOwnProperty('king')) {
                return -1;
            }

            if (a.hasOwnProperty('king') && b.hasOwnProperty('king')) {
                return a.king - b.king;
            }

            if (a.hasOwnProperty('value') && b.hasOwnProperty('value')) {
                return a.value - b.value; // 改为小到大排序
            }
        })
    }

    appendOtherCardsToOutZone(outCard_node, cards, yoffset) {
        outCard_node.removeAllChildren();

        //console.log("appendOtherCardsToOutZone length"+cards.length)
        //添加新的子节点
        for (let i = 0; i < cards.length; i++) {
            let card = cards[i];
            outCard_node.addChild(card, 100 + i) //第二个参数是zorder,保证牌不能被遮住
        }

        //对出牌进行排序
        //设置出牌节点的坐标
        let zPoint = cards.length / 2;
        //console.log("appendOtherCardsToOutZone zeroPoint:"+zPoint)
        for (let i = 0; i < cards.length; i++) {
            let cardNode = outCard_node.getChildren()[i]
            let x = (i - zPoint) * 30;
            let y = cardNode.y + yoffset; //因为每个节点需要的Y不一样，做参数传入
            //console.log("-----cardNode: x:"+x+" y:"+y)
            cardNode.setScale(0.5, 0.5);
            cardNode.setPosition(x, y);

        }
    }

    appendCardsToOutZone(username, destroy_card) {
        if (destroy_card.length == 0) {
            return
        }
        //先给本次出的牌做一个排序
        this.pushCardSort(destroy_card)
        //console.log("appendCardsToOutZone")
        let gameroom_script = this.node.parent.getComponent(gameRoomScene)
        //获取出牌区域节点
        let outCard_node = gameroom_script.getUserOutCardPosByAccount(username)
        this.appendOtherCardsToOutZone(outCard_node, destroy_card, 360)
        //sconsole.log("OutZone:"+outCard_node.name)

    }

    updateCards() {

        let zeroPoint = this.cards_nods.length / 2;
        //let last_card_x = this.cards_nods[this.cards_nods.length-1].x
        for (let i = 0; i < this.cards_nods.length; i++) {
            let cardNode = this.cards_nods[i]
            let x = (i - zeroPoint) * (this.card_width * 0.4);
            cardNode.setPosition(x, -250);
        }

    }

    playPushCardSound(card_name) {
        // console.log("playPushCardSound:"+card_name)

        // if(card_name==""){
        //     return
        // }

        // switch(card_name){
        //     case CardsValue.one.name:
        //         break
        //     case CardsValue.double.name:
        //             if(isopen_sound){
        //                 cc.audioEngine.play(cc.url.raw("resources/sound/duizi.mp3")) 
        //              }
        //         break  
        // }
    }

    onButtonClick(event, customData) {
        switch (customData) {
            case "btn_qiandz":
                console.log("btn_qiandz")
                gameManager.Instance.socketUtil.requestRobState(qian_state.qian)
                this.robUI.active = false
                // if(isopen_sound){
                //     cc.audioEngine.play(cc.url.raw("resources/sound/woman_jiao_di_zhu.ogg")) 
                //  }
                break
            case "btn_buqiandz":
                console.log("btn_buqiandz")
                gameManager.Instance.socketUtil.requestRobState(qian_state.buqiang)
                this.robUI.active = false
                // if(isopen_sound){
                //     cc.audioEngine.play(cc.url.raw("resources/sound/woman_bu_jiao.ogg")) 
                //  }
                break
            case "nopushcard":  //不出牌
                gameManager.Instance.socketUtil.requestbuchuCard([], null)
                this.playingUI.active = false
                break
            case "pushcard":   //出牌
                //先获取本次出牌数据
                if (this.choose_card_data.length == 0) {
                    this.roomMsg.string = "請選擇牌!"
                    setTimeout(function () {
                        this.roomMsg.string = ""
                    }.bind(this), 2000);
                }
                gameManager.Instance.socketUtil.requestChuCard(this.choose_card_data, function (err, data) {

                    if (err) {
                        console.log("request_chu_card:" + err)
                        console.log("request_chu_card" + JSON.stringify(data))
                        if (this.roomMsg.string == "") {
                            this.roomMsg.string = data.msg
                            setTimeout(function () {
                                this.roomMsg.string = ""
                            }.bind(this), 2000);
                        }

                        //出牌失败，把选择的牌归位
                        for (let i = 0; i < this.cards_nods.length; i++) {
                            let card = this.cards_nods[i]
                            card.emit("reset_card_flag")
                        }
                        this.choose_card_data = []
                    } else {
                        //出牌成功
                        console.log("resp_chu_card data:" + JSON.stringify(data))
                        this.playingUI.active = false
                        //播放出牌的声音
                        //resp_chu_card data:{"account":"2519901","msg":"sucess","cardvalue":{"name":"Double","value":1}}
                        //{"type":"other_chucard_notify","result":0,"data":{"accountid":"2519901","cards":[{"cardid":24,"card_data":{"index":24,"value":6,"shape":1}},{"cardid":26,"card_data":{"index":26,"value":6,"shape":3}}]},"callBackIndex":0}
                        // this.playPushCardSound(data.cardvalue.name)
                        this.destoryCard(data.account, this.choose_card_data)
                        this.choose_card_data = []

                    }

                }.bind(this))
                //this.playingUI.active = false
                break
            case "tipcard":
                break
            default:
                break
        }
    }

}


