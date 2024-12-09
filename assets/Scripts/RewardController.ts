import { _decorator, Animation, Collider2D, Component, Contact2DType, IPhysics2DContact, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('RewardController')
export class RewardController extends Component {

    @property
    public speed: number = 80;

    @property
    public type: number = 1;

    colider: Collider2D = null;

    @property(Animation)
    public anim: Animation = null;

    start() {
        this.colider = this.getComponent(Collider2D);
        if(this.colider) {
            this.colider.on(Contact2DType.BEGIN_CONTACT, this.onContact, this);
        }
    }

    onContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        this.colider.enabled = false;
        this.anim.play('Reward_Down');
        this.scheduleOnce(()=>{
            this.node.destroy();
        }, 0.5);
    }
      

    update(deltaTime: number) {
        const pos = this.node.position;
        this.node.setPosition(pos.x, pos.y - this.speed * deltaTime);

        if(this.node.worldPosition.y <= -580) {
            this.node.destroy();
        }
    }
}


