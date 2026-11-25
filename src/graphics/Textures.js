/**
 * Genera todas las texturas procedurales del juego con estética neón/cyberpunk.
 * Se ejecuta una sola vez y evita depender de assets externos.
 */
export function generateGameTextures(scene) {
    if (scene.textures.exists('player')) return;

    const g = scene.make.graphics({ x: 0, y: 0, add: false });

    // 1. Player (28x36) - Runner cyber con visor cian
    g.clear();
    g.fillStyle(0x16213e, 1);
    g.fillRoundedRect(2, 4, 24, 30, 6);
    g.lineStyle(2, 0x00f0ff, 1);
    g.strokeRoundedRect(2, 4, 24, 30, 6);
    // Visor
    g.fillStyle(0x00f0ff, 1);
    g.fillRoundedRect(12, 10, 12, 7, 3);
    // Núcleo en el pecho
    g.fillStyle(0x00ff99, 1);
    g.fillCircle(14, 24, 3);
    g.generateTexture('player', 28, 36);

    // 2. Ground / Platform (128x24) - Plataforma metálica con borde neón
    g.clear();
    g.fillStyle(0x141b2d, 1);
    g.fillRoundedRect(0, 0, 128, 24, 4);
    g.fillStyle(0x1f2d4d, 1);
    g.fillRect(4, 4, 120, 16);
    g.lineStyle(2, 0x3b82f6, 1);
    g.strokeRoundedRect(1, 1, 126, 22, 4);
    // Línea superior brillante
    g.fillStyle(0x60a5fa, 1);
    g.fillRect(4, 1, 120, 2);
    g.generateTexture('ground', 128, 24);

    // 3. Battery (20x24) - Célula de energía brillante
    g.clear();
    g.fillStyle(0x00f0ff, 0.25);
    g.fillCircle(10, 13, 10);
    g.fillStyle(0x0f172a, 1);
    g.fillRoundedRect(4, 4, 12, 18, 3);
    g.lineStyle(2, 0x00f0ff, 1);
    g.strokeRoundedRect(4, 4, 12, 18, 3);
    g.fillStyle(0x00ff99, 1);
    g.fillRect(7, 8, 6, 10);
    // Borne superior
    g.fillStyle(0x00f0ff, 1);
    g.fillRect(7, 1, 6, 3);
    g.generateTexture('battery', 20, 24);

    // 4. Spike (28x22) - Pincho láser rojo
    g.clear();
    g.fillStyle(0xff2a55, 0.3);
    g.fillTriangle(14, 0, 0, 22, 28, 22);
    g.fillStyle(0xff2a55, 1);
    g.fillTriangle(14, 3, 3, 21, 25, 21);
    g.fillStyle(0xff99aa, 1);
    g.fillTriangle(14, 7, 10, 20, 18, 20);
    g.generateTexture('spike', 28, 22);

    // 5. Drone (34x26) - Dron patrullero con ojo rojo
    g.clear();
    g.fillStyle(0x2a1228, 1);
    g.fillRoundedRect(2, 4, 30, 18, 8);
    g.lineStyle(2, 0xff2a55, 1);
    g.strokeRoundedRect(2, 4, 30, 18, 8);
    // Ojo central
    g.fillStyle(0xff2a55, 1);
    g.fillCircle(20, 13, 5);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(21, 12, 2);
    // Propulsores inferiores
    g.fillStyle(0xff7700, 1);
    g.fillRect(7, 22, 6, 3);
    g.fillRect(21, 22, 6, 3);
    g.generateTexture('drone', 34, 26);

    // 6. Goal Portal (36x48) - Portal de salida verde neón
    g.clear();
    g.fillStyle(0x00ff88, 0.2);
    g.fillEllipse(18, 24, 34, 46);
    g.lineStyle(3, 0x00ff88, 1);
    g.strokeEllipse(18, 24, 28, 40);
    g.fillStyle(0xaaffdd, 0.85);
    g.fillEllipse(18, 24, 14, 24);
    g.generateTexture('goal', 36, 48);

    // 7. Particle (8x8) - Chispa para efectos
    g.clear();
    g.fillStyle(0xffffff, 1);
    g.fillCircle(4, 4, 4);
    g.generateTexture('particle', 8, 8);

    // 8. Sentinel (28x28) - Centinela vertical ámbar/naranja
    g.clear();
    g.fillStyle(0x2d1b06, 1);
    g.fillCircle(14, 14, 12);
    g.lineStyle(2, 0xffaa00, 1);
    g.strokeCircle(14, 14, 12);
    g.fillStyle(0xffaa00, 1);
    g.fillCircle(14, 14, 5);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(14, 14, 2);
    g.generateTexture('sentinel', 28, 28);

    // 9. Hunter (32x28) - Cazador magenta agresivo
    g.clear();
    g.fillStyle(0x28092e, 1);
    g.fillTriangle(16, 2, 2, 26, 30, 26);
    g.lineStyle(2, 0xe879f9, 1);
    g.strokeTriangle(16, 2, 2, 26, 30, 26);
    g.fillStyle(0xf0abfc, 1);
    g.fillCircle(16, 17, 4);
    g.generateTexture('hunter', 32, 28);

    g.destroy();
}
