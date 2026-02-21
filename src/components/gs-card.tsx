import type { ReactNode } from 'react';
import { View } from 'react-native';

type GSCardProps = {
  children: ReactNode;
};

export function GSCard({ children }: GSCardProps) {
  return (
    <View className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
      {children}
    </View>
  );
}
