import { useEffect, useState } from "react";
import { getPerformanceTrend, getStudentPerformance } from "../../api/studentsApi";
import PixelPanel from "../common/PixelPanel";
import PerformanceChart from "./PerformanceChart";
import StudentTable from "./StudentTable";
import type { Student, TrendPoint } from "../../types";

type Status = "loading" | "ready" | "error";

interface PerformanceOverviewProps {
  classId?: string;
}

export default function PerformanceOverview({ classId }: PerformanceOverviewProps) {
  const [trend, setTrend] = useState<TrendPoint[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");

    Promise.all([
      getPerformanceTrend(classId ? { classId } : {}),
      getStudentPerformance(classId ? { classId } : {}),
    ])
      .then(([trendRes, studentRes]) => {
        if (!cancelled) {
          setTrend(trendRes.data);
          setStudents(studentRes.data);
          setStatus("ready");
        }
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [classId]);

  if (status === "loading") {
    return (
      <PixelPanel>
        <p className="font-body text-sm text-parchment-300">Loading performance data…</p>
      </PixelPanel>
    );
  }

  if (status === "error") {
    return (
      <PixelPanel accent="ember">
        <p className="font-body text-sm text-parchment-100">
          Couldn't load performance analytics. Try again shortly.
        </p>
      </PixelPanel>
    );
  }

  return (
    <section className="space-y-4">
      <h2 className="font-pixel text-[11px] text-parchment-100 uppercase tracking-wider">
        Student Performance
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PerformanceChart data={trend} />
        <StudentTable students={students} />
      </div>
    </section>
  );
}