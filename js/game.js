var config = {
    type: Phaser.AUTO,
    parent: 'content',
    width: 1280,
    height: 720,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.NO_CENTER
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [
        BootScene,
        MainMenu,
        WorldScene,
        OptionScene,
        CreditScene,
        GameOverScene
    ]
}

var game = new Phaser.Game(config);