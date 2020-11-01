import React from 'react';
import { Button } from 'antd';
import { pure } from 'recompose';
import { SchoolSubjects } from './data';
import SubjectItem from './SubjectItem';
import { StudentSubject } from '../../types/Student';

interface Props {
  subjects: StudentSubject[];
  setSubjects: (subjects: StudentSubject[]) => void;
}

const SubjectList = ({ subjects, setSubjects }: Props) => {
  const changeSubject = (oldSubject: StudentSubject, newSubject: string) => {
    const subjectList: StudentSubject[] = subjects.map((s) => {
      if (s.name === oldSubject.name) {
        return {
          name: newSubject,
          grade: oldSubject.grade,
        };
      }
      return s;
    });

    setSubjects(subjectList);
  };

  const changeSubjectRange = (
    obj: StudentSubject,
    [min, max]: [number, number]
  ) => {
    const subjectList = subjects.map((s) => {
      if (s.name === obj.name) {
        return { ...obj, grade: { min, max } };
      }
      return s;
    });
    console.log(min, max, obj, subjectList);

    setSubjects(subjectList);
  };

  const addSubject = () => {
    const remainingSubject = SchoolSubjects.find(
      (n) => !subjects.find((i) => i.name === n)
    );
    if (remainingSubject) {
      setSubjects([
        ...subjects,
        { name: remainingSubject, grade: { min: 1, max: 13 } },
      ]);
    }
  };

  const removeSubject = (obj: StudentSubject) => {
    const newList = subjects.filter((s) => obj.name !== s.name);
    setSubjects([...newList]);
  };

  return (
    <div>
      {subjects.map((obj, index) => (
        <SubjectItem
          key={obj.name + '-' + index}
          changeSubjectRange={changeSubjectRange}
          changeSubject={changeSubject}
          subject={obj}
          removeSubject={removeSubject}
          options={SchoolSubjects.filter(
            (n) => !subjects.find((i) => i.name === n)
          )}
        />
      ))}
      <Button
        type="dashed"
        style={{ margin: '8px 0 0px 0' }}
        onClick={addSubject}
      >
        add
      </Button>
    </div>
  );
};

export default pure(SubjectList);
