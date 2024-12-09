import { _decorator, Animation, AudioClip, AudioSource, Collider2D, Component, Contact2DType, director, EventTarget, EventTouch, input, Input, instantiate, IPhysics2DContact, Label, Node, Prefab, Sprite, Vec3 } from 'cc';
import { RewardController } from './RewardController';
import { GameOverUI } from './UI/GameOverUI';
import { AudioMgr } from './AudioMgr';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {

    private static instance: PlayerController;
    public static getInstance(): PlayerController {
        return this.instance;
    }

    @property(Prefab)
    public bullet1: Prefab = null;

    @property(Prefab)
    public bullet2: Prefab = null;

    @property(Prefab)
    public Bomb: Prefab = null;

    @property(Node)
    public Gun1: Node = null;

    @property(Node)
    public BulletParent: Node = null;

    @property
    public attackSpeed: number = 1;

    @property
    public bulletModel: number = 1;

    public attackTime: number = 0;

    colider: Collider2D = null;

    @property
    public hp: number = 3;
    @property(Animation)
    public anim: Animation = null;
    @property
    public HitAnim: string = '';
    @property
    public DownAnim: string = '';
    @property
    public FlyAnim: string = '';

    private state: number = 0;

    private doubleAttackTime: number = 0;

    @property
    public bombCount: number = 0;

    @property(Label)
    public BombLabel: Label = null;
    @property(Label)
    public HPLabel: Label = null;
    
    @property(Label)
    public ScoreLabel: Label = null;
    public score: number = 0;

    public IsCanController: boolean = true;

    @property(GameOverUI)
    public GameOverUI: GameOverUI = null;

    @property(AudioClip)
    public GameAudio: AudioClip = null;
    @property(AudioClip)
    public BulletAudio: AudioClip = null;
    @property(AudioClip)
    public ButtonAudio: AudioClip = null;
    @property(AudioClip)
    public UseBombAudio: AudioClip = null;
    @property(AudioClip)
    public GameOverAudio: AudioClip = null;
    @property(AudioClip)
    public Reward1Audio: AudioClip = null;
    @property(AudioClip)
    public Reward2Audio: AudioClip = null;

    public pausestate: boolean = false;

    start() {
        AudioMgr.inst.play(this.GameAudio,0.5);

        PlayerController.instance = this;
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.colider = this.getComponent(Collider2D);
        if(this.colider) {
            this.colider.on(Contact2DType.BEGIN_CONTACT, this.onContact, this);
        }
    }

    protected onDestroy(): void {
        input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
    }

    onContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        const reward = otherCollider.getComponent(RewardController);
        if(reward) {
            this.onContactReward(reward.type, reward);
        } else {
            this.onContactEnemy();
        }
        
    }

    onContactEnemy(){
        if(this.state === 0){
            this.hp -= 1;
            this.state = 1;
            this.HPLabel.string = this.hp.toString();
            if(this.hp <= 0) {
                AudioMgr.inst.stop();
                AudioMgr.inst.playOneShot(this.GameOverAudio,0.5);
                const scorenow = this.score;
                this.anim.play(this.DownAnim);
                this.colider.enabled = false;
                let highScore = +localStorage.getItem('highscore') || 0;
                let currentHighScore = scorenow > highScore ? scorenow : highScore;
                localStorage.setItem('highscore',currentHighScore.toString());
                this.scheduleOnce(()=>{
                    this.GameOverUI.showGameOverUI(currentHighScore,scorenow);
                    // this.node.destroy();
                }, 0.5);
            } else {
                this.anim.play(this.HitAnim);
                this.scheduleOnce(()=>{
                    this.state = 0;
                    this.anim.play(this.FlyAnim);
                }, 1);
            }
        }
    }
    
    lastreward: RewardController = null;
    onContactReward(type: number,reward: RewardController) {
        if(this.lastreward === reward) {
            return;
        }
        this.lastreward = reward;
        if(type === 1) {
            this.doubleAttackTime += 10;
            AudioMgr.inst.playOneShot(this.Reward1Audio,0.5);
        } else {
            this.bombCount += 1;
            AudioMgr.inst.playOneShot(this.Reward2Audio,0.5);
            // this.eventTarget.emit('bombAdd');
            console.log(this.bombCount,'kk');
            this.BombLabel.string = this.bombCount.toString();
        }
    }

    onTouchMove(event: EventTouch){       
        if(this.IsCanController){
            // 移动
            let pos = this.node.position;
            this.node.setPosition(pos.x+event.getDelta().x*0.6,pos.y+event.getDelta().y*0.6);
            // 边界判断
            if(this.node.position.y > 400) {
                this.node.setPosition(pos.x,400);
            }
            if(this.node.position.y < -400) {
                this.node.setPosition(pos.x,-400);
            }
            if(this.node.position.x > 240) {
                this.node.setPosition(240,pos.y);
            }
            if(this.node.position.x < -240) {
                this.node.setPosition(-240,pos.y);
            }
        }
    }

    changeScore(score: number) {
        if(this.hp > 0){
            this.score += score;
        }
        this.ScoreLabel.string = this.score.toString();
    }

    update(deltaTime: number) {
        this.attackTime += deltaTime;
        if(this.attackTime >= this.attackSpeed && this.hp > 0) {
            AudioMgr.inst.playOneShot(this.BulletAudio,0.5);
            this.attackTime = 0;

            if(this.bulletModel === 1) {
                const bullet1 = instantiate(this.bullet1);
                this.BulletParent.addChild(bullet1);
                bullet1.setWorldPosition(this.Gun1.worldPosition);
            }

            if(this.bulletModel === 2) {
                const bullet21 = instantiate(this.bullet2);
                const bullet22 = instantiate(this.bullet2);
                this.BulletParent.addChild(bullet21);
                this.BulletParent.addChild(bullet22);
                bullet21.setWorldPosition(this.Gun1.worldPosition.x-20,this.Gun1.worldPosition.y,0);
                bullet22.setWorldPosition(this.Gun1.worldPosition.x+20,this.Gun1.worldPosition.y,0);
            }

        }

        if(this.doubleAttackTime > 0) {
            this.doubleAttackTime -= deltaTime;
            this.bulletModel = 2;
        } else {
            this.doubleAttackTime = 0;
            this.bulletModel = 1;
        }
        
    }

    @property(Node)
    public PauseBtn: Node = null;
    @property(Node)
    public ResumeBtn: Node = null;

    onPause() {
        AudioMgr.inst.playOneShot(this.ButtonAudio,1);
        AudioMgr.inst.pause();
        director.pause();
        this.IsCanController = false;
        this.PauseBtn.active = false;
        this.ResumeBtn.active = true;
        this.pausestate = true;
    }
    onResume() {
        AudioMgr.inst.playOneShot(this.ButtonAudio,1);
        AudioMgr.inst.resume();
        director.resume();
        this.IsCanController = true;
        this.PauseBtn.active = true;
        this.ResumeBtn.active = false;
        this.pausestate = false;
    }

    onBoooooomb() {
        
        if(this.bombCount > 0) {
            AudioMgr.inst.playOneShot(this.UseBombAudio,0.5);
            this.bombCount -= 1;
            this.BombLabel.string = this.bombCount.toString();
            const bomb = instantiate(this.Bomb);
            this.BulletParent.addChild(bomb);
            bomb.setPosition(0,0,0);

            this.scheduleOnce(()=>{
                bomb.destroy();
            }, 0.2);
        }
    }

   
}


