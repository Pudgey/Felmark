"use client";

import { useState } from "react";
import type { FlowBlockData } from "@/lib/types";
import styles from "./FlowBlock.module.css";

export function getDefaultFlow(): FlowBlockData {
  return {
    title: "Client Onboarding Process",
    nodes: [
      { id: "n1", label: "Inquiry", sub: "Day 0", desc: "Client fills out the contact form. We review fit and schedule a discovery call within 24 hours.", icon: "\u2709", color: "rgba(91, 127, 164, 0.15)" },
      { id: "n2", label: "Discovery", sub: "Day 1-2", desc: "30-minute call to understand goals, timeline, and budget. Send summary + proposal link after.", icon: "\u25CE", color: "rgba(124, 107, 158, 0.15)" },
      { id: "n3", label: "Proposal", sub: "Day 3", desc: "Custom proposal with scope, milestones, and pricing. Client signs and pays 50% deposit.", icon: "\u25C6", color: "rgba(176, 125, 79, 0.15)" },
      { id: "n4", label: "Kickoff", sub: "Day 5", desc: "Create workstation, share brand questionnaire, set up project timeline and first milestone.", icon: "\u25B6", color: "rgba(90, 154, 60, 0.15)" },
      { id: "n5", label: "Deliver", sub: "Ongoing", desc: "Work through milestones with weekly check-ins. Invoice remaining 50% on final delivery.", icon: "\u2726", color: "rgba(176, 125, 79, 0.15)" },
    ],
  };
}

export default function FlowBlock({ data, onChange: _onChange }: { data: FlowBlockData; onChange: (d: FlowBlockData) => void }) {
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const activeDetail = data.nodes.find(n => n.id === activeNode);

  return (
    <div className={styles.flow}>
      <div className={styles.flowHeader}>
        <div className={styles.flowIcon}>&#x25CE;</div>
        <span className={styles.flowLabel}>Process Flow</span>
        <span className={styles.blockMeta}>{data.nodes.length} steps</span>
      </div>
      <div className={styles.flowBody}>
        <div className={styles.flowTrack}>
          <div className={styles.flowConnector} />
          {data.nodes.map((node) => (
            <div
              key={node.id}
              className={`${styles.flowNode} ${activeNode === node.id ? styles.flowNodeActive : ""}`}
              onClick={() => setActiveNode(activeNode === node.id ? null : node.id)}
            >
              <div className={styles.flowNodeIcon} style={{ background: node.color }}>
                {node.icon}
              </div>
              <span className={styles.flowNodeLabel}>{node.label}</span>
              <span className={styles.flowNodeSub}>{node.sub}</span>
            </div>
          ))}
        </div>
        {activeDetail && (
          <div className={styles.flowDetail}>
            <div className={styles.flowDetailLabel}>{activeDetail.label} Details</div>
            {activeDetail.desc}
          </div>
        )}
      </div>
    </div>
  );
}

export { FlowBlock };
