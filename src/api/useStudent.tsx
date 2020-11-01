import {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import { baseUrl, studentInfoPath, studentManualVerification } from './urls';
import { message } from 'antd';
import { IStudent, IStudentInfo } from '../types/Student';
import {ApiContext} from "./ApiContext";

const useStudent = (email: string) => {
  const [studentInfo, setStudentInfo] = useState<IStudentInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const context = useContext(ApiContext);

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

  const save = (studentInfo: IStudentInfo) => {
    setLoading(true);
    console.log('request', baseUrl + studentManualVerification, {
      screeningResult: {...studentInfo, screenerMail: context?.user?.email},
      studentEmail: email,
    });

    axios
      .post(baseUrl + studentManualVerification, {
        screeningResult: {...studentInfo, screenerEmail: context?.user?.email},
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

  return { studentInfo, setStudentInfo, loading, save, reload };
};

export default useStudent;
