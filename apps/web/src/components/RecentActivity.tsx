import PixelPanel from './PixelPanel';
import ActivityItem from './ActivityItem';
import type { ActivityEvent } from '../types/dashboard.types';

export default function RecentActivity({ events }: { events: ActivityEvent[] }) {
  return (
    <PixelPanel label="Jungle Log" accent="leaf">
      <div className="flex flex-col">
        {events.map((event) => (
          <ActivityItem key={event.id} event={event} />
        ))}
      </div>
    </PixelPanel>
  );
}