"use client";

import styles from "./ListPane.module.css";

const CLIENTS = [
  { av: "MS", name: "Meridian Studio", owed: 2400, last: "2m", tasks: 3, status: "active" as const },
  { av: "NK", name: "Nora Kim", owed: 3200, last: "1h", tasks: 2, status: "active" as const },
  { av: "BF", name: "Bolt Fitness", owed: 4000, last: "3d", tasks: 2, status: "overdue" as const },
  { av: "LB", name: "Luna Boutique", owed: 0, last: "2h", tasks: 0, status: "lead" as const },
];

export default function ClientsPane() {
  return (
    <div>
      {CLIENTS.map((client, index) => (
        <div key={index} className={`${styles.row} ${client.status === "overdue" ? styles.rowOv : ""}`}>
          <div className={styles.rowMain}>
            <div className={`${styles.avXs} ${client.status === "overdue" ? styles.avOv : client.status === "lead" ? styles.avRdy : ""}`}>{client.av}</div>
            <div className={styles.rowInfo}><span className={styles.rowName}>{client.name}</span><span className={styles.rowMeta}>{client.owed > 0 ? `$${(client.owed / 1000).toFixed(1)}k owed` : "New lead"} &middot; {client.last}</span></div>
            <span className={`${styles.rowMono} ${styles.sm}`}>{client.tasks} tasks</span>
            <span className={`${styles.pill} ${client.status === "overdue" ? styles.overdue : client.status === "lead" ? styles.lead : styles.activeS}`}>{client.status}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
