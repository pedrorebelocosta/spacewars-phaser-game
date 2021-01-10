class CreditScene extends Phaser.Scene {

    constructor() {
        super( { key: 'CreditScene' });
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

        this.load.image('background_3', 'assets/game/credits.png');
        this.load.image('exit_1', 'assets/menu/exit_buttons.png');
    }

    create() {

        this.progressBar.destroy();
        this.progressBox.destroy();

        this.redPlayerWinsText = this.add.text((this.sys.game.config.width/2) - 80,
                                               (this.sys.game.config.height/2) - 90, "", 
                                               {font:"30px Arial", fill:"#ffffff"}
        );

        this.redPlayerWinsText.setDepth(1);

        this.bluePlayerWinsText = this.add.text((this.sys.game.config.width/2) - 80,
                                                (this.sys.game.config.height/2) + 60, "Total wins:", 
                                                {font:"30px Arial", fill:"#ffffff"}
        );

        this.bluePlayerWinsText.setDepth(1);

        

        this.background = this.add.image(0, 0, 'background_3');
        this.background.setOrigin(0,0);

        this.goBack = this.add.image(this.sys.game.config.width - 100, this.sys.game.config.height - 75, 'exit_1').setInteractive({ useHandCursor: true })
        .on('pointerdown', this.onGoBack);

        this.redPlayerWins = localStorage.getItem('redPlayerWins');
        this.bluePlayerWins = localStorage.getItem('bluePlayerWins');

        if(this.redPlayerWins == null) {
            this.redPlayerWinsText.setText("This player doesn't have any record!");
        } else {
            this.redPlayerWinsText.setText("Total Wins: " + this.redPlayerWins);
        }

        if(this.bluePlayerWins == null) {
            this.bluePlayerWinsText.setText("This player doesn't have any record!");
        } else {
            this.bluePlayerWinsText.setText("Total Wins: " + this.bluePlayerWins);
        }

    }

    update() {

    }

    onGoBack() {
        this.scene.scene.start('MainMenu');
    }

}