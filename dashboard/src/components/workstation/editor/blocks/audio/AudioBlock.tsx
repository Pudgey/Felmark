"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { AudioBlockData } from "@/lib/types";
import styles from "./AudioBlock.module.css";

interface AudioBlockProps {
  data: AudioBlockData;
  onUpdate: (data: AudioBlockData) => void;
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function getDefaultAudioData(): AudioBlockData {
  return { state: "idle", duration: 0, audioUrl: null, waveform: [], transcript: "" };
}

export { getDefaultAudioData };

export default function AudioBlock({ data, onUpdate }: AudioBlockProps) {
  const [state, setState] = useState(data.state);
  const [duration, setDuration] = useState(data.duration);
  const [waveform, setWaveform] = useState<number[]>(data.waveform);
  const [audioUrl, setAudioUrl] = useState<string | null>(data.audioUrl);
  const [transcript, setTranscript] = useState(data.transcript);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playProgress, setPlayProgress] = useState(0);
  const [dbLevel, setDbLevel] = useState(-60);
  const [autoTranscribe, setAutoTranscribe] = useState(true);
  const [editingTranscript, setEditingTranscript] = useState(false);

  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const chunks = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const animRef = useRef<number | null>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const startTime = useRef(0);
  const pausedDuration = useRef(0);

  // Sync to parent only when recording finishes or transcript changes
  const prevStateRef = useRef(state);
  const prevTranscriptRef = useRef(transcript);
  useEffect(() => {
    const stateChanged = prevStateRef.current !== state && state === "done";
    const transcriptChanged = prevTranscriptRef.current !== transcript && state === "done";
    prevStateRef.current = state;
    prevTranscriptRef.current = transcript;
    if (stateChanged || transcriptChanged) {
      onUpdate({ state, duration, audioUrl, waveform, transcript });
    }
  }, [state, transcript]); // eslint-disable-line react-hooks/exhaustive-deps

  const sampleWaveformRef = useRef<() => void>(undefined);
  useEffect(() => {
    sampleWaveformRef.current = () => {
      if (!analyser.current) return;
      const buf = new Uint8Array(analyser.current.fftSize);
      analyser.current.getByteTimeDomainData(buf);
      let sum = 0;
      for (let i = 0; i < buf.length; i++) {
        const v = (buf[i] - 128) / 128;
        sum += v * v;
      }
      const rms = Math.sqrt(sum / buf.length);
      const db = 20 * Math.log10(Math.max(rms, 0.0001));
      setDbLevel(Math.max(-60, Math.min(0, db)));
      const amplitude = Math.min(1, rms * 4);
      setWaveform(prev => {
        const next = [...prev, amplitude];
        if (next.length > 200) return next.slice(-200);
        return next;
      });
      animRef.current = requestAnimationFrame(() => sampleWaveformRef.current?.());
    };
  });
  const sampleWaveform = useCallback(() => sampleWaveformRef.current?.(), []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ctx = new AudioContext();
      const source = ctx.createMediaStreamSource(stream);
      const anal = ctx.createAnalyser();
      anal.fftSize = 256;
      source.connect(anal);
      audioContext.current = ctx;
      analyser.current = anal;

      const recorder = new MediaRecorder(stream);
      chunks.current = [];
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.current.push(e.data); };
      recorder.onstop = () => {
        const blob = new Blob(chunks.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        stream.getTracks().forEach(t => t.stop());
        if (autoTranscribe) {
          setTranscript("Transcription would appear here (requires speech API)");
        }
      };

      recorder.start(100);
      mediaRecorder.current = recorder;
      startTime.current = Date.now();
      setState("recording");
      setWaveform([]);
      setDuration(0);

      timerRef.current = setInterval(() => {
        setDuration((Date.now() - startTime.current + pausedDuration.current) / 1000);
      }, 100);

      animRef.current = requestAnimationFrame(sampleWaveform);
    } catch {
      // Microphone access denied — show demo mode
      setState("done");
      setDuration(47);
      setWaveform(Array.from({ length: 80 }, () => Math.random() * 0.7 + 0.1));
      setTranscript("Demo: microphone access required for real recording.");
    }
  };

  const pauseRecording = () => {
    if (mediaRecorder.current && state === "recording") {
      mediaRecorder.current.pause();
      pausedDuration.current += Date.now() - startTime.current;
      if (timerRef.current) clearInterval(timerRef.current);
      if (animRef.current) cancelAnimationFrame(animRef.current);
      setState("paused");
    }
  };

  const resumeRecording = () => {
    if (mediaRecorder.current && state === "paused") {
      mediaRecorder.current.resume();
      startTime.current = Date.now();
      setState("recording");
      timerRef.current = setInterval(() => {
        setDuration((Date.now() - startTime.current + pausedDuration.current) / 1000);
      }, 100);
      animRef.current = requestAnimationFrame(sampleWaveform);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      if (timerRef.current) clearInterval(timerRef.current);
      if (animRef.current) cancelAnimationFrame(animRef.current);
      audioContext.current?.close();
      pausedDuration.current = 0;
      setState("done");
    }
  };

  const togglePlayback = () => {
    if (!audioUrl) return;
    if (!audioElRef.current) {
      audioElRef.current = new Audio(audioUrl);
      audioElRef.current.onended = () => { setIsPlaying(false); setPlayProgress(0); };
      audioElRef.current.ontimeupdate = () => {
        if (audioElRef.current) setPlayProgress(audioElRef.current.currentTime / audioElRef.current.duration);
      };
    }
    if (isPlaying) {
      audioElRef.current.pause();
      setIsPlaying(false);
    } else {
      audioElRef.current.play();
      setIsPlaying(true);
    }
  };

  const resetRecording = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    audioElRef.current = null;
    setState("idle");
    setDuration(0);
    setWaveform([]);
    setAudioUrl(null);
    setTranscript("");
    setIsPlaying(false);
    setPlayProgress(0);
  };

  // Cleanup — use ref to capture latest audioUrl without re-running effect
  const audioUrlRef = useRef(audioUrl);
  useEffect(() => { audioUrlRef.current = audioUrl; }, [audioUrl]);
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animRef.current) cancelAnimationFrame(animRef.current);
      if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
    };
  }, []);

  // ── IDLE ──
  if (state === "idle") {
    return (
      <div className={styles.block}>
        <div className={styles.idle}>
          <button className={styles.recBtn} onClick={startRecording}>
            <span className={styles.recDot} />
            <span>Record</span>
          </button>
          <span className={styles.hint}>Click to start recording</span>
        </div>
      </div>
    );
  }

  // ── RECORDING / PAUSED ──
  if (state === "recording" || state === "paused") {
    return (
      <div className={styles.block}>
        <div className={styles.terminal}>
          <div className={styles.termHead}>
            <span className={`${styles.termStatus} ${state === "recording" ? styles.termRec : styles.termPaused}`}>
              {state === "recording" ? "● REC" : "❚❚ PAUSED"}
            </span>
            <span className={styles.termTime}>{formatTime(duration)}</span>
            <span className={styles.termDb}>{Math.round(dbLevel)}dB</span>
          </div>

          <div className={styles.waveWrap}>
            <div className={styles.wave}>
              {waveform.map((v, i) => (
                <div key={i} className={styles.waveBar} style={{ height: `${Math.max(4, v * 100)}%`, opacity: state === "paused" ? 0.3 : 0.5 + v * 0.5 }} />
              ))}
              {state === "recording" && <div className={styles.waveCursor} />}
            </div>
          </div>

          <div className={styles.termFoot}>
            <button className={styles.termBtn} onClick={stopRecording}>
              <span className={styles.stopIcon} /> Stop
            </button>
            {state === "recording" ? (
              <button className={styles.termBtn} onClick={pauseRecording}>
                <span className={styles.pauseIcon} /> Pause
              </button>
            ) : (
              <button className={styles.termBtn} onClick={resumeRecording}>
                <span className={styles.playIcon} /> Resume
              </button>
            )}
            <div className={styles.termRight}>
              <label className={styles.termToggle}>
                <input type="checkbox" checked={autoTranscribe} onChange={e => setAutoTranscribe(e.target.checked)} />
                <span>Transcribe</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── DONE ──
  return (
    <div className={styles.block}>
      <div className={styles.terminal}>
        <div className={styles.termHead}>
          <span className={styles.termDone}>AUDIO</span>
          <span className={styles.termTime}>{formatTime(duration)}</span>
          <button className={styles.termSmallBtn} onClick={resetRecording} title="Re-record">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6a4 4 0 017.2-2.4M10 6a4 4 0 01-7.2 2.4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M9.5 1.5v2.5H7M2.5 10.5V8H5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>

        <div className={styles.playWrap} onClick={togglePlayback}>
          <button className={styles.playBtn}>
            {isPlaying ? (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="3" y="2" width="3" height="10" rx="0.5" fill="currentColor"/><rect x="8" y="2" width="3" height="10" rx="0.5" fill="currentColor"/></svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3.5 1.5l9 5.5-9 5.5V1.5z" fill="currentColor"/></svg>
            )}
          </button>
          <div className={styles.wavePlayback}>
            {waveform.map((v, i) => {
              const pct = i / waveform.length;
              const played = pct <= playProgress;
              return (
                <div key={i} className={styles.waveBar} style={{ height: `${Math.max(4, v * 100)}%`, opacity: played ? 0.9 : 0.25, background: played ? "var(--ember)" : undefined }} />
              );
            })}
          </div>
          <span className={styles.playTime}>{isPlaying ? formatTime(playProgress * duration) : formatTime(duration)}</span>
        </div>

        {transcript && (
          <div className={styles.transcriptWrap}>
            <div className={styles.transcriptHead}>
              <span className={styles.transcriptLabel}>TRANSCRIPT</span>
              <button className={styles.termSmallBtn} onClick={() => setEditingTranscript(p => !p)}>
                {editingTranscript ? "Done" : "Edit"}
              </button>
            </div>
            {editingTranscript ? (
              <textarea
                className={styles.transcriptEdit}
                value={transcript}
                onChange={e => setTranscript(e.target.value)}
                rows={3}
              />
            ) : (
              <div className={styles.transcriptText}>{transcript}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
