import React, { useState, useEffect, ReactNode, useCallback, useMemo } from "react";
import useInstructors, { Instructor } from "../../api/useInstructors";
import { ScreeningStatus } from "../../types/Student";
import useDebounce from "../../utils/useDebounce";
import { Student } from "../../api";
import { Select } from "antd";

const toTags = (instructors: Instructor[]) => instructors.map((instructor) => ({ key: instructor.email, value: JSON.stringify(instructor), label: `${instructor.firstname} ${instructor.lastname}` }));

export default function InstructorSelector({ instructors, setInstructors }: { instructors: Instructor[], setInstructors(instructors: Instructor[]): void }) {
    const { instructors: foundInstructors, loadInstructors } = useInstructors({ initialStatus: ScreeningStatus.Accepted, initialSearch: "" });
    const [instructorSearch, setInstructorSearch] = useState<string>("");
    const debouncedInstructorSearch = useDebounce(instructorSearch);

    useEffect(() => {
        loadInstructors({ screeningStatus : ScreeningStatus.Accepted, search: debouncedInstructorSearch });
    }, [debouncedInstructorSearch]);


    const instructorTags = useMemo(() => toTags(instructors), [instructors]);

    function alreadyChosen(newInstructor: Instructor) {
        return instructors.map(i => i.id).indexOf(newInstructor.id) !== -1;
    }

    const addInstructor = ({ value }: { value: string }) => {
        console.log("addInstructor", value);

        let newInstructor = JSON.parse(value);
        {!alreadyChosen(newInstructor) && setInstructors([...instructors, newInstructor])};
    };
    
    const removeInstructor = ({ value } : { value: string }) => {
        setInstructors(instructors.filter(it => JSON.stringify(it) !== value));
    };

    return (
        <>
            
            <Select style={{ width: "300px" }}
                    size="small"
                    mode="multiple"
                    
                    value={instructorTags}
                    onSearch={setInstructorSearch}
                    onSelect={addInstructor}
                    onDeselect={removeInstructor}
                    labelInValue
            >
                {foundInstructors.filter(instructor => !alreadyChosen(instructor)).map(instructor => <Select.Option key={instructor.email} value={JSON.stringify(instructor)}>{instructor.firstname} {instructor.lastname}</Select.Option>)}
            </Select>
            
        </>
    );
}