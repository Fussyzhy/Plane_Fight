import { _decorator, AudioClip, Component, director, Label, Node } from 'cc';
import { AudioMgr } from '../AudioMgr';
const { ccclass, property } = _decorator;

@ccclass('GameOverUI')
export class GameOverUI extends Component {

    @property(Label)
    public highScoreLabel: Label = null;

    @property(Label)
    public currentScoreLabel: Label = null;

    @property(AudioClip)
    public ButtonAudio: AudioClip = null;
    
    showGameOverUI(highScore: number, currentScore: number) {
        this.node.active = true;
        this.highScoreLabel.string = highScore.toString();
        this.currentScoreLabel.string = currentScore.toString();
    }

    onRestartButtonClick() {
        director.loadScene(director.getScene().name);
        AudioMgr.inst.playOneShot(this.ButtonAudio,0.5);
    }
    onQuitButtonClick() {
        director.loadScene('01-Start');
        AudioMgr.inst.playOneShot(this.ButtonAudio,0.5);
    }
}


