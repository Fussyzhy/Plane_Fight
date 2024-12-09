import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BgMove')
export class BgMove extends Component {
    @property(Node)
    public bg1: Node = null;

    @property(Node)
    public bg2: Node = null;

    @property
    public speed: number = 100;

    start() {

    }

    update(deltaTime: number) {
        let po1 = this.bg1.position;
        let po2 = this.bg2.position;
        this.bg1.setPosition(po1.x, po1.y - this.speed * deltaTime);
        this.bg2.setPosition(po2.x, po2.y - this.speed * deltaTime);


        if(this.bg1.position.y <= -852) {
            this.bg1.setPosition(po1.x, this.bg2.position.y + 852);
        }

        if(this.bg2.position.y <= -852) {
            this.bg2.setPosition(po2.x, this.bg1.position.y + 852);
        }
    }
}


