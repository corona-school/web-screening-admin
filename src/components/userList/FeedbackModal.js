import React from "react";
import { Modal, Button, Descriptions, Input } from "antd";
import moment from "moment";
import "./FeedbackModal.less";
import SubjectList from "./SubjectList";

const { TextArea } = Input;

const FeedbackModal = ({
	isModalOpen,
	completeJob,
	selectedJob,
	setSelectedJob,
	closeModal
}) => {
	const changeJob = (key, value) => {
		setSelectedJob(oldJob => ({ ...oldJob, [key]: value }));
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
			<Descriptions
				title="Studenten-Information"
				layout="horizontal"
				column={2}>
				<Descriptions.Item label="Name">
					{selectedJob.firstname} {selectedJob.lastname}
				</Descriptions.Item>
				<Descriptions.Item label="E-Mail">
					{selectedJob.email}
				</Descriptions.Item>
				<Descriptions.Item label="Message">
					{selectedJob.msg ? selectedJob.msg : "-"}
				</Descriptions.Item>
				<Descriptions.Item label="Alter">
					{selectedJob.birthday
						? moment().diff(selectedJob.birthday, "years")
						: "keine Angabe"}
				</Descriptions.Item>
			</Descriptions>
			<div className="title">Screening Angaben</div>
			<div className="label">Feedback des Studenten: </div>
			<TextArea
				rows={4}
				placeholder="Feedback des Studenten"
				value={selectedJob.feedback}
				onChange={e => changeJob("feedback", e.target.value)}
			/>
			<div className="label">Wie hat der Student von uns erfahren?</div>
			<TextArea
				rows={2}
				placeholder="Wie hat der Student von uns erfahren?"
				value={selectedJob.knowcsfrom}
				onChange={e => changeJob("knowcsfrom", e.target.value)}
			/>
			<div className="label">Kommentar: </div>
			<TextArea
				style={{ marginBottom: "16px" }}
				rows={2}
				value={selectedJob.commentScreener}
				placeholder="Hier ein Kommentar (Optional)"
				onChange={e => changeJob("commentScreener", e.target.value)}
			/>
			<div className="label">Fächer: </div>
			<SubjectList
				subjects={selectedJob.subjects}
				setSubjects={subjects => changeJob("subjects", subjects)}
			/>
		</Modal>
	);
};

export default FeedbackModal;
