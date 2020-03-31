import React from "react";
import moment from "moment";
import { StatusMap, SubjectsMap } from "./data";
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
			title: "Name",
			dataIndex: "lastname",
			key: "lastname",
			render: (lastname, job) => `${job.firstname} ${job.lastname}`
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
			title: "Screener",
			dataIndex: "screener",
			key: "screener",
			render: screener => (
				<span>
					{screener ? `${screener.firstname} ${screener.lastname}` : ""}
				</span>
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

	return (
		<Table
			expandable={{
				expandedRowRender: job => {
					return (
						<div>
							<p style={{ margin: "4px" }}>"{job.msg}"</p>
							<div style={{ margin: "4px" }}>
								{job.subjects.map(subject => (
									<Tag style={{ margin: "4px" }} key={subject}>
										{subject}
									</Tag>
								))}
							</div>
						</div>
					);
				}
			}}
			columns={columns}
			dataSource={data}
		/>
	);
};
export default JobTable;
