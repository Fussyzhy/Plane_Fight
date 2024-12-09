import { _decorator, Component, instantiate, math, Node, Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('EnemyManage')
export class EnemyManage extends Component {

    @property(Prefab)
    public enemy0Prefab: Prefab = null;
    @property(Prefab)
    public enemy1Prefab: Prefab = null;
    @property(Prefab)
    public enemy2Prefab: Prefab = null;
    @property
    public enemy0rate: number = 1;
    @property
    public enemy1rate: number = 2;
    @property
    public enemy2rate: number = 8;


    @property
    public Rewardrate: number = 15;
    @property(Prefab)
    public Reward01: Prefab = null;
    @property(Prefab)
    public Reward02: Prefab = null;


    start() {
        this.schedule(this.createEnemy0, this.enemy0rate);
        this.schedule(this.createEnemy1, this.enemy1rate);
        this.schedule(this.createEnemy2, this.enemy2rate);
        this.schedule(this.createReward, this.Rewardrate);
    }

    protected onDestroy(): void {
        this.unschedule(this.createEnemy0);
        this.unschedule(this.createEnemy1);
        this.unschedule(this.createEnemy2);
        this.unschedule(this.createReward);
    }


    createEnemy0() {
        this.createEnemy(this.enemy0Prefab, -215, 215, 450);
    }
    createEnemy1() {
        this.createEnemy(this.enemy1Prefab, -205, 205, 480);
    }
    createEnemy2() {
        this.createEnemy(this.enemy2Prefab, -155, 155, 530);
    }
    createReward(){
        if(math.randomRangeInt(0,2) === 0) {
            this.createEnemy(this.Reward01, -210, 210, 520);
        } else {
            this.createEnemy(this.Reward02, -210, 210, 520);
        }
        
    }
    createEnemy(Prefab: Prefab,minx: number, maxx: number ,height: number) {
        const enemy = instantiate(Prefab);
        this.node.addChild(enemy);
        const posx = math.randomRangeInt(minx, maxx);
        enemy.setPosition(posx, height);
    }

    update(deltaTime: number) {
        
    }
}


