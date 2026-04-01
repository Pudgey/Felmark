"use client";

import { useState, useEffect, useCallback } from "react";
import styles from "./FloatingTimer.module.css";

interface TimerTask {
  id: string;
  title: string;
  clientName: string;
  clientColor: string;
}

interface FloatingTimerProps {
  task: TimerTask | null;
  onLog: (taskId: string, seconds: number) => void;
}

export default function FloatingTimer({ task, onLog }: FloatingTimerProps) {
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [minimized, setMinimized] = useState(false);
  // Track which task the timer is attached to (persists across task selection changes)
  const [timerTask, setTimerTask] = useState<TimerTask | null>(null);

  useEffect(() => {
    if (!running) return;
    const i = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(i);
  }, [running]);

  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  const fmt = `${hrs > 0 ? hrs + "h " : ""}${String(mins).padStart(2, "0")}m ${String(secs).padStart(2, "0")}s`;
  const fmtShort = `${hrs > 0 ? hrs + ":" : ""}${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

  const activeTask = timerTask || task;

  const handleStart = useCallback(() => {
    if (!activeTask) return;
    setTimerTask(activeTask);
    setRunning(true);
  }, [activeTask]);

  const handlePause = () => setRunning(false);

  const handleResume = () => setRunning(true);

  const handleStopAndLog = useCallback(() => {
    if (timerTask && seconds > 0) {
      onLog(timerTask.id, seconds);
    }
    setRunning(false);
    setSeconds(0);
    setTimerTask(null);
  }, [timerTask, seconds, onLog]);

  const handleDiscard = () => {
    setRunning(false);
    setSeconds(0);
    setTimerTask(null);
  };

  // Minimized pill (only when timer is running)
  if (minimized && running) {
    return (
      <div className={styles.mini} onClick={() => setMinimized(false)}>
        <div className={styles.miniPulse} />
        <span>{fmtShort}</span>
      </div>
    );
  }

  // No task and no active timer — show idle footer
  if (!activeTask && seconds === 0) {
    return (
      <div className={styles.idle}>
        <span className={styles.idleDot} />
        <span>Select a task to start tracking</span>
      </div>
    );
  }

  const displayTask = timerTask || activeTask;

  return (
    <div className={`${styles.bar} ${running ? styles.barActive : ""}`}>
      {/* Left: task info */}
      <div className={styles.left}>
        {running && <div className={styles.pulse} />}
        <div className={styles.info}>
          <div className={styles.task}>{displayTask?.title}</div>
          <div className={styles.client}>
            <span className={styles.clientDot} style={{ background: displayTask?.clientColor }} />
            {displayTask?.clientName}
          </div>
        </div>
      </div>

      {/* Center: time display */}
      <div className={styles.time}>
        <span className={styles.timeVal}>{fmt}</span>
        {running && <span className={styles.timeLabel}>Recording</span>}
        {!running && seconds > 0 && <span className={`${styles.timeLabel} ${styles.timeLabelPaused}`}>Paused</span>}
      </div>

      {/* Right: controls */}
      <div className={styles.controls}>
        {!running && seconds === 0 && (
          <button className={`${styles.btn} ${styles.btnStart}`} onClick={handleStart}>▶ Start</button>
        )}
        {running && (
          <>
            <button className={`${styles.btn} ${styles.btnPause}`} onClick={handlePause}>❚❚</button>
            <button className={`${styles.btn} ${styles.btnStop}`} onClick={handleStopAndLog}>■ Stop & Log</button>
          </>
        )}
        {!running && seconds > 0 && (
          <>
            <button className={`${styles.btn} ${styles.btnStart}`} onClick={handleResume}>▶ Resume</button>
            <button className={`${styles.btn} ${styles.btnStop}`} onClick={handleDiscard}>✕ Discard</button>
            <button className={`${styles.btn} ${styles.btnLog}`} onClick={handleStopAndLog}>✓ Log {fmtShort}</button>
          </>
        )}
        {running && <button className={styles.btnIcon} onClick={() => setMinimized(true)} title="Minimize">—</button>}
      </div>
    </div>
  );
}
