var botaoJogar, botaoSair;

class menu extends Phaser.Scene { // define movChar como extensão da cena do Phasser
    constructor() {
        super({ key: 'menu' });
    }

    preload() {
        this.load.image('logo', 'assets/logo.png');
        this.load.image('botaoJogar', 'assets/jogar.png');
        this.load.image('botaoSair', 'assets/sair.png');
        this.load.video('fundo', 'assets/fundo.mp4')
        this.load.audio('soundtrack', 'assets/soundtrack.mp3')
    }

    create() {

        // Soundtrack
        let audio = this.sound.add('soundtrack', { loop: true, volume: 1 });
        if (!this.sound.locked) {
            audio.play();
        } else {
            this.sound.once('unlocked', () => {
                audio.play();
            });
        }
        // Fundo background

        let video = this.add.video(640, 360, 'fundo'); // Posição X=400, Y=300 (centro)
        video.setScale(1); // Ajusta o tamanho do vídeo
        video.play(true); // Toca o vídeo em loop
        let overlay = this.add.rectangle(640, 360, this.scale.width, this.scale.height, 0x000000, 0.6);
        overlay.setDepth(1); // Garante que fique sobre o vídeo

        //Logo
        this.add.image(640, 150, 'logo').setDepth(10)

        botaoJogar = this.add.image(640, 350, 'botaoJogar').setDepth(10).setInteractive();

        botaoJogar.on('pointerdown', () => {
            this.scene.start('Tutorial', { cenaAnterior: this.scene.key }); // Inicia a tela de configuração
        });
        botaoJogar.on('pointerover', () => {
            this.tweens.add({ // Adiciona animação
                targets: botaoJogar, // Define que a animação é para o botaoConfig
                scale: 1.1, // Aumenta o tamanho do botão
                duration: 200, // Define a duração da animação como 0.2 segundos
                ease: 'Linear' // Define o movimento da animação como linear(constante)
            });
        });
        botaoJogar.on('pointerout', () => {
            this.tweens.add({ // adiciona animação
                targets: botaoJogar, // Define que a animação é para o botaoVivo
                scale: 1, // Diminui o tamanho do botão para o normal
                duration: 200, // Define a duração da animação como 0.2 segundos
                ease: 'Linear' // Define o movimento da animação como linear(constante)
            });
        });
    }

    update() {

    }
}

