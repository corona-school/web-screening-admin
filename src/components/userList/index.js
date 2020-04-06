import React, { useContext, useState, useEffect } from "react";
import { Tabs, message } from "antd";

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
		selectedJob,
		handleRemoveJob,
		setSelectedJob,
		isSocketConnected,
		user,
	} = useContext(ApiContext);

	const [isModalOpen, setModalOpen] = useState(false);
	const [filterType, setFilterType] = useState(2);

	useEffect(() => {
		if (!selectedJob) {
			setModalOpen(false);
		}
	}, [selectedJob]);

	useInterval(() => {
		if (userIsLoggedIn && !isSocketConnected) {
			getJobsCall();
		}
	}, 1000);

	const startVideoCall = () => {
		postChangeStatusCall({ ...selectedJob, status: "active" })
			.then((resp) => {
				setSelectedJob(resp.data);
				setModalOpen(true);
				setFilterType(3);
				message.success("Der Student wurde zum VideoCall eingeladen.");
			})
			.catch((err) => {
				setSelectedJob(null);
				setModalOpen(false);
				message.error("Der VideoCall konnte nicht gestartet werden.");
			});
	};

	const completeJob = (selectedJob, isVerified) => {
		setModalOpen(false);
		setFilterType(isVerified ? 4 : 5);
		let job = selectedJob;
		job.status = isVerified ? "completed" : "rejected";

		postChangeStatusCall(job)
			.then((resp) =>
				message.success("Änderungen wurden erfolgreich gespeichert.")
			)
			.catch((err) =>
				message.error("Änderungen konnten nicht gespeichert werden")
			);
	};

	const handleColumnClick = (job) => {
		if (job.status !== "waiting") {
			setSelectedJob(job);
			setModalOpen(true);
			return;
		}

		const hide = message.loading("Daten werden geladen..", 0);
		postChangeStatusCall({ ...job, screener: user })
			.then((resp) => {
				setSelectedJob(job);
				setModalOpen(true);
				hide();
				message.success("Du wurdest als Screener eingetragen.");
			})
			.catch((err) =>
				message.error("Du konntest nicht als Screener eingetragen werden.")
			);
	};

	const data = studentData
		.map((data, index) => ({ key: index, ...data }))
		.filter((data) => {
			if (filterType !== 1) {
				return data.status === KeyMap.get(filterType).toLowerCase();
			}
			return true;
		})
		.sort((a, b) => a.time - b.time)
		.filter((job) => {
			if (job.status !== "waiting" && job.status !== "active" && job.screener) {
				return job.screener.email === user.email;
			}
			return true;
		});

	return (
		<div className="userlist">
			<Tabs
				defaultActiveKey={`${filterType}`}
				activeKey={`${filterType}`}
				onChange={(key) => {
					setFilterType(parseInt(key));
				}}>
				{Keys.map((index) => {
					return (
						<TabPane tab={TabMap.get(index)} key={index}>
							<JobTable
								reverse={filterType === 2 ? false : true}
								handleRemoveJob={handleRemoveJob}
								allJobs={studentData}
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
					startVideoCall={startVideoCall}
					selectedJob={selectedJob}
					setSelectedJob={(job) => setSelectedJob(job)}
				/>
			)}
		</div>
	);
};

export default UserList;
