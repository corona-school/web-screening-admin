import React from 'react';
import { Button } from 'antd';
import { pure } from 'recompose';
import { ProjectFields } from './data';
import {ProjectFieldWithGradeInfoType} from "../../types/Student";
import ProjectItem from "./ProjectItem";

interface Props {
    projects: ProjectFieldWithGradeInfoType[];
    setProjects: (projects: ProjectFieldWithGradeInfoType[]) => void;
}

const SubjectList = ({ projects, setProjects }: Props) => {
    const changeProjectName = (oldProject: ProjectFieldWithGradeInfoType, newProject: string) => {
        const projectList: ProjectFieldWithGradeInfoType[] = projects.map((s) => {
            if (s.name === oldProject.name) {
                return {
                    name: newProject,
                    min: oldProject.min,
                    max: oldProject.max
                };
            }
            return s;
        });

        setProjects(projectList);
    };

    const changeProjectRange = (
        obj: ProjectFieldWithGradeInfoType,
        [min, max]: [number | undefined, number | undefined]
    ) => {
        const projectList = projects.map((p) => {
            if (p.name === obj.name) {
                return { ...obj, min, max };
            }
            return p;
        });
        console.log(min, max, obj, projectList);

        setProjects(projectList);
    };

    const addProject = () => {
        const remainingProject = ProjectFields.find(
            (n) => !projects.find((i) => i.name === n)
        );
        if (remainingProject) {
            setProjects([
                ...projects,
                { name: remainingProject, min: undefined, max: undefined  },
            ]);
        }
    };

    const removeProject = (obj: ProjectFieldWithGradeInfoType) => {
        const newList = projects.filter((s) => obj.name !== s.name);
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
                    options={ProjectFields.filter(
                        (n) => !projects.find((i) => i.name === n)
                    )}
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

export default pure(SubjectList);
