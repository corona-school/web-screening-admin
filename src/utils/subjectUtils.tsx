import { StudentSubject } from '../types/Student';

export const createSubjects = (rawSubject: string): StudentSubject[] => {
  const getSubject = (subject: string): string | null => {
    try {
      return subject.replace(/[0-9]+|:/g, '');
    } catch (err) {
      return null;
    }
  };

  const getValues = (subject: string | null): number[] => {
    try {
      const matchGroup = subject?.match(/[0-9]+:[0-9]+/g);
      if (matchGroup) {
        return matchGroup[0].split(':').map((s) => parseInt(s));
      }
      return [1, 13];
    } catch (err) {
      return [1, 13];
    }
  };

  try {
    return JSON.parse(rawSubject).map((s: any) => {
      if (getSubject(s)) {
        return {
          subject: getSubject(s),
          grade: {
            min: getValues(s)[0],
            max: getValues(s)[1],
          },
        };
      } else {
        return {
          subject: s.name,
          grade: {
            min: s.minGrade,
            max: s.maxGrade,
          },
        };
      }
    });
  } catch (err) {
    console.info('Cannot parse');
    return [];
  }
};

export const subjectToString = (subjects: StudentSubject[]) => {
  return JSON.stringify(
    subjects.map(
      (s: StudentSubject) => `${s.name}${s.grade.min}:${s.grade.max}`
    )
  );
};
