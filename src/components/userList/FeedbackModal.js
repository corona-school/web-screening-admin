import React from "react";
import { Modal, Button, Descriptions } from "antd";
import TextArea from "antd/lib/input/TextArea";
import SubjectTreeSelect from "./SubjectTreeSelect";

const FeedbackModal = ({
	isModalOpen,
	completeJob,
	selectedJob,
	selectedClasses,
	setSelectedClasses,
	closeModal
}) => {
	return (
		<Modal
			visible={isModalOpen}
			onCancel={closeModal}
			title="Kennenlerngespräch"
			footer={[
				<Button danger key="back" onClick={() => completeJob(false)}>
					Ablehen
				</Button>,
				<Button key="submit" type="primary" onClick={() => completeJob(true)}>
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
			<TextArea rows={4} placeholder="Hier Feedback geben..." />
			<TextArea
				style={{ marginTop: "16px", marginBottom: "16px" }}
				rows={2}
				placeholder="Hier ein Kommentar (Optional)"
			/>
			<SubjectTreeSelect
				selectedClasses={selectedClasses}
				setSelectedClasses={setSelectedClasses}
			/>
		</Modal>
	);
};

export default FeedbackModal;
