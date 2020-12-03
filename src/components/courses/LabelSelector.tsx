import { CourseCategory, CourseTag } from '../../types/Course';
import { Select } from 'antd';
import React from 'react';

const { Option } = Select;

export default function LabelSelector({
  category,
  tags,
  setTags,
  tagProposals,
}: {
  category: CourseCategory;
  tags: CourseTag[];
  setTags(tags: CourseTag[]): void;
  tagProposals: CourseTag[];
}) {
  const handleChange = (value: string[]) => {
    setTags(
      value.map(
        (n) =>
          tagProposals
            .filter((t) => t.category === category)
            .find((t) => t.identifier === n) ?? { name: n }
      )
    );
  };

  return (
    <Select
      mode="tags"
      value={tags.map((t) => t.identifier ?? t.name ?? '')}
      onChange={handleChange}
      style={{ width: '100%' }}
    >
      {tagProposals
        .filter((t) => t.category === category)
        .map((t) => (
          <Option value={t.identifier ?? t.name ?? ''}>{t.name ?? ''}</Option>
        ))}
    </Select>
  );
}
