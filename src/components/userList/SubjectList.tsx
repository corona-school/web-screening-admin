import React from "react";
import { Button } from "antd";
import { pure } from "recompose";
import { SchoolSubjects } from "./data";
import SubjectItem from "./SubjectItem";
import { ISubject } from "../../api/ApiContext";

interface Props {
	subjects: ISubject[];
	setSubjects: (subjects: ISubject[]) => void;
}

const SubjectList = ({ subjects, setSubjects }: Props) => {
	const changeSubject = (oldSubject: ISubject, newSubject: string) => {
		const subjectList = subjects.map((s) => {
			if (s.subject === oldSubject.subject) {
				return {
					min: oldSubject.min,
					max: oldSubject.max,
					subject: newSubject,
				};
			}
			return s;
		});

		setSubjects(subjectList);
	};

	const changeSubjectRange = (obj: ISubject, [min, max]: [number, number]) => {
		const subjectList = subjects.map((s) => {
			if (s.subject === obj.subject) {
				return { ...obj, min, max };
			}
			return s;
		});

		setSubjects(subjectList);
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

	const removeSubject = (obj: ISubject) => {
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
