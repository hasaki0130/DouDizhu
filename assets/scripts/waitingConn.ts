import { _decorator, Component, find, Node, tween } from 'cc';
import gameManager from './components/gameManager';
const { ccclass, property } = _decorator;

@ccclass('waittingConn')
export class waittingConn extends Component {
    @property (Node) loading: Node = null;
    @property (Node) spin: Node = null;
    
    isShow = false;
    onLoad() {
        this.loading.active = false;
        gameManager.Instance.loading = this;
        
    }
    
    show(){
        this.loading.active = true;
        this.isShow = true;
    }

    hide(){
        this.loading.active = false;
        this.isShow = false;
    }
   
    start() {
       
            
        
    }

    update(dt) {
        this.spin.angle = this.spin.angle - 45 * dt;
    }
    
    onDestroy() {
        gameManager.Instance.loading = null;
    }

}


