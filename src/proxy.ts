import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Refreshes the Supabase session cookie before page and API requests continue. */
export async function proxy(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  await supabase.auth.getSession();

  return res;
}

export const config = {
  matcher: "/((?!_next/image|_next/static|favicon.ico).*)",
};
