
import { waittingConn } from "../waitingConn";
import Alert from "./Alert";
import HTTP from "./HTTP"
import SocketUtil from "./SocketUtil";
import UserMgr from "./UserMgr";
import Util from "./Util";
import eventListener from "./eventListener";





export default class gameManager{
    public static readonly Instance: gameManager = new gameManager()
    
    
    http:HTTP = null;
    SI = null;
    VERSION = null;
    socketUtil:SocketUtil = null;
    loading:waittingConn = null;
    alert:Alert = null;
    userMgr:UserMgr = null;
    util:Util = null;
    eventlistener:eventListener = null;
    userDetails = null;
    
    
}