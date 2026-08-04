import { useEffect, useState } from "react";
import { getClasses } from "../../api/classesApi";
import PixelPanel from "../common/PixelPanel";
import ClassCard from "./ClassCard";
import type { ClassItem } from "../../types";

type Status = "loading" | "ready" | "error";

interface ClassOverviewProps {
  onSelectClass?: (classItem: ClassItem) => void;
}

export default function ClassOverview({ onSelectClass }: ClassOverviewProps) {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    let cancelled = false;

    getClasses()
      .then((res) => {
        if (!cancelled) {
          setClasses(res.data);
          setStatus("ready");
        }
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section>
      <h2 className="font-pixel text-[11px] text-parchment-100 uppercase tracking-wider mb-4">
        Your Classes
      </h2>

      {status === "loading" && (
        <PixelPanel>
          <p className="font-body text-sm text-parchment-300">Loading classes…</p>
        </PixelPanel>
      )}

      {status === "error" && (
        <PixelPanel accent="ember">
          <p className="font-body text-sm text-parchment-100">
            Couldn't load your classes. Check your connection and try again.
          </p>
        </PixelPanel>
      )}

      {status === "ready" && classes.length === 0 && (
        <PixelPanel accent="gold">
          <p className="font-body text-sm text-parchment-100">
            No classes yet — create one to get started.
          </p>
        </PixelPanel>
      )}

      {status === "ready" && classes.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map((classItem) => (
            <ClassCard
              key={classItem.id}
              classItem={classItem}
              onSelect={onSelectClass}
            />
          ))}
        </div>
      )}
    </section>
  );
}