import { _decorator, assetManager, Component, director, Label, Node, ProgressBar, resources } from 'cc';
import gameManager from './components/gameManager';
const { ccclass, property } = _decorator;

@ccclass('loading')
export default class loadScene extends Component {
    @property(Label) loadLabel: Label = null;
    @property(ProgressBar) pb: ProgressBar = null;
    

    onLoad() {
        this.loadRes();
        
       
    }

    loadRes(){
        resources.loadDir("UI",(com,total)=>{
            // console.log(com / total)
            this.pb.progress = com / total;
            this.loadLabel.string = "正在載入資源:" + Math.floor(this.pb.progress* 100) + "%";

            },(err)=>{
                if(err){
                    this.loadLabel.string = "資源加載異常...";
                    gameManager.Instance.alert.show("錯誤","資源加載異常...");
                }else{
                    this.loadLabel.string = "場景跳轉中...";
                    director.loadScene("login")
                }
        })
    }

    start() {
  
    }

    update(deltaTime: number) {
        
    }
}


