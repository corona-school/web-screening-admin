import React from "react";
import moment from "moment";
import { StatusMap } from "./data";
import { Button, Tag, Table } from "antd";

const JobTable = ({ data, handleColumnClick, user, allJobs }) => {
	const getTextFromJob = job => {
		if (job.status === "waiting") {
			return "Verifizieren";
		}

		return "Feedback";
	};

	const hasActiveStudent = () =>
		allJobs.some(
			job =>
				job.status === "active" &&
				job.screener &&
				job.screener.email === user.email
		);

	const renderActions = job => {
		if (job.screener && job.screener.email === user.email) {
			return (
				<Button onClick={() => handleColumnClick(job)}>
					{getTextFromJob(job)}
				</Button>
			);
		}

		if (!job.screener && job.status === "waiting" && !hasActiveStudent()) {
			return (
				<Button onClick={() => handleColumnClick(job)}>
					{getTextFromJob(job)}
				</Button>
			);
		}
	};

	const renderScreener = screener => {
		if (!screener) {
			return;
		}
		if (screener.email === user.email) {
			return (
				<Tag color={"blue"} key={screener.email}>
					Du
				</Tag>
			);
		}
		return (
			<span>
				{screener.firstname} {screener.lastname}
			</span>
		);
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
			render: screener => renderScreener(screener)
		},
		{
			title: "Action",
			dataIndex: "action",
			key: "action",
			render: (text, job) => renderActions(job)
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
