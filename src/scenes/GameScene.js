import Phaser from 'phaser';
import { Player } from '../entities/Player.js';
import { Drone } from '../entities/Drone.js';
import { Sentinel } from '../entities/Sentinel.js';
import { Hunter } from '../entities/Hunter.js';
import { LEVELS } from '../levels/levels.js';
import { generateGameTextures } from '../graphics/Textures.js';
import { sfx } from '../audio/SoundFX.js';

export class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    init(data) {
        this.levelIndex = data.levelIndex ?? 0;
        this.totalScore = data.totalScore ?? 0;
        this.lives = data.lives ?? 3;
        this.elapsedTime = data.elapsedTime ?? 0;
        this.levelScore = 0;
        this.gameState = 'playing'; // 'playing' | 'paused' | 'transition' | 'gameover' | 'victory'
        this.drones = [];
        this.sentinels = [];
        this.hunters = [];
    }

    create() {
        generateGameTextures(this);

        const level = LEVELS[this.levelIndex];
        this.cameras.main.setBackgroundColor('#090d1a');
        this._drawCyberGrid();

        // Plataformas
        this.platforms = this.physics.add.staticGroup();
        level.platforms.forEach(p => {
            const plat = this.platforms.create(p.x, p.y, 'ground');
            if (p.scaleX && p.scaleX !== 1) {
                plat.setScale(p.scaleX, 1).refreshBody();
            }
        });

        // Baterías
        this.batteries = this.physics.add.group();
        level.batteries.forEach(b => {
            const bat = this.batteries.create(b.x, b.y, 'battery');
            bat.body.allowGravity = false;
            this.tweens.add({
                targets: bat,
                y: b.y - 6,
                scaleX: 1.12,
                scaleY: 1.12,
                duration: 750,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        });

        // Pinchos
        this.spikes = this.physics.add.staticGroup();
        level.spikes.forEach(s => {
            const spike = this.spikes.create(s.x, s.y, 'spike');
            spike.body.setSize(20, 16);
            spike.body.setOffset(4, 6);
        });

        // Meta (Portal) - empieza bloqueado hasta juntar la energía requerida
        this.goalUnlocked = false;
        this.goal = this.physics.add.staticSprite(level.goal.x, level.goal.y, 'goal');
        this.goal.setTint(0xff2a55);
        this.goal.setAlpha(0.5);
        this.tweens.add({
            targets: this.goal,
            scaleX: 1.08,
            scaleY: 1.08,
            duration: 700,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        this.goalLabel = this.add.text(level.goal.x, level.goal.y - 36, 'BLOQUEADO', {
            fontSize: '12px',
            fontFamily: 'monospace',
            fontStyle: 'bold',
            color: '#ff2a55'
        }).setOrigin(0.5);

        // Jugador
        this.player = new Player(this, level.playerSpawn.x, level.playerSpawn.y);

        // Drones (patrulla horizontal)
        (level.drones || []).forEach(d => {
            this.drones.push(new Drone(this, d.x, d.y, d.minX, d.maxX, d.speed));
        });

        // Centinelas (patrulla vertical)
        (level.sentinels || []).forEach(s => {
            this.sentinels.push(new Sentinel(this, s.x, s.y, s.minY, s.maxY, s.speed));
        });

        // Cazadores (persiguen al jugador si se acerca)
        (level.hunters || []).forEach(h => {
            this.hunters.push(new Hunter(this, h.x, h.y, h.minX, h.maxX, h.speed));
        });

        // Colisiones
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.player, this.spikes, () => this._handleHazardHit());
        [...this.drones, ...this.sentinels, ...this.hunters].forEach(enemy => {
            this.physics.add.overlap(this.player, enemy, () => this._handleHazardHit());
        });

        this.physics.add.overlap(this.player, this.batteries, (p, bat) => this._collectBattery(bat));
        this.physics.add.overlap(this.player, this.goal, () => this._reachGoal(level));

        // Controles
        this.cursors = this.input.keyboard.createCursorKeys();
        this.dashKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

        this.input.keyboard.on('keydown-P', () => this._togglePause());
        this.input.keyboard.on('keydown-ESC', () => this._togglePause());
        this.input.keyboard.on('keydown-M', () => this._toggleMute());
        this.input.keyboard.on('keydown-R', () => {
            if (this.gameState === 'playing') {
                this.scene.restart({
                    levelIndex: this.levelIndex,
                    totalScore: this.totalScore - this.levelScore,
                    lives: this.lives,
                    elapsedTime: this.elapsedTime
                });
            }
        });

        // HUD y controles táctiles
        this._createHUD(level);
        this._createTouchControls();
    }

    update(time, delta) {
        if (this.gameState !== 'playing') return;

        const dt = Math.min(delta, 50);
        this.elapsedTime += dt / 1000;
        this.timerText.setText(`${this.elapsedTime.toFixed(1)}s`);

        this.player.updateControls(this.cursors, this.dashKey, dt, this.touchState);
        this.touchState.jumpJustPressed = false;
        this.touchState.dashJustPressed = false;
        this.drones.forEach(d => d.update());
        this.sentinels.forEach(s => s.update());
        this.hunters.forEach(h => h.update(this.player));

        const pct = this.player.getDashCooldownPercent();
        this.dashBar.width = 110 * (1 - pct);
        this.dashBar.fillColor = pct > 0 ? 0xff2a55 : 0x00ff99;
    }

    _drawCyberGrid() {
        const g = this.add.graphics();
        g.lineStyle(1, 0x1e293b, 0.35);
        for (let x = 0; x <= 800; x += 40) {
            g.lineBetween(x, 0, x, 600);
        }
        for (let y = 0; y <= 600; y += 40) {
            g.lineBetween(0, y, 800, y);
        }
    }

    _createHUD(level) {
        // Barra superior semitransparente
        this.add.rectangle(400, 26, 800, 52, 0x070a14, 0.8).setScrollFactor(0);

        this.add.text(16, 10, level.name, {
            fontSize: '13px',
            fontFamily: 'monospace',
            fontStyle: 'bold',
            color: '#60a5fa'
        });

        this.scoreText = this.add.text(16, 28, `Energía: 0 / ${level.requiredEnergy}`, {
            fontSize: '16px',
            fontFamily: 'monospace',
            color: '#00f0ff'
        });

        // Barra de Dash
        this.add.text(260, 18, 'DASH', {
            fontSize: '12px',
            fontFamily: 'monospace',
            color: '#9ca3af'
        });
        this.add.rectangle(305, 25, 110, 10, 0x1f2937).setOrigin(0, 0.5);
        this.dashBar = this.add.rectangle(305, 25, 110, 10, 0x00ff99).setOrigin(0, 0.5);

        // Vidas, tiempo y sonido
        this.livesText = this.add.text(460, 18, `VIDAS: ${'♥ '.repeat(this.lives).trim()}`, {
            fontSize: '15px',
            fontFamily: 'monospace',
            color: '#ff2a55'
        });

        this.timerText = this.add.text(640, 18, `${this.elapsedTime.toFixed(1)}s`, {
            fontSize: '15px',
            fontFamily: 'monospace',
            color: '#e5e7eb'
        });

        this.muteText = this.add.text(784, 18, sfx.muted ? '🔇[M]' : '🔊[M]', {
            fontSize: '13px',
            fontFamily: 'monospace',
            color: '#9ca3af'
        }).setOrigin(1, 0);

        // Controles abajo
        this.add.text(400, 588, '← → Mover  |  ↑/ESPACIO Saltar  |  SHIFT Dash  |  P Pausa  |  M Sonido', {
            fontSize: '11px',
            fontFamily: 'monospace',
            color: '#6b7280'
        }).setOrigin(0.5);
    }

    _createTouchControls() {
        this.input.addPointer(2); // Multi-touch para moverse y saltar/hacer dash a la vez
        this.touchState = {
            left: false,
            right: false,
            jumpJustPressed: false,
            dashJustPressed: false
        };

        const makeBtn = (x, y, label, color, onDown, onUp) => {
            const bg = this.add.circle(x, y, 28, color, 0.16)
                .setStrokeStyle(2, color, 0.55)
                .setScrollFactor(0)
                .setDepth(100)
                .setInteractive();

            this.add.text(x, y, label, {
                fontSize: '20px',
                fontFamily: 'monospace',
                fontStyle: 'bold',
                color: '#ffffff'
            }).setOrigin(0.5).setAlpha(0.75).setScrollFactor(0).setDepth(101);

            bg.on('pointerdown', () => {
                bg.setFillStyle(color, 0.4);
                onDown();
            });
            const release = () => {
                bg.setFillStyle(color, 0.16);
                if (onUp) onUp();
            };
            bg.on('pointerup', release);
            bg.on('pointerout', release);
        };

        // Izquierda / Derecha (abajo a la izquierda)
        makeBtn(52, 535, '◀', 0x3b82f6,
            () => { this.touchState.left = true; },
            () => { this.touchState.left = false; }
        );
        makeBtn(122, 535, '▶', 0x3b82f6,
            () => { this.touchState.right = true; },
            () => { this.touchState.right = false; }
        );

        // Dash / Saltar (abajo a la derecha)
        makeBtn(678, 535, '⚡', 0x00ff99,
            () => { this.touchState.dashJustPressed = true; }
        );
        makeBtn(748, 535, '▲', 0x00f0ff,
            () => { this.touchState.jumpJustPressed = true; }
        );
    }

    _collectBattery(bat) {
        bat.disableBody(true, true);
        sfx.collect();

        this.levelScore += 10;
        this.totalScore += 10;

        const level = LEVELS[this.levelIndex];
        this.scoreText.setText(`Energía: ${this.levelScore} / ${level.requiredEnergy}`);
        if (this.levelScore >= level.requiredEnergy && !this.goalUnlocked) {
            this.goalUnlocked = true;
            this.scoreText.setColor('#00ff99');
            this.goal.clearTint();
            this.goal.setAlpha(1);
            this.goalLabel.setText('SALIDA ABIERTA').setColor('#00ff99');

            const unlockFx = this.add.particles(this.goal.x, this.goal.y, 'particle', {
                speed: { min: 50, max: 140 },
                scale: { start: 1, end: 0 },
                tint: 0x00ff99,
                lifespan: 400,
                quantity: 14,
                emitting: false
            });
            unlockFx.explode(14);
            this.time.delayedCall(450, () => unlockFx.destroy());
        }

        const particles = this.add.particles(bat.x, bat.y, 'particle', {
            speed: { min: 40, max: 120 },
            scale: { start: 0.8, end: 0 },
            tint: 0x00ff99,
            lifespan: 300,
            quantity: 10,
            emitting: false
        });
        particles.explode(10);
        this.time.delayedCall(350, () => particles.destroy());
    }

    _handleHazardHit() {
        if (this.gameState !== 'playing' || this.player.isInvulnerable) return;

        sfx.hit();
        this.cameras.main.shake(180, 0.012);
        this.cameras.main.flash(180, 255, 42, 85, false);
        this.lives--;
        this.livesText.setText(`VIDAS: ${'♥ '.repeat(Math.max(0, this.lives)).trim()}`);

        if (this.lives <= 0) {
            this._showGameOver();
            return;
        }

        const level = LEVELS[this.levelIndex];
        this.player.setPosition(level.playerSpawn.x, level.playerSpawn.y);
        this.player.setVelocity(0, 0);
        this.player.triggerInvulnerability(1200);
    }

    _reachGoal(level) {
        if (this.gameState !== 'playing') return;

        if (this.levelScore < level.requiredEnergy) {
            if (!this._warnActive) {
                this._warnActive = true;
                const warn = this.add.text(this.player.x, this.player.y - 40,
                    `Faltan ${level.requiredEnergy - this.levelScore} de energía`, {
                        fontSize: '14px',
                        fontFamily: 'monospace',
                        color: '#ff2a55',
                        backgroundColor: '#090d1a'
                    }).setOrigin(0.5);
                this.time.delayedCall(1000, () => {
                    warn.destroy();
                    this._warnActive = false;
                });
            }
            return;
        }

        this.gameState = 'transition';
        this.physics.pause();
        sfx.levelUp();

        const nextIndex = this.levelIndex + 1;
        if (nextIndex < LEVELS.length) {
            this.add.rectangle(400, 300, 800, 600, 0x000000, 0.7);
            this.add.text(400, 280, `${level.name} COMPLETADO`, {
                fontSize: '28px',
                fontFamily: 'monospace',
                fontStyle: 'bold',
                color: '#00ff99'
            }).setOrigin(0.5);
            this.add.text(400, 325, 'Cargando siguiente sector...', {
                fontSize: '16px',
                fontFamily: 'monospace',
                color: '#93c5fd'
            }).setOrigin(0.5);

            this.time.delayedCall(1400, () => {
                this.scene.restart({
                    levelIndex: nextIndex,
                    totalScore: this.totalScore,
                    lives: this.lives,
                    elapsedTime: this.elapsedTime
                });
            });
        } else {
            this._showVictory();
        }
    }

    _togglePause() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
            this.physics.pause();
            this.pauseOverlay = this.add.container(0, 0, [
                this.add.rectangle(400, 300, 800, 600, 0x000000, 0.72),
                this.add.text(400, 260, 'PAUSA', {
                    fontSize: '42px',
                    fontFamily: 'monospace',
                    fontStyle: 'bold',
                    color: '#00f0ff'
                }).setOrigin(0.5),
                this.add.text(400, 325, 'P / ESC: Continuar   |   Q: Menú principal', {
                    fontSize: '16px',
                    fontFamily: 'monospace',
                    color: '#e5e7eb'
                }).setOrigin(0.5)
            ]);
            this._menuKey = this.input.keyboard.once('keydown-Q', () => {
                this.scene.start('MenuScene');
            });
        } else if (this.gameState === 'paused') {
            this.gameState = 'playing';
            this.physics.resume();
            if (this.pauseOverlay) {
                this.pauseOverlay.destroy();
                this.pauseOverlay = null;
            }
            if (this._menuKey) {
                this.input.keyboard.off('keydown-Q');
            }
        }
    }

    _toggleMute() {
        const muted = sfx.toggleMute();
        this.muteText.setText(muted ? '🔇[M]' : '🔊[M]');
    }

    _showGameOver() {
        this.gameState = 'gameover';
        this.physics.pause();
        sfx.gameOver();

        this.add.rectangle(400, 300, 800, 600, 0x000000, 0.82);
        this.add.text(400, 240, 'SISTEMA COMPROMETIDO', {
            fontSize: '40px',
            fontFamily: 'monospace',
            fontStyle: 'bold',
            color: '#ff2a55'
        }).setOrigin(0.5);

        this.add.text(400, 300, `Energía total: ${this.totalScore}  |  Tiempo: ${this.elapsedTime.toFixed(1)}s`, {
            fontSize: '18px',
            fontFamily: 'monospace',
            color: '#e5e7eb'
        }).setOrigin(0.5);

        this.add.text(400, 360, 'Presiona R para reintentar  |  Q para menú', {
            fontSize: '16px',
            fontFamily: 'monospace',
            color: '#9ca3af'
        }).setOrigin(0.5);

        this.input.keyboard.once('keydown-R', () => {
            this.scene.restart({ levelIndex: 0, totalScore: 0, lives: 3, elapsedTime: 0 });
        });
        this.input.keyboard.once('keydown-Q', () => {
            this.scene.start('MenuScene');
        });
    }

    _showVictory() {
        this.gameState = 'victory';

        // Guardar récords
        const prevScore = Number(localStorage.getItem('sistema_escapado_best_score') || 0);
        if (this.totalScore > prevScore) {
            localStorage.setItem('sistema_escapado_best_score', String(this.totalScore));
        }
        const prevTime = localStorage.getItem('sistema_escapado_best_time');
        if (!prevTime || this.elapsedTime < Number(prevTime)) {
            localStorage.setItem('sistema_escapado_best_time', this.elapsedTime.toFixed(1));
        }

        this.add.rectangle(400, 300, 800, 600, 0x000000, 0.82);
        this.add.text(400, 220, '¡SISTEMA ESCAPADO!', {
            fontSize: '44px',
            fontFamily: 'monospace',
            fontStyle: 'bold',
            color: '#00ff99'
        }).setOrigin(0.5);

        this.add.text(400, 290, `Energía final: ${this.totalScore}\nTiempo total: ${this.elapsedTime.toFixed(1)}s`, {
            fontSize: '20px',
            fontFamily: 'monospace',
            color: '#e5e7eb',
            align: 'center',
            lineSpacing: 8
        }).setOrigin(0.5);

        this.add.text(400, 375, 'Presiona R para jugar de nuevo  |  Q para menú', {
            fontSize: '16px',
            fontFamily: 'monospace',
            color: '#93c5fd'
        }).setOrigin(0.5);

        this.input.keyboard.once('keydown-R', () => {
            this.scene.restart({ levelIndex: 0, totalScore: 0, lives: 3, elapsedTime: 0 });
        });
        this.input.keyboard.once('keydown-Q', () => {
            this.scene.start('MenuScene');
        });
    }
}
