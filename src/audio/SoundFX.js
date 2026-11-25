/**
 * Generador de efectos de sonido procedurales con Web Audio API.
 * No requiere archivos externos y respeta el estado de silencio (mute).
 */
class SoundFX {
    constructor() {
        this.ctx = null;
        this.muted = false;
    }

    _ensureContext() {
        if (this.muted) return null;
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                this.ctx = new AudioCtx();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume().catch(() => {});
        }
        return this.ctx;
    }

    toggleMute() {
        this.muted = !this.muted;
        return this.muted;
    }

    _playTone({ freqStart, freqEnd, duration, type = 'square', gain = 0.12 }) {
        const ctx = this._ensureContext();
        if (!ctx) return;

        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const amp = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freqStart, now);
        if (freqEnd !== undefined) {
            osc.frequency.exponentialRampToValueAtTime(Math.max(20, freqEnd), now + duration);
        }

        amp.gain.setValueAtTime(gain, now);
        amp.gain.exponentialRampToValueAtTime(0.001, now + duration);

        osc.connect(amp);
        amp.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + duration);
    }

    jump() {
        this._playTone({ freqStart: 240, freqEnd: 520, duration: 0.12, type: 'square', gain: 0.08 });
    }

    dash() {
        this._playTone({ freqStart: 600, freqEnd: 140, duration: 0.14, type: 'sawtooth', gain: 0.1 });
    }

    collect() {
        this._playTone({ freqStart: 520, freqEnd: 980, duration: 0.1, type: 'sine', gain: 0.12 });
    }

    hit() {
        this._playTone({ freqStart: 180, freqEnd: 55, duration: 0.22, type: 'sawtooth', gain: 0.16 });
    }

    levelUp() {
        const ctx = this._ensureContext();
        if (!ctx) return;
        const notes = [440, 554, 659, 880];
        notes.forEach((freq, i) => {
            setTimeout(() => {
                this._playTone({ freqStart: freq, freqEnd: freq * 1.02, duration: 0.12, type: 'triangle', gain: 0.12 });
            }, i * 75);
        });
    }

    gameOver() {
        const ctx = this._ensureContext();
        if (!ctx) return;
        const notes = [330, 277, 220, 146];
        notes.forEach((freq, i) => {
            setTimeout(() => {
                this._playTone({ freqStart: freq, freqEnd: freq * 0.9, duration: 0.18, type: 'sawtooth', gain: 0.12 });
            }, i * 110);
        });
    }
}

export const sfx = new SoundFX();
