export interface CourseStudent {
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
  state?: State;
  university?: string;
  module?: TeacherModule;
  moduleHours?: number;
}

export interface SearchStudent {
  firstname: string;
  lastname: string;
  email: string;
}

export enum ScreeningStatus {
  Unscreened = 'UNSCREENED',
  Accepted = 'ACCEPTED',
  Rejected = 'REJECTED',
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
  student?: CourseStudent;
}

export interface IStudentInfo {
  firstname: string;
  lastname: string;
  email: string;
  subjects: string;
  phone?: string;
  msg?: string;
  verified?: boolean;
}

export interface IStudent {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  isTutor: boolean;
  isInstructor: boolean;
  isProjectCoach: boolean;
  screenings: {
    tutor?: ScreeningInfo;
    instructor?: ScreeningInfo;
    projectCoach?: ScreeningInfo;
  };
  projectFields: ProjectFieldWithGradeInfoType[];
  subjects: StudentSubject[];
  feedback?: string;
  phone?: string;
  newsletter: boolean;
  msg?: string;
  university?: string;
  state?: string;
  isUniversityStudent?: boolean;
  official?: {
    hours: number;
    module: string;
  };
  screenerEmail: string;
  jitsi: string;
}

export interface ProjectFieldWithGradeInfoType {
  name: string;
  min?: number;
  max?: number;
}

export interface StudentSubject {
  name: string;
  grade: {
    min: number;
    max: number;
  };
}

export interface ScreeningInfo {
  verified: boolean;
  comment?: string;
  knowsCoronaSchoolFrom?: string;
}

export enum TeacherModule {
  INTERNSHIP = 'internship',
  SEMINAR = 'seminar',
}

export const TeacherModulePretty: { [key in TeacherModule]: string } = {
  internship: 'Praktikum',
  seminar: 'Seminar',
};

export enum State {
  BW = 'bw',
  BY = 'by',
  BE = 'be',
  BB = 'bb',
  HB = 'hb',
  HH = 'hh',
  HE = 'he',
  MV = 'mv',
  NI = 'ni',
  NW = 'nw',
  RP = 'rp',
  SL = 'sl',
  SN = 'sn',
  ST = 'st',
  SH = 'sh',
  TH = 'th',
  OTHER = 'other',
}

export const StateLong: { [key in State]: string } = {
  bw: 'Baden-Württemberg',
  by: 'Bayern',
  be: 'Berlin',
  bb: 'Brandenburg',
  hb: 'Bremen',
  hh: 'Hamburg',
  he: 'Hessen',
  mv: 'Mecklenburg-Vorpommern',
  ni: 'Niedersachsen',
  nw: 'Nordrhein-Westfalen',
  rp: 'Rheinland-Pfalz',
  sl: 'Saarland',
  sn: 'Sachsen',
  st: 'Sachsen-Anhalt',
  sh: 'Schleswig-Holstein',
  th: 'Thüringen',
  other: 'Sonstiges',
};
