import {Lecture} from "../../types/Course";
import React from "react";
import { Tag, Typography } from 'antd';
import {CloseOutlined, UndoOutlined} from "@ant-design/icons";
import moment from "moment";

const { Text } = Typography;

function lectureTimeToString (l: Lecture){
    const date = moment(l.start).format("DD.MM.YY");
    const startTime = moment(l.start).format("HH:mm");
    const endTime = moment(l.start).add(l.duration, "minutes").format("HH:mm");

    return (`${date} ${startTime} - ${endTime}`)
}

export default function ({currentLectures, newLectures, setNewLectures, oldLectures, setOldLectures}: { currentLectures: Lecture[], newLectures: Lecture[], setNewLectures(newLectures: Lecture[]): void, oldLectures: Lecture[], setOldLectures(oldLectures: Lecture[]): void }) {
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

    return (
        <div>
            { currentLectures.map(l => <DisplayCurrentLecture lecture={l} />) }
        </div>
    )
}