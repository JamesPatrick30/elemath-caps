import { useState } from "react";
import PixelModal from "../common/PixelModal";
import PixelButton from "../common/PixelButton";
import { createQuizSession, getGameSession } from "../../api/gameApi";
import type { ClassItem } from "../../types";
import type { createQuizSessionResponse } from "@repo/types";
type Status = "idle" | "starting" | "started" | "error";

interface StartQuizModalProps {
  classItem: ClassItem;
  onClose: () => void;
  onEnterLobby: (session: createQuizSessionResponse) => void;
}

export default function StartQuizModal({
  classItem,
  onClose,
  onEnterLobby,
}: StartQuizModalProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [session, setSession] = useState<createQuizSessionResponse | null>(null);

  async function handleStart() {
    setStatus("starting");
    try {
      // POST /game/create returns no body (CreateQuizSession resolves
      // void) — fetch the actual session afterward.
      const session = await createQuizSession(classItem.id);
      setSession(session.data);
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


          <div className="flex justify-end">
            <PixelButton
              type="button"
              variant="leaf"
              onClick={() => onEnterLobby(session)}
            >
              Enter Lobby
            </PixelButton>
          </div>
        </div>
      )}
    </PixelModal>
  );
}