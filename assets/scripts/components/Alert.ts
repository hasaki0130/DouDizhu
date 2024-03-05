import { _decorator, Button, Component, find, Label, Node } from 'cc';
import gameManager from './gameManager';
const { ccclass, property } = _decorator;

@ccclass('Alert')
export default class Alert extends Component {

    @property (Node) alert: Node = null;
    @property (Label) alertTitle: Label = null;
    @property (Label) alertLabel: Label = null;
    @property (Node) btnOk: Node = null;
    btnCallBack = null;


    onLoad(){
        gameManager.Instance.alert = this
        this.alert.active = false;
        this.alert = find("Canvas/alert")
        this.alertTitle = this.alert.getChildByName("alertTitle").getComponent(Label)
        this.alertLabel = this.alert.getChildByName("alertLabel").getComponent(Label)
        this.btnOk = this.alert.getChildByName("btnOk")
        this.btnOk.on(Node.EventType.TOUCH_END,this.onBtnClick.bind(this))
    }

    onBtnClick(){
        if(this.btnCallBack){
            this.btnCallBack();
        }
        this.alert.active = false
    }
    /**
     * @param title
     * @param content
     * @param callback
     */
    show(title,content,callback?){
        this.alert.active = true;
        this.alertTitle.string = title
        this.alertLabel.string = content
        if(callback){
            this.btnCallBack = callback
        }

    }

    start() {

    }

    onDestroy() {
        gameManager.Instance.alert = null;
    }
}


