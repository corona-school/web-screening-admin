import React, { useContext, useState } from "react";
import { Tabs, Button } from "antd";

import { ApiContext } from "../../api/ApiContext";
import { Keys, KeyMap, TabMap } from "./data";
import JobTable from "./JobTable";
import FeedbackModal from "./FeedbackModal";
import useInterval from "../../api/interval";

const { TabPane } = Tabs;

const UserList = ({ studentData }) => {
	const {
		postChangeStatusCall,
		getJobsCall,
		userIsLoggedIn,
		user
	} = useContext(ApiContext);
	const [selectedJob, setSelectedJob] = useState(null);
	const [isModalOpen, setModalOpen] = useState(false);
	const [filterType, setFilterType] = useState(2);

	useInterval(() => {
		if (userIsLoggedIn) {
			getJobsCall();
		}
	}, 1000);

	const startVideoCall = () => {
		setFilterType(3);
		let job = selectedJob;
		job.status = "active";
		postChangeStatusCall({ ...selectedJob, status: "active" });
		setSelectedJob(job);
		setModalOpen(true);
	};

	const completeJob = (selectedJob, isVerified) => {
		setModalOpen(false);
		setFilterType(isVerified ? 4 : 5);
		let job = selectedJob;
		job.status = isVerified ? "completed" : "rejected";

		postChangeStatusCall(job);
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
						<TabPane tab={TabMap.get(index)} key={index}>
							<JobTable
								data={data}
								handleColumnClick={handleColumnClick}
								user={user}
							/>
							;
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
					setSelectedJob={setSelectedJob}
				/>
			)}
		</div>
	);
};

export default UserList;
