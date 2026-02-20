export function formatDate(dateISO: string, locale = 'my-MM'): string {
  const date = new Date(dateISO);
  if (Number.isNaN(date.getTime())) {
    return 'မသိသောရက်စွဲ';
  }

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}
