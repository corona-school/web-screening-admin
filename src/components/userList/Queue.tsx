import React, { useContext, useState, useEffect } from "react";
import classes from "./Queue.module.less";
import { Tabs, message, Typography, Tag, Tooltip } from "antd";
import { ApiContext, IJobInfo, ScreenerStatus } from "../../api/ApiContext";
import { Keys, KeyMap, TabMap } from "./data";
import JobTable from "./JobTable";
import FeedbackModal from "./FeedbackModal";
import useInterval from "../../api/interval";

import "./UserList.less";

const { TabPane } = Tabs;
const { Title } = Typography;
const Queue = () => {
	const context = useContext(ApiContext);
	const [selectedJob, setSelectedJob] = useState<IJobInfo | null>(null);
	const [isModalOpen, setModalOpen] = useState(false);
	const [filterType, setFilterType] = useState(2);

	useEffect(() => {
		if (!selectedJob) {
			setModalOpen(false);
		}
	}, [selectedJob]);

	useInterval(() => {
		if (context?.userIsLoggedIn && !context?.isSocketConnected) {
			getJobsCall();
		}
	}, 1000);

	if (!context) {
		return null;
	}

	const {
		postChangeStatusCall,
		getJobsCall,
		handleRemoveJob,
		studentData,
		user,
	} = context;

	const startVideoCall = () => {
		if (!selectedJob) {
			return;
		}
		const job: IJobInfo = { ...selectedJob, status: "active" };
		postChangeStatusCall(job)
			.then((resp: any) => {
				setSelectedJob(resp.data);
				setModalOpen(true);
				setFilterType(3);
				message.success("Der Student wurde zum VideoCall eingeladen.");
			})
			.catch((err: any) => {
				setSelectedJob(null);
				setModalOpen(false);
				message.error("Der VideoCall konnte nicht gestartet werden.");
			});
	};

	const completeJob = (selectedJob: IJobInfo, isVerified: boolean) => {
		setModalOpen(false);
		setFilterType(isVerified ? 4 : 5);
		let job = selectedJob;
		job.status = isVerified ? "completed" : "rejected";

		postChangeStatusCall(job)
			.then(() => message.success("Änderungen wurden erfolgreich gespeichert."))
			.catch(() =>
				message.error("Änderungen konnten nicht gespeichert werden")
			);
	};

	const handleColumnClick = (job: IJobInfo) => {
		if (job.status !== "waiting") {
			setSelectedJob(job);
			setModalOpen(true);
			return;
		}

		const hide = message.loading("Daten werden geladen..", 0);
		if (!job) {
			return;
		}
		const newJob: IJobInfo = { ...job, screener: user ? user : undefined };
		postChangeStatusCall(newJob)
			.then(() => {
				setSelectedJob(job);
				setModalOpen(true);
				hide();
				message.success("Du wurdest als Screener eingetragen.");
			})
			.catch(() => {
				message.error("Du konntest nicht als Screener eingetragen werden.");
				hide();
			});
	};

	const data = studentData
		.map((data, index) => ({ key: index, ...data }))
		.filter((data) => {
			if (filterType !== 1) {
				return data.status === KeyMap.get(filterType)?.toLowerCase();
			}
			return true;
		})
		.sort((a, b) => a.time - b.time)
		.filter((job) => {
			if (job.status !== "waiting" && job.status !== "active" && job.screener) {
				return job.screener.email === user?.email;
			}
			return true;
		});

	const renderStatus = () => {
		if (context.status === ScreenerStatus.ONLINE) {
			return (
				<Tooltip
					title="Du bist mit dem Backend verbunden und bekommst Live updates."
					placement="left">
					<Tag color="green">Live</Tag>
				</Tooltip>
			);
		}
		if (context.status === ScreenerStatus.OFFLINE) {
			return (
				<Tooltip
					title="Deine Verbindung ist abgebrochen. Bitte lade die Seite neu!"
					placement="left">
					<Tag color="red">Offline</Tag>
				</Tooltip>
			);
		}
		if (context.status === ScreenerStatus.RECONNECTING) {
			return (
				<Tooltip
					title="Deine Verbindung wird wiederhergestellt."
					placement="left">
					<Tag color="orange">Reconnecting...</Tag>
				</Tooltip>
			);
		}
	};

	return (
		<div className={classes.queue}>
			<div className={classes.header}>
				<Title style={{ color: "#6c757d", marginTop: 0 }} level={4}>
					Warteschlange
				</Title>
				{renderStatus()}
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
							<JobTable
								reverse={filterType === 2 ? false : true}
								handleRemoveJob={handleRemoveJob}
								allJobs={studentData}
								data={data}
								handleColumnClick={handleColumnClick}
								user={user}
							/>
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
					setSelectedJob={(job: IJobInfo) => setSelectedJob(job)}
				/>
			)}
		</div>
	);
};

export default Queue;
