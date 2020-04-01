import React from "react";
import { TreeSelect } from "antd";
import { SchoolSubjects, SchoolClasses } from "./data";

const { SHOW_CHILD } = TreeSelect;

const SubjectTreeSelect = ({ setSelectedClasses, selectedClasses }) => {
	const treeData = SchoolSubjects.map(subject => {
		return {
			title: subject,
			value: `${subject}`,
			checkable: false,
			key: `${subject}`,
			children: SchoolClasses.map(schoolClass => {
				return {
					title: `${subject}: ${schoolClass} Klasse`,
					value: `${subject}1:${schoolClass}`,
					key: `${subject}:${schoolClass}`
				};
			})
		};
	});

	const tProps = {
		treeData,
		value: selectedClasses,
		onChange: value => setSelectedClasses(value),
		treeCheckable: true,
		showCheckedStrategy: SHOW_CHILD,
		placeholder: "Wähle hier die Fächer aus..",
		style: {
			width: "100%"
		}
	};

	return <TreeSelect {...tProps} />;
};

export default SubjectTreeSelect;
