import React, { useState } from "react";
import { Descriptions, Tag, Select, Button, Modal } from "antd";
import { IJobInfo } from "../../api";
import { StatusMap, knowsFromMap } from "./data";
import TextArea from "antd/lib/input/TextArea";
import SubjectList from "./SubjectList";
import { Link } from "react-router-dom";
import { DeleteOutlined } from "@ant-design/icons";

import classes from "./JobScreeningEdit.module.less";

const { Option } = Select;
const { confirm } = Modal;

interface Props {
	selectedJob: IJobInfo;
	setSelectedJob: (job: IJobInfo) => void;
	completeJob: (job: IJobInfo, decision: boolean) => void;
	removeJob: (email: string) => void;
	showButtons?: boolean;
}

const JobScreeningEdit = ({
	selectedJob,
	setSelectedJob,
	completeJob,
	removeJob,
	showButtons,
}: Props) => {
	const [knowsFrom, setKnowsFrom] = useState(
		knowsFromMap.has(selectedJob.data.knowcsfrom)
			? selectedJob.data.knowcsfrom
			: "13"
	);
	const changeJob = (key: string, value: any) => {
		setSelectedJob({
			...selectedJob,
			data: { ...selectedJob.data, [key]: value },
		});
	};

	const showDeleteConfirm = (email: string) => {
		confirm({
			title: "Willst du diesen Job wirklich löschen?",
			content:
				"Der Job wird von der Warteschalgen entfernt und der Student muss sich neu anmelden, um sich verifizieren zu lassen.",
			okText: "Ja",
			cancelText: "Nein",
			onOk() {
				removeJob(email);
			},
			onCancel() {},
		});
	};

	const room = new URL(selectedJob.data.jitsi).pathname;

	return (
		<div className={classes.container}>
			<Descriptions
				title="Studenten-Information"
				layout="horizontal"
				column={2}>
				<Descriptions.Item label="Name">
					{selectedJob.data.firstname} {selectedJob.data.lastname}
				</Descriptions.Item>
				<Descriptions.Item label="E-Mail">
					{selectedJob.data.email}
				</Descriptions.Item>
				<Descriptions.Item label="Nachricht">
					{selectedJob.data.msg ? selectedJob.data.msg : "-"}
				</Descriptions.Item>

				<Descriptions.Item label="Status">
					<Tag color={StatusMap.get(selectedJob.status)}>
						{selectedJob.status.toUpperCase()}
					</Tag>
				</Descriptions.Item>
				{selectedJob.status !== "waiting" && (
					<Descriptions.Item label="Screening-Link">
						<Link to={`screening/${selectedJob.data.email}${room}`}>
							Zum Screening
						</Link>
					</Descriptions.Item>
				)}
				<Descriptions.Item label="Externer Video-Link">
					<a
						href={selectedJob.data.jitsi}
						target="_blank"
						rel="noopener noreferrer">
						Jitsi-Link
					</a>
				</Descriptions.Item>
			</Descriptions>
			<div className="title">Screening Angaben</div>
			<div className="label">Feedback des Studenten: </div>
			<TextArea
				rows={2}
				placeholder="Feedback des Studenten"
				value={selectedJob.data.feedback}
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
					value={selectedJob.data.knowcsfrom}
					onChange={(e) => changeJob("knowcsfrom", e.target.value)}
				/>
			)}
			<div className="label">Kommentar: </div>
			<TextArea
				style={{ marginBottom: "16px" }}
				rows={2}
				value={selectedJob.data.commentScreener}
				placeholder="Hier ein Kommentar (Optional)"
				onChange={(e) => changeJob("commentScreener", e.target.value)}
			/>
			<div className="label">Fächer: </div>
			<SubjectList
				subjects={selectedJob.data.subjects}
				setSubjects={(subjects) => changeJob("subjects", subjects)}
			/>
			{showButtons && (
				<div style={{ marginTop: "32px" }}>
					<Button
						style={{ width: "100px", marginLeft: "0" }}
						danger
						key="back"
						onClick={() => completeJob(selectedJob, false)}>
						Ablehen
					</Button>
					<Button
						style={{ width: "140px" }}
						key="submit"
						type="primary"
						onClick={() => completeJob(selectedJob, true)}>
						Freischalten
					</Button>
					<Button
						style={{ width: "36px" }}
						icon={<DeleteOutlined />}
						onClick={() => showDeleteConfirm(selectedJob.data.email)}></Button>
				</div>
			)}
		</div>
	);
};

export default JobScreeningEdit;
