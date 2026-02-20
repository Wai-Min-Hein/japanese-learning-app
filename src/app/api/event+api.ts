import { getLearningEvents } from '@/server/db';

export async function GET() {
  return Response.json({ events: getLearningEvents() });
}
