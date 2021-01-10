class GameOverScene extends Phaser.Scene {

    constructor() {
        super( {key: 'GameOverScene'} );
    }

    preload(){
        this.load.image('gameOver', 'assets/gameover.png');
    }

    init(data) {
        this.playerWon = data.player;
    }

    create() {

        this.gameOver = this.add.image(this.sys.game.config.width / 2, 100, 
                                       'gameOver');

        this.playerText = this.add.text((this.sys.game.config.width / 2), 
                                        (this.sys.game.config.height / 2) - 100, 
                                        this.playerWon + " has won!", 
                                        {font:"30px Arial", fill:"#ffffff"}
        );

        this.playerText.setOrigin(0.5, 0.3);

        this.play = this.add.image((this.sys.game.config.width / 2),
                                   (this.sys.game.config.height / 2) + 50,
                                    'play').setInteractive({ useHandCursor: true })
                                           .on('pointerdown', this.onPlayButtonClick);

    }

    update(){

    }

    onPlayButtonClick() {
        this.scene.scene.start('WorldScene');
    }

}