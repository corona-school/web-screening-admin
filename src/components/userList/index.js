import React, { useContext, useState, useEffect } from "react";
import {
	Table,
	Tag,
	Tabs,
	Button,
	Modal,
	Descriptions,
	Input,
	TreeSelect
} from "antd";
import moment from "moment";
import { ApiContext } from "../../api/ApiContext";

const { TextArea } = Input;
const { SHOW_CHILD } = TreeSelect;
const { TabPane } = Tabs;

const UserList = ({ studentData }) => {
	const { postChangeStatusCall } = useContext(ApiContext);
	const [selectedJob, setSelectedJob] = useState(null);
	const [isModalOpen, setModalOpen] = useState(false);
	const [filterType, setFilterType] = useState(2);
	const [selectedClasses, setSelectedClasses] = useState([]);

	useEffect(() => {
		if (selectedJob !== null) {
			const job = studentData.find(job => job.email === selectedJob.email);
			if (job) {
				if (job.status !== selectedJob.status) {
					setSelectedJob(job);
					if (job.status === "active") {
						setModalOpen(true);
					}
				}
			}
		}
	}, [studentData, selectedJob]);

	const startVideoCall = () => {
		if (!selectedJob) {
			return;
		}
		window.open(selectedJob.jitsi, "_blank");
		setFilterType(3);
		postChangeStatusCall({ email: selectedJob.email, status: "active" });
	};

	const completeJob = isVerified => {
		setModalOpen(false);
		setFilterType(isVerified ? 4 : 5);
		postChangeStatusCall({
			email: selectedJob.email,
			status: isVerified ? "completed" : "rejected"
		});
	};

	const renderSelectedJob = () => {
		if (!selectedJob) {
			return;
		}
		if (selectedJob.status === "active") {
			return (
				<div>
					<Button
						style={{ width: "200px" }}
						type="primary"
						onClick={() => setModalOpen(true)}>
						Feedback
					</Button>
				</div>
			);
		}
		if (selectedJob.status === "waiting") {
			return (
				<div>
					<Button
						style={{ width: "200px" }}
						type="primary"
						onClick={startVideoCall}>
						Starte Video-Call
					</Button>
				</div>
			);
		}

		return;
	};

	const StatusMap = new Map([
		["waiting", "orange"],
		["active", "geekblue"],
		["completed", "green"],
		["rejected", "red"]
	]);

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
				<Button onClick={() => setSelectedJob(job)}>
					{getTextFromJob(job)}
				</Button>
			)
		}
	];

	const keyMap = new Map([
		[1, "All"],
		[2, "Waiting"],
		[3, "Active"],
		[4, "Completed"],
		[5, "Rejected"]
	]);
	const data = studentData
		.map((data, index) => ({ key: index, ...data }))
		.filter(data => {
			if (filterType !== 1) {
				return data.status === keyMap.get(filterType).toLowerCase();
			}
			return true;
		})
		.sort((a, b) => a.time - b.time);

	const T = <Table columns={columns} dataSource={data} />;

	const subjects = [
		"Deutsch",
		"Latein",
		"Französisch",
		"Englisch",
		"Mathematik",
		"Informatik",
		"Kunst"
	];

	const classes = [5, 6, 7, 8, 9, 10, 11, 12];

	const treeData = subjects.map((subject, i) => {
		return {
			title: subject,
			value: `0-${i}`,
			checkable: false,
			key: `0-${i}`,
			children: classes.map((schoolClass, k) => {
				return {
					title: `${subject}: ${schoolClass} Klasse`,
					value: `0-${i}-${k}`,
					key: `0-${i}-${k}`
				};
			})
		};
	});

	const tProps = {
		treeData,
		value: selectedClasses,
		onChange: value => setSelectedClasses(value),
		treeCheckable: true,
		showCheckedStrategy: SHOW_CHILD,
		placeholder: "Wähle hier die Fächer aus..",
		style: {
			width: "100%"
		}
	};

	return (
		<div>
			{selectedJob !== null && renderSelectedJob()}
			<Tabs
				defaultActiveKey={`${filterType}`}
				activeKey={`${filterType}`}
				onChange={key => {
					setFilterType(parseInt(key));
				}}>
				{[1, 2, 3, 4, 5].map(index => {
					return (
						<TabPane tab={keyMap.get(index)} key={index}>
							{T}
						</TabPane>
					);
				})}
			</Tabs>
			{selectedJob && (
				<Modal
					visible={isModalOpen}
					title="Kennenlerngespräch"
					footer={[
						<Button danger key="back" onClick={() => completeJob(false)}>
							Ablehen
						</Button>,
						<Button
							key="submit"
							type="primary"
							onClick={() => completeJob(true)}>
							Freischalten
						</Button>
					]}>
					<Descriptions title="Studenten-Information" layout="horizontal">
						<Descriptions.Item label="Name">
							{selectedJob.firstname} {selectedJob.lastname}
						</Descriptions.Item>
						<Descriptions.Item label="E-Mail">
							{selectedJob.email}
						</Descriptions.Item>
					</Descriptions>
					<Descriptions
						title="Screener Angaben"
						layout="horizontal"
						style={{ marginTop: "16px" }}
					/>
					<TextArea rows={4} placeholder="Hier Feedback geben..." />
					<TextArea
						style={{ marginTop: "16px", marginBottom: "16px" }}
						rows={2}
						placeholder="Hier ein Kommentar (Optional)"
					/>

					<TreeSelect {...tProps} />
				</Modal>
			)}
		</div>
	);
};

export default UserList;
