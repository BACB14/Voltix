import Phaser from 'phaser';

export class Drone extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, minX, maxX, speed = 150) {
        super(scene, x, y, 'drone');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(true);
        this.minX = minX;
        this.maxX = maxX;
        this.speed = speed;
        this.setVelocityX(this.speed);
        this.setImmovable(true);
        this.body.allowGravity = false;
        this.body.setSize(28, 20);
        this.body.setOffset(3, 3);
    }

    update() {
        if (this.x >= this.maxX) {
            this.setVelocityX(-this.speed);
            this.flipX = true;
        } else if (this.x <= this.minX) {
            this.setVelocityX(this.speed);
            this.flipX = false;
        }
    }
}
