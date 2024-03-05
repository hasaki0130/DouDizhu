import { _decorator, Component, Label, Sprite, Node, Prefab, SpriteAtlas, instantiate } from 'cc';

import Card from '../Card/Card';
import gameManager from './gameManager';
import { qian_state } from './define';


const { ccclass, property } = _decorator;

@ccclass('PlayerPrefab')
export default class PlayerPrefab extends Component {

    @property(Label) username_label: Label = null;
    @property(Node) avatar: Node = null;
    @property(Label) money_label: Label = null;
    @property(Node) headimage: Node = null;
    @property(Node) clockimage: Node = null;
    @property(Node) qiangdidzhu_node: Node = null;
    @property(Label) time_label: Label = null;
    @property(Node) robIcon_Sp: Node = null;
    @property(Node) robnoIcon_Sp: Node = null;
    @property(Node) masterIcon: Node = null;
    @property(Node) readyimage: Node = null;
    @property(Prefab) pokerPrefab: Prefab = null;
    @property(Node) pokerContainer: Node | null = null;
    @property(SpriteAtlas)
    public cardsSpriteAtlas: SpriteAtlas | null = null;
    username = null;
    cardlist_node = []
    seat_index = null;
    onLoad() {
        this.readyimage.active = false
        this.robIcon_Sp.active = false
        this.robnoIcon_Sp.active = false
        this.masterIcon.active = false
        this.clockimage.active = false


        //监听开始游戏事件(客户端发给客户端)
        this.node.on("gamestart_event", function (event) {

            this.readyimage.active = false
        }.bind(this))

        this.node.on("push_card_event", function (event) {
            console.log("on push_card_event")
            //自己不再发牌
            if (this.username == gameManager.Instance.userDetails.username) {

                return
            }
            this.pushCard()
        }.bind(this))

        this.node.on("playernode_rob_state_event", function (event) {
            //{"username":"2162866","state":1}
            var detail = event

            //如果是自己在抢，需要隐藏qiangdidzhu_node节点
            //this.username表示这个节点挂接的username
            if (detail.username == this.username) {
                //console.log("detail.username"+detail.username)
                this.qiangdidzhu_node.active = false

            }

            if (this.username == detail.username) {
                if (detail.state == qian_state.qian) {

                    console.log("this.robIcon_Sp.active = true")
                    this.robIcon_Sp.active = true

                } else if (detail.state == qian_state.buqiang) {
                    this.robnoIcon_Sp.active = true

                } else {
                    console.log("get rob value :" + detail.state)
                }
            }

        }.bind(this))

        this.node.on("playernode_changemaster_event", function (event) {
            var detail = event
            this.robIcon_Sp.active = false
            this.robnoIcon_Sp.active = false
            if (detail == this.username) {
                this.masterIcon.active = true
            }
        }.bind(this))

        



    }


    init_data(data, index) {
        console.log("init_data:" + JSON.stringify(data))
        //data:{"username":"2117836","nick_name":"tiny543","avatarUrl":"http://xxx","goldcount":1000}
        this.username = data.username
        this.username_label.string = data.username
        this.avatar = data.avatar
        this.money_label.string = data.money
        this.cardlist_node = []
        this.seat_index = index
        if (data.isready == true) {
            this.readyimage.active = true
        }


        this.node.on("player_ready_notify", function (event) {
            console.log("player_ready_notify event", event)
            var detail = event
            console.log("------player_ready_notify detail:" + detail)
            
            if (detail == this.username) {
                this.readyimage.active = true
            }
        }.bind(this))
        //监听内部随可以抢地主消息,这个消息会发给每个playernode节点
        this.node.on("playernode_canrob_event", function (event) {
            var detail = event
            console.log("------playernode_canrob_event detail:" + detail)
            if (detail == this.username) {
                this.qiangdidzhu_node.active = true
                this.time_label.string = "10"
                //开启一个定时器

            }
        }.bind(this))
        if (index == 1) {
            this.pokerContainer.setPosition(-this.pokerContainer.position.x - 30, this.pokerContainer.position.y, 0);

        }

    }

    pushCard() {

        this.pokerContainer.active = true

        for (var i = 0; i < 17; i++) {
            let card = instantiate(this.pokerPrefab)
            card.setScale(0.6, 0.6, 0)
            console.log(" this.card_node.parent.parent" + this.pokerContainer.parent.parent.name)
            card.parent = this.pokerContainer
            
            let height = 159
            let yPos = (17 - 1) * 0.5 * height * 0.4 * 0.3 - height * 0.4 * 0.3 * i;
            card.setPosition(0, yPos, 0)
            // console.log("call pushCard x:"+card.x+" y:"+card.y)
            this.cardlist_node.push(card)
        }
    }




}