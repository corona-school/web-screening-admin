import React from "react";
import { Modal, Button, Descriptions } from "antd";
import TextArea from "antd/lib/input/TextArea";
import SubjectTreeSelect from "./SubjectTreeSelect";

const FeedbackModal = ({
	isModalOpen,
	completeJob,
	selectedJob,
	setSelectedJob,
	closeModal
}) => {
	const changeJob = (key, value) => {
		const job = { ...selectedJob, [key]: value };
		setSelectedJob(job);
	};

	return (
		<Modal
			visible={isModalOpen}
			onCancel={closeModal}
			title="Kennenlerngespräch"
			footer={[
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
					{selectedJob.status === "waiting" || selectedJob.status === "active"
						? "Freischalten"
						: "Ändern"}
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
			<TextArea
				rows={4}
				placeholder="Hier Feedback geben..."
				value={selectedJob.feedback}
				onChange={e => changeJob("feedback", e.target.value)}
			/>
			<TextArea
				style={{ marginTop: "16px", marginBottom: "16px" }}
				rows={2}
				value={selectedJob.commentScreener}
				placeholder="Hier ein Kommentar (Optional)"
				onChange={e => changeJob("commentScreener", e.target.value)}
			/>
			<SubjectTreeSelect
				selectedClasses={selectedJob.subjects}
				setSelectedClasses={subjects => changeJob("subjects", subjects)}
			/>
		</Modal>
	);
};

export default FeedbackModal;