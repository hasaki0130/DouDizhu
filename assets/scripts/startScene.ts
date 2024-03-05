import { _decorator, Component, director, Label, Node, resources } from 'cc';
import gameManager from './components/gameManager';
import HTTP from './components/HTTP';
import { Api } from './components/urlAPI';

const { ccclass, property } = _decorator;
@ccclass('start')
export class startScence extends Component {
    @property(Node) startBg: Node = null;
    @property(Node) connecting: Node = null;
    _connecting: Label = null;
    onLoad() {
        this._connecting = this.connecting.getComponent(Label);
        this.connecting.active = false;
        
        this.scheduleOnce(()=>{
            this.startBg.active = false;
            this.init();
        },2)
        
        

    }
    
    init(){
        gameManager.Instance.http = new HTTP();
        this.connecting.active = true;
        this._connecting.string = "正在連接伺服器 ..."
        
        let url = "ver/ver"
        resources.loadDir(url,(err,data)=>{
            if(err){
                console.log(err)
            }else{
                gameManager.Instance.VERSION = data;
                console.log("當前版本:" + data)
                this.getServerInfo();
            }
        })
    }

    getServerInfo(){
        let xhr = null
        let complete = false
        let self = this
        let fnRequest = function () {
            xhr = gameManager.Instance.http.getRequest(Api.get_serverinfo,null,(ret)=>{
                console.log(ret);
                xhr = null;
                xhr = true;
                if(ret.version == null){
                    self._connecting.string = "版本獲取失敗..."
                }else{
                    gameManager.Instance.SI = ret;
                    self._connecting.string = "連接成功，即將跳轉!"
                    director.loadScene("loading")
                }
                
            })
            // setTimeout(fn,5000)
        }
        let fn = function () {
            if(!complete){
                if(xhr){
                    // xhr.close(); 
                    // this._connecting.string = "伺服器連接失敗，即將重新連接"
                    setTimeout(()=>{
                        fnRequest();
                    },5000)
                }else{
                    fnRequest();
                }
            }
        }
        fn();  
    }

    start() {
      
    }

   
}


