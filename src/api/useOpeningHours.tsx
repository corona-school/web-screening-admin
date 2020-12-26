import { useState, useEffect } from 'react';
import axios from 'axios';
import { baseUrl, openingHoursPath } from './urls';
import { message } from 'antd';

export interface ITime {
  id: string;
  week: number;
  from: string;
  to: string;
}

const useOpeningHours = () => {
  const [openingHours, setOpeningHours] = useState<ITime[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(baseUrl + openingHoursPath)
      .then(({ data }) => {
        setLoading(false);
        setOpeningHours(data);
      })
      .catch((err) => {
        setLoading(false);
        console.log('Get Database Stats failed.', err);
      });
  }, []);

  const save = (newHours?: ITime[]) => {
    axios
      .post(baseUrl + openingHoursPath, newHours ? newHours : openingHours)
      .then(({ data }) => {
        message.success('Öffnungszeiten wurden erfolgreich gespeichert.');
        setLoading(false);
        setOpeningHours(data);
      })
      .catch((err) => {
        message.error('Öffnungszeiten konnten nicht gespeichert werden.');
        setLoading(false);
        console.log('Get Database Stats failed.', err);
      });
  };

  return { openingHours, loading, setOpeningHours, save };
};

export default useOpeningHours;
