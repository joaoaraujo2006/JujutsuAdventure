
class Tutorial extends Phaser.Scene { // define movChar como extensão da cena do Phasser
    constructor() {
        super({ key: 'Tutorial' });
    }

    preload() {
        this.load.image('sky', 'assets/fundoTree.png');
        this.load.image('tutorial', 'assets/Tutorial.png');
        this.load.image('botaoAvancar', 'assets/avancar.png')
    }

    create() {

        // ADICIONA O FUNDO
        this.add.image(640, 360, 'sky').setScale(2);;

        // CRIA O TUTORIAL E O BOTÃO

        var tutorial = this.add.image(640, 360, 'tutorial').setScale(0.8);
        var botaoAvancar = this.add.image(900, 620, 'botaoAvancar').setDepth(10).setInteractive();

        // ANIMAÇÃO PARA SUMIR AO CLICAR O BOTÃO
        botaoAvancar.on('pointerdown', () => {
            this.tweens.add({
                targets: tutorial,
                alpha: 0, // Alvo: tornar totalmente invisível
                duration: 1000, // Tempo da animação (0.5 segundo)
                ease: 'Power2'
            });
            this.tweens.add({
                targets: botaoAvancar,
                alpha: 0, // Alvo: tornar totalmente invisível
                duration: 1000, // Tempo da animação (0.5 segundo)
                ease: 'Power2'
            });
            this.time.addEvent({
                delay: 1200, // Tempo em milissegundos (2 segundos)
                callback: () => {
                    
                    this.scene.start('cutscene'); 
                },
            });  
            
        });

        // ANIMAÇÃO PARA O BOTÃO AVANCAR

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


    }

    update() {
    }
    
}

