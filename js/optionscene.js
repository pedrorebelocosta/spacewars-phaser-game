class OptionScene extends Phaser.Scene {
    
    constructor() {
        super( { key: 'OptionScene' } );
    }

    preload() {

        this.progressBar = this.add.graphics();
        this.progressBox = this.add.graphics();

        this.progressBox.fillStyle(0x222222, 0.8);
        this.progressBox.fillRect(520, 360, 320, 50);

        this.progressBar.setDepth(1);
        this.progressBox.setDepth(1);

        this.load.on('progress', function (value) {
            this.scene.progressBar.clear();
            this.scene.progressBar.fillStyle(0xffffff, 1);
            this.scene.progressBar.fillRect(530, 370, 300 * value, 30);
        });
                    
        this.load.on('fileprogress', function (file) {

        });
        
        this.load.on('complete', function () {
            this.scene.progressBar.destroy();
            this.scene.progressBox.destroy();
        });

        this.load.image('background_2', 'assets/game/options.png');
        this.load.image('exit', 'assets/menu/exit_buttons.png');
    }

    create() {

        this.progressBar.destroy();
        this.progressBox.destroy();
        
        this.background = this.add.image(0, 0, 'background_2');
        this.background.setOrigin(0,0);

        this.goBack = this.add.image(this.sys.game.config.width -100,
                                     this.sys.game.config.height - 75, 'exit')
                                     .setInteractive({ useHandCursor: true });

        this.goBack.on('pointerdown', this.onGoBack);
    }

    update() {
        
    }

    onGoBack() {
        this.scene.scene.start('MainMenu');
    }

}