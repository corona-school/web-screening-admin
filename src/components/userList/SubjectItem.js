import React from "react";
import { Select, Button, Input, InputNumber } from "antd";
import { pure } from "recompose";
import { CloseOutlined } from "@ant-design/icons";

const { Option } = Select;

const SubjectItem = ({
	subject,
	changeSubjectRange,
	changeSubject,
	options,
	removeSubject
}) => {
	return (
		<div
			key={subject.subject}
			style={{ display: "flex", width: "100%", marginTop: "8px" }}>
			<Input.Group compact>
				<Select
					key={`${subject.subject}-input`}
					onChange={value => changeSubject(subject, value)}
					defaultValue={subject.subject}
					style={{ width: 120 }}>
					{options.map(schoolSubject => {
						return (
							<Option key={schoolSubject} value={schoolSubject}>
								{schoolSubject}
							</Option>
						);
					})}
				</Select>
				<InputNumber
					key={`${subject.subject}-min`}
					style={{
						width: 60,
						marginLeft: "8px",
						textAlign: "center"
					}}
					value={subject.min}
					max={subject.max + 1}
					min={1}
					placeholder="Minimum"
					onChange={v => changeSubjectRange(subject, [v, subject.max])}
				/>
				<Input
					className="site-input-split"
					style={{
						width: 30,
						borderLeft: 0,
						borderRight: 0,
						zIndex: 2,
						pointerEvents: "none"
					}}
					placeholder="~"
					disabled
				/>
				<InputNumber
					key={`${subject.subject}-max`}
					className="site-input-right"
					value={subject.max}
					min={subject.min + 1}
					max={13}
					onChange={v => changeSubjectRange(subject, [subject.min, v])}
					style={{
						width: 60,
						textAlign: "center"
					}}
					placeholder="Maximum"
				/>
			</Input.Group>

			<Button
				icon={<CloseOutlined />}
				style={{ margin: 0, width: "40px" }}
				onClick={() => removeSubject(subject)}
			/>
		</div>
	);
};

export default pure(SubjectItem);
