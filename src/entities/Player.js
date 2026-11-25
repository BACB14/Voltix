import Phaser from 'phaser';
import { sfx } from '../audio/SoundFX.js';

export class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        const useCustomSprite = scene.textures.exists('player_sprite');
        super(scene, x, y, useCustomSprite ? 'player_sprite' : 'player', 0);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(true);
        this.setBounce(0);
        this.body.setGravityY(320);

        this.hasCustomAnims = useCustomSprite;
        if (useCustomSprite) {
            this.setDisplaySize(84, 65);
            this.baseScaleX = this.scaleX;
            this.baseScaleY = this.scaleY;
            this.body.setSize(95, 145);
            this.body.setOffset(70, 32);

            if (!scene.anims.exists('voltix_idle')) {
                scene.anims.create({
                    key: 'voltix_idle',
                    frames: scene.anims.generateFrameNumbers('player_sprite', { start: 0, end: 1 }),
                    frameRate: 3,
                    repeat: -1
                });
                scene.anims.create({
                    key: 'voltix_run',
                    frames: scene.anims.generateFrameNumbers('player_sprite', { start: 2, end: 5 }),
                    frameRate: 12,
                    repeat: -1
                });
                scene.anims.create({
                    key: 'voltix_dash',
                    frames: scene.anims.generateFrameNumbers('player_sprite', { start: 8, end: 9 }),
                    frameRate: 14,
                    repeat: -1
                });
            }
        } else {
            this.baseScaleX = 1;
            this.baseScaleY = 1;
            this.body.setSize(22, 32);
            this.body.setOffset(3, 4);
        }

        this.moveSpeed = 230;
        this.jumpSpeed = -440;
        this.maxJumps = 2;
        this.jumpsRemaining = this.maxJumps;
        this.dashSpeed = 620;
        this.dashCooldownDuration = 800;
        this.dashCooldownRemaining = 0;
        this.canDash = true;
        this.isDashing = false;

        this.coyoteTime = 0;
        this.jumpBufferTime = 0;
        this.isInvulnerable = false;
        this.wasOnGround = false;
    }

    updateControls(cursors, dashKey, dt) {
        const onGround = this.body.blocked.down || this.body.touching.down;

        if (this.isDashing) {
            if (this.hasCustomAnims && (!this.anims.isPlaying || this.anims.currentAnim?.key !== 'voltix_dash')) {
                this.play('voltix_dash');
            }
        } else {
            if (cursors.left.isDown) {
                this.setVelocityX(-this.moveSpeed);
                this.flipX = true;
                this.setAngle(-3);
                if (onGround && this.hasCustomAnims && (!this.anims.isPlaying || this.anims.currentAnim?.key !== 'voltix_run')) {
                    this.play('voltix_run');
                }
            } else if (cursors.right.isDown) {
                this.setVelocityX(this.moveSpeed);
                this.flipX = false;
                this.setAngle(3);
                if (onGround && this.hasCustomAnims && (!this.anims.isPlaying || this.anims.currentAnim?.key !== 'voltix_run')) {
                    this.play('voltix_run');
                }
            } else {
                this.setVelocityX(0);
                this.setAngle(0);
                if (onGround && this.hasCustomAnims && (!this.anims.isPlaying || this.anims.currentAnim?.key !== 'voltix_idle')) {
                    this.play('voltix_idle');
                }
            }

            if (!onGround && this.hasCustomAnims) {
                this.stop();
                this.setFrame(this.body.velocity.y < 0 ? 6 : 7);
            }
        }

        // Coyote time y detección de aterrizaje
        if (onGround && !this.wasOnGround) {
            this._spawnLandingParticles();
        }
        this.wasOnGround = onGround;

        if (onGround) {
            this.coyoteTime = 110;
            this.jumpsRemaining = this.maxJumps;
        } else {
            this.coyoteTime = Math.max(0, this.coyoteTime - dt);
        }

        // Jump buffer
        if (Phaser.Input.Keyboard.JustDown(cursors.up) || Phaser.Input.Keyboard.JustDown(cursors.space)) {
            this.jumpBufferTime = 110;
        } else {
            this.jumpBufferTime = Math.max(0, this.jumpBufferTime - dt);
        }

        if (this.jumpBufferTime > 0) {
            if (this.coyoteTime > 0) {
                this.setVelocityY(this.jumpSpeed);
                this.coyoteTime = 0;
                this.jumpBufferTime = 0;
                this.jumpsRemaining = this.maxJumps - 1;
                sfx.jump();
            } else if (this.jumpsRemaining > 0) {
                this.setVelocityY(this.jumpSpeed * 0.92);
                this.jumpBufferTime = 0;
                this.jumpsRemaining--;
                sfx.jump();
                this._spawnDoubleJumpParticles();
            }
        }

        if (Phaser.Input.Keyboard.JustDown(dashKey) && this.canDash) {
            this.dash();
        }

        this.updateDashCooldown(dt);
    }

    dash() {
        this.canDash = false;
        this.isDashing = true;
        this.dashCooldownRemaining = this.dashCooldownDuration;

        const direction = this.flipX ? -1 : 1;
        this.setVelocityX(direction * this.dashSpeed);
        this.setVelocityY(0);
        sfx.dash();

        // Estela visual del dash
        const particles = this.scene.add.particles(this.x, this.y, 'particle', {
            speed: { min: 20, max: 80 },
            scale: { start: 0.9, end: 0 },
            alpha: { start: 0.8, end: 0 },
            tint: 0x00f0ff,
            lifespan: 220,
            quantity: 8,
            emitting: false
        });
        particles.explode(8);
        this.scene.time.delayedCall(260, () => particles.destroy());

        this.scene.tweens.add({
            targets: this,
            alpha: 0.5,
            duration: 90,
            yoyo: true
        });

        this.scene.time.delayedCall(140, () => {
            this.isDashing = false;
        });
    }

    triggerInvulnerability(duration = 1200) {
        this.isInvulnerable = true;
        const blinkTween = this.scene.tweens.add({
            targets: this,
            alpha: 0.3,
            duration: 100,
            yoyo: true,
            repeat: -1
        });
        this.scene.time.delayedCall(duration, () => {
            blinkTween.stop();
            this.alpha = 1;
            this.isInvulnerable = false;
        });
    }

    updateDashCooldown(dt) {
        if (this.dashCooldownRemaining > 0) {
            this.dashCooldownRemaining = Math.max(0, this.dashCooldownRemaining - dt);
            if (this.dashCooldownRemaining === 0) {
                this.canDash = true;
            }
        }
    }

    _squashAndStretch(multX, multY) {
        if (this._squashTween) this._squashTween.stop();
        this.setScale(this.baseScaleX * multX, this.baseScaleY * multY);
        this._squashTween = this.scene.tweens.add({
            targets: this,
            scaleX: this.baseScaleX,
            scaleY: this.baseScaleY,
            duration: 140,
            ease: 'Back.easeOut'
        });
    }

    _spawnDoubleJumpParticles() {
        const particles = this.scene.add.particles(this.x, this.y + 28, 'particle', {
            speedX: { min: -90, max: 90 },
            speedY: { min: 10, max: 60 },
            scale: { start: 0.7, end: 0 },
            alpha: { start: 0.9, end: 0 },
            tint: 0x00f0ff,
            lifespan: 220,
            quantity: 8,
            emitting: false
        });
        particles.explode(8);
        this.scene.time.delayedCall(260, () => particles.destroy());
    }

    _spawnLandingParticles() {
        const particles = this.scene.add.particles(this.x, this.y + 30, 'particle', {
            speedX: { min: -60, max: 60 },
            speedY: { min: -30, max: -5 },
            scale: { start: 0.5, end: 0 },
            alpha: { start: 0.7, end: 0 },
            tint: 0x60a5fa,
            lifespan: 180,
            quantity: 5,
            emitting: false
        });
        particles.explode(5);
        this.scene.time.delayedCall(220, () => particles.destroy());
    }

    getDashCooldownPercent() {
        return this.dashCooldownRemaining / this.dashCooldownDuration;
    }
}
