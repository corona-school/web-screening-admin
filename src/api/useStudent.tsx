import { useState, useEffect } from 'react';
import axios from 'axios';
import { baseUrl, studentInfoPath, studentManualVerification } from './urls';
import { message } from 'antd';
import { ISubject } from './ApiContext';

export interface IStudentInfo {
  firstname: string;
  lastname: string;
  email: string;
  subjects: string;
  phone?: string;
  msg?: string;
  verified?: boolean;
}

export interface IStudentScreeningResult {
  verified: boolean;
  birthday?: Date;
  commentScreener?: string;
  knowscsfrom?: string;
  subjects?: string;
  feedback?: string;
  screenerEmail: string;
}
export interface IStudentScreeningResult2 {
  verified: boolean;
  birthday?: Date;
  commentScreener?: string;
  knowscsfrom?: string;
  subjects?: ISubject[];
  feedback?: string;
  screenerEmail: string;
}

const useStudent = (email: string) => {
  const [studentInfo, setStudentInfo] = useState<IStudentInfo | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get(baseUrl + studentInfoPath, { params: { email } })
      .then(({ data }) => {
        setLoading(false);
        setStudentInfo(data);
      })
      .catch((err) => {
        setLoading(false);
        console.log('Get Database Stats failed.', err);
      });
  }, [email]);

  const reload = () => {
    setLoading(true);
    axios
      .get(baseUrl + studentInfoPath, { params: { email } })
      .then(({ data }) => {
        setLoading(false);
        setStudentInfo(data);
      })
      .catch((err) => {
        setLoading(false);
        console.log('Get Database Stats failed.', err);
      });
  };

  const save = (screeningResult: IStudentScreeningResult) => {
    setLoading(true);
    console.log('request', baseUrl + studentManualVerification, {
      screeningResult,
      studentEmail: email,
    });

    axios
      .post(baseUrl + studentManualVerification, {
        screeningResult,
        studentEmail: email,
      })
      .then(({ data }) => {
        message.success('Student wurden erfolgreich manuel verifiziert.');
        setLoading(false);
        reload();
      })
      .catch((err) => {
        message.error('Student konnten nicht manuel verifiziert werden.');
        setLoading(false);
      });
  };

  return { studentInfo, loading, save, reload };
};

export default useStudent;
