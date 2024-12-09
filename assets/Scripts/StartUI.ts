import { _decorator, AudioClip, Component, director, Director, Node } from 'cc';
import { AudioMgr } from './AudioMgr';
const { ccclass, property } = _decorator;

@ccclass('StartUI')
export class StartUI extends Component {
    @property(AudioClip)
    public ButtonAudio: AudioClip = null;
    start() {
        AudioMgr.inst.stop();
    }

    update(deltaTime: number) {
        
    }

    public onStartBtn() {
        AudioMgr.inst.playOneShot(this.ButtonAudio,0.5);
        director.loadScene('02-GameScene');
    }
}


