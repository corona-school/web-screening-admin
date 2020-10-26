import React from 'react';
import { Button } from 'antd';
import {ProjectFieldWithGradeInfoType} from '../../types/Student';
import ProjectItem from "./ProjectItem";

interface Props {
    projects: ProjectFieldWithGradeInfoType[];
    setProjects: (projects: ProjectFieldWithGradeInfoType[]) => void;
}

const ProjectList = ({ projects, setProjects }: Props) => {
    const changeProjectName = (oldProject: ProjectFieldWithGradeInfoType, newProjectName: string) => {
        const projectList: ProjectFieldWithGradeInfoType[] = projects.map((p) => {
            if (p.name === oldProject.name) {
                return {
                    name: newProjectName,
                    min: oldProject.min,
                    max: oldProject.max
                };
            }
            return p;
        });

        setProjects(projectList);
    };

    const changeProjectRange = (
        obj: ProjectFieldWithGradeInfoType,
        [min, max]: [number, number]
    ) => {
        const projectList = projects.map((p) => {
            if (p.name === obj.name) {
                return { ...obj, min, max };
            }
            return p;
        });
        console.log(min, max, obj, projectList);

        setProjects(projectList)
    };

    const addProject = () => {
        setProjects([...projects, { name: "", min: 1, max: 13 },]);
    };

    const removeProject = (obj: ProjectFieldWithGradeInfoType) => {
        const newList = projects.filter((p) => obj.name !== p.name);
        setProjects([...newList]);
    };

    return (
        <div>
            {projects.map((obj, index) => (
                <ProjectItem
                    key={obj.name + '-' + index}
                    changeProjectRange={changeProjectRange}
                    changeProjectName={changeProjectName}
                    project={obj}
                    removeProject={removeProject}
                />
            ))}
            <Button
                type="dashed"
                style={{ margin: '8px 0 0px 0' }}
                onClick={addProject}
            >
                add
            </Button>
        </div>
    );
};

export default ProjectList;