"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import type { ImageBlockData } from "@/lib/types";
import styles from "./ImageBlock.module.css";

interface ImageBlockProps {
  data: ImageBlockData;
  onChange: (data: ImageBlockData) => void;
}

export function getDefaultImageData(): ImageBlockData {
  return {
    src: "",
    alt: "",
    caption: "",
    fit: "contain",
  };
}

function humanizeFileName(name: string) {
  return name
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .trim();
}

function readAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("Could not read image data."));
    };
    reader.onerror = () => reject(reader.error ?? new Error("Could not read image data."));
    reader.readAsDataURL(file);
  });
}

export default function ImageBlock({ data, onChange }: ImageBlockProps) {
  const inputId = useId();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [urlDraft, setUrlDraft] = useState(data.src.startsWith("data:") ? "" : data.src);
  const [error, setError] = useState("");

  useEffect(() => {
    setUrlDraft(data.src.startsWith("data:") ? "" : data.src);
  }, [data.src]);

  const hasImage = Boolean(data.src);

  const updateData = (patch: Partial<ImageBlockData>) => {
    onChange({ ...data, ...patch });
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Choose an image file.");
      event.target.value = "";
      return;
    }

    try {
      const src = await readAsDataUrl(file);
      const inferredLabel = humanizeFileName(file.name);
      setError("");
      updateData({
        src,
        alt: data.alt || inferredLabel,
        caption: data.caption || inferredLabel,
      });
    } catch {
      setError("Could not read that image.");
    } finally {
      event.target.value = "";
    }
  };

  const applyUrl = () => {
    const nextUrl = urlDraft.trim();
    if (!nextUrl) {
      setError("Paste an image URL or upload a file.");
      return;
    }

    setError("");
    updateData({
      src: nextUrl,
      alt: data.alt || "Image description",
    });
  };

  const clearImage = () => {
    setError("");
    setUrlDraft("");
    updateData({ src: "", alt: "", caption: "" });
  };

  return (
    <div className={styles.block}>
      <input
        ref={fileInputRef}
        className={styles.hiddenInput}
        id={inputId}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />

      {hasImage ? (
        <figure className={styles.figure}>
          <div className={styles.previewShell}>
            {/* eslint-disable-next-line @next/next/no-img-element -- user-provided URL or uploaded data URL */}
            <img
              className={data.fit === "cover" ? styles.imageCover : styles.imageContain}
              src={data.src}
              alt={data.alt || data.caption || "Uploaded image"}
            />
          </div>

          <div className={styles.toolbar}>
            <div className={styles.toolbarGroup}>
              <button className={styles.actionBtn} onClick={() => fileInputRef.current?.click()} type="button">
                Replace
              </button>
              <button className={styles.actionBtn} onClick={clearImage} type="button">
                Remove
              </button>
            </div>

            <div className={styles.toolbarGroup}>
              <button
                className={`${styles.toggleBtn} ${data.fit === "contain" ? styles.toggleBtnOn : ""}`}
                onClick={() => updateData({ fit: "contain" })}
                type="button"
              >
                Contain
              </button>
              <button
                className={`${styles.toggleBtn} ${data.fit === "cover" ? styles.toggleBtnOn : ""}`}
                onClick={() => updateData({ fit: "cover" })}
                type="button"
              >
                Cover
              </button>
            </div>
          </div>

          <div className={styles.fields}>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>Caption</span>
              <input
                className={styles.input}
                value={data.caption}
                onChange={(event) => updateData({ caption: event.target.value })}
                placeholder="Add a short caption"
              />
            </label>

            <label className={styles.field}>
              <span className={styles.fieldLabel}>Alt text</span>
              <input
                className={styles.input}
                value={data.alt}
                onChange={(event) => updateData({ alt: event.target.value })}
                placeholder="Describe the image"
              />
            </label>
          </div>
        </figure>
      ) : (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>▣</div>
          <div className={styles.emptyCopy}>
            <div className={styles.emptyTitle}>Add an image</div>
            <div className={styles.emptyText}>Upload from your device or paste a direct image URL.</div>
          </div>

          <div className={styles.emptyActions}>
            <button className={styles.primaryBtn} onClick={() => fileInputRef.current?.click()} type="button">
              Upload image
            </button>

            <div className={styles.urlRow}>
              <input
                className={styles.input}
                value={urlDraft}
                onChange={(event) => setUrlDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    applyUrl();
                  }
                }}
                placeholder="https://example.com/image.jpg"
              />
              <button className={styles.secondaryBtn} onClick={applyUrl} type="button">
                Use URL
              </button>
            </div>
          </div>

          {error ? <div className={styles.error}>{error}</div> : null}
        </div>
      )}
    </div>
  );
}

export { ImageBlock };
