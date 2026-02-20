import { useMemo } from 'react';

import { getChapters, getLearningEvents } from '@/server/db';

export function useAppState() {
  const chapters = useMemo(() => getChapters(), []);
  const events = useMemo(() => getLearningEvents(), []);

  return {
    chapters,
    events,
    streakDays: 3,
  };
}
