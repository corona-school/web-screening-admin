import React from 'react';
import { Select, Button, Input, InputNumber } from 'antd';
import { pure } from 'recompose';
import { CloseOutlined } from '@ant-design/icons';
import { StudentSubject } from '../../types/Student';

const { Option } = Select;
interface Props {
  subject: StudentSubject;
  changeSubjectRange: (
    subject: StudentSubject,
    [min, max]: [number, number]
  ) => void;
  changeSubject: (subject: StudentSubject, newSubject: string) => void;
  options: string[];
  removeSubject: (subject: StudentSubject) => void;
}
const SubjectItem = ({
  subject,
  changeSubjectRange,
  changeSubject,
  options,
  removeSubject,
}: Props) => {
  return (
    <div
      key={subject.name}
      style={{ display: 'flex', width: '100%', marginTop: '8px' }}
    >
      <Input.Group compact>
        <Select
          key={`${subject.name}-input`}
          onChange={(value) => changeSubject(subject, value)}
          defaultValue={subject.name}
          style={{ width: 120 }}
        >
          {options.map((schoolSubject) => {
            return (
              <Option key={schoolSubject} value={schoolSubject}>
                {schoolSubject}
              </Option>
            );
          })}
        </Select>
        <InputNumber
          key={`${subject.name}-min`}
          style={{
            width: 60,
            marginLeft: '8px',
            textAlign: 'center',
          }}
          value={subject.grade.min}
          max={subject.grade.max + 1}
          min={1}
          placeholder="Minimum"
          onChange={(v) => {
            if (v) {
              changeSubjectRange(subject, [v, subject.grade.max]);
            }
          }}
        />
        <Input
          className="site-input-split"
          style={{
            width: 30,
            borderLeft: 0,
            borderRight: 0,
            zIndex: 2,
            pointerEvents: 'none',
          }}
          placeholder="~"
          disabled
        />
        <InputNumber
          key={`${subject.name}-max`}
          className="site-input-right"
          value={subject.grade.max}
          min={subject.grade.min + 1}
          max={13}
          onChange={(v) => {
            if (v) {
              changeSubjectRange(subject, [subject.grade.min, v]);
            }
          }}
          style={{
            width: 60,
            textAlign: 'center',
          }}
          placeholder="Maximum"
        />
      </Input.Group>

      <Button
        icon={<CloseOutlined />}
        style={{ margin: 0, width: '40px' }}
        onClick={() => removeSubject(subject)}
      />
    </div>
  );
};

export default pure(SubjectItem);
