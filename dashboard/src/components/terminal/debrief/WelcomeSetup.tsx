"use client";

import styles from "./debrief.module.css";

interface WelcomeSetupProps {
  onRunCommand: (cmd: string) => void;
}

const SETUP_STEPS = [
  {
    num: "01",
    title: "Add your first client",
    desc: "Create a client workspace with their name, rate, and project details. Everything in Felmark orbits around clients.",
    cmd: "/client new",
  },
  {
    num: "02",
    title: "Set your hourly rate",
    desc: "Your target rate is how Felmark measures your business health.",
    cmd: "/rate set 120",
  },
  {
    num: "03",
    title: "Connect payments",
    desc: "Link Stripe to send invoices and get paid directly through Felmark.",
    cmd: "/connect stripe",
  },
  {
    num: "04",
    title: "Explore the terminal",
    desc: "7 commands run your entire business. Type /help to see them all.",
    cmd: "/help",
  },
];

function markWelcomed() {
  if (typeof window !== "undefined") {
    localStorage.setItem("felmark_terminal_welcomed", "true");
  }
}

export default function WelcomeSetup({ onRunCommand }: WelcomeSetupProps) {
  const handleStepClick = (cmd: string) => {
    markWelcomed();
    onRunCommand(cmd);
  };

  return (
    <div className={styles.debrief}>
      <div className={styles.mark}>&#9670;</div>

      <div>
        <div className={styles.title}>Welcome to Felmark.</div>
        <div className={styles.subtitle}>Your freelance command center. Let&apos;s get you set up.</div>
      </div>

      <div className={styles.steps}>
        {SETUP_STEPS.map((step) => (
          <div key={step.num} className={styles.step}>
            <span className={styles.stepNum}>{step.num}</span>
            <div className={styles.stepBody}>
              <span className={styles.stepTitle}>{step.title}</span>
              <span className={styles.stepDesc}>{step.desc}</span>
              <button className={styles.stepCmd} onClick={() => handleStepClick(step.cmd)}>
                &rarr; {step.cmd}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.skipNote}>You can skip setup and explore on your own.</div>
    </div>
  );
}
