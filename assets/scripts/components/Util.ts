import { director } from "cc";
import gameManager from "./gameManager";
let userDetails = gameManager.Instance.userDetails;
export default class Util {
    
    logout(){
        
        userDetails = {};
        console.log(userDetails);
        director.loadScene("login");
    }

}