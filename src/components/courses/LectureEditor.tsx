import {ApiAddLecture, Lecture, Subcourse} from "../../types/Course";
import React, {useState} from "react";
import { Tag, Typography, DatePicker, TimePicker, message, Button } from 'antd';
import {CloseOutlined, UndoOutlined, PlusOutlined} from "@ant-design/icons";
import moment, {Moment} from 'moment'
import locale from 'antd/lib/calendar/locale/de_DE';

const { Text } = Typography;

function lectureTimeToString (l: Lecture | ApiAddLecture){
    const date = moment(l.start).format("DD.MM.YY");
    const startTime = moment(l.start).format("HH:mm");
    const endTime = moment(l.start).add(l.duration, "minutes").format("HH:mm");

    return (`${date} ${startTime} - ${endTime}`)
}

export default function ({currentLectures, newLectures, setNewLectures, oldLectures, setOldLectures, subcourse}: { currentLectures: Lecture[], newLectures: ApiAddLecture[], setNewLectures(newLectures: ApiAddLecture[]): void, oldLectures: Lecture[], setOldLectures(oldLectures: Lecture[]): void, subcourse: Subcourse }) {
    const DisplayCurrentLecture = ({ lecture }: { lecture: Lecture }) => {
        const active = oldLectures.indexOf(lecture) == -1;
        const lectureTime = lectureTimeToString(lecture)

        const handleEdit = () => {
            if (active) {
                setOldLectures([...oldLectures, lecture]);
            } else {
                setOldLectures(oldLectures.filter(l => l != lecture));
            }
        }

        return (
            <div>
                {active &&
                <Tag>
                    <Text>{lectureTime}</Text>
                    <CloseOutlined onClick={handleEdit} />
                </Tag>}
                {!active &&
                <Tag>
                    <Text delete>{lectureTime}</Text>
                    <UndoOutlined onClick={handleEdit} />
                </Tag>}
            </div>
        )
    }

    const DisplayNewLecture = ({ lecture }: { lecture: ApiAddLecture }) => {
        const lectureTime = lectureTimeToString(lecture);

        const handleRemove = () => {
            setNewLectures(newLectures.filter(l => l != lecture))
        }

        return (
            <Tag>
                <Text>{lectureTime}</Text>
                <CloseOutlined onClick={handleRemove} />
            </Tag>
        )
    }

    const AddLecture = () => {
        const [start, setStart] = useState<Moment | null>(null);
        const [duration, setDuration] = useState<number>(0);

        const OnPickTime = (value: Moment | null) => {
            start && setDuration(value?.diff(start, "minute") ?? 0)
            !start && message.error("Bitte zuerst eine Startzeit wählen.")
        }

        const OnAddClicked = () => {
            start && setNewLectures(
                [...newLectures, {subcourse: subcourse, start: start.toDate(), duration: duration}]
            );
        }

        return (
            <div>
                <DatePicker format="DD.MM.YYYY HH:mm" showTime locale={locale} onChange={(value) => setStart(value)} />
                {" - "}
                <TimePicker format="HH:mm"
                            locale={locale}
                            value={start && moment(start).add(duration, "minute")}
                            onChange={(time) => OnPickTime(time)} />
                <Button icon={<PlusOutlined />} onClick={OnAddClicked} />
            </div>
        )
    }

    return (
        <div>
            { currentLectures.map(l => <DisplayCurrentLecture lecture={l} />) }
            { newLectures.map(l => <DisplayNewLecture lecture={l} />) }
            <AddLecture />
        </div>
    )
}