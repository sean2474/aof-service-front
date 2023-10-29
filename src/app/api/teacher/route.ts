import { getLocalData } from "@/util/json"
import { NextApiRequest } from "next";
import type { Teacher } from "users"

export async function GET(req: NextApiRequest) {
  const params = new URLSearchParams(req.url?.split('?')[1]);
  const email = params.get('email');
  
  // Fetch the teacher data
  let data: any = await getLocalData('src/json/teacherDataExample.json');

  // Adjust the data to map service_hour_id to id
  if (data && data.students) {
    data.students = data.students.map((student: any) => {
      if (student.serviceHours) {
        student.serviceHours = student.serviceHours.map((serviceHour: any) => {
          return {
            ...serviceHour,
            id: serviceHour.serviceHourId,
            serviceHourId: undefined
          };
        });
      }
      return student;
    });
  }
  
  let teacher: Teacher = data;

  return new Response(JSON.stringify({teacher: teacher}), { status: 200 });
}
