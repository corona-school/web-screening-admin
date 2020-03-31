import React from "react";
import { TreeSelect } from "antd";
import { SchoolSubjects, SchoolClasses } from "./data";

const { SHOW_CHILD } = TreeSelect;

const SubjectTreeSelect = ({ setSelectedClasses, selectedClasses }) => {
	const treeData = SchoolSubjects.map((subject, i) => {
		return {
			title: subject,
			value: `0-${i}`,
			checkable: false,
			key: `0-${i}`,
			children: SchoolClasses.map((schoolClass, k) => {
				return {
					title: `${subject}: ${schoolClass} Klasse`,
					value: `0-${i}-${k}`,
					key: `0-${i}-${k}`
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
