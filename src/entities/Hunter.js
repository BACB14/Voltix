import Phaser from 'phaser';

/**
 * Cazador que patrulla horizontalmente y acelera si detecta al jugador cerca.
 */
export class Hunter extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, minX, maxX, speed = 130) {
        super(scene, x, y, 'hunter');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(true);
        this.minX = minX;
        this.maxX = maxX;
        this.baseSpeed = speed;
        this.chaseSpeed = speed * 1.75;
        this.setVelocityX(this.baseSpeed);
        this.setImmovable(true);
        this.body.allowGravity = false;
        this.body.setSize(22, 20);
        this.body.setOffset(5, 6);
    }

    update(player) {
        const dist = player ? Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y) : 999;
        const speed = dist < 170 ? this.chaseSpeed : this.baseSpeed;

        if (dist < 170 && player) {
            const dir = player.x < this.x ? -1 : 1;
            const nextX = this.x + dir * 2;
            if (nextX >= this.minX && nextX <= this.maxX) {
                this.setVelocityX(dir * speed);
                this.flipX = dir < 0;
                return;
            }
        }

        if (this.x >= this.maxX) {
            this.setVelocityX(-speed);
            this.flipX = true;
        } else if (this.x <= this.minX) {
            this.setVelocityX(speed);
            this.flipX = false;
        }
    }
}
