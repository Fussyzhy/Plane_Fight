import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BulletController')
export class BulletController extends Component {

    @property
    public speed: number = 500;
    @property
    public type: number = 1;

    start() {

    }

    update(deltaTime: number) {
        if(this.type === 1) {
            const pos = this.node.position;
            this.node.setPosition(pos.x, pos.y + this.speed * deltaTime);
            if(this.node.worldPosition.y >= 1000) {
                this.node.destroy();
            }
        } 
        // else {
        //     const pos = this.node.position;
        //     this.node.setPosition(pos.x + this.speed * deltaTime, pos.y);
        //     if(this.node.worldPosition.x >= 1000) {
        //         this.node.destroy();
        //     }
        // }
    }
}


