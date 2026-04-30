'use client';
import { useState } from 'react';

export type TabHome = 'rf' | 'rnf';

export function useHomeScreen() {
  const [tab, setTab] = useState<TabHome>('rf');
  return { tab, setTab };
}
