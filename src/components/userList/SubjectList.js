import React from "react";
import { Select, Button } from "antd";
import { pure } from "recompose";
import { SchoolSubjects } from "./data";
import SubjectItem from "./SubjectItem";

const SubjectList = ({ subjects, setSubjects }) => {
	const changeSubject = (oldSubject, newSubject) => {
		const newList = subjects.filter(s => s.subject !== oldSubject.subject);
		setSubjects([
			...newList,
			{ subject: newSubject, min: oldSubject.min, max: oldSubject.max }
		]);
	};

	const changeSubjectRange = (obj, [min, max]) => {
		const newList = subjects.filter(s => obj.subject !== s.subject);

		setSubjects([...newList, { subject: obj.subject, min, max }]);
	};

	const addSubject = () => {
		const remainingSubject = SchoolSubjects.find(
			n => !subjects.find(i => i.subject === n)
		);
		if (remainingSubject) {
			setSubjects([
				...subjects,
				{ subject: remainingSubject, min: 1, max: 13 }
			]);
		}
	};

	const removeSubject = obj => {
		const newList = subjects.filter(s => obj.subject !== s.subject);
		setSubjects([...newList]);
	};

	console.log(subjects);

	const sortyMagic = (a, b) => {
		if (a.subject < b.subject) {
			return -1;
		}
		if (a.subject > b.subject) {
			return 1;
		}
		return 0;
	};

	return (
		<div>
			{subjects.sort(sortyMagic).map((obj, index) => (
				<SubjectItem
					key={obj.subject + "-" + index}
					changeSubjectRange={changeSubjectRange}
					changeSubject={changeSubject}
					subject={obj}
					removeSubject={removeSubject}
					options={SchoolSubjects.filter(
						n => !subjects.find(i => i.subject === n)
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
