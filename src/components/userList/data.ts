import { IJobInfo } from '../../api';

export const SchoolSubjects = [
  'Mathematik',
  'Informatik',
  'Physik',
  'Chemie',
  'Sachkunde',
  'Politik',
  'Wirtschaft',
  'Geschichte',
  'Erdkunde',
  'Biologie',
  'Kunst',
  'Philosophie',
  'Religion',
  'Deutsch',
  'Englisch',
  'Latein',
  'Französisch',
  'Spanisch',
  'Italienisch',
  'Chinesisch',
  'Deutsch als Zweitsprache',
];

export const SchoolClasses = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

export const Keys = [1, 2, 3, 4, 5];

export const TabMap = new Map([
  [1, 'Alles'],
  [2, 'In der Warteschlange'],
  [3, 'Im Video-Call'],
  [4, 'Freigeschaltet'],
  [5, 'Abgelehnt'],
]);

export const KeyMap = new Map([
  [1, 'All'],
  [2, 'Waiting'],
  [3, 'Active'],
  [4, 'Completed'],
  [5, 'Rejected'],
]);

export const StatusMap = new Map([
  ['waiting', 'orange'],
  ['active', 'geekblue'],
  ['completed', 'green'],
  ['rejected', 'red'],
]);
export const getScreeningType = (j: IJobInfo) => {
  const screenings = [];

  switch (j.status) {
    case 'waiting':
    case 'active':
      if (j.data.isInstructor && j.data.screenings.instructor === undefined) {
        screenings.push(j.data.official ? 'intern' : 'instructor');
      }
      if (j.data.isTutor && j.data.screenings.tutor === undefined) {
        screenings.push('tutor');
      }
      if (
        j.data.isProjectCoach &&
        j.data.screenings.projectCoach === undefined
      ) {
        screenings.push('projectCoach');
      }
      return screenings;
    case 'completed':
    case 'rejected':
      if (j.data.isInstructor) {
        screenings.push(j.data.official ? 'intern' : 'instructor');
      }
      if (j.data.isTutor) {
        screenings.push('tutor');
      }
      if (j.data.isProjectCoach) {
        screenings.push('projectCoach');
      }
      return screenings;
  }
};
export const ScreeningTypeText = new Map([
  ['instructor', 'Kursleiter*in'],
  ['intern', 'Praktikant*in'],
  ['projectCoach', 'JuFo'],
  ['tutor', 'Tutor*in'],
]);

export const ScreeningColorMap = new Map([
  ['instructor', 'orange'],
  ['intern', 'magenta'],
  ['projectCoach', 'geekblue'],
  ['tutor', 'green'],
]);
export const tagColors = [
  'magenta',
  'red',
  'volcano',
  'orange',
  'gold',
  'lime',
  'green',
  'cyan',
  'blue',
  'geekblue',
  'purple',
];

export const SubjectsMap = new Map(
  SchoolSubjects.map((subject, index) => [
    subject,
    tagColors[index % tagColors.length],
  ])
);

export const knowsFromMap = new Map([
  ['Bekannte', 'Über Bekannte/Familie'],
  ['Empfehlung', 'Über eine Empfehlung'],
  ['Schule', 'Über Lehrer/Schule'],
  ['Universität', 'Über die Universität'],
  ['Pressebericht', 'Über einen Pressebericht'],
  ['Radiobeitrag', 'Über einen Radiobeitrag'],
  ['Fernsehbeitrag', 'Über einen Fernsehbeitrag'],
  ['Facebook', 'Über Facebook'],
  ['Instagram', 'Über Instagram'],
  ['TikTok', 'Über TikTok'],
  ['Suchmaschine', 'Über eine Suchmaschinen-Suche'],
  ['Werbeanzeige', 'Über eine Werbeanzeige'],
  ['13', 'anders'],
]);

export const ProjectFields = [
  'Arbeitswelt',
  'Biologie',
  'Chemie',
  'Geo-und-Raumwissenschaften',
  'Mathematik/Informatik',
  'Physik',
  'Technik',
];
