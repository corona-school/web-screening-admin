/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import {
  Button,
  Tabs,
  Table,
  Tag,
  Space,
  Card,
  Descriptions,
  Input,
  Dropdown,
  Menu,
  Select,
} from 'antd';
import Title from 'antd/lib/typography/Title';
import {
  ArrowLeftOutlined,
  FileTextOutlined,
  CalendarOutlined,
  UserOutlined,
  EditOutlined,
  DownOutlined,
  TagOutlined,
  ReloadOutlined,
} from '@ant-design/icons/lib';

import './Courses.less';
import {
  CourseState,
  Course,
  ApiCourseUpdate,
  CourseCategory,
  CourseTag,
  Lecture,
  ApiAddLecture,
} from '../../types/Course';

import useCourses from '../../api/useCourses';
import { Instructor } from '../../api/useInstructors';
import { CourseStudent } from '../../types/Student';
import useDebounce from '../../utils/useDebounce';

import InstructorSelector from './InstructorSelector';
import moment from 'moment';
import LectureEditor from './LectureEditor';
import LabelSelector from './LabelSelector';
import { Pagination } from '../navigation/Pagination';
import Search from 'antd/lib/transfer/search';

const { TextArea } = Input;
const { Option } = Select;

const courseStates: { [key in CourseState]: string } = {
  submitted: 'Prüfen',
  allowed: 'Angenommen',
  created: 'Erstellt',
  denied: 'Abgelehnt',
  cancelled: 'Gecancelled',
};

const categoryName: { [key in CourseCategory]: string } = {
  club: 'AG',
  revision: 'Repetitorium',
  coaching: 'Lern-Coaching',
};

const Courses = () => {
  const [courseState, setCourseState] = useState<CourseState>(
    CourseState.SUBMITTED
  );
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);
  const [page, setPage] = useState(0);

  const [editCourse, setEditCourse] = useState<Course | null>(null);

  const {
    courses,
    courseTags,
    loadCourses,
    loading,
    loadCourseTags,
    updateCourse: _updateCourse,
  } = useCourses({
    initial: CourseState.SUBMITTED,
  });

  const [hasLocalChanges, setHasLocalChanges] = useState(false);

  async function updateCourse(course: Course, update: ApiCourseUpdate) {
    setHasLocalChanges(true);
    await _updateCourse(course, update);
  }

  async function update() {
    /* do not reload table if course is edited at the moment */
    if (editCourse) return;
    await loadCourses({ courseState, search: debouncedSearch, page });
    await loadCourseTags();
    setHasLocalChanges(false);
  }

  useEffect(() => {
    update();

    /* refresh every 10 seconds, unless the user navigates, in that case reset timer to 10s */
    // const timer = setInterval(update, /* every 10s */ 10 * 1000);
    // return () => clearInterval(timer);
  }, [courseState, debouncedSearch, page /* editCourse */]);

  /* When switching tabs or searching, start with page 0 again */
  useEffect(() => {
    setPage(0);
  }, [courseState, search]);

  return (
    <div className="course-container">
      {editCourse && (
        <UpdateCourse
          course={editCourse}
          updateCourse={updateCourse}
          courseTags={courseTags}
          close={() => setEditCourse(null)}
        />
      )}
      {!editCourse && (
        <CourseTable
          courseState={courseState}
          courses={courses}
          loading={loading}
          setCourseState={setCourseState}
          setEditCourse={setEditCourse}
          search={search}
          setSearch={setSearch}
          page={page}
          setPage={setPage}
          hasLocalChanges={hasLocalChanges}
          refresh={update}
        />
      )}
    </div>
  );
};

function CourseTable({
  courseState,
  setCourseState,
  courses,
  loading,
  setEditCourse,
  search,
  setSearch,
  page,
  setPage,
  hasLocalChanges,
  refresh,
}: {
  courseState: CourseState;
  setCourseState(courseState: CourseState): void;
  courses: Course[];
  loading: boolean;
  setEditCourse(course: Course): void;
  search: string;
  setSearch(search: string): void;
  page: number;
  setPage(page: number): void;
  hasLocalChanges: boolean;
  refresh(): void;
}) {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Autoren',
      dataIndex: 'instructors',
      key: 'instructors',
      render: (instructors: CourseStudent[]) =>
        instructors
          .map((instructor) => instructor.firstname + ' ' + instructor.lastname)
          .join(', ') || '-',
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags: CourseTag[]) => tags?.map((tag) => <Tag>{tag.name}</Tag>),
    },
    {
      title: 'Erstellungsdatum',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt: string) => new Date(createdAt).toLocaleDateString(),
    },
  ];

  const rowClassName = (record: Course) => {
    if (record.courseState === courseState) return '';

    if (record.courseState === CourseState.ALLOWED) return 'green';

    if (record.courseState === CourseState.DENIED) return 'red';

    return '';
  };

  const onSearch = (event: { target: { value: string } }) => {
    setSearch(event.target.value);
  };

  const searchField = (
    <Input
      size="large"
      style={{ width: '400px' }}
      placeholder="Suche nach Name oder Beschreibung"
      allowClear
      onChange={onSearch}
      value={search}
    />
  );

  return (
    <div className="queue">
      <div className="header">
        <Title style={{ color: '#6c757d', marginTop: 0 }} level={4}>
          Kurse
        </Title>
      </div>
      <Tabs
        tabBarExtraContent={searchField}
        defaultActiveKey={`submitted`}
        activeKey={courseState}
        onChange={(k) => setCourseState(k as CourseState)}
      >
        {Object.keys(courseStates).map((courseState) => {
          return (
            <Tabs.TabPane
              tab={courseStates[courseState as CourseState]}
              key={courseState}
            >
              <Table
                rowClassName={rowClassName}
                loading={loading}
                columns={columns}
                dataSource={courses}
                onRow={(record) => ({
                  onClick() {
                    setEditCourse(record);
                  },
                })}
                className="hover"
                pagination={false}
              ></Table>
              {!hasLocalChanges && (
                <Pagination
                  page={page}
                  setPage={setPage}
                  hasNextPage={courses.length === 20}
                />
              )}
              {hasLocalChanges && (
                <>
                  <Button
                    onClick={refresh}
                    type="primary"
                    icon={<ReloadOutlined />}
                  >
                    Erfrische die Seite
                  </Button>
                </>
              )}
            </Tabs.TabPane>
          );
        })}
      </Tabs>
    </div>
  );
}

function UpdateCourse({
  course,
  updateCourse,
  courseTags,
  close,
}: {
  course: Course;
  updateCourse(course: Course, update: ApiCourseUpdate): Promise<void>;
  courseTags: CourseTag[];
  close(): void;
}) {
  const [name, setName] = useState(course.name);
  const [outline, setOutline] = useState(course.outline);
  const [description, setDescription] = useState(course.description);
  const [category, setCategory] = useState<CourseCategory>(course.category);
  const [tags, setTags] = useState<CourseTag[]>(course.tags ?? []);
  const [imageUrl] = useState(course.imageUrl);
  const [screeningComment, setScreeningComment] = useState(
    course.screeningComment
  );
  const [instructors, setInstructors] = useState<Instructor[]>(
    course.instructors ?? []
  );
  const [isEditMode, setIsEditMode] = useState(false);
  const [newLectures, setNewLectures] = useState<ApiAddLecture[]>([]);
  const [removeLectures, setRemoveLectures] = useState<Lecture[]>([]);

  const isEdited =
    name !== course.name ||
    outline !== course.outline ||
    description !== course.description ||
    category !== course.category ||
    imageUrl !== course.imageUrl;

  function update(
    courseState:
      | CourseState.ALLOWED
      | CourseState.CANCELLED
      | CourseState.DENIED
      | undefined
  ) {
    updateCourse(course, {
      category,
      tags,
      courseState,
      description,
      imageUrl,
      name,
      outline,
      screeningComment,
      instructors,
      newLectures,
      removeLectures,
    }).then(close);
  }

  const Header = () => {
    return (
      <div className="course-header">
        <Space size="large" style={{ width: '100%' }}>
          <Button
            onClick={() =>
              (!isEdited ||
                window.confirm('Willst du die Änderungen verwerfen?')) &&
              close()
            }
            icon={<ArrowLeftOutlined />}
          />

          {!isEditMode && (
            <Title style={{ color: '#6c757d' }} level={4}>
              {name}
            </Title>
          )}
          {isEditMode && (
            <Input
              style={{ width: '100%' }}
              size="large"
              value={name}
              className=""
              onChange={(e) => setName(e.target.value)}
            />
          )}
        </Space>
        {!isEditMode && (
          <Space size="small">
            {course.courseState !== 'allowed' && (
              <Button
                onClick={() => update(CourseState.ALLOWED)}
                style={{ background: '#B5F1BB' }}
              >
                Annehmen
              </Button>
            )}
            {course.courseState !== 'denied' && (
              <Button
                onClick={() => update(CourseState.DENIED)}
                style={{ background: '#F5AFAF' }}
              >
                Ablehnen
              </Button>
            )}
            <Button
              onClick={() => setIsEditMode(true)}
              icon={<EditOutlined />}
            />
          </Space>
        )}

        {isEditMode && (
          <Space size="small">
            <Button
              onClick={() => update(undefined)}
              style={{ background: '#C4C4C4', color: '#FFFFFF' }}
            >
              Speichern
            </Button>
            {course.courseState !== 'allowed' && (
              <Button
                onClick={() => update(CourseState.ALLOWED)}
                style={{ background: '#B5F1BB' }}
              >
                Speichern und Annehmen
              </Button>
            )}
            {course.courseState !== 'denied' && (
              <Button
                onClick={() => update(CourseState.DENIED)}
                style={{ background: '#F5AFAF' }}
              >
                Speichern und Ablehnen
              </Button>
            )}
          </Space>
        )}
      </div>
    );
  };

  const CourseDetails = () => {
    const categoryMenu = (
      <Menu>
        {Object.entries(categoryName).map(([category, name]) => (
          <Menu.Item
            onClick={() => {
              if (
                window.confirm(
                  'Wenn du die Kategorie änderst, werden vorhandene Labels gelöscht.'
                )
              ) {
                setTags([]);
                setCategory(category as CourseCategory);
              }
            }}
          >
            {name}
          </Menu.Item>
        ))}
      </Menu>
    );

    return (
      <div className="course-details">
        <Card
          title={
            <>
              <FileTextOutlined /> Kurzbeschreibung:
            </>
          }
        >
          {!isEditMode && outline}
          {isEditMode && (
            <TextArea
              value={outline}
              onChange={(e) => setOutline(e.target.value)}
            />
          )}
        </Card>
        <br />
        <Card
          title={
            <>
              <FileTextOutlined /> Beschreibung:
            </>
          }
        >
          {!isEditMode && description}
          {isEditMode && (
            <TextArea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          )}
        </Card>
        <br />
        <Card
          title={
            <>
              <TagOutlined /> Kategorie und Label:{' '}
            </>
          }
        >
          <div className="labels">
            {!isEditMode && <div>{categoryName[category]}</div>}
            {isEditMode && (
              <Dropdown.Button overlay={categoryMenu} icon={<DownOutlined />}>
                <a
                  className="ant-dropdown-link"
                  onClick={(e) => e.preventDefault()}
                >
                  {categoryName[category]}
                </a>
              </Dropdown.Button>
            )}
            <br />
            {!isEditMode && (
              <div style={{ flexDirection: 'row' }}>
                {course.tags?.map((tag) => (
                  <Tag>{tag.name}</Tag>
                ))}
              </div>
            )}
            {isEditMode && (
              <LabelSelector
                category={category}
                tags={tags}
                setTags={setTags}
                tagProposals={courseTags}
              />
            )}
          </div>
        </Card>
        <br />
        <Card
          title={
            <>
              <CalendarOutlined /> Kurszeiten:{' '}
            </>
          }
        >
          {!isEditMode &&
            (course.subcourses
              ? course.subcourses[0].lectures.map((l) => {
                  const date = moment(l.start).format('DD.MM.YY');
                  const startTime = moment(l.start).format('HH:mm');
                  const endTime = moment(l.start)
                    .add(l.duration, 'minutes')
                    .format('HH:mm');

                  return <Tag>{`${date} ${startTime} - ${endTime}`}</Tag>;
                })
              : '')}
          {isEditMode &&
            (course.subcourses ? (
              <LectureEditor
                currentLectures={course.subcourses[0].lectures}
                newLectures={newLectures}
                setNewLectures={setNewLectures}
                removeLectures={removeLectures}
                setRemoveLectures={setRemoveLectures}
                subcourse={course.subcourses[0]}
                instructors={instructors}
              />
            ) : (
              ''
            ))}
        </Card>
        <br />
        <Card
          title={
            <>
              <FileTextOutlined /> Kommentar:
            </>
          }
        >
          {!isEditMode && screeningComment}
          {isEditMode && (
            <TextArea
              value={screeningComment || ''}
              onChange={(e) => setScreeningComment(e.target.value)}
            />
          )}
        </Card>
      </div>
    );
  };

  const MetaDetails = () => {
    return (
      <div className="meta-details">
        <Descriptions layout="vertical" column={1} bordered={true}>
          <Descriptions.Item
            label={
              <>
                <CalendarOutlined /> Erstellt am
              </>
            }
          >
            {new Date(course.createdAt).toLocaleDateString()}
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <>
                <CalendarOutlined /> Updated am
              </>
            }
          >
            {new Date(course.updatedAt).toLocaleDateString()}
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <>
                <UserOutlined /> Trainer
              </>
            }
          >
            {!isEditMode &&
              (course.instructors
                ?.map(
                  (instructor) =>
                    instructor.firstname + ' ' + instructor.lastname
                )
                .join(', ') ||
                '-')}
            {isEditMode && (
              <InstructorSelector
                instructors={instructors}
                setInstructors={setInstructors}
              />
            )}
          </Descriptions.Item>
        </Descriptions>
      </div>
    );
  };

  return (
    <div className="update-course">
      {Header()}
      {CourseDetails()}
      {MetaDetails()}
    </div>
  );
}

export default Courses;
