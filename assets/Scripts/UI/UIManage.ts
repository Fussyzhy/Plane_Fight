import { _decorator, Component, EventTarget, Label, Node } from 'cc';
import { PlayerController } from '../PlayerController';
const { ccclass, property } = _decorator;

@ccclass('UIManage')
export class UIManage extends Component {

    
    @property(PlayerController)
    public PlayerController: PlayerController = null;
    start() {

    }

    update(deltaTime: number) {
        
    }

    BombChange(){
        
        console.log('rr');
    }
}


