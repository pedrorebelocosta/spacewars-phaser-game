class BootScene extends Phaser.Scene {

    constructor() {
        super( { key: 'BootScene'} );
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

        // PLAY, CREDITS, OPTIONS, -EXIT
        this.load.image('background', 'assets/background.jpg');
        this.load.image('gametitle', 'assets/title.png');
        this.load.image('play', 'assets/menu/play_buttons.png');
        this.load.image('options', 'assets/menu/optionst_buttons.png');
        this.load.image('credits', 'assets/menu/Creditst_buttons.png');
        // this.load.image('exit', 'exit_buttons.png');
    }

    create() {

        this.progressBar.destroy();
        this.progressBox.destroy();
        
        this.scene.start('MainMenu');
        /*
        this.background = this.add.tileSprite(0,0, this.sys.game.config.width,
                this.sys.game.config.height) */
    }

}