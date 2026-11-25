/**
 * Genera todas las texturas procedurales del juego con estética neón/cyberpunk.
 * Se ejecuta una sola vez y evita depender de assets externos.
 */
export function generateGameTextures(scene) {
    if (scene.textures.exists('player')) return;

    const g = scene.make.graphics({ x: 0, y: 0, add: false });

    // 1. Player (32x40) - Unidad Voltix con antena, visor cian y núcleo de alto voltaje
    g.clear();
    // Antena superior
    g.fillStyle(0xfacc15, 1);
    g.fillRect(15, 0, 2, 5);
    g.fillCircle(16, 2, 2);
    // Cuerpo / traje
    g.fillStyle(0x0f172a, 1);
    g.fillRoundedRect(4, 5, 24, 28, 6);
    g.lineStyle(2, 0x00f0ff, 1);
    g.strokeRoundedRect(4, 5, 24, 28, 6);
    // Visor
    g.fillStyle(0x00f0ff, 1);
    g.fillRoundedRect(13, 10, 13, 7, 3);
    // Núcleo de alto voltaje en el pecho
    g.fillStyle(0xfacc15, 1);
    g.fillCircle(16, 24, 4);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(16, 24, 1.5);
    // Botas propulsoras
    g.fillStyle(0x3b82f6, 1);
    g.fillRect(7, 33, 7, 6);
    g.fillRect(18, 33, 7, 6);
    g.generateTexture('player', 32, 40);

    // 2. Ground / Platform (128x24) - Placa de circuito con trazas de voltaje
    g.clear();
    g.fillStyle(0x0b1222, 1);
    g.fillRoundedRect(0, 0, 128, 24, 4);
    g.fillStyle(0x13203b, 1);
    g.fillRect(4, 4, 120, 16);
    g.lineStyle(2, 0x00f0ff, 0.9);
    g.strokeRoundedRect(1, 1, 126, 22, 4);
    // Trazas de circuito y nodos
    g.fillStyle(0xfacc15, 0.9);
    g.fillRect(4, 1, 120, 2);
    g.fillCircle(14, 12, 2);
    g.fillCircle(64, 12, 2);
    g.fillCircle(114, 12, 2);
    g.generateTexture('ground', 128, 24);

    // 3. Battery / Volt Cell (20x24) - Célula de alto voltaje amarilla/cian
    g.clear();
    g.fillStyle(0xfacc15, 0.25);
    g.fillCircle(10, 13, 10);
    g.fillStyle(0x090d1a, 1);
    g.fillRoundedRect(4, 4, 12, 18, 3);
    g.lineStyle(2, 0xfacc15, 1);
    g.strokeRoundedRect(4, 4, 12, 18, 3);
    g.fillStyle(0x00f0ff, 1);
    g.fillRect(7, 8, 6, 10);
    // Borne superior
    g.fillStyle(0xfacc15, 1);
    g.fillRect(7, 1, 6, 3);
    g.generateTexture('battery', 20, 24);

    // 4. Spike (28x24) - Pilon de arco eléctrico / pincho Tesla
    g.clear();
    // Base metálica
    g.fillStyle(0x1e293b, 1);
    g.fillRoundedRect(3, 18, 22, 6, 2);
    g.lineStyle(1, 0x64748b, 1);
    g.strokeRoundedRect(3, 18, 22, 6, 2);
    // Halo de plasma rojo
    g.fillStyle(0xff2a55, 0.3);
    g.fillTriangle(14, 0, 2, 19, 26, 19);
    // Aguja de energía
    g.fillStyle(0xff2a55, 1);
    g.fillTriangle(14, 2, 6, 18, 22, 18);
    g.fillStyle(0xffcce0, 1);
    g.fillTriangle(14, 6, 11, 18, 17, 18);
    g.generateTexture('spike', 28, 24);

    // 5. Drone (34x26) - Dron de seguridad con escáner y propulsores
    g.clear();
    g.fillStyle(0x18182b, 1);
    g.fillRoundedRect(3, 4, 28, 16, 6);
    g.lineStyle(2, 0xff2a55, 1);
    g.strokeRoundedRect(3, 4, 28, 16, 6);
    // Ojo escáner
    g.fillStyle(0xff2a55, 1);
    g.fillCircle(20, 12, 4.5);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(21, 11, 1.5);
    // Propulsores de plasma
    g.fillStyle(0xfacc15, 1);
    g.fillRect(7, 20, 6, 4);
    g.fillRect(21, 20, 6, 4);
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
