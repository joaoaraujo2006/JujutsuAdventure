
var score = 0;
var scoreText;
var platforms;
var plataformas;
var player;
var cont = 1;
var stars;
var bombs;
var cursors;
var animacaoEx = false;
var esquerda = false;
var direita = false;
var fundo2, fundo;
var explosionSound, risada;
var gameover, musicaAnterior2, win;



var healthBar; // Barra de vida
var health = 100; // Vida inicial
var maxHealth = 100; // Vida máxima

class gameFase extends Phaser.Scene { // define movChar como extensão da cena do Phasser
    constructor() {
        super({ key: 'gameFase' });
    }

    preload() {
        this.load.image('botaoAvancar', 'assets/avancar.png')
        this.load.video('domainEx', 'assets/expansaoDomain.mp4');
        this.load.image('sky', 'assets/fundoTree.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('star', 'assets/dedoSukuna.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.image('plataformas', 'assets/plataforma.png');
        this.load.image('lifebar', 'assets/lifebar.png')
        this.load.audio('explosionSound', 'assets/corte.mp3');
        this.load.audio('risada', 'assets/risada.mp3');
        this.load.image('gameover', 'assets/gameover.png')
        this.load.image('win', 'assets/win.png')
        this.load.spritesheet('walk',
            'assets/gojoWalk.png',
            { frameWidth: 35, frameHeight: 64 }
        );
        this.load.spritesheet('parado',
            'assets/gojoStand.png',
            { frameWidth: 35, frameHeight: 64 }
        );
        this.load.spritesheet('jump',
            'assets/gojoJump.png',
            { frameWidth: 47, frameHeight: 70 }
        );
        this.load.spritesheet('left',
            'assets/gojoLeft.png',
            { frameWidth: 35, frameHeight: 64 }
        );
    }

    create() {

        let musicaAnterior = this.sound.get('soundtrack'); // define a variavel musica anterior como a musica de background da tela inicial
        musicaAnterior.stop();

        musicaAnterior2 = this.sound.get('musica');

        explosionSound = this.sound.add('explosionSound');
        risada = this.sound.add('risada');

        // ADICIONA O FUNDO 
        fundo = this.add.image(640, 360, 'sky').setScale(2);
        fundo2 = this.add.video(640, 360, 'domainEx').setScale(2);

        // ADICIONA TELA DE GAME OVER

        gameover = this.add.image(640, 360, 'gameover').setScale(0.8).setAlpha(0).setDepth(20).setScrollFactor(0);
        win = this.add.image(640, 360, 'win').setScale(0.8).setAlpha(0).setDepth(20).setScrollFactor(0);
        // ADICIONA O CHÃO

        platforms = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });

        platforms.create(400, 668, 'ground').setScale(2).refreshBody().setAlpha(0);
        platforms.create(800, 668, 'ground').setScale(2).refreshBody().setAlpha(0);
        platforms.create(1200, 668, 'ground').setScale(2).refreshBody().setAlpha(0);
        platforms.create(1600, 668, 'ground').setScale(2).refreshBody().setAlpha(0);
        platforms.create(2000, 668, 'ground').setScale(2).refreshBody().setAlpha(0);

        // ADICIONA AS PLATAFORMAS VOADORAS

        plataformas = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });

        plataformas.create(400, 300, 'plataformas').refreshBody().setScale(0.5);
        plataformas.create(700, 500, 'plataformas').refreshBody().setScale(0.5);
        plataformas.create(1280, 200, 'plataformas').refreshBody().setScale(0.5);
        plataformas.create(1600, 300, 'plataformas').refreshBody().setScale(0.5);

        // ADICIONA O PLAYER 
        player = this.physics.add.sprite(152, 572, 'parado').setScale(2);

        player.setBounce(0.2);
        player.setCollideWorldBounds(true);
        this.physics.add.collider(player, platforms);

        this.physics.add.collider(player, plataformas);
        this.anims.create({
            key: 'stoped',
            frames: this.anims.generateFrameNumbers('parado', { start: 0, end: 0 }),
            frameRate: 10,
            repeat: -1
        })
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('walk', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('left', { start: 0, end: 7 }),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNumbers('jump', { start: 0, end: 3 }),
            frameRate: 15,
            repeat: -1
        });

        stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 160 }
        });

        stars.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
            child.setScale(0.7)
        });

        // Adiciona as colisões entre os objetos
        this.physics.add.collider(stars, platforms);
        this.physics.add.collider(stars, plataformas);
        this.physics.add.overlap(player, stars, collectStar, null, this);

        // bomba
        bombs = this.physics.add.group();
        this.physics.add.collider(bombs, platforms);
        this.physics.add.collider(player, bombs, hitBomb, null, this);

        // Marcador de pontos
        this.add.image(60, 60, 'star').setScale(1).setDepth(10).setScrollFactor(0);
        this.add.image(1100, 90, 'lifebar').setScale(0.6).setDepth(10).setScrollFactor(0);
        scoreText = this.add.text(100, 50, '0', { fontSize: '32px', fill: '#fff' }).setScrollFactor(0);

        // Ajustar o limite de movimento da câmera e permitir que o personagem vá além
        this.cameras.main.startFollow(player);
        this.cameras.main.setBounds(0, 0, 2560, 720);  // O mundo agora tem 1600px de largura

        // Adicionando um limite ao mundo para o personagem se mover
        this.physics.world.setBounds(0, 0, 2560, 720); // Faz com que o personagem possa se mover até 1600px

        var barX = 950;  // Posição X no canto direito
        var barY = 100;   // Posição Y no topo

        // Criar a barra de vida
        healthBar = this.add.graphics().setScrollFactor(0).setDepth(11);

        // Desenhar a barra de vida
        healthBar.fillStyle(0x8B0000); // Cor verde para a vida cheia
        healthBar.fillRect(barX, barY, 200, 20); // x, y, largura, altura


    }

    update() {
        cursors = this.input.keyboard.createCursorKeys();


        // DEFINE QUANDO OS BOTÕES FOREM CLICADOS, MOVIMENTAÇÃO E ANIMAÇÃO EM USO
        if (cursors.left.isDown) {
            player.setVelocityX(-160);
            direita = false; // Mude a direção para esquerda
            if (animacaoEx == false) {
                player.anims.play('right', true);
                player.setFlipX(true); // Inverte o personagem para a esquerda
            }
        }
        else if (cursors.right.isDown) {
            player.setVelocityX(160);
            direita = true; // Mude a direção para direita
            if (animacaoEx == false) {
                player.anims.play('right', true);
                player.setFlipX(false); // Remove a inversão (faz o personagem olhar para a direita)
            }
        }
        else {
            if (animacaoEx == false) {
                player.anims.play('stoped', true);
            }
            player.setVelocityX(0);
        }

        if (cursors.up.isDown) {
            player.setVelocityY(-280);
        }

        if (player.y < 572) {
            animacaoEx = true;
            if (direita === true) {
                player.anims.play('jump');
            } else {
                player.anims.play('jump');
                player.setFlipX(true); // Inverte a imagem para a esquerda no salto
            }
        } else {
            animacaoEx = false;
        }


        // EXPANSÃO DE DOMINIO

        this.teclaR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

        if (Phaser.Input.Keyboard.JustDown(this.teclaR) && cont === 1) { // Se a tecla E for clicada
            this.domainExpansion();
            cont -= 1;
        }

        // Atualizar a barra de vida com base no valor atual
        healthBar.clear();
        var healthWidth = (health / maxHealth) * 200; // Calculando a largura da barra de vida
        var barX = 950;  // Posição X no canto direito
        var barY = 100;   // Posição Y no topo

        // Desenhar a barra de vida
        healthBar.fillStyle(0x8B0000); // Cor verde
        healthBar.fillRect(barX, barY, healthWidth, 20); // Atualizando a largura da barra

        // Vencedor

        if(score == 100){
            this.vencedor();
        }

    }
    domainExpansion() {
        fundo.setAlpha(0);
        fundo2.setAlpha(1);
        fundo2.play(true); // Toca o vídeo em loop

        this.time.delayedCall(9000, () => {
            fundo2.pause();
            this.time.delayedCall(7000, () => {
                fundo2.pause();

                // Restaurar movimento e gravidade das estrelas
                stars.children.iterate(function (child) {
                    child.setVelocity(Phaser.Math.Between(-50, 50), Phaser.Math.Between(-50, 50));
                    child.body.moves = true;
                    child.body.allowGravity = true;
                });

                // Restaurar movimento e gravidade das bombas
                bombs.children.iterate(function (child) {
                    child.setVelocity(Phaser.Math.Between(-200, 200), 20);
                    child.body.moves = true;
                    child.body.allowGravity = true;
                });

                fundo.setAlpha(1);
                fundo2.setAlpha(0);
                fundo2.stop();
            });
        });

        // Congelar estrelas
        stars.children.iterate(function (child) {
            child.setVelocity(0, 0);
            child.body.moves = false;
            child.body.allowGravity = false;
        });

        // Congelar bombas
        bombs.children.iterate(function (child) {
            child.setVelocity(0, 0);
            child.body.moves = false;
            child.body.allowGravity = false;
        });
    }
    vencedor(){
        this.physics.pause();
        musicaAnterior2.stop();


        this.time.delayedCall(2000, () => {
            this.tweens.add({
                targets: win,
                alpha: 1, // Alvo: tornar totalmente invisível
                duration: 1000, // Tempo da animação (0.5 segundo)
                ease: 'Power2'
            });
            var botaoAvancar = this.add.image(400, 520, 'botaoAvancar').setDepth(21).setInteractive().setScrollFactor(0);
            risada.play({loop: true});
            // ANIMAÇÃO PARA SUMIR AO CLICAR O BOTÃO
            botaoAvancar.on('pointerdown', () => {
                this.tweens.add({
                    targets: win,
                    alpha: 0, // Alvo: tornar totalmente invisível
                    duration: 1000, // Tempo da animação (0.5 segundo)
                    ease: 'Power2'
                });
                this.time.addEvent({
                    delay: 1200, // Tempo em milissegundos (2 segundos)
                    callback: () => {
                        this.game.scene.restart()
                    },
                });
    
            });
            botaoAvancar.on('pointerover', () => {
                this.tweens.add({
                    targets: botaoAvancar, // Define que a animação é para o botaoAvancar
                    scale: 1.1, // Aumenta o tamanho do botão
                    duration: 200, // Define a duração da animação como 0.2 segundos
                    ease: 'Linear' // Define o movimento da animação como linear(constante)
                });
            });
            botaoAvancar.on('pointerout', () => {
                this.tweens.add({ // adiciona animação
                    targets: botaoAvancar, // Define que a animação é para o botaoAvancar
                    scale: 1, // Diminui o tamanho do botão para o normal
                    duration: 200, // Define a duração da animação como 0.2 segundos
                    ease: 'Linear' // Define o movimento da animação como linear(constante)
                });
            });
    
    
        })
    }


}
function collectStar(player, star) {
    star.disableBody(true, true);

    score += 1;
    scoreText.setText(score);
    health -= 1;

    if (stars.countActive(true) === 0) {
        let espacamento = 200; // Define uma distância maior entre as estrelas
        let posX = 12; // Posição inicial das estrelas

        stars.children.iterate(function (child) {
            child.enableBody(true, posX, 0, true, true);
            child.setVelocity(0, 0);
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

            posX += espacamento; // Aumenta a posição X para o próximo objeto
            if (posX > 2000) { // Garante que não saiam dos limites da tela
                posX = 12;
            }
        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var bomb = bombs.create(x, 16, 'bomb');
        bomb.setScale(0.2)
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        bomb.body.allowGravity = true;
    }

}

function hitBomb(player, bomb) {
    this.physics.pause();

    player.setTint(0xff0000);
    player.anims.play('');

    explosionSound.play();
    musicaAnterior2.stop();
    this.time.delayedCall(2000, () => {
        this.tweens.add({
            targets: gameover,
            alpha: 1, // Alvo: tornar totalmente invisível
            duration: 1000, // Tempo da animação (0.5 segundo)
            ease: 'Power2'
        });
        var botaoAvancar = this.add.image(400, 520, 'botaoAvancar').setDepth(21).setInteractive().setScrollFactor(0);
        risada.play({loop: true});
        // ANIMAÇÃO PARA SUMIR AO CLICAR O BOTÃO
        botaoAvancar.on('pointerdown', () => {
            this.tweens.add({
                targets: botaoAvancar,
                alpha: 0, // Alvo: tornar totalmente invisível
                duration: 1000, // Tempo da animação (0.5 segundo)
                ease: 'Power2'
            });
            this.time.addEvent({
                delay: 1200, // Tempo em milissegundos (2 segundos)
                callback: () => {
                    this.game.scene.restart()
                },
            });

        });
        botaoAvancar.on('pointerover', () => {
            this.tweens.add({
                targets: botaoAvancar, // Define que a animação é para o botaoAvancar
                scale: 1.1, // Aumenta o tamanho do botão
                duration: 200, // Define a duração da animação como 0.2 segundos
                ease: 'Linear' // Define o movimento da animação como linear(constante)
            });
        });
        botaoAvancar.on('pointerout', () => {
            this.tweens.add({ // adiciona animação
                targets: botaoAvancar, // Define que a animação é para o botaoAvancar
                scale: 1, // Diminui o tamanho do botão para o normal
                duration: 200, // Define a duração da animação como 0.2 segundos
                ease: 'Linear' // Define o movimento da animação como linear(constante)
            });
        });


    })

}

