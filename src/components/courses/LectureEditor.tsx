import { ApiAddLecture, Lecture, Subcourse } from '../../types/Course';
import React, { useState } from 'react';
import { Tag, Typography, DatePicker, Button, Select, InputNumber } from 'antd';
import { CloseOutlined, UndoOutlined, PlusOutlined } from '@ant-design/icons';
import moment, { Moment } from 'moment';
import locale from 'antd/lib/calendar/locale/de_DE';
import { Instructor } from '../../api/useInstructors';

const { Text } = Typography;

function lectureTimeToString(l: Lecture | ApiAddLecture) {
  const date = moment(l.start).format('DD.MM.YY');
  const startTime = moment(l.start).format('HH:mm');
  const endTime = moment(l.start).add(l.duration, 'minutes').format('HH:mm');

  return `${date} ${startTime} - ${endTime}`;
}

export default function LectureEditor({
  currentLectures,
  newLectures,
  setNewLectures,
  removeLectures,
  setRemoveLectures,
  subcourse,
  instructors,
}: {
  currentLectures: Lecture[];
  newLectures: ApiAddLecture[];
  setNewLectures(newLectures: ApiAddLecture[]): void;
  removeLectures: Lecture[];
  setRemoveLectures(oldLectures: Lecture[]): void;
  subcourse: Subcourse;
  instructors: Instructor[];
}) {
  const DisplayCurrentLecture = ({ lecture }: { lecture: Lecture }) => {
    const active = !removeLectures.includes(lecture);
    const lectureTime = lectureTimeToString(lecture);

    if (active) {
      return (
        <Tag>
          <Text>{lectureTime}</Text>
          <CloseOutlined
            onClick={() => setRemoveLectures([...removeLectures, lecture])}
          />
        </Tag>
      );
    } else {
      return (
        <Tag>
          <Text delete>{lectureTime}</Text>
          <UndoOutlined
            onClick={() =>
              setRemoveLectures(removeLectures.filter((l) => l !== lecture))
            }
          />
        </Tag>
      );
    }
  };

  const DisplayNewLecture = ({ lecture }: { lecture: ApiAddLecture }) => {
    const lectureTime = lectureTimeToString(lecture);

    const handleRemove = () => {
      setNewLectures(newLectures.filter((l) => l !== lecture));
    };

    return (
      <Tag>
        <Text>{lectureTime}</Text>
        <CloseOutlined onClick={handleRemove} />
      </Tag>
    );
  };

  const AddLecture = () => {
    const [start, setStart] = useState<Moment | null>(null);
    const [duration, setDuration] = useState<number>(0);
    const [instructor, setInstructor] = useState<{ id: number }>(
      instructors[0]
    );

    const onAddClicked = () => {
      start &&
        setNewLectures([
          ...newLectures,
          {
            subcourse: subcourse,
            start: start.toDate(),
            duration: duration,
            instructor: instructor,
          },
        ]);
    };

    return (
      <div>
        <div style={{ width: 'fit-content' }}>
          {'Beginn: '}
          <DatePicker
            format="DD.MM.YYYY HH:mm"
            showTime
            locale={locale}
            onChange={(value) => setStart(value)}
          />
          {' Dauer: '}
          <InputNumber
            min={0}
            value={duration}
            onChange={(v) => setDuration(v ?? 0)}
          />
          <Button icon={<PlusOutlined />} onClick={onAddClicked} />
        </div>
        {instructors.length > 1 && (
          <Select
            value={instructor.id}
            onChange={(value) => setInstructor({ id: value })}
            options={instructors.map((i) => ({
              label: `${i.firstname} ${i.lastname}`,
              value: i.id,
            }))}
            style={{ width: '340px', marginTop: '8px' }}
          />
        )}
      </div>
    );
  };

  return (
    <div>
      <div>
        {currentLectures.map((l) => (
          <DisplayCurrentLecture lecture={l} />
        ))}
        {newLectures.map((l) => (
          <DisplayNewLecture lecture={l} />
        ))}
      </div>
      <div style={{ marginTop: '16px' }}>
        <AddLecture />
      </div>
    </div>
  );
}
