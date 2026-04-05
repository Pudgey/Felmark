"use client";

import { useState } from "react";
import type { AvailabilityPickerData } from "@/lib/types";
import styles from "./UniqueBlocks.module.css";

interface Props {
  data: AvailabilityPickerData;
  onUpdate: (data: AvailabilityPickerData) => void;
}

export function getDefaultAvailabilityPickerData(): AvailabilityPickerData {
  return {
    days: [
      {
        date: "Mon, Apr 7",
        slots: [
          { time: "10:00 AM", duration: "30 min", available: true },
          { time: "2:00 PM", duration: "30 min", available: true },
          { time: "4:00 PM", duration: "30 min", available: false },
        ],
      },
      {
        date: "Tue, Apr 8",
        slots: [
          { time: "9:00 AM", duration: "30 min", available: true },
          { time: "11:00 AM", duration: "30 min", available: true },
          { time: "3:00 PM", duration: "30 min", available: true },
        ],
      },
      {
        date: "Wed, Apr 9",
        slots: [
          { time: "10:00 AM", duration: "30 min", available: true },
          { time: "1:00 PM", duration: "30 min", available: true },
        ],
      },
      {
        date: "Thu, Apr 10",
        slots: [
          { time: "9:00 AM", duration: "30 min", available: true },
          { time: "2:00 PM", duration: "30 min", available: true },
          { time: "4:30 PM", duration: "30 min", available: true },
        ],
      },
    ],
    selected: null,
  };
}

export default function AvailabilityPickerBlock({ data, onUpdate }: Props) {
  const [confirmed, setConfirmed] = useState(false);

  const selectSlot = (key: string) => {
    if (confirmed) return;
    onUpdate({ ...data, selected: data.selected === key ? null : key });
  };

  const selectedDay = data.selected ? data.days[parseInt(data.selected.split("-")[0])] : null;
  const selectedSlot = data.selected && selectedDay ? selectedDay.slots[parseInt(data.selected.split("-")[1])] : null;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span
          className={styles.badge}
          style={{
            color: "var(--info)",
            background: "color-mix(in srgb, var(--info) 6%, transparent)",
            borderColor: "color-mix(in srgb, var(--info) 10%, transparent)",
          }}
        >
          Schedule
        </span>
        <span className={styles.title}>Pick a time for our kickoff call</span>
        <span className={styles.subtitle}>30-minute video call</span>
      </div>
      <div className={styles.availGrid}>
        {data.days.map((day, di) => (
          <div key={di} className={styles.availDay}>
            <div className={styles.availDate}>{day.date}</div>
            <div className={styles.availSlots}>
              {day.slots.map((slot, si) => {
                const key = `${di}-${si}`;
                const isSelected = data.selected === key;
                return (
                  <button
                    key={si}
                    className={`${styles.availSlot} ${isSelected ? styles.availSlotChosen : ""} ${!slot.available ? styles.availSlotTaken : ""}`}
                    onClick={() => slot.available && selectSlot(key)}
                    disabled={!slot.available || confirmed}
                  >
                    <span className={styles.availTime}>{slot.time}</span>
                    <span className={styles.availDur}>{slot.duration}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      {data.selected && selectedDay && selectedSlot && (
        <div className={styles.availConfirm}>
          <span style={{ color: confirmed ? "var(--success)" : "var(--ember)" }}>{confirmed ? "✓" : "◎"}</span>
          <span>
            {confirmed ? "Confirmed:" : "Selected:"} {selectedDay.date} at {selectedSlot.time}
          </span>
          {!confirmed && (
            <button className={styles.availConfirmBtn} onClick={() => setConfirmed(true)}>
              Confirm Booking
            </button>
          )}
        </div>
      )}
    </div>
  );
}
