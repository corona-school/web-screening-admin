import React, { useContext, useState, useEffect } from "react";
import { Table, Tag, Tabs, Button, Modal } from "antd";
import moment from "moment";

import { ApiContext } from "../../api/ApiContext";

const { TabPane } = Tabs;

const UserList = ({ studentData }) => {
	const { postChangeStatusCall } = useContext(ApiContext);
	const [selectedJob, setSelectedJob] = useState(null);
	const [isModalOpen, setModalOpen] = useState(false);
	const [filterType, setFilterType] = useState(1);

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
		postChangeStatusCall({ email: selectedJob.email, status: "active" });
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

		return <div>tbd</div>;
	};

	const StatusMap = new Map([
		["waiting", "orange"],
		["active", "geekblue"],
		["completed", "green"],
		["rejected", "red"]
	]);

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

	const T = (
		<Table
			rowSelection={{
				type: "radio",
				onChange: (selectedRowKeys, selectedRows) => {
					const job = selectedRows[0];
					setSelectedJob(job);
				}
			}}
			columns={columns}
			dataSource={data}
		/>
	);

	return (
		<div>
			{selectedJob !== null && renderSelectedJob()}
			<Tabs
				defaultActiveKey={"1"}
				onChange={key => {
					setFilterType(parseInt(key));
					// setSelectedJob(null);
				}}>
				{[1, 2, 3, 4, 5].map(index => {
					return (
						<TabPane tab={keyMap.get(index)} key={index}>
							{T}
						</TabPane>
					);
				})}
			</Tabs>
			<Modal
				visible={isModalOpen}
				title="Kennenlerngespräch"
				onOk={() => setModalOpen(false)}
				onCancel={() => setModalOpen(false)}
				footer={[
					<Button key="back" onClick={() => setModalOpen(false)}>
						Rejected
					</Button>,
					<Button
						key="submit"
						type="primary"
						onClick={() => setModalOpen(false)}>
						Completed
					</Button>
				]}>
				<p>Some contents...</p>
				<p>Some contents...</p>
				<p>Some contents...</p>
				<p>Some contents...</p>
				<p>Some contents...</p>
			</Modal>
		</div>
	);
};

export default UserList;
