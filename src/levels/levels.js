/**
 * Definición de niveles del juego.
 * Cada nivel tiene plataformas, baterías, pinchos, drones, spawn y meta.
 */
export const LEVELS = [
    {
        name: 'SECTOR 01: ACCESO',
        requiredEnergy: 40,
        playerSpawn: { x: 100, y: 500 },
        goal: { x: 140, y: 112 },
        platforms: [
            { x: 400, y: 588, scaleX: 6.5 }, // Suelo principal
            { x: 140, y: 475, scaleX: 1.35 },
            { x: 400, y: 410, scaleX: 1.75 },
            { x: 650, y: 345, scaleX: 1.35 },
            { x: 400, y: 260, scaleX: 1.45 },
            { x: 140, y: 165, scaleX: 1.35 }
        ],
        batteries: [
            { x: 140, y: 435 },
            { x: 400, y: 375 },
            { x: 650, y: 315 },
            { x: 400, y: 225 },
            { x: 520, y: 540 }
        ],
        spikes: [
            { x: 380, y: 565 },
            { x: 410, y: 565 },
            { x: 470, y: 397 }
        ],
        drones: [
            { x: 400, y: 382, minX: 310, maxX: 490, speed: 130 }
        ]
    },
    {
        name: 'SECTOR 02: NÚCLEO',
        requiredEnergy: 50,
        playerSpawn: { x: 90, y: 520 },
        goal: { x: 700, y: 112 },
        platforms: [
            { x: 400, y: 588, scaleX: 6.5 },
            { x: 120, y: 480, scaleX: 1.25 },
            { x: 350, y: 425, scaleX: 1.45 },
            { x: 630, y: 465, scaleX: 1.35 },
            { x: 640, y: 325, scaleX: 1.35 },
            { x: 380, y: 265, scaleX: 1.5 },
            { x: 150, y: 205, scaleX: 1.25 },
            { x: 420, y: 160, scaleX: 1.25 },
            { x: 700, y: 165, scaleX: 1.25 }
        ],
        batteries: [
            { x: 120, y: 440 },
            { x: 630, y: 425 },
            { x: 640, y: 285 },
            { x: 380, y: 225 },
            { x: 150, y: 165 },
            { x: 420, y: 115 }
        ],
        spikes: [
            { x: 280, y: 565 },
            { x: 520, y: 565 },
            { x: 350, y: 407 },
            { x: 640, y: 307 }
        ],
        drones: [
            { x: 380, y: 232, minX: 300, maxX: 460, speed: 160 },
            { x: 630, y: 432, minX: 560, maxX: 700, speed: 145 }
        ],
        sentinels: [
            { x: 520, y: 250, minY: 180, maxY: 360, speed: 100 }
        ]
    },
    {
        name: 'SECTOR 03: ESCAPE FINAL',
        requiredEnergy: 60,
        playerSpawn: { x: 400, y: 520 },
        goal: { x: 400, y: 92 },
        platforms: [
            { x: 400, y: 588, scaleX: 6.5 },
            { x: 140, y: 485, scaleX: 1.25 },
            { x: 660, y: 485, scaleX: 1.25 },
            { x: 400, y: 405, scaleX: 1.55 },
            { x: 150, y: 325, scaleX: 1.35 },
            { x: 650, y: 325, scaleX: 1.35 },
            { x: 400, y: 240, scaleX: 1.6 },
            { x: 160, y: 165, scaleX: 1.2 },
            { x: 640, y: 165, scaleX: 1.2 },
            { x: 400, y: 145, scaleX: 1.2 }
        ],
        batteries: [
            { x: 140, y: 445 },
            { x: 660, y: 445 },
            { x: 150, y: 285 },
            { x: 650, y: 285 },
            { x: 400, y: 200 },
            { x: 160, y: 120 },
            { x: 640, y: 120 }
        ],
        spikes: [
            { x: 240, y: 565 },
            { x: 560, y: 565 },
            { x: 400, y: 387 },
            { x: 150, y: 307 },
            { x: 650, y: 307 }
        ],
        drones: [
            { x: 400, y: 372, minX: 315, maxX: 485, speed: 175 },
            { x: 140, y: 452, minX: 80, maxX: 200, speed: 140 }
        ],
        sentinels: [
            { x: 270, y: 240, minY: 150, maxY: 340, speed: 115 },
            { x: 530, y: 240, minY: 150, maxY: 340, speed: 115 }
        ],
        hunters: [
            { x: 400, y: 207, minX: 305, maxX: 495, speed: 135 }
        ]
    },
    {
        name: 'SECTOR 04: NÚCLEO CENTRAL',
        requiredEnergy: 70,
        playerSpawn: { x: 80, y: 520 },
        goal: { x: 720, y: 100 },
        platforms: [
            { x: 400, y: 588, scaleX: 6.5 },
            { x: 140, y: 490, scaleX: 1.2 },
            { x: 380, y: 440, scaleX: 1.45 },
            { x: 640, y: 480, scaleX: 1.25 },
            { x: 660, y: 345, scaleX: 1.25 },
            { x: 410, y: 290, scaleX: 1.55 },
            { x: 150, y: 240, scaleX: 1.25 },
            { x: 160, y: 140, scaleX: 1.2 },
            { x: 430, y: 150, scaleX: 1.35 },
            { x: 720, y: 155, scaleX: 1.2 }
        ],
        batteries: [
            { x: 140, y: 450 },
            { x: 380, y: 400 },
            { x: 640, y: 440 },
            { x: 660, y: 305 },
            { x: 410, y: 250 },
            { x: 150, y: 200 },
            { x: 160, y: 95 },
            { x: 430, y: 105 }
        ],
        spikes: [
            { x: 260, y: 565 },
            { x: 520, y: 565 },
            { x: 660, y: 327 },
            { x: 150, y: 222 }
        ],
        drones: [
            { x: 380, y: 407, minX: 300, maxX: 460, speed: 165 }
        ],
        sentinels: [
            { x: 540, y: 250, minY: 160, maxY: 360, speed: 125 },
            { x: 280, y: 210, minY: 130, maxY: 310, speed: 120 }
        ],
        hunters: [
            { x: 410, y: 257, minX: 325, maxX: 495, speed: 145 },
            { x: 430, y: 112, minX: 355, maxX: 505, speed: 150 }
        ]
    }
];
