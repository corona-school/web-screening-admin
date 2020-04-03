import React from "react";
import { Button } from "antd";
import { pure } from "recompose";
import { SchoolSubjects } from "./data";
import SubjectItem from "./SubjectItem";

const SubjectList = ({ subjects, setSubjects }) => {
	const changeSubject = (oldSubject, newSubject) => {
		setSubjects(
			subjects.map((s) => {
				if (s.subject === oldSubject.subject) {
					return { ...oldSubject, subject: newSubject };
				}
				return s;
			})
		);
	};

	const changeSubjectRange = (obj, [min, max]) => {
		setSubjects(
			subjects.map((s) => {
				if (s.subject === obj.subject) {
					return { ...obj, min, max };
				}
				return s;
			})
		);
	};

	const addSubject = () => {
		const remainingSubject = SchoolSubjects.find(
			(n) => !subjects.find((i) => i.subject === n)
		);
		if (remainingSubject) {
			setSubjects([
				...subjects,
				{ subject: remainingSubject, min: 1, max: 13 },
			]);
		}
	};

	const removeSubject = (obj) => {
		const newList = subjects.filter((s) => obj.subject !== s.subject);
		setSubjects([...newList]);
	};

	return (
		<div>
			{subjects.map((obj, index) => (
				<SubjectItem
					key={obj.subject + "-" + index}
					changeSubjectRange={changeSubjectRange}
					changeSubject={changeSubject}
					subject={obj}
					removeSubject={removeSubject}
					options={SchoolSubjects.filter(
						(n) => !subjects.find((i) => i.subject === n)
					)}
				/>
			))}
			<Button
				type="dashed"
				style={{ margin: "8px 0 0px 0" }}
				onClick={addSubject}>
				add
			</Button>
		</div>
	);
};

export default pure(SubjectList);
