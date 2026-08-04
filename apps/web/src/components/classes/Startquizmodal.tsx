import { useState } from "react";
import PixelModal from "../common/PixelModal";
import PixelButton from "../common/PixelButton";
import { createQuizSession } from "../../api/gameApi";
import type { ClassItem } from "../../types";

type Status = "idle" | "starting" | "started" | "error";

interface StartQuizModalProps {
  classItem?: ClassItem | null;
  onClose: () => void;
}

export default function StartQuizModal({ classItem, onClose }: StartQuizModalProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [session, setSession] = useState<any | null>(null);

  if (!classItem) return null;

  async function handleStart() {
    setStatus("starting");
    try {
        console.log("Starting quiz session for class ID:", classItem?.id);
      const res = await createQuizSession(classItem?.id);
      setSession(res.data);
      setStatus("started");
    } catch {
      setStatus("error");
    }
  }

  return (
    <PixelModal
      title={`Start Quiz — ${classItem.name}`}
      onClose={onClose}
      accent={status === "started" ? "leaf" : "gold"}
    >
      {status !== "started" && (
        <div className="space-y-4">
          <p className="font-body text-sm text-parchment-100">
            Start a live quiz session for{" "}
            <span className="text-gold-300">{classItem.name}</span>? Students
            in this class will be able to join once it's live.
          </p>

          {status === "error" && (
            <p className="font-body text-xs text-ember-400">
              Couldn't start the session. Try again.
            </p>
          )}

          <div className="flex justify-end gap-2">
            <PixelButton type="button" variant="ghost" onClick={onClose}>
              Cancel
            </PixelButton>
            <PixelButton
              type="button"
              variant="gold"
              onClick={handleStart}
              disabled={status === "starting"}
            >
              {status === "starting" ? "Starting…" : "Start session"}
            </PixelButton>
          </div>
        </div>
      )}

      {status === "started" && session && (
        <div className="space-y-4">
          <p className="font-body text-sm text-parchment-100">
            Session is live for{" "}
            <span className="text-leaf-400">{classItem.name}</span>.
          </p>

          {session.code ? (
            <div className="text-center py-4">
              <p className="font-pixel text-[8px] text-parchment-500 uppercase tracking-wider mb-2">
                Join Code
              </p>
              <p className="font-data text-3xl text-gold-300 tracking-widest">
                {session.code}
              </p>
            </div>
          ) : (
            <p className="font-data text-xs text-parchment-300">
              Session ID: {session.id}
            </p>
          )}

          <div className="flex justify-end">
            <PixelButton type="button" variant="leaf" onClick={onClose}>
              Done
            </PixelButton>
          </div>
        </div>
      )}
    </PixelModal>
  );
}