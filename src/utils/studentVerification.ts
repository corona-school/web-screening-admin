import {IStudent} from "../types/Student";

export default function VerifyStudent({ student, decision }: { student: IStudent, decision: boolean}) {
    if (student.screenings.tutor) student.screenings.tutor.verified = decision;
    if (student.screenings.instructor) student.screenings.instructor.verified = decision;
    if (student.screenings.projectCoach) student.screenings.projectCoach.verified = decision;
}