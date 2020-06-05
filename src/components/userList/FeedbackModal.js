import React from "react";
import { Modal, Button } from "antd";

import "./FeedbackModal.less";

import JobScreeningEdit from "./JobScreeningEdit";

const FeedbackModal = ({
	isModalOpen,
	completeJob,
	removeJob,
	selectedJob,
	setSelectedJob,
	startVideoCall,
	closeModal,
}) => {
	return (
		<Modal
			width="640px"
			style={{ top: 20, maxHeight: "90%" }}
			visible={isModalOpen}
			onCancel={closeModal}
			title="Kennenlerngespräch"
			footer={
				selectedJob.status === "waiting"
					? [
							<Button
								style={{ width: "200px" }}
								type="primary"
								onClick={startVideoCall}>
								Starte Video-Call
							</Button>,
					  ]
					: [
							<Button
								danger
								key="back"
								onClick={() => completeJob(selectedJob, false)}>
								Ablehen
							</Button>,
							<Button
								key="submit"
								type="primary"
								onClick={() => completeJob(selectedJob, true)}>
								{selectedJob.status === "waiting" ||
								selectedJob.status === "active"
									? "Freischalten"
									: "Ändern"}
							</Button>,
					  ]
			}>
			<JobScreeningEdit
				selectedJob={selectedJob}
				setSelectedJob={setSelectedJob}
				completeJob={completeJob}
				removeJob={removeJob}
			/>
		</Modal>
	);
};

export default FeedbackModal;
