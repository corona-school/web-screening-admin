import { IStudent, ScreeningInfo } from '../types/Student';
import { IJobInfo } from '../api';

export function VerifyStudent({
  student,
  decision,
}: {
  student: IStudent;
  decision: boolean;
}) {
  if (student.screenings.tutor) student.screenings.tutor.verified = decision;
  if (student.screenings.instructor)
    student.screenings.instructor.verified = decision;
  if (student.screenings.projectCoach)
    student.screenings.projectCoach.verified = decision;
}

export function CompleteJob({
  job,
  screening,
  screeningTypes,
}: {
  job: IJobInfo;
  screening: ScreeningInfo;
  screeningTypes: string[];
}): IJobInfo {
  return {
    ...job,
    data: {
      ...job.data,
      screenings: {
        tutor: screeningTypes.includes('tutor')
          ? screening
          : job.data.screenings.tutor,
        instructor: screeningTypes.includes('instructor')
          ? screening
          : job.data.screenings.instructor,
        projectCoach: screeningTypes.includes('projectCoach')
          ? screening
          : job.data.screenings.projectCoach,
      },
    },
  };
}

export function CleanScreenings(student: IStudent) {
  if (!student.isTutor) student.screenings.tutor = undefined;
  if (!student.isInstructor) student.screenings.instructor = undefined;
  if (!student.isProjectCoach) student.screenings.projectCoach = undefined;
}
