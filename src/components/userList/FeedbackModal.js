import React, { useState } from "react";
import { Modal, Button, Descriptions, Input, Tag, Select } from "antd";
import moment from "moment";
import "./FeedbackModal.less";
import SubjectList from "./SubjectList";
import { StatusMap, knowsFromMap } from "./data";

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
	const [knowsFrom, setKnowsFrom] = useState(
		knowsFromMap.has(selectedJob.knowcsfrom) ? selectedJob.knowcsfrom : "13"
	);
	const changeJob = (key, value) => {
		setSelectedJob({ ...selectedJob, [key]: value });
	};

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
				onChange={(v) => {
					setKnowsFrom(v);
					if (v !== "13") {
						changeJob("knowcsfrom", v);
					}
				}}
				defaultValue={knowsFrom}
				style={{ marginBottom: "16px", marginTop: "16px", width: "100%" }}>
				<Option value="Bekannte"> Über Bekannte/Familie</Option>
				<Option value="Empfehlung"> Über eine Empfehlung</Option>
				<Option value="Schule"> Über Lehrer/Schule</Option>
				<Option value="Universität"> Über die Universität</Option>
				<Option value="Pressebericht"> Über einen Pressebericht</Option>
				<Option value="Radiobeitrag"> Über einen Radiobeitrag</Option>
				<Option value="Fernsehbeitrag"> Über einen Fernsehbeitrag</Option>
				<Option value="Facebook"> Über Facebook</Option>
				<Option value="Instagram"> Über Instagram</Option>
				<Option value="TikTok"> Über TikTok</Option>
				<Option value="Suchmaschine"> Über eine Suchmaschinen-Suche</Option>
				<Option value="Werbeanzeige"> Über eine Werbeanzeige</Option>
				<Option value="13"> anders</Option>
			</Select>
			{knowsFrom === "13" && (
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
				subjects={selectedJob.data.subjects}
				setSubjects={(subjects) => changeJob("subjects", subjects)}
			/>
		</Modal>
	);
};

export default FeedbackModal;
