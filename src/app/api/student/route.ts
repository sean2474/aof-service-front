import { getLocalData } from "@/util/json"
import { NextRequest } from "next/server";
import type { Student } from "users"

export async function GET(req: NextRequest) {
  const params = new URLSearchParams(req.url?.split('?')[1]);
  const email = params.get('email');
  // TODO: read from database in the future
  
  const student: Student = await getLocalData('src/json/studentDataExample.json');

  return new Response(JSON.stringify({student: student}), { status: 200 });
}