var playerPulando = true; // Variável de controle global
var animacaoRodando = false; // Para evitar múltiplas execuções
var titulo;

class cutscene extends Phaser.Scene { // define movChar como extensão da cena do Phasser
    constructor() {
        super({ key: 'cutscene' });
    }

    preload() {
        this.load.image('sky', 'assets/fundoTree.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.audio('musica', 'assets/music.mp3');
        this.load.image('plataformas', 'assets/plataforma.png');
        this.load.image('titulo', 'assets/titulo.png')
        this.load.spritesheet('walk',
            'assets/GojoWalk.png',
            { frameWidth: 35, frameHeight: 64 }
        );
        this.load.spritesheet('parado',
            'assets/gojoStand.png',
            { frameWidth: 35, frameHeight: 64 }
        );
        this.load.spritesheet('pular',
            'assets/gojoJump.png',
            { frameWidth: 47, frameHeight: 70 }
        );
        this.load.spritesheet('esq',
            'assets/gojoLeft.png',
            { frameWidth: 35.5, frameHeight: 64 }
        );
        this.load.spritesheet('tirandoC',
            'assets/gojoStart.png',
            { frameWidth: 33, frameHeight: 66 }
        );
        this.playerPulando = true; // Variável de controle global
        this.animacaoRodando = false; // Para evitar múltiplas execuções
    }

    create() {

        // PARA A MUSICA ANTERIOR

        let musicaAnterior = this.sound.get('soundtrack'); // define a variavel musica anterior como a musica de background da tela inicial
        musicaAnterior.stop();

        // ADICIONA O FUNDO

        this.add.image(640, 360, 'sky').setScale(2);

        // Adiciona o titulo

        titulo = this.add.image(640, 360, 'titulo').setAlpha(0);

        // INICIA A MÚSICA DO JOGO
        let musica = this.sound.add('musica');
        musica.play();

        // ADICIONA AS PLATAFORMAS VOADORAS

        plataformas = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });


        // CRIA AS PLATAFORMAS
        plataformas.create(400, 300, 'plataformas').refreshBody().setScale(0.5);
        plataformas.create(700, 500, 'plataformas').refreshBody().setScale(0.5);
        plataformas.create(1280, 200, 'plataformas').refreshBody().setScale(0.5);
        plataformas.create(1600, 300, 'plataformas').refreshBody().setScale(0.5);


        // CRIA O CHÃO
        
        platforms = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });

        platforms.create(400, 668, 'ground').setScale(2).refreshBody().setAlpha(0);
        platforms.create(800, 668, 'ground').setScale(2).refreshBody().setAlpha(0);
        platforms.create(1200, 668, 'ground').setScale(2).refreshBody().setAlpha(0);
        platforms.create(1600, 668, 'ground').setScale(2).refreshBody().setAlpha(0);
        platforms.create(2000, 668, 'ground').setScale(2).refreshBody().setAlpha(0);

        player = this.physics.add.sprite(50, 100, 'parado').setScale(2).refreshBody();

        // COLISÕES 
        
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);
        this.physics.add.collider(player, platforms);

        // Criando animação

        this.anims.create({
            key: 'stoped',
            frames: this.anims.generateFrameNumbers('parado', { start: 0, end: 0 }),
            frameRate: 15,
            repeat: 0
        })
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('walk', { start: 0, end: 7 }),
            frameRate: 15,
            repeat: -1
        });
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('esq', { start: 7, end: 0 }),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNumbers('pular', { start: 0, end: 0 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'tirandoC',
            frames: this.anims.generateFrameNumbers('tirandoC', { start: 0, end: 3 }),
            frameRate: 2,
            repeat: 0
        });



        // Ajustar o limite de movimento da câmera e permitir que o personagem vá além
        this.cameras.main.startFollow(player);
        this.cameras.main.setBounds(0, 0, 2560, 720);  // O mundo agora tem 1600px de largura

        // Adicionando um limite ao mundo para o personagem se mover
        this.physics.world.setBounds(0, 0, 2560, 720); // Faz com que o personagem possa se mover até 1600px


    }

    update() {
        this.GojoAndando();
    }
    GojoAndando() {
        if (player.x < 100) {
            player.anims.play('jump', true);
            player.setVelocityX(60);
            playerPulando = true; // Mantém o controle
            console.log(player.x);

            this.tweens.add({
                targets: titulo,
                alpha: 1, // Alvo: tornar totalmente invisível
                duration: 1000, // Tempo da animação (0.5 segundo)
                ease: 'Power2'
            });
        }
        else if (player.x > 150 && playerPulando) {
            player.setVelocityX(0);
            player.anims.stop();
            console.log(player.x);
            playerPulando = false; // Garante que só pare uma vez
        }

        if (player.x === 151 && !animacaoRodando) {
            animacaoRodando = true; // Garante que só rode uma vez
            player.anims.play('stoped');

            // ✅ Usa delayedCall para rodar apenas uma vez após 2s
            this.time.delayedCall(2000, () => {
                this.tweens.add({
                    targets: titulo,
                    alpha: 0, // Alvo: tornar totalmente invisível
                    duration: 1000, // Tempo da animação (0.5 segundo)
                    ease: 'Power2'
                });
                player.anims.play('tirandoC');
                console.log(player.y)
                this.time.delayedCall(4000, () => {
                    player.anims.play('stoped');
                    console.log(player.x);
                    this.time.delayedCall(1000, () => {
                        this.scene.start('gameFase');
                    });
                });
            });
        }
    }
}

