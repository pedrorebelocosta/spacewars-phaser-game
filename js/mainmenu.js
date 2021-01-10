class MainMenu extends Phaser.Scene {

    constructor() {
        super( { key: 'MainMenu' });
    }

    preload() {

    }

    create() {
        
        this.background = this.add.tileSprite(0, 0, this.sys.game.config.width, this.sys.game.config.height, 'background');
        this.background.setOrigin(0, 0);
        this.gametitle = this.add.image(0, 0, 'gametitle');
        this.gametitle.setOrigin(0, 0);

        this.play = this.add.image(this.sys.game.config.width/2, 300, 'play').setInteractive({ useHandCursor: true })
                                                                             .on('pointerdown', this.onPlayButtonClick);
        this.options = this.add.image(this.sys.game.config.width/2, 450, 'options').setInteractive({ useHandCursor: true })
                                                                                   .on('pointerdown', this.onOptionsButtonClick);
        this.credits = this.add.image(this.sys.game.config.width/2, 600, 'credits').setInteractive({ useHandCursor: true })
                                                                                   .on('pointerdown', this.onCreditsButtonClick);
    }

    update() {}

    onPlayButtonClick() {
        this.scene.scene.start('WorldScene');
    }

    onOptionsButtonClick() {
        this.scene.scene.start('OptionScene');
    }

    onCreditsButtonClick() {
        this.scene.scene.start('CreditScene');
    }

}