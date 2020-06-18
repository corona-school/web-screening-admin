import React, {useContext, useState} from "react";
import "./Queue.less"
import { Tabs, Typography } from "antd";
import { ApiContext } from "../../api/ApiContext";
import {Keys, TabMap} from "./data";
import renderStatus from "../RenderStatus";

const { Title } = Typography;
const { TabPane} = Tabs;

const Queue = () => {
    const context = useContext(ApiContext);
    const [filterType, setFilterType] = useState(1);

    if (!context){
        return null;
    }

    return (
        <div className={"queue"}>
            <div className={"header"}>
                <Title style={{ color: "#6c757d", marginTop: 0 }} level={4}>
                    Kurse
                </Title>
                {renderStatus(context)}
            </div>
            <Tabs
                defaultActiveKey={`${filterType}`}
                activeKey={`${filterType}`}
                onChange={(key) => {
                    setFilterType(parseInt(key));
                }}>
                {Keys.map((index) => {
                    return (
                        <TabPane tab={TabMap.get(index)} key={index.toString()}>

                        </TabPane>
                    );
                })}
            </Tabs>
        </div>
    )
}

export default Queue;