import React, { useContext, useState, useEffect } from "react";
import { Tabs, Button } from "antd";

import { ApiContext } from "../../api/ApiContext";
import { Keys, KeyMap } from "./data";
import JobTable from "./JobTable";
import FeedbackModal from "./FeedbackModal";

const { TabPane } = Tabs;

const UserList = ({ studentData }) => {
	const { postChangeStatusCall } = useContext(ApiContext);
	const [selectedJob, setSelectedJob] = useState(null);
	const [isModalOpen, setModalOpen] = useState(false);
	const [filterType, setFilterType] = useState(2);
	const [selectedClasses, setSelectedClasses] = useState([]);

	useEffect(() => {
		if (!selectedJob) {
			return;
		}

		const job = studentData.find(job => job.email === selectedJob.email);
		if (!job) {
			return;
		}

		if (job.status !== selectedJob.status) {
			setSelectedJob(job);
			if (job.status === "active") {
				setModalOpen(true);
			}
		}
	}, [studentData, selectedJob]);

	const startVideoCall = () => {
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

	const handleColumnClick = job => {
		setSelectedJob(job);
		if (job.status !== "waiting") {
			setModalOpen(true);
		}
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
						<a href={selectedJob.jitsi} target="blank" rel="noopener">
							Starte Video-Call
						</a>
					</Button>
				</div>
			);
		}

		return;
	};

	const data = studentData
		.map((data, index) => ({ key: index, ...data }))
		.filter(data => {
			if (filterType !== 1) {
				return data.status === KeyMap.get(filterType).toLowerCase();
			}
			return true;
		})
		.sort((a, b) => a.time - b.time);

	return (
		<div>
			{selectedJob !== null && renderSelectedJob()}
			<Tabs
				defaultActiveKey={`${filterType}`}
				activeKey={`${filterType}`}
				onChange={key => {
					setFilterType(parseInt(key));
				}}>
				{Keys.map(index => {
					return (
						<TabPane tab={KeyMap.get(index)} key={index}>
							<JobTable data={data} handleColumnClick={handleColumnClick} />;
						</TabPane>
					);
				})}
			</Tabs>
			{selectedJob && (
				<FeedbackModal
					isModalOpen={isModalOpen}
					closeModal={() => setModalOpen(false)}
					completeJob={completeJob}
					selectedJob={selectedJob}
					selectedClasses={selectedClasses}
					setSelectedClasses={setSelectedClasses}
				/>
			)}
		</div>
	);
};

export default UserList;
