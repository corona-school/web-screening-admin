import React from "react";
import moment from "moment";
import { StatusMap } from "./data";
import { Button, Tag, Table } from "antd";

const JobTable = ({ data, handleColumnClick }) => {
	const getTextFromJob = job => {
		if (job.status === "waiting") {
			return "Verifizieren";
		}

		return "Feedback";
	};

	const columns = [
		{
			title: "Vorname",
			dataIndex: "firstname",
			key: "firstname"
		},
		{
			title: "Nachname",
			dataIndex: "lastname",
			key: "lastname"
		},
		{
			title: "E-Mail",
			dataIndex: "email",
			key: "email"
		},
		{
			title: "Status",
			dataIndex: "status",
			key: "status",
			render: tag => (
				<Tag color={StatusMap.get(tag)} key={tag}>
					{tag.toUpperCase()}
				</Tag>
			)
		},
		{
			title: "Zeit",
			dataIndex: "time",
			key: "time",
			render: time => <span>{moment(time).fromNow()}</span>
		},
		{
			title: "Video-Link",
			dataIndex: "jitsi",
			key: "jitsi",
			render: link => (
				<a href={link} target="blank">
					Link
				</a>
			)
		},
		{
			title: "Action",
			dataIndex: "action",
			key: "action",
			render: (text, job) => (
				<Button onClick={() => handleColumnClick(job)}>
					{getTextFromJob(job)}
				</Button>
			)
		}
	];

	return <Table columns={columns} dataSource={data} />;
};
export default JobTable;
