import Phaser from 'phaser';

/**
 * Centinela que patrulla verticalmente entre minY y maxY.
 */
export class Sentinel extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, minY, maxY, speed = 110) {
        super(scene, x, y, 'sentinel');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(true);
        this.minY = minY;
        this.maxY = maxY;
        this.speed = speed;
        this.setVelocityY(this.speed);
        this.setImmovable(true);
        this.body.allowGravity = false;
        this.body.setCircle(11, 3, 3);
    }

    update() {
        if (this.y >= this.maxY) {
            this.setVelocityY(-this.speed);
        } else if (this.y <= this.minY) {
            this.setVelocityY(this.speed);
        }
    }
}
