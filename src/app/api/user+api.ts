import { getGuestProfile } from '@/server/auth';

export async function GET() {
  return Response.json({ user: getGuestProfile() });
}
