# Sonic ForceField

A browser-based acoustic motion experiment using your PC speakers and microphone. It emits a high-frequency pilot tone, analyzes Doppler sidebands and tone attenuation, and visualizes motion as a Three.js field around a PC.

**[Open the English app](https://kg-ninja.github.io/SonicForceField/)** · **[日本語UI](https://kg-ninja.github.io/SonicForceField/ja/)** · [日本語README](README.ja.md)

## Try it

1. Open the app in desktop Chrome or Edge. Use speakers near the PC, not headphones, and select a real microphone rather than loopback audio.
2. Click **Start sensing** and allow microphone access. Keep the PC still during the tone check and calibration (usually about 8 seconds; noise can extend it).
3. Move a hand near or across the speaker. Approaching, receding, mixed-direction motion, and obstruction can all count as detection events.
4. Click **Stop** to end microphone input and tone output. Switching away from the page also stops sensing.

**Start demo** uses synthetic audio through the same FFT and detector. It needs neither microphone access nor speaker output. A successful demo is not evidence of real-world detection accuracy.

The default UI is English; the header links to Japanese. Both versions are generated from the same implementation.

## What the display means

| State | Visualization | Event behavior |
| --- | --- | --- |
| Approach | Red waves converge | One event per sustained motion episode |
| Recede | Blue waves expand | Counted as motion, not mislabeled as approach |
| Mixed / unknown | Yellow waves | Counts even when direction changes during a hand sweep |
| Obstruction | Red waves | Reduced pilot reception is counted as obstruction / approach |
| No motion | Green field | Does not establish absence or stationary presence |

The motion score is measured dB above the calibrated spectral baseline, or pilot attenuation in dB during obstruction. It is not confidence or distance. The waves and arrows are intentionally emphasized; their size does not represent physical position or range.

## Sensitivity and limitations

- **Extra sensitive** (default): 1 dB threshold, 0.15 seconds of sustained evidence, relative baseline floor -72 dB, sideband floor -100 dBFS. Weak / slow mode uses 3 dB and 0.6 seconds. These are persistence times, not total latency: the FFT also spans an audio window.
- Extra sensitive obstruction detection starts at 2 dB attenuation and releases below 1 dB. Other modes use 6 / 4 dB. After calibration, reception below -75 dBFS also counts as obstruction. Complete signal loss remains in the obstruction state.
- Muting speakers, lowering volume, or unreported input failure can look like obstruction. The application cannot distinguish people, hands, objects, or these audio changes.
- Events count once per episode, with a 3-second cooldown and 0.65-second calm release. Direction changes do not reset motion persistence.
- Default tone: 20 kHz, digital output amplitude 2%, with a hard maximum of 3%. Sensitivity never boosts the output. Digital amplitude is **not measured sound pressure or a safety guarantee**. Stop if the tone is audible or uncomfortable; 18 / 19 kHz can be audible.
- High-frequency response varies substantially by speakers, microphones, drivers, and browser. Bluetooth or aggressive audio processing may prevent operation. The initial probe requires reception of at least -75 dBFS and an off/on increase of at least 10 dB.
- Brief calibration noise and clipping are excluded. Persistent interference can prevent calibration. Clipping while sensing, reported microphone mute/disconnection, audio suspension, and processing stalls stop the session.
- Fans, moving objects, background sounds, and interference can cause false detections, especially in Extra sensitive mode. Static people and slow or sideways motion may be missed.

**This is an experimental motion visualization, not a security system, distance sensor, identity classifier, or occupancy detector. No detection range or success rate is established.**

## Privacy

Microphone samples are processed in browser memory. The app does not record or upload audio, use analytics, or call an external detection API. Event history lasts only within the current page session. GitHub Pages still receives normal requests for the site files; its hosting behavior is separate from microphone processing.

## Local development

Requires Node.js 22+ and npm. No account or API key is needed to run the app.

```sh
npm ci
npm start
```

Open `http://127.0.0.1:8765`. On Windows, `start-sonic-forcefield.cmd` starts the local server. The source development UI is Japanese; use the Pages build for both languages.

```sh
npm test
npm run lint
npm run typecheck
npm run check
npm run build
npm run build:pages
```

- `dist/`: local Node.js distribution, including Three.js. Start it with `node server.js`.
- `pages/`: static English site, with Japanese at `pages/ja/`. Serve this directory with a static server or deploy it to an HTTPS host. Microphone access requires HTTPS or localhost.
- `scripts/english.js`: build-time UI and error translation. The build fails if Japanese text remains untranslated in the English application sources.

## GitHub Pages

The workflow in `.github/workflows/pages.yml` installs locked dependencies, runs verification, builds both languages, and deploys **only `pages/`**. Set the repository Pages source to **GitHub Actions**. Pushes to `main` and manual workflow runs deploy the site; pull requests run checks without deployment.

Relative asset paths support the `/SonicForceField/` project prefix. Three.js is bundled locally; no CDN is required. The custom local server is not needed or deployed on Pages. Its response headers are specific to the local server; GitHub controls production hosting headers.

## Validation

Automated tests cover synthetic directional and crossing motion, weak echoes, obstruction and recovery, noise-tolerant calibration, audio resource cleanup, cancellation, qualification failure, local-server boundaries, and both static language builds. Browser demo checks verify UI behavior; they do not establish physical detection accuracy. Test your own hardware with repeated still, approach, and recede trials before interpreting results.

## References and third-party notices

This is an original implementation inspired by research principles and the field visualization concept; it does not claim to reproduce the paper's accuracy.

- [SoundWave — Microsoft Research](https://www.microsoft.com/en-us/research/project/soundwave-using-the-doppler-effect-to-sense-gestures/)
- [Gupta et al., CHI 2012 paper](https://www.microsoft.com/en-us/research/wp-content/uploads/2012/05/guptasoundwavechi2012.pdf)
- [ForceField Wi-Fi fluctuation detection](https://github.com/KG-NINJA/ForceField-Wi-Fi-fluctuation-detection)
- Three.js: pinned in `package-lock.json`; its MIT license is included at `vendor/LICENSE` in each static language build and in the local distribution.
