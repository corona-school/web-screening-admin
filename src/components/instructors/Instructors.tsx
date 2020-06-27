import React, {useState} from "react";
import { Tabs, Table } from "antd";

import "./Instructors.less"
import useInstructors from "../../api/useInstructors";
import {ScreeningStatus, Student} from "../../types/Student";
import Title from "antd/lib/typography/Title";


const possibleScreeningStatus: { [key in ScreeningStatus]: string } = {
    UNSCREENED: "Prüfen",
    ACCEPTED: "Angenommen",
    REJECTED: "Abgelehnt"
}

const Instructors = () => {
    const  [screeningStatus, _setScreeningStatus] = useState<ScreeningStatus>(ScreeningStatus.Unscreened);

    const { instructors, loadInstructors, loading } = useInstructors({ initial: ScreeningStatus.Unscreened})

    function setScreeningStatus(screeningStatus: ScreeningStatus){
        _setScreeningStatus(screeningStatus);
        loadInstructors({ screeningStatus });
    }

    return (
        <div className="course-container">
            <InstructorTable
                screeningStatus={screeningStatus}
                setScreeningStatus={setScreeningStatus}
                instructors={instructors}
                loading={loading}
            />
        </div>
    )
}

function InstructorTable({ screeningStatus, setScreeningStatus, instructors, loading }: { screeningStatus: ScreeningStatus, setScreeningStatus(screeningStatus: ScreeningStatus): void, instructors: Student[], loading: boolean }) {
    const columns = [
        {
            title: "Nachname",
            dataIndex: "lastname",
            key: "lastname",
        },
        {
            title: "Vorname",
            dataIndex: "firstname",
            key: "firstname,"
        },

    ];

    return (
        <div className="list">
            <div className="header">
                <Title style={{ color: "#6c757d", marginTop: 0 }} level={4}>
                    Kursleiter
                </Title>
            </div>
            <Tabs
                activeKey={ screeningStatus }
                onChange={k => setScreeningStatus(k as ScreeningStatus)}>
                {Object.keys(possibleScreeningStatus).map((screeningStatus) => {
                    return (
                        <Tabs.TabPane
                            tab={possibleScreeningStatus[screeningStatus as ScreeningStatus]}
                            key={screeningStatus}>
                            <Table loading={loading}
                                   dataSource={instructors}
                                   className="hover"
                                   columns={columns}/>
                        </Tabs.TabPane>

                    )
                })}

            </Tabs>

        </div>
    )

}


export default Instructors;