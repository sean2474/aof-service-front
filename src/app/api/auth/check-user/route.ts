import { getLocalData } from "@/util/json"
import type { TeacherInfo } from "users"

export async function POST(request: Request) {
  const { email } = await request.json();
  const teacherList: Array<TeacherInfo> = await getLocalData('src/json/teachers.json');

  const teacher = teacherList.find(teacher => teacher.email === email);
  if (teacher!==undefined) return new Response(JSON.stringify({message: 'teacher'}), { status: 200 });
  else return new Response(JSON.stringify({message: 'student'}), { status: 200 });
}