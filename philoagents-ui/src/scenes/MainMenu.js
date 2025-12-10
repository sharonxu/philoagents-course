import { Scene } from 'phaser';

export class MainMenu extends Scene {
    constructor() {
        super('MainMenu');
    }

    create() {
        this.add.image(0, 0, 'background').setOrigin(0, 0);
        this.add.image(510, 260, 'logo').setScale(0.55);

        const centerX = this.cameras.main.width / 2;
        const startY = 524;
        const buttonSpacing = 70;

        this.createButton(centerX, startY, 'Let\'s Play!', () => {
            this.scene.start('Game');
        });

        this.createButton(centerX, startY + buttonSpacing, 'Instructions', () => {
            this.showInstructions();
        });
    }

    createButton(x, y, text, callback) {
        const buttonWidth = 280;
        const buttonHeight = 52;
        const cornerRadius = 12;
        const maxFontSize = 22;
        const padding = 20;

        // Outer shadow/border for depth
        const shadow = this.add.graphics();
        shadow.fillStyle(0x2a3a50, 1);
        shadow.fillRoundedRect(x - buttonWidth / 2, y - buttonHeight / 2 + 4, buttonWidth, buttonHeight, cornerRadius);

        // Main button with gradient-like effect
        const button = this.add.graphics();
        button.fillStyle(0xfaf8f5, 1);
        button.fillRoundedRect(x - buttonWidth / 2, y - buttonHeight / 2, buttonWidth, buttonHeight, cornerRadius);
        // Add border
        button.lineStyle(3, 0x2a3a50, 1);
        button.strokeRoundedRect(x - buttonWidth / 2, y - buttonHeight / 2, buttonWidth, buttonHeight, cornerRadius);
        
        button.setInteractive(
            new Phaser.Geom.Rectangle(x - buttonWidth / 2, y - buttonHeight / 2, buttonWidth, buttonHeight),
            Phaser.Geom.Rectangle.Contains
        );

        let fontSize = maxFontSize;
        let buttonText;
        do {
            if (buttonText) buttonText.destroy();
            
            buttonText = this.add.text(x, y, text, {
                fontSize: `${fontSize}px`,
                fontFamily: '"Trebuchet MS", "Segoe UI", Tahoma, sans-serif',
                color: '#2a3a50',
                fontStyle: 'bold',
                stroke: '#ffffff',
                strokeThickness: 0
            }).setOrigin(0.5);

            fontSize -= 1;
        } while (buttonText.width > buttonWidth - padding && fontSize > 10);

        button.on('pointerover', () => {
            this.updateButtonStyle(button, shadow, x, y, buttonWidth, buttonHeight, cornerRadius, true);
            buttonText.setColor('#ffffff');
            buttonText.y -= 2;
        });

        button.on('pointerout', () => {
            this.updateButtonStyle(button, shadow, x, y, buttonWidth, buttonHeight, cornerRadius, false);
            buttonText.setColor('#2a3a50');
            buttonText.y += 2;
        });

        button.on('pointerdown', callback);
        
        return { button, shadow, text: buttonText };
    }

    updateButtonStyle(button, shadow, x, y, width, height, radius, isHover) {
        button.clear();
        shadow.clear();
        
        if (isHover) {
            // Hover: golden/accent color
            shadow.fillStyle(0x8b6914, 1);
            shadow.fillRoundedRect(x - width / 2, y - height / 2 + 2, width, height, radius);
            button.fillStyle(0xf0c040, 1);
            button.fillRoundedRect(x - width / 2, y - height / 2, width, height, radius);
            button.lineStyle(3, 0x8b6914, 1);
            button.strokeRoundedRect(x - width / 2, y - height / 2, width, height, radius);
        } else {
            // Normal: marble white
            shadow.fillStyle(0x2a3a50, 1);
            shadow.fillRoundedRect(x - width / 2, y - height / 2 + 4, width, height, radius);
            button.fillStyle(0xfaf8f5, 1);
            button.fillRoundedRect(x - width / 2, y - height / 2, width, height, radius);
            button.lineStyle(3, 0x2a3a50, 1);
            button.strokeRoundedRect(x - width / 2, y - height / 2, width, height, radius);
        }
    }

    showInstructions() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        const centerX = width / 2;
        const centerY = height / 2;
        
        const elements = this.createInstructionPanel(centerX, centerY);
        
        const instructionContent = this.addInstructionContent(centerX, centerY, elements.panel);
        elements.title = instructionContent.title;
        elements.textElements = instructionContent.textElements;
        
        const closeElements = this.addCloseButton(centerX, centerY + 79, () => {
            this.destroyInstructionElements(elements);
        });
        elements.closeButton = closeElements.button;
        elements.closeText = closeElements.text;
        
        elements.overlay.on('pointerdown', () => {
            this.destroyInstructionElements(elements);
        });
    }
    
    createInstructionPanel(centerX, centerY) {
        const overlay = this.add.graphics();
        overlay.fillStyle(0x000000, 0.7);
        overlay.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);
        overlay.setInteractive(
            new Phaser.Geom.Rectangle(0, 0, this.cameras.main.width, this.cameras.main.height),
            Phaser.Geom.Rectangle.Contains
        );
        
        const panel = this.add.graphics();
        panel.fillStyle(0xffffff, 1);
        panel.fillRoundedRect(centerX - 200, centerY - 150, 400, 300, 20);
        panel.lineStyle(4, 0x000000, 1);
        panel.strokeRoundedRect(centerX - 200, centerY - 150, 400, 300, 20);
        
        return { overlay, panel };
    }
    
    addInstructionContent(centerX, centerY, panel) {
        const title = this.add.text(centerX, centerY - 110, 'INSTRUCTIONS', {
            fontSize: '28px',
            fontFamily: 'Arial',
            color: '#000000',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        const instructions = [
            'Arrow keys for moving',
            'SPACE for talking to philosophers',
            'ESC for closing the dialogue'
        ];
        
        const textElements = [];
        let yPos = centerY - 59;
        instructions.forEach(instruction => {
            textElements.push(
                this.add.text(centerX, yPos, instruction, {
                    fontSize: '22px',
                    fontFamily: 'Arial',
                    color: '#000000'
                }).setOrigin(0.5)
            );
            yPos += 40;
        });
        
        return { title, textElements };
    }
    
    addCloseButton(x, y, callback) {
        const adjustedY = y + 10;
        
        const buttonWidth = 120;
        const buttonHeight = 40;
        const cornerRadius = 10;
        
        const closeButton = this.add.graphics();
        closeButton.fillStyle(0x87CEEB, 1);
        closeButton.fillRoundedRect(x - buttonWidth / 2, adjustedY - buttonHeight / 2, buttonWidth, buttonHeight, cornerRadius);
        closeButton.lineStyle(2, 0x000000, 1);
        closeButton.strokeRoundedRect(x - buttonWidth / 2, adjustedY - buttonHeight / 2, buttonWidth, buttonHeight, cornerRadius);
        
        const closeText = this.add.text(x, adjustedY, 'Close', {
            fontSize: '20px',
            fontFamily: 'Arial',
            color: '#000000',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        closeButton.setInteractive(
            new Phaser.Geom.Rectangle(x - buttonWidth / 2, adjustedY - buttonHeight / 2, buttonWidth, buttonHeight),
            Phaser.Geom.Rectangle.Contains
        );
        
        closeButton.on('pointerover', () => {
            closeButton.clear();
            closeButton.fillStyle(0x5CACEE, 1);
            closeButton.fillRoundedRect(x - buttonWidth / 2, adjustedY - buttonHeight / 2, buttonWidth, buttonHeight, cornerRadius);
            closeButton.lineStyle(2, 0x000000, 1);
            closeButton.strokeRoundedRect(x - buttonWidth / 2, adjustedY - buttonHeight / 2, buttonWidth, buttonHeight, cornerRadius);
        });
        
        closeButton.on('pointerout', () => {
            closeButton.clear();
            closeButton.fillStyle(0x87CEEB, 1);
            closeButton.fillRoundedRect(x - buttonWidth / 2, adjustedY - buttonHeight / 2, buttonWidth, buttonHeight, cornerRadius);
            closeButton.lineStyle(2, 0x000000, 1);
            closeButton.strokeRoundedRect(x - buttonWidth / 2, adjustedY - buttonHeight / 2, buttonWidth, buttonHeight, cornerRadius);
        });
        
        closeButton.on('pointerdown', callback);
        
        return { button: closeButton, text: closeText };
    }
    
    destroyInstructionElements(elements) {
        elements.overlay.destroy();
        elements.panel.destroy();
        elements.title.destroy();
        
        elements.textElements.forEach(text => text.destroy());
        
        elements.closeButton.destroy();
        elements.closeText.destroy();
    }
}
