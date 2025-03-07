var config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [menu, cutscene, gameFase, Tutorial],
    mode: Phaser.Scale.FIT,  // Mantém a proporção e ajusta o jogo à tela sem cortar
        width: 1280, // Mantém a largura fixa
        height: 720, // Mantém a altura fixa
        parent: 'game-container'  // Define um contêiner HTML específico
};
var game = new Phaser.Game(config);