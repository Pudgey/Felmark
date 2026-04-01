"use client";

import { useState } from "react";
import type { RenderBlock } from "../types";
import styles from "./CalendarBlock.module.css";

interface DayItem {
  time: string;
  text: string;
  color: string;
  icon: string;
  duration: string;
}

interface DayData {
  name: string;
  num: number;
  today?: boolean;
  items: DayItem[];
}

const DAYS: DayData[] = [
  {
    name: "Mon", num: 31, items: [
      { time: "9:00 AM", text: "Meridian kickoff call", color: "#8b8bba", icon: "\u260E", duration: "45m" },
      { time: "2:00 PM", text: "Color palette review", color: "#b07d4f", icon: "\u270E", duration: "1h" },
    ],
  },
  {
    name: "Tue", num: 1, today: true, items: [
      { time: "10:00 AM", text: "Bolt Fitness check-in", color: "#6b9a6b", icon: "\u260E", duration: "30m" },
      { time: "1:00 PM", text: "Design system work", color: "#8b8bba", icon: "\u270E", duration: "3h" },
      { time: "4:30 PM", text: "Invoice follow-up", color: "#c07a6a", icon: "\u2709", duration: "15m" },
    ],
  },
  {
    name: "Wed", num: 2, items: [
      { time: "11:00 AM", text: "Nora portfolio review", color: "#b07d4f", icon: "\u260E", duration: "1h" },
    ],
  },
  { name: "Thu", num: 3, items: [] },
  {
    name: "Fri", num: 4, items: [
      { time: "9:30 AM", text: "Luna discovery call", color: "#8b8bba", icon: "\u260E", duration: "45m" },
      { time: "3:00 PM", text: "Weekly wrap-up", color: "#6b9a6b", icon: "\u2630", duration: "30m" },
    ],
  },
  { name: "Sat", num: 5, items: [] },
  { name: "Sun", num: 6, items: [] },
];

export default function CalendarBlock({ block }: { block: RenderBlock }) {
  const todayIdx = DAYS.findIndex((d) => d.today);
  const [selected, setSelected] = useState(todayIdx >= 0 ? todayIdx : 0);
  const day = DAYS[selected];

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <span className={styles.title}>This Week</span>
        <span className={styles.range}>Mar 31 &ndash; Apr 6</span>
      </div>

      <div className={styles.strip}>
        {DAYS.map((d, i) => (
          <div
            key={i}
            className={`${styles.day} ${i === selected ? styles.daySelected : ""}`}
            onClick={() => setSelected(i)}
          >
            <span className={styles.dayName}>{d.name}</span>
            <span className={`${styles.dayNum} ${i === selected ? styles.daySelectedNum : ""}`}>
              {d.num}
            </span>
            <div className={styles.dayDots}>
              {d.items.map((item, j) => (
                <span key={j} className={styles.dayDot} style={{ background: item.color }} />
              ))}
            </div>
            {d.today && <div className={styles.todayBar} />}
          </div>
        ))}
      </div>

      {day.items.length > 0 ? (
        <div className={styles.detail}>
          <div className={styles.detailDate}>
            {day.name}, {day.num < 10 ? (day.num <= 6 && day.num >= 1 ? "Apr" : "Mar") : "Mar"} {day.num}
          </div>
          {day.items.map((item, i) => (
            <div key={i} className={styles.event}>
              <div className={styles.eventBar} style={{ background: item.color }} />
              <div className={styles.eventInfo}>
                <div className={styles.eventTime}>{item.time}</div>
                <div className={styles.eventText}>{item.text}</div>
              </div>
              <span className={styles.eventIcon}>{item.icon}</span>
              <span className={styles.eventDuration}>{item.duration}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <span className={styles.emptyText}>Nothing scheduled</span>
          <button className={styles.emptyAdd}>+ Add event</button>
        </div>
      )}
    </div>
  );
}
