import Phaser from 'phaser';
import { generateGameTextures } from '../graphics/Textures.js';
import { LEVELS } from '../levels/levels.js';

export class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    create() {
        generateGameTextures(this);

        this.cameras.main.setBackgroundColor('#090d1a');
        this._drawCyberGrid();
        this._spawnAmbientParticles();
        this.selectedLevel = 0;

        // Título principal
        this.add.text(400, 140, 'CYBER DASH', {
            fontSize: '48px',
            fontFamily: 'monospace',
            fontStyle: 'bold',
            color: '#00f0ff',
            stroke: '#003344',
            strokeThickness: 6
        }).setOrigin(0.5);

        this.add.text(400, 195, `PROTOCOLO DE EVASIÓN // ${LEVELS.length} SECTORES`, {
            fontSize: '15px',
            fontFamily: 'monospace',
            color: '#60a5fa'
        }).setOrigin(0.5);

        // Récord guardado
        const bestScore = localStorage.getItem('sistema_escapado_best_score') || 0;
        const bestTime = localStorage.getItem('sistema_escapado_best_time');
        const timeStr = bestTime ? `${Number(bestTime).toFixed(1)}s` : '--';

        this.add.text(400, 245, `RÉCORD: ${bestScore} ENERGÍA  |  MEJOR TIEMPO: ${timeStr}`, {
            fontSize: '14px',
            fontFamily: 'monospace',
            color: '#00ff99'
        }).setOrigin(0.5);

        // Caja de controles
        const box = this.add.rectangle(400, 355, 500, 130, 0x111827, 0.85);
        box.setStrokeStyle(1, 0x3b82f6, 0.8);

        this.add.text(400, 315, 'CONTROLES', {
            fontSize: '16px',
            fontFamily: 'monospace',
            color: '#93c5fd',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(400, 362,
            '← →  Moverse        ↑ / ESPACIO  Saltar\n' +
            'SHIFT  Dash         P / ESC  Pausa         M  Sonido',
            {
                fontSize: '14px',
                fontFamily: 'monospace',
                color: '#e5e7eb',
                align: 'center',
                lineSpacing: 10
            }
        ).setOrigin(0.5);

        // Selector de sector
        this.add.text(400, 425, 'SELECCIONAR SECTOR:', {
            fontSize: '12px',
            fontFamily: 'monospace',
            color: '#9ca3af'
        }).setOrigin(0.5);

        const sectorBtns = [];
        const totalWidth = LEVELS.length * 116;
        const startX = 400 - totalWidth / 2 + 58;
        LEVELS.forEach((lvl, idx) => {
            const x = startX + idx * 116;
            const btn = this.add.rectangle(x, 450, 106, 28, 0x111827, 0.9)
                .setInteractive({ useHandCursor: true });
            const txt = this.add.text(x, 450, `SECTOR 0${idx + 1}`, {
                fontSize: '12px',
                fontFamily: 'monospace',
                color: '#9ca3af'
            }).setOrigin(0.5);
            sectorBtns.push({ btn, txt, idx });

            btn.on('pointerdown', () => {
                this.selectedLevel = idx;
                updateSelector();
            });
        });

        const updateSelector = () => {
            sectorBtns.forEach(({ btn, txt, idx }) => {
                const active = idx === this.selectedLevel;
                btn.setStrokeStyle(1, active ? 0x00ff99 : 0x374151, 1);
                txt.setColor(active ? '#00ff99' : '#9ca3af');
            });
        };
        updateSelector();

        // Botón de inicio
        const startBtn = this.add.rectangle(400, 505, 260, 48, 0x00f0ff, 0.15)
            .setInteractive({ useHandCursor: true });
        startBtn.setStrokeStyle(2, 0x00f0ff, 1);

        const startText = this.add.text(400, 505, 'INICIAR MISIÓN', {
            fontSize: '20px',
            fontFamily: 'monospace',
            fontStyle: 'bold',
            color: '#00f0ff'
        }).setOrigin(0.5);

        this.tweens.add({
            targets: startBtn,
            scaleX: 1.03,
            scaleY: 1.03,
            duration: 900,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        const startGame = () => {
            this.scene.start('GameScene', { levelIndex: this.selectedLevel, totalScore: 0, lives: 3, elapsedTime: 0 });
        };

        startBtn.on('pointerover', () => {
            startBtn.setFillStyle(0x00f0ff, 0.35);
            startText.setColor('#ffffff');
        });
        startBtn.on('pointerout', () => {
            startBtn.setFillStyle(0x00f0ff, 0.15);
            startText.setColor('#00f0ff');
        });
        startBtn.on('pointerdown', startGame);

        this.input.keyboard.once('keydown-ENTER', startGame);
        this.input.keyboard.once('keydown-SPACE', startGame);

        this.add.text(400, 545, 'Presiona ENTER o ESPACIO para comenzar', {
            fontSize: '13px',
            fontFamily: 'monospace',
            color: '#6b7280'
        }).setOrigin(0.5);
    }

    _spawnAmbientParticles() {
        this.add.particles(0, 0, 'particle', {
            x: { min: 0, max: 800 },
            y: 610,
            speedY: { min: -40, max: -15 },
            scale: { start: 0.4, end: 0 },
            alpha: { start: 0.35, end: 0 },
            tint: [0x00f0ff, 0x00ff99, 0x3b82f6],
            lifespan: 5000,
            frequency: 220
        });
    }

    _drawCyberGrid() {
        const g = this.add.graphics();
        g.lineStyle(1, 0x1e293b, 0.45);
        for (let x = 0; x <= 800; x += 40) {
            g.lineBetween(x, 0, x, 600);
        }
        for (let y = 0; y <= 600; y += 40) {
            g.lineBetween(0, y, 800, y);
        }
    }
}
