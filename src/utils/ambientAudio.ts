/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Controlador de Audio Ambiental para el Ecosistema DOCE - IFTS N.º 12
 * Genera sonidos suaves de concentración (Lluvia relajante / Ruido marrón Lo-Fi)
 * mediante la Web Audio API nativa sin dependencias externas.
 */

class AmbientAudioService {
  private ctx: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private sourceNode: AudioBufferSourceNode | null = null;
  private isPlaying: boolean = false;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  }

  public playRain(volume: number = 0.15) {
    try {
      this.initContext();
      if (!this.ctx) return;

      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      this.stop();

      // Generar 5 segundos de Brown Noise en bucle (sonido cálido de lluvia suave)
      const bufferSize = this.ctx.sampleRate * 5;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Filtro paso bajo de un polo para ruido marrón (sonido de lluvia)
        lastOut = (lastOut + 0.02 * white) / 1.02;
        data[i] = lastOut * 3.5;
      }

      const source = this.ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      // Filtro paso bajo para suavizar
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 850;

      const gain = this.ctx.createGain();
      gain.gain.value = volume;

      source.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      source.start();
      this.sourceNode = source;
      this.gainNode = gain;
      this.isPlaying = true;
    } catch (e) {
      console.warn('Audio ambiental no disponible en este entorno:', e);
    }
  }

  public stop() {
    try {
      if (this.sourceNode) {
        this.sourceNode.stop();
        this.sourceNode.disconnect();
        this.sourceNode = null;
      }
      this.isPlaying = false;
    } catch (e) {
      // Ignorar error al detener
    }
  }

  public toggle(volume: number = 0.15): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.playRain(volume);
      return true;
    }
  }

  public getStatus(): boolean {
    return this.isPlaying;
  }
}

export const ambientAudio = new AmbientAudioService();
