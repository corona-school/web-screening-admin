import React from "react";
import moment from "moment";
import { StatusMap } from "./data";
import { Button, Tag, Table, Modal } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

const { confirm } = Modal;

const JobTable = ({
	data,
	handleColumnClick,
	user,
	allJobs,
	handleRemoveJob,
	reverse,
}) => {
	const getTextFromJob = (job) => {
		if (job.status === "waiting") {
			if (job.screener && job.screener.email !== user.email) {
				return "Übernehmen";
			}
			return "Verifizieren";
		}

		return "Ergebnis";
	};

	const showDeleteConfirm = (email) => {
		confirm({
			title: "Willst du diesen Job wirklich löschen?",
			content:
				"Der Job wird von der Warteschalgen entfernt und der Student muss sich neu anmelden, um sich verifizieren zu lassen.",
			okText: "Ja",
			okType: "danger",
			cancelText: "Nein",
			onOk() {
				handleRemoveJob(email);
			},
			onCancel() {},
		});
	};

	const hasActiveStudent = () =>
		allJobs.some(
			(job) =>
				job.status === "active" &&
				job.screener &&
				job.screener.email === user.email
		);

	const showConfirm = (job) => {
		confirm({
			title: "Willst du diesen Job übernehemen?",
			content: "Ein andere Screener ist bereits eingetragen für diesen Job.",
			okText: "Ja",
			cancelText: "Abbrechen",
			onOk() {
				handleColumnClick(job);
			},
			onCancel() {
				console.log("Abbrechen");
			},
		});
	};

	const renderActions = (job) => {
		const isSelfAssignedJob = job.screener && job.screener.email === user.email;

		const isWaitingAndHasNoActiveJob =
			job.status === "waiting" && !hasActiveStudent();

		const isNotMyJob = job.screener && job.screener.email !== user.email;

		if (isSelfAssignedJob || isWaitingAndHasNoActiveJob) {
			return (
				<>
					<Button
						style={{ width: "116px" }}
						onClick={() =>
							isNotMyJob ? showConfirm(job) : handleColumnClick(job)
						}>
						{getTextFromJob(job)}
					</Button>
					<Button
						style={{ width: "36px" }}
						icon={<DeleteOutlined />}
						onClick={() => showDeleteConfirm(job.email)}
					/>
				</>
			);
		}
	};

	const renderScreener = (screener) => {
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
			render: (lastname, job) => `${job.firstname} ${job.lastname}`,
		},
		{
			title: "E-Mail",
			dataIndex: "email",
			key: "email",
		},
		{
			title: "Status",
			dataIndex: "status",
			key: "status",
			render: (tag) => (
				<Tag color={StatusMap.get(tag)} key={tag}>
					{tag.toUpperCase()}
				</Tag>
			),
		},
		{
			title: "Zeit",
			dataIndex: "time",
			key: "time",
			render: (time) => <span>{moment(time).fromNow()}</span>,
			defaultSortOrder: reverse ? "descend" : "ascend",
			sorter: (a, b) => a.time - b.time,
		},
		{
			title: "Video-Link",
			dataIndex: "jitsi",
			key: "jitsi",
			render: (link) => (
				<a href={link} target="blank">
					Link
				</a>
			),
		},
		{
			title: "Screener",
			dataIndex: "screener",
			key: "screener",
			render: (screener) => renderScreener(screener),
		},
		{
			title: "Action",
			dataIndex: "action",
			key: "action",
			render: (text, job) => renderActions(job),
		},
	];

	return (
		<Table
			expandable={{
				expandedRowRender: (job) => {
					return (
						<div>
							{job.msg && <p style={{ margin: "4px" }}>"{job.msg}"</p>}
							<div style={{ margin: "4px" }}>
								{job.subjects.map((subject) => (
									<Tag style={{ margin: "4px" }} key={subject.subject}>
										{subject.subject}
									</Tag>
								))}
							</div>
						</div>
					);
				},
			}}
			columns={columns}
			dataSource={data}
		/>
	);
};
export default JobTable;
