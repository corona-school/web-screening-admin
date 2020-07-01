import React, { useState, useEffect } from "react";
import { Tabs, Table, Input, Space } from "antd";

import "./Instructors.less"
import useInstructors from "../../api/useInstructors";
import {ScreeningStatus, Student, TeacherModule} from "../../types/Student";
import Title from "antd/lib/typography/Title";
import useDebounce from "../../utils/useDebounce";

const possibleScreeningStatus: { [key in ScreeningStatus]: string } = {
    UNSCREENED: "Prüfen",
    ACCEPTED: "Angenommen",
    REJECTED: "Abgelehnt"
}

const Instructors = () => {
    const  [screeningStatus, setScreeningStatus] = useState<ScreeningStatus>(ScreeningStatus.Unscreened);
    const  [search, setSearch] = useState<string>("");
    const { instructors, loadInstructors, loading } = useInstructors({ initialStatus: ScreeningStatus.Unscreened, initialSearch: "" });

    console.log(instructors);
    
    const debouncedSearch = useDebounce(search, 1000);
        
    useEffect(() => { loadInstructors({ screeningStatus, search: debouncedSearch }); }, [screeningStatus, debouncedSearch]);

    return (
        <div className="course-container">
            <InstructorTable
                screeningStatus={screeningStatus}
                setScreeningStatus={setScreeningStatus}
                instructors={instructors}
                loading={loading}
                setSearch={setSearch}
            />
        </div>
    )
}

function InstructorTable({ screeningStatus, setScreeningStatus, instructors, loading, setSearch }: { screeningStatus: ScreeningStatus, setScreeningStatus(screeningStatus: ScreeningStatus): void, instructors: Student[], loading: boolean, setSearch(search: string): void }) {
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
        {
            title: "Kursleiter-Typ",
            dataIndex: "module",
            key: "module",
            render: (module: TeacherModule) => module ? "Praktikum" : "Sommer-AGs",
        }

    ];

    const onSearch = (event: { target: { value: string; }; }) => {
        setSearch(event.target.value);
    }

    const searchField = <Input
        size="large"
        style={{ width: "400px" }}
        placeholder="Nach einem Kursleiter suchen..."
        allowClear
        onChange={onSearch}
    />

    return (
        <div className="list">
            <div className="header">
                <Title style={{ color: "#6c757d", marginTop: 0 }} level={4}>
                    Kursleiter
                </Title>
            </div>
            <Tabs
                tabBarExtraContent={searchField}
                activeKey={ screeningStatus }
                onChange={k => setScreeningStatus(k as ScreeningStatus)}>
                {Object.keys(possibleScreeningStatus).map((screeningStatus) => {
                    return (
                        <Tabs.TabPane
                            tab={possibleScreeningStatus[screeningStatus as ScreeningStatus]}
                            key={screeningStatus}>
                            <Space size="small" direction="vertical" style={{ width: "100%" }}>
                                <Table
                                    loading={loading}
                                    dataSource={instructors}
                                    className="hover"
                                    columns={columns}/>
                            </Space>
                        </Tabs.TabPane>

                    )
                })}

            </Tabs>

        </div>
    )

}


export default Instructors;