class WorldScene extends Phaser.Scene {

    constructor() {
        super( { key: 'WorldScene' });
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

        if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
            this.isMobile = true;
            this.input.addPointer(4);
        }else{
            this.isMobile = false;
        }

        this.load.spritesheet('redplayer', 'assets/game/redplayer.png',
                             {frameWidth: 650, frameHeight: 650});
        this.load.spritesheet('blueplayer', 'assets/game/blueplayer.png',
                             {frameWidth: 650, frameHeight: 650});
                        
        // Blue weapons                             
        this.load.image('blueBullet', 'assets/game/bullet_blue.png');
        this.load.image('blueBomb', 'assets/game/space_bomb_blue.png');

        // Red weapons
        this.load.image('redBullet', 'assets/game/bullet_red.png'); 
        
        this.load.image('redBomb', 'assets/game/space_bomb.png');

        // Blue shield
        this.load.image('blueShield', 'assets/game/shield_blue.png');
        this.load.image('blueShieldPowerUp', 'assets/game/powerup_shield_blue.png')
        // Red shield
        this.load.image('redShield', 'assets/game/shield_red.png');
        this.load.image('redShieldPowerUp', 'assets/game/powerup_shield_red.png')

        // Blue bomb power up
        this.load.image('blueBombPowerUp', 'assets/game/space_mine_blue.png');

        // Red bomb power up
        this.load.image('redBombPowerUp', 'assets/game/space_mine.png');

        // Sound effects and background music
        this.load.audio('shootingSound', ['assets/sounds/pew.mp3', 'assets/sounds/pew.ogg']);
        this.load.audio('backgroundMusic', ['assets/sounds/background_music.mp3', 'assets/sounds/background_music.ogg']);

        this.load.image('soundOn', 'assets/menu/sound_on.png');
        this.load.image('soundOff', 'assets/menu/sound_off.png');

        if(this.isMobile) {
            this.load.image('moveLeft', 'assets/game/controls/move_left.png');
            this.load.image('moveRight', 'assets/game/controls/move_right.png');
            this.load.image('shootAmmo', 'assets/game/controls/shoot_ammo.png');
            this.load.image('switchAmmo', 'assets/game/controls/switch_ammo.png');
            this.load.image('useShield', 'assets/game/controls/use_shield.png');
        }

        this.background = this.add.tileSprite(0, 0, this.sys.game.config.width, this.sys.game.config.height, 'background');
        this.background.setOrigin(0,0);

    }

    create() {

        this.progressBar.destroy();
        this.progressBox.destroy();

        // Counts related to powerups & selected ammo
        this.redShieldCount = 0;
        this.blueShieldCount = 0;

        this.redPlayerBombCount = 0;
        this.bluePlayerBombCount = 0;

        this.redPlayerSelectedAmmo = 0;
        this.bluePlayerSelectedAmmo = 0;
        
        // Sprite is always positioned in the left center of the height
        this.redPlayer = this.physics.add.sprite(0, this.sys.game.config.height / 2, 'redplayer');
        this.redPlayer.setAngle(90);
        this.redPlayer.setScale(0.2);
        this.redPlayer.setCollideWorldBounds(true);

        // Red Health, Ammo & Shields
        this.redPlayerLives = 3;
        this.redPlayerHealth = 500;
        this.redPlayerHealthText = this.add.text(0, 0, "HP: " + this.redPlayerHealth + " Lives: " + (this.redPlayerLives), {font:"20px Arial",
                                                                                       fill:"#ffffff"});

        this.redBullets = this.physics.add.group();
        this.redBombs = this.physics.add.group();
        this.redShields = this.physics.add.group();

        // Sprite is always positioned in the right center of the height
        this.bluePlayer = this.physics.add.sprite(this.sys.game.config.width, this.sys.game.config.height / 2, 'blueplayer');
        this.bluePlayer.setAngle(-90);
        this.bluePlayer.setScale(0.2);
        this.bluePlayer.setCollideWorldBounds(true);

        // Blue Health, Ammo & Shields
        this.bluePlayerLives = 3;
        this.bluePlayerHealth = 500;
        this.bluePlayerHealthText = this.add.text(this.sys.game.config.width - 150, 0, "HP: " + this.bluePlayerHealth + " Lives: " + (this.bluePlayerLives), {font:"20px Arial",
                                                                                                                        fill:"#ffffff"});
        this.blueBullets = this.physics.add.group();
        this.blueBombs = this.physics.add.group();
        this.blueShields = this.physics.add.group();

        // Blue shield(s) on the map
        this.blueShieldsOnWorld = this.physics.add.group();

        // Red shield(s) on the map
        this.redShieldsOnWorld = this.physics.add.group();

        // Blue bomb(s) on the map
        this.blueBombsOnWorld = this.physics.add.group();

        // Red bomb(s) on the map
        this.redBombsOnWorld = this.physics.add.group();

        // checking if the bullets & bombs collide with the players
        this.physics.add.collider(this.redPlayer, this.blueBullets, this.onRedPlayerHitByBullet, null, this);
        this.physics.add.collider(this.redPlayer, this.blueBombs, this.onRedPlayerHitByBomb, null, this);
        
        this.physics.add.collider(this.bluePlayer, this.redBullets, this.onBluePlayerHitByBullet, null, this);
        this.physics.add.collider(this.bluePlayer, this.redBombs, this.onBluePlayerHitByBomb, null, this);

        // Checking if bullets collide with shields
        this.physics.add.collider(this.blueBullets, this.redShields, this.onRedShieldHit, null, this);
        this.physics.add.collider(this.redBullets, this.blueShields, this.onBlueShieldHit, null, this);

        // Shields PowerUp collision logic
        this.physics.add.collider(this.blueBullets, this.blueShieldsOnWorld, this.addShieldToBlue, null, this);
        this.physics.add.collider(this.redBullets, this.blueShieldsOnWorld, this.removeBlueShieldFromMap, null, this);

        this.physics.add.collider(this.redBullets, this.redShieldsOnWorld, this.addShieldToRed, null, this);
        this.physics.add.collider(this.blueBullets, this.redShieldsOnWorld, this.removeRedShieldFromMap, null, this);

        // Bombs PowerUp collision logic
        this.physics.add.collider(this.blueBullets, this.blueBombsOnWorld, this.addBombToBlue, null, this);
        this.physics.add.collider(this.redBullets, this.blueBombsOnWorld, this.removeBlueBombFromMap, null, this);

        this.physics.add.collider(this.redBullets, this.redBombsOnWorld, this.addBombToRed, null, this);
        this.physics.add.collider(this.blueBullets, this.redBombsOnWorld, this.removeRedBombFromMap, null, this);

        /*

        Anims are not working, some sort of issue with the generateFrameNumbers function

        this.anims.create({
            key: 'blueUp',
            // we're letting the animation know that the sprites to use are between 0 and 3 (4 frames in total)
            frames: this.anims.generateFrameNumbers('bluePlayer', { start: 0, end: 1 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'blueStill',
            frames: [ { key: 'bluePlayer', frame: 2 } ],
            frameRate: 10
        });

        this.anims.create({
            key: 'blueDown',
            frames: this.anims.generateFrameNumbers('bluePlayer', { start: 3, end: 4 }),
            frameRate: 10,
            repeat: -1
        });

        */
        
        // Assigning variables to our soundfx and background music resources
        this.shootingSound = this.sound.add('shootingSound');
        this.backgroundMusic = this.sound.add('backgroundMusic');

        this.soundOnOff = true;

        this.soundIcon = this.add.image(this.sys.game.config.width / 2, 40, 'soundOn')
                                        .setInteractive({ useHandCursor: true });

        this.soundIcon.on('pointerdown', this.toggleSound);

        if(this.isMobile) {

            // RED MOBILE CONTROLS
            this.redMoveRight = this.physics.add.sprite(80, (this.sys.game.config.height) - 80, 'moveRight').setInteractive();
            this.redMoveRight.setDepth(1);
            this.redMoveRight.setSize(90, 90);

            this.redMoveLeft = this.physics.add.sprite(80, 80, 'moveLeft').setInteractive();
            this.redMoveLeft.setDepth(1);
            this.redMoveLeft.setSize(90, 90);

            this.redShootAmmo = this.physics.add.sprite(180, this.sys.game.config.height - 80, 'shootAmmo').setInteractive();
            this.redShootAmmo.setDepth(1);
            this.redShootAmmo.setSize(90, 90);

            this.redSwitchAmmo = this.physics.add.sprite(80, (this.sys.game.config.height) - 180, 'switchAmmo').setInteractive();
            this.redSwitchAmmo.setDepth(1);
            this.redSwitchAmmo.setSize(90, 90);

            this.redUseShield = this.physics.add.sprite(180, 80, 'useShield').setInteractive();
            this.redUseShield.setDepth(1);
            this.redUseShield.setSize(90, 90);

            this.redMoveRight.setAngle(90);
            this.redMoveLeft.setAngle(90);
            this.redShootAmmo.setAngle(180);
            this.redSwitchAmmo.setAngle(90);
            this.redUseShield.setAngle(90);
            
            // BLUE MOBILE CONTROLS
            this.blueMoveLeft = this.physics.add.sprite((this.sys.game.config.width) - 100,
                                                (this.sys.game.config.height) - 80, 
                                                'moveLeft').setInteractive();
            this.blueMoveLeft.setDepth(1);
            this.blueMoveLeft.setSize(90, 90);

            this.blueSwitchAmmo = this.physics.add.sprite((this.sys.game.config.width) - 100, 180, 'switchAmmo').setInteractive();
            this.blueSwitchAmmo.setDepth(1);
            this.blueSwitchAmmo.setSize(90, 90);

            this.blueUseShield = this.physics.add.sprite((this.sys.game.config.width) - 200, 
                                                    (this.sys.game.config.height) - 80,
                                                    'useShield').setInteractive();
            this.blueUseShield.setDepth(1);
            this.blueUseShield.setSize(90, 90);

            this.blueShootAmmo = this.physics.add.sprite((this.sys.game.config.width) - 200, 80, 'shootAmmo').setInteractive();
            this.blueShootAmmo.setSize(90, 90);

            this.blueMoveRight = this.physics.add.sprite((this.sys.game.config.width) - 100, 80,
                                                    'moveRight').setInteractive();
            this.blueMoveRight.setDepth(1);
            this.blueMoveRight.setSize(90, 90);

            this.blueMoveLeft.setAngle(-90);
            this.blueSwitchAmmo.setAngle(-90);
            this.blueUseShield.setAngle(-90);
            this.blueMoveRight.setAngle(-90);

            // RED CONTROLS ACTION
            this.redMoveLeft.on('pointerdown', function(pointer, localX, localY, event) {
                this.scene.redPlayer.setVelocityY(-500);
            });

            this.redMoveLeft.on('pointerup', function(pointer, localX, localY, event) {
                this.scene.redPlayer.setVelocityY(0);
            });

            this.redMoveRight.on('pointerdown', function(pointer, localX, localY, event) {
                this.scene.redPlayer.setVelocityY(500);
            });

            this.redMoveRight.on('pointerup', function(pointer, localX, localY, event) {
                this.scene.redPlayer.setVelocityY(0);
            });

            this.redSwitchAmmo.on('pointerdown', function(pointer, localX, localY, event) {

                if(this.scene.redPlayerBombCount > 0) {
                    if(this.scene.redPlayerSelectedAmmo == 0){
                        this.scene.redPlayerSelectedAmmo = 1;
                    } else {
                        this.scene.redPlayerSelectedAmmo = 0;
                    }
                }
            });

            this.redUseShield.on('pointerdown', function(pointer, localX, localY, event){
                
                if(this.scene.redShieldCount > 0) {
                    let shield = this.scene.redShields.create(
                        Phaser.Math.Between(190, 600),
                        Phaser.Math.Between(50, 600), 'redShield');

                    shield.body.allowGravity = false;
                    shield.setScale(0.3);
                    shield.body.setImmovable(true);

                    this.scene.redShieldCount--;

                    this.scene.time.addEvent( {
                        delay: 15000,
                        callback: function() {
                            shield.destroy('redShield');
                        },
                        callbackScope: this.scene,
                        loop: true
                    });
                }

            });

            this.redShootAmmo.on('pointerdown', function(pointer, localX, localY, event){
                this.scene.redFire();
            });

            if(this.input.pointer1.isDown) {
                this.redFire();
            }

            if(this.input.pointer2.isDown) {
                this.blueFire();
            }

            // BLUE PLAYER CONTROL ACTION
            this.blueMoveRight.on('pointerdown', function(pointer, localX, localY, event) {
                this.scene.bluePlayer.setVelocityY(-500);
            });

            this.blueMoveRight.on('pointerup', function(pointer, localX, localY, event) {
                this.scene.bluePlayer.setVelocityY(0);
            });

            this.blueMoveLeft.on('pointerdown', function(pointer, localX, localY, event) {
                this.scene.bluePlayer.setVelocityY(500);
            });

            this.blueMoveLeft.on('pointerup', function(pointer, localX, localY, event) {
                this.scene.bluePlayer.setVelocityY(0);
            });

            this.blueSwitchAmmo.on('pointerdown', function(pointer, localX, localY, event) {

                if(this.scene.bluePlayerBombCount > 0) {
                    if(this.scene.bluePlayerSelectedAmmo == 0){
                        this.scene.bluePlayerSelectedAmmo = 1;
                    } else {
                        this.scene.bluePlayerSelectedAmmo = 0;
                    }
                }
            });

            this.blueUseShield.on('pointerdown', function(pointer, localX, localY, event){
                
                if(this.scene.blueShieldCount > 0) {
                    let shield = this.scene.blueShields.create(
                        Phaser.Math.Between(190, 600),
                        Phaser.Math.Between(50, 600), 'blueShield');

                    shield.body.allowGravity = false;
                    shield.setScale(0.3);
                    shield.body.setImmovable(true);

                    this.scene.blueShieldCount--;

                    this.scene.time.addEvent( {
                        delay: 15000,
                        callback: function() {
                            shield.destroy('blueShield');
                        },
                        callbackScope: this.scene,
                        loop: true
                    });
                }

            });

            this.blueShootAmmo.on('pointerdown', function(pointer, localX, localY, event){
                this.scene.blueFire();
            }); 


        } else {
            // bluePlayer controls
            this.cursorKeys = this.input.keyboard.createCursorKeys();
            this.shootBlue = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
            this.changeAmmoTypeBlue = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
            this.useBlueShield = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);

            // redPlayer controls
            this.keys = this.input.keyboard.addKeys('W,A');
            this.shootRed = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
            this.changeAmmoTypeRed = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
            this.useRedShield = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        }
        
        
        // playing the background music
        this.backgroundMusic.setLoop(true);
        this.backgroundMusic.play();

        // Spawn red shields on the map in intervals of 15 seconds
        this.time.addEvent( {
            
            delay: 15000,
            callback: function (){
                
                let spawnedRedShield = this.redShieldsOnWorld.create(
                    Phaser.Math.Between(300, 600),
                    Phaser.Math.Between(50, 600), 'redShieldPowerUp');
                
                spawnedRedShield.setScale(0.1);
                spawnedRedShield.setImmovable(true);
                spawnedRedShield.body.allowGravity = false;

                this.time.addEvent( {
                    delay: 5000,
                    callback: function() {
                        spawnedRedShield.destroy('redShieldPowerUp');
                    },
                    callbackScope: this,
                    loop: true
                });

                
            },
            callbackScope: this,
            loop: true
            
        });

        // Spawn blue shields on the map in intervals of 15 seconds
        this.time.addEvent( {
            
            delay: 15000,
            callback: function () {
                
                // make sure the power ups don't get in the way of the ships and don't go over the middle
                let spawnedBlueShield = this.blueShieldsOnWorld.create(
                    Phaser.Math.Between(700, 900),
                    Phaser.Math.Between(50, 600), 'blueShieldPowerUp');
                
                spawnedBlueShield.setScale(0.1);
                spawnedBlueShield.body.setImmovable(true);
                spawnedBlueShield.body.allowGravity = false;

                this.time.addEvent( {
                    delay: 5000,
                    callback: function() {
                        spawnedBlueShield.destroy('blueShieldPowerUp');
                    },
                    callbackScope: this,
                    loop: true
                });

            },
            callbackScope: this,
            loop: true
        });

        // Spawn red bombs to collect (interval: 30s)
        this.time.addEvent( {
            
            delay: 45000,
            callback: function (){
                
                let spawnedRedBomb = this.redBombsOnWorld.create(
                    Phaser.Math.Between(300, 600),
                    Phaser.Math.Between(50, 600), 'redBombPowerUp');
                
                spawnedRedBomb.setImmovable(true);
                spawnedRedBomb.setScale(0.3);
                spawnedRedBomb.body.allowGravity = false;
                
                // if the power ups are not collected within 5 seconds, they are removed from the screen
                this.time.addEvent( {
                    delay: 5000,
                    callback: function() {
                        spawnedRedBomb.destroy('redBombPowerUp');
                    },
                    callbackScope: this,
                    loop: true
                });
                
            },
            callbackScope: this,
            loop: true
            
        });

        // Spawn blue bombs to collect (interval: 30s)
        this.time.addEvent( {
            
            delay: 45000,
            callback: function () {
                
                let spawnedBlueBomb = this.blueBombsOnWorld.create(
                    Phaser.Math.Between(700, 900),
                    Phaser.Math.Between(50, 600), 'blueBombPowerUp');
                
                spawnedBlueBomb.setImmovable(true);
                spawnedBlueBomb.setScale(0.3);
                spawnedBlueBomb.body.allowGravity = false;

                this.time.addEvent( {
                    delay: 5000,
                    callback: function() {
                        spawnedBlueBomb.destroy('blueBombPowerUp');
                    },
                    callbackScope: this,
                    loop: true
                });
                
            },
            callbackScope: this,
            loop: true
            
        });

    }

    update() {

        this.redPlayerHealthText.setText("HP: " + this.redPlayerHealth + " Lives: " + (this.redPlayerLives));
        this.bluePlayerHealthText.setText("HP: " + this.bluePlayerHealth + " Lives: " + (this.bluePlayerLives));
      
        if(!this.isMobile) {

            // Control actions for bluePlayer
            if(this.cursorKeys.up.isDown) {
                this.bluePlayer.setVelocityY(-500);
            } else if(this.cursorKeys.down.isDown) {
                this.bluePlayer.setVelocityY(500);
            } else if(this.cursorKeys.up.isUp) {
                this.bluePlayer.setVelocityY(0);
            } else if(this.cursorKeys.down.isUp) {
                this.bluePlayer.setVelocityY(0);
            }

            // Just down avoids auto shooting, makes this single shots only
            if(Phaser.Input.Keyboard.JustDown(this.shootBlue)) {
                this.blueFire();
            }

            if(Phaser.Input.Keyboard.JustDown(this.changeAmmoTypeBlue)) {

                if(this.bluePlayerBombCount > 0) {
                    if(this.bluePlayerSelectedAmmo == 0){
                        this.bluePlayerSelectedAmmo = 1;
                    } else {
                        this.bluePlayerSelectedAmmo = 0;
                    }
                }

            }

            if(Phaser.Input.Keyboard.JustDown(this.useBlueShield)){

                if(this.blueShieldCount > 0) {
                    
                    let shield = this.blueShields.create(
                        Phaser.Math.Between(700, 1090),
                        Phaser.Math.Between(50, 600), 'blueShield');

                    shield.body.allowGravity = false;
                    shield.setScale(0.3);
                    shield.body.setImmovable(true);

                    this.blueShieldCount--;

                    this.time.addEvent( {
                        delay: 15000,
                        callback: function() {
                            shield.destroy('blueShield');
                        },
                        callbackScope: this,
                        loop: true
                    });

                }
            }

            // Control actions for redPlayer
            if(this.keys.W.isDown) {
                this.redPlayer.setVelocityY(-500);
            } else if(this.keys.A.isDown) {
                this.redPlayer.setVelocityY(500);
            } else if(this.keys.W.isUp){
                this.redPlayer.setVelocityY(0);
            } else if(this.keys.A.Up) {
                this.redPlayer.setVelocityY(0);
            }

            // Just down avoids auto shooting, makes this single shots only
            if(Phaser.Input.Keyboard.JustDown(this.shootRed)) {
                this.redFire();
            }

            if(Phaser.Input.Keyboard.JustDown(this.changeAmmoTypeRed)) {

                if(this.redPlayerBombCount > 0) {
                    if(this.redPlayerSelectedAmmo == 0){
                        this.redPlayerSelectedAmmo = 1;
                    } else {
                        this.redPlayerSelectedAmmo = 0;
                    }
                }

            }

            if(Phaser.Input.Keyboard.JustDown(this.useRedShield)){
                
                if(this.redShieldCount > 0) {
                    let shield = this.redShields.create(
                        Phaser.Math.Between(190, 600),
                        Phaser.Math.Between(50, 600), 'redShield');

                    shield.body.allowGravity = false;
                    shield.setScale(0.3);
                    shield.body.setImmovable(true);

                    this.redShieldCount--;

                    this.time.addEvent( {
                        delay: 15000,
                        callback: function() {
                            shield.destroy('redShield');
                        },
                        callbackScope: this,
                        loop: true
                    });
                }

            }

        }

        if(this.redPlayerLives < 1) {
            // game over, blue player wins
            this.backgroundMusic.stop();
            let read = localStorage.getItem('bluePlayerWins');

            if(read > 0) {
                localStorage.setItem('bluePlayerWins', (parseInt(read) + 1));
            }else{
                localStorage.setItem('bluePlayerWins', 1);
            }
            
            this.scene.start('GameOverScene', { player: 'Blue player' });
        }

        if(this.bluePlayerLives < 1) {
            // game over, red player wins
            this.backgroundMusic.stop();
            let read = localStorage.getItem('redPlayerWins');

            if(read > 0) {
                localStorage.setItem('redPlayerWins', (parseInt(read) + 1));
            }else{
                localStorage.setItem('redPlayerWins', 1);
            }

            this.scene.start('GameOverScene', { player: 'Red player' });
        }

        if(this.bluePlayerHealth <= 0) {
            if(this.bluePlayerLives >= 1) {
                this.bluePlayerHealth = 500;
                this.bluePlayerLives--;
            }
        }

        if(this.redPlayerHealth <= 0) {
            if(this.redPlayerLives >= 1) {
                this.redPlayerHealth = 500;
                this.redPlayerLives--;
            }
        }
     
    }

    addBombToBlue(blueBullet, blueBombPowerUp){
        blueBullet.destroy('blueBullet');
        blueBombPowerUp.destroy('blueBombPowerUp');
        this.bluePlayerBombCount++;
    }

    removeBlueBombFromMap(redBullet, blueBombPowerUp) {
        redBullet.destroy('redBullet');
        blueBombPowerUp.destroy('blueBombPowerUp');
    }

    addShieldToBlue(blueBullet, blueShieldPowerUp) {
        blueBullet.destroy('blueBullet');
        blueShieldPowerUp.destroy('blueShield');
        this.blueShieldCount++;
    }

    removeBlueShieldFromMap(redBullet, blueShieldPowerUp) {
        redBullet.destroy('redBullet');
        blueShieldPowerUp.destroy('blueShield');
    }

    addBombToRed(redBullet, redBombPowerUp){
        redBullet.destroy('redBullet');
        redBombPowerUp.destroy('redBombPowerUp');
        this.redPlayerBombCount++;
    }

    removeRedBombFromMap(blueBullet, redBombPowerUp) {
        blueBullet.destroy('blueBullet');
        redBombPowerUp.destroy('redBombPowerUp');
    }

    addShieldToRed(redBullet, redShieldPowerUp) {
        redBullet.destroy('redBullet');
        redShieldPowerUp.destroy('redShieldPowerUp');
        this.redShieldCount++;
    }

    removeRedShieldFromMap(blueBullet, redShieldPowerUp) {
        blueBullet.destroy('blueBullet');
        redShieldPowerUp.destroy('redShieldPowerUp');
    }

    onBluePlayerHitByBullet(bluePlayer, redBullet) {
        this.bluePlayerHealth -= 5;
        redBullet.destroy('redBullet');
    }

    onBluePlayerHitByBomb(bluePlayer, redBomb) {
        this.bluePlayerHealth -= 100;
        redBomb.destroy('redBomb');
    }

    onRedPlayerHitByBullet(redPlayer, blueBullet) {
        this.redPlayerHealth -= 5;
        blueBullet.destroy('blueBullet');
    }

    onRedPlayerHitByBomb(redPlayer, blueBullet) {
        this.redPlayerHealth -= 100;
        blueBullet.destroy('blueBullet');
    }

    onRedShieldHit(blueBullet, redShield) {
        blueBullet.destroy('blueBullet');
    }

    onBlueShieldHit(redBullet, blueShield) {
        redBullet.destroy('redBullet');
    }

    blueFire() {

        if(this.bluePlayerSelectedAmmo == 0) {
            let blueBullet = this.blueBullets.create(this.bluePlayer.x, this.bluePlayer.y, 'blueBullet');
            blueBullet.setAngle(-90);
            blueBullet.body.allowGravity = false;
            blueBullet.setVelocityX(-1200);

            if(this.soundOnOff) {
                this.shootingSound.play();
            }

        } else if(this.bluePlayerSelectedAmmo == 1) {
            let blueBomb = this.blueBombs.create(this.bluePlayer.x, this.bluePlayer.y, 'blueBomb');
            blueBomb.body.allowGravity = false;
            blueBomb.setScale(0.5);
            blueBomb.setVelocityX(-1200);
            this.bluePlayerBombCount--;

            if(this.soundOnOff) {
                this.shootingSound.play();
            }

            if(this.bluePlayerBombCount == 0) {
                this.bluePlayerSelectedAmmo = 0;
            }
        }
        
    }

    redFire() {

        if(this.redPlayerSelectedAmmo == 0) {
            let redBullet = this.redBullets.create(this.redPlayer.x, this.redPlayer.y, 'redBullet');
            redBullet.setAngle(90);
            redBullet.body.allowGravity = false;
            redBullet.setVelocityX(1200);

            if(this.soundOnOff) {
                this.shootingSound.play();
            }

        }else if(this.redPlayerSelectedAmmo == 1){
            let redBomb = this.redBombs.create(this.redPlayer.x, this.redPlayer.y, 'redBomb');
            redBomb.body.allowGravity = false;
            redBomb.setScale(0.5);
            redBomb.setVelocityX(1200);

            this.redPlayerBombCount--;

            if(this.soundOnOff) {
                this.shootingSound.play();
            }

            if(this.redPlayerBombCount == 0) {
                this.redPlayerSelectedAmmo = 0;
            }

        }
        
    }

    toggleSound() {

        if(this.soundOnOff){
            this.scene.backgroundMusic.stop();
            this.soundOnOff = false;
            this.scene.soundIcon.setTexture('soundOff');
        } else {
            this.scene.backgroundMusic.play();
            this.soundOnOff = true;
            this.scene.soundIcon.setTexture('soundOn');
        }
        
    }

}