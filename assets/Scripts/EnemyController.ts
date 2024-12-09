import { _decorator, Animation, assert, AudioClip, AudioSource, Collider2D, Component, Contact2DType, EventTarget, IPhysics2DContact, Label, Node, PlaneCollider, Sprite, Vec2, Vec3 } from 'cc';
import { BulletController } from './BulletController';
import { PlayerController } from './PlayerController';
import { BombController } from './BombController';
import { AudioMgr } from './AudioMgr';
const { ccclass, property } = _decorator;

@ccclass('EnmyController')
export class EnmyController extends Component {

    @property
    public speed: number = 300;
    @property
    public hp: number = 1;
    @property(Animation)
    public anim: Animation = null;
    @property
    public enemyscore: number = 10;

    @property
    public HitAnim: string = '';
    @property
    public DownAnim: string = '';

    colider: Collider2D = null;
    @property(AudioClip)
    public DownAudio: AudioClip = null;

    @property(AudioSource)
    public _audioSource: AudioSource = null!;


    protected onLoad(): void {
        // 获取 AudioSource 组件
        const audioSource :any = this.node.getComponent(AudioSource)!;
        // 检查是否含有 AudioSource，如果没有，则输出错误消息
        assert(audioSource);
        // 将组件赋到全局变量 _audioSource 中
        this._audioSource = audioSource;
    }

    start() {
        this.colider = this.getComponent(Collider2D);
        if(this.colider) {
            this.colider.on(Contact2DType.BEGIN_CONTACT, this.onContact, this);
        }
        
    }
    onContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if(otherCollider.getComponent(BulletController)){
            if(otherCollider.getComponent(BombController)) {
                this.hp -= 1000;
                AudioMgr.inst.playOneShot(this.DownAudio,0.5);
                if(this.hp <= 0) {
                    PlayerController.getInstance().changeScore(this.enemyscore);
                    this.anim.play(this.DownAnim);
                    this.colider.enabled = false;
                    this.scheduleOnce(()=>{
                        this.node.destroy();
                    }, 0.5);
                }
            } else {
                this.hp -= 1;
                if(this.hp <= 0) {
                    AudioMgr.inst.playOneShot(this.DownAudio,0.5);
                    PlayerController.getInstance().changeScore(this.enemyscore);
                    this.anim.play(this.DownAnim);
                    this.colider.enabled = false;
                    this.scheduleOnce(()=>{
                        this.node.destroy();
                    }, 0.5);
                } else {
                    this.anim.play(this.HitAnim);
                }
                otherCollider.enabled = false;
                otherCollider.getComponent(Sprite).enabled = false;
            }
        }
    }

    update(deltaTime: number) {
        const pos = this.node.position;
        this.node.setPosition(pos.x, pos.y - this.speed * deltaTime);

        if(this.node.worldPosition.y <= -580) {
            this.node.destroy();
        }

        // if(!PlayerController.getInstance().pausestate) {
        //     this.onpause();
        // } else {
        //     this.onresume();
        // }
    }

    // onpause(){
    //     if(this._audioSource) {
    //         this._audioSource.pause();
    //     }
    // }
    // onresume(){
    //     if(this._audioSource) {
    //         this._audioSource.play();
    //     }
    // }
}


