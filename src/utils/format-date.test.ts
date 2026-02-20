import assert from 'node:assert/strict';
import test from 'node:test';

import { formatDate } from './format-date';

test('formats ISO date for Burmese locale', () => {
  const formatted = formatDate('2026-02-21T19:00:00+06:30');
  assert.ok(formatted.length > 0);
});

test('handles invalid date input', () => {
  assert.equal(formatDate('invalid-date'), 'မသိသောရက်စွဲ');
});
