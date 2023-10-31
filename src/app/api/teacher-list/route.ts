import { getLocalData } from "@/util/json"
import { NextRequest } from "next/server";
import type { TeacherInfo } from "users"

export async function GET(req: NextRequest) {
  const params = new URLSearchParams(req.url?.split('?')[1]);
  const email = params.get('email');
  // TODO: read from database in the future
  
  const teacherInfos: Array<TeacherInfo> = await getLocalData('src/json/teachers.json');
  
  return new Response(JSON.stringify({teacherInfos: teacherInfos}), { status: 200 });
}