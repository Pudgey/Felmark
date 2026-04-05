"use client";

import { useMemo } from "react";
import { useTerminalContext } from "../../TerminalProvider";
import { THEMES } from "@/lib/themes";
import styles from "./previews.module.css";

interface CommandPreviewProps {
  command: string;
}

export default function CommandPreview({ command }: CommandPreviewProps) {
  const { workstations } = useTerminalContext();

  const content = useMemo(() => {
    switch (command) {
      case "status": {
        const projectCount = workstations.reduce((sum, ws) => sum + ws.projects.length, 0);
        const statuses = new Map<string, number>();
        for (const ws of workstations) {
          for (const p of ws.projects) {
            statuses.set(p.status, (statuses.get(p.status) || 0) + 1);
          }
        }
        return (
          <div>
            <div className={styles.previewTitle}>Project Status</div>
            <div className={styles.previewCard}>
              <div className={styles.previewValue}>{projectCount}</div>
              <div className={styles.previewMeta}>total projects</div>
            </div>
            {Array.from(statuses.entries()).map(([status, count]) => (
              <div key={status} className={styles.previewRow}>
                <span className={styles.previewMeta}>{status}</span>
                <span className={styles.previewValue} style={{ fontSize: 16 }}>
                  {count}
                </span>
              </div>
            ))}
          </div>
        );
      }

      case "rate":
        return (
          <div>
            <div className={styles.previewTitle}>Rate Calculator</div>
            <div className={styles.previewCard}>
              <div className={styles.previewMeta}>
                Calculate hourly, daily, and monthly rates based on your target income and work schedule.
              </div>
            </div>
            <div className={styles.previewCard}>
              <div className={styles.previewMeta}>Usage: /rate &lt;hourly&gt;</div>
            </div>
          </div>
        );

      case "pipeline": {
        const stages = new Map<string, number>();
        for (const ws of workstations) {
          for (const p of ws.projects) {
            stages.set(p.status, (stages.get(p.status) || 0) + 1);
          }
        }
        return (
          <div>
            <div className={styles.previewTitle}>Pipeline Summary</div>
            {Array.from(stages.entries()).map(([stage, count]) => (
              <div key={stage} className={styles.previewCard}>
                <div className={styles.previewMeta}>{stage}</div>
                <div className={styles.previewValue}>{count}</div>
              </div>
            ))}
            {stages.size === 0 && (
              <div className={styles.previewCard}>
                <div className={styles.previewMeta}>No projects in pipeline</div>
              </div>
            )}
          </div>
        );
      }

      case "client":
        return (
          <div>
            <div className={styles.previewTitle}>Clients</div>
            {workstations.map((ws) => (
              <div key={ws.id} className={styles.previewCard}>
                <div className={styles.previewMeta}>{ws.client}</div>
                <div className={styles.previewValue} style={{ fontSize: 16 }}>
                  {ws.projects.length} project{ws.projects.length !== 1 ? "s" : ""}
                </div>
              </div>
            ))}
            {workstations.length === 0 && (
              <div className={styles.previewCard}>
                <div className={styles.previewMeta}>No clients yet</div>
              </div>
            )}
          </div>
        );

      case "wire":
        return (
          <div>
            <div className={styles.previewTitle}>Wire</div>
            <div className={styles.previewCard}>
              <div className={styles.previewMeta}>
                Market intelligence & competitive signals. Surface trends, industry news, and actionable insights for
                your freelance business.
              </div>
            </div>
          </div>
        );

      case "theme": {
        const themeList = Object.values(THEMES);
        return (
          <div>
            <div className={styles.previewTitle}>Themes</div>
            <div className={styles.swatchGrid}>
              {themeList.map((t) => (
                <div key={t.id} className={styles.swatchItem}>
                  <div className={styles.themeSwatch} style={{ background: t.accent }} title={t.name} />
                  <span className={styles.previewMeta}>{t.name}</span>
                </div>
              ))}
            </div>
          </div>
        );
      }

      case "clear":
        return (
          <div>
            <div className={styles.previewTitle}>Clear</div>
            <div className={styles.previewCard}>
              <div className={styles.previewMeta}>Clears terminal history and resets the view.</div>
            </div>
          </div>
        );

      default:
        return (
          <div>
            <div className={styles.previewTitle}>/{command}</div>
            <div className={styles.previewCard}>
              <div className={styles.previewMeta}>No preview available for this command.</div>
            </div>
          </div>
        );
    }
  }, [command, workstations]);

  return <div style={{ padding: "14px 0" }}>{content}</div>;
}
