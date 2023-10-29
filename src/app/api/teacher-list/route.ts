import { getLocalData } from "@/util/json"
import { NextApiRequest } from "next";
import type { TeacherInfo } from "users"

export async function GET(req: NextApiRequest) {
  const params = new URLSearchParams(req.url?.split('?')[1]);
  const email = params.get('email');
  // TODO: read from database in the future
  
  const teacherInfos: Array<TeacherInfo> = await getLocalData('src/json/teachers.json');
  
  return new Response(JSON.stringify({teacherInfos: teacherInfos}), { status: 200 });
}