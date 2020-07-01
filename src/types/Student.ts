export interface Student {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  verified?: boolean;
  subjects: string;
  phone?: string;
  msg: string;
  feedback?: string;
  isStudent: boolean;
  module?: TeacherModule;
}

export interface SearchStudent {
  firstname: string;
  lastname: string;
  email: string;
}

export interface IRawStudent2 {
  firstname: string;
  lastname: string;
  email: string;
  subjects: string;
  msg?: string;
  verified: boolean;
  alreadyScreened: boolean;
}

export interface IRawStudent {
  firstName: string;
  lastName: string;
  email: string;
  subjects: string;
  msg?: string;
  verified: boolean;
  alreadyScreened: boolean;
  phone?: string;
  birthday?: Date;
}

export enum ScreeningStatus {
  Unscreened = "UNSCREENED",
  Accepted = "ACCEPTED",
  Rejected = "REJECTED",
}

export interface ApiScreeningResult {
  verified: boolean;
  phone?: string;
  commentScreener?: string;
  knowscsfrom?: string;
  subjects?: string;
  feedback?: string;
  isStudent: boolean;
}

export interface Screening {
    id: number;
    success: boolean; //verified or not verified
    comment: string;
    knowsCoronaSchoolFrom: string;
    createdAt: Date;
    updatedAt: Date;
    screener?: any;
    student?: Student;
}

export enum TeacherModule {
  INTERNSHIP = "internship",
  SEMINAR = "seminar"
}