import React, { useState } from "react";
import { Modal, Button, Descriptions, Input, Tag, Select } from "antd";
import moment from "moment";
import "./FeedbackModal.less";
import SubjectList from "./SubjectList";
import { StatusMap } from "./data";

const { TextArea } = Input;
const { Option } = Select;

const FeedbackModal = ({
	isModalOpen,
	completeJob,
	selectedJob,
	setSelectedJob,
	startVideoCall,
	closeModal,
}) => {
	const [knowsFrom, setKnowsFrom] = useState(13);
	const changeJob = (key, value) => {
		setSelectedJob({ ...selectedJob, [key]: value });
	};

	return (
		<Modal
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
								<a href={selectedJob.jitsi} target="blank" rel="noopener">
									Starte Video-Call
								</a>
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
				<Descriptions.Item label="Nachricht">
					{selectedJob.msg ? selectedJob.msg : "-"}
				</Descriptions.Item>
				<Descriptions.Item label="Alter">
					{selectedJob.birthday
						? moment().diff(selectedJob.birthday, "years")
						: "keine Angabe"}
				</Descriptions.Item>
				<Descriptions.Item label="Status">
					<Tag color={StatusMap.get(selectedJob.status)}>
						{selectedJob.status.toUpperCase()}
					</Tag>
				</Descriptions.Item>
			</Descriptions>
			<div className="title">Screening Angaben</div>
			<div className="label">Feedback des Studenten: </div>
			<TextArea
				rows={2}
				placeholder="Feedback des Studenten"
				value={selectedJob.feedback}
				onChange={(e) => changeJob("feedback", e.target.value)}
			/>
			<div className="label">Wie hat der Student von uns erfahren?</div>
			<Select
				onChange={(v) => setKnowsFrom(parseInt(v))}
				defaultValue={`${knowsFrom}`}
				style={{ marginBottom: "16px", marginTop: "16px", width: "100%" }}>
				<Option value="1"> Über Bekannte/Familie</Option>
				<Option value="2"> Über eine Empfehlung</Option>
				<Option value="3"> Über Lehrer/Schule</Option>
				<Option value="4"> Über die Universität</Option>
				<Option value="5"> Über einen Pressebericht</Option>
				<Option value="6"> Über einen Radiobeitrag</Option>
				<Option value="7"> Über einen Fernsehbeitrag</Option>
				<Option value="8"> Über Facebook</Option>
				<Option value="9"> Über Instagram</Option>
				<Option value="10"> Über TikTok</Option>
				<Option value="11"> Über eine Suchmaschinen-Suche</Option>
				<Option value="12"> Über eine Werbeanzeige</Option>
				<Option value="13"> anders</Option>
			</Select>
			{knowsFrom === 13 && (
				<TextArea
					rows={1}
					placeholder="anderes"
					value={selectedJob.knowcsfrom}
					onChange={(e) => changeJob("knowcsfrom", e.target.value)}
				/>
			)}

			<div className="label">Kommentar: </div>
			<TextArea
				style={{ marginBottom: "16px" }}
				rows={2}
				value={selectedJob.commentScreener}
				placeholder="Hier ein Kommentar (Optional)"
				onChange={(e) => changeJob("commentScreener", e.target.value)}
			/>
			<div className="label">Fächer: </div>
			<SubjectList
				subjects={selectedJob.subjects}
				setSubjects={(subjects) => changeJob("subjects", subjects)}
			/>
		</Modal>
	);
};

export default FeedbackModal;
