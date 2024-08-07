import React, { useState, useEffect } from 'react';
import { Button, MenuItem, Typography, Grid, Divider } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
    closeAssignStudents,
    openSuccessPopup,
    getStudentBatchMapping,
    postAssignStudents,
    getAssignStudents,
} from '../../redux/features/taModule/taSlice';
import CustomTextField from '../CustomFields/CustomTextField';
import ReusableDialog from '../CustomFields/ReusableDialog';
import PopUpTable from '../CommonComponent/PopUpTable';
import {
    closeEditStudent,
    openScheduleSession,
} from '../../redux/features/taModule/taScheduling';

import {
    closeCoachEditStudent,
    openCoachScheduleSession,
} from '../../redux/features/CoachModule/coachSchedule';

import {
    closeCoachAssignStudents,
    openCoachSuccessPopup,
    getCoachStudentBatchMapping,
    postCoachAssignStudents,
    getCoachAssignStudents,
} from '../../redux/features/CoachModule/coachSlice';
import {
    closeSelectStudents,
    getCoachMenuAssignedStudents,
    openCreateSessionPopup,
} from '../../redux/features/coach/coachmenuprofileSilce';
import {
    closeTaMenuSelectStudents,
    getTaMenuAssignedStudents,
    openTaMenuCreateSessionsPopup,
} from '../../redux/features/teachingAssistant/tamenuSlice';

const CustomButton = ({
    onClick,
    children,
    color = '#FFFFFF',
    backgroundColor = '#4E18A5',
    borderColor = '#FFFFFF',
    sx,
    ...props
}) => {
    return (
        <Button
            variant="contained"
            onClick={onClick}
            sx={{
                backgroundColor: backgroundColor,
                color: color,
                fontWeight: '700',
                fontSize: '16px',
                borderRadius: '50px',
                padding: '10px 20px',
                border: `2px solid ${borderColor}`,
                '&:hover': {
                    backgroundColor: color,
                    color: backgroundColor,
                    borderColor: color,
                },
                ...sx,
            }}
            {...props}
        >
            {children}
        </Button>
    );
};

const EditStudents = ({ componentname }) => {
    console.log('Component Name :', componentname);
    const dispatch = useDispatch();
    const [selectedTerm, setSelectedTerm] = useState([]);
    const [selectedBatch, setSelectedBatch] = useState('');
    const [searchName, setSearchName] = useState('');
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);

    let stateModuleKey,
        nameKey,
        assignStudentOpenKey,
        closeDialogAction,
        getAssignStudentAction,
        editStudentKey,
        selectedStudentKey;

    let schedulingState, nameKeyScheduling, idKeyScheduling;

    switch (componentname) {
        case 'COACHSCHEDULE':
            stateModuleKey = 'coachModule';
            nameKey = 'coach_name';
            assignStudentOpenKey = 'openCoachEditStudent';
            editStudentKey = 'assignedStudents';
            selectedStudentKey = 'student';
            closeDialogAction = closeCoachEditStudent;
            getAssignStudentAction = getCoachAssignStudents;
            schedulingState = useSelector(state => state.coachScheduling);
            nameKeyScheduling = 'coachName';
            idKeyScheduling = 'coachID';
            break;

        case 'TASCHEDULE':
            stateModuleKey = 'taModule';
            nameKey = 'ta_name';
            assignStudentOpenKey = 'openEditStudent';
            editStudentKey = 'assignedStudents';
            selectedStudentKey = 'student';
            closeDialogAction = closeEditStudent;
            getAssignStudentAction = getAssignStudents;
            schedulingState = useSelector(state => state.taScheduling);
            nameKeyScheduling = 'taName';
            idKeyScheduling = 'taID';
            break;

        case 'COACHMENU_CALENDER':
            stateModuleKey = 'coachMenu';
            nameKey = '';
            assignStudentOpenKey = 'selectStudent';
            editStudentKey = 'assignedCoachStudents';
            selectedStudentKey = 'selectedCoachStudents';
            closeDialogAction = closeSelectStudents;
            getAssignStudentAction = getCoachMenuAssignedStudents;
            schedulingState = useSelector(state => state.coachMenu);
            nameKeyScheduling = '';
            idKeyScheduling = '';
            break;

        case 'TAMENU_CALENDER':
            stateModuleKey = 'taMenu';
            nameKey = '';
            assignStudentOpenKey = 'selectTaStudent';
            editStudentKey = 'assignedTaStudents';
            selectedStudentKey = 'selectedTaStudents';
            closeDialogAction = closeTaMenuSelectStudents;
            getAssignStudentAction = getTaMenuAssignedStudents;
            schedulingState = useSelector(state => state.taMenu);
            nameKeyScheduling = '';
            idKeyScheduling = '';
            break;

        default:
            stateModuleKey = null;
            nameKey = null;
            assignStudentOpenKey = null;
            editStudentKey = null;
            selectedStudentKey = null;
            closeDialogAction = null;
            getAssignStudentAction = null;
            schedulingState = null;
            nameKeyScheduling = null;
            idKeyScheduling = null;
            break;
    }

    const stateSelector = useSelector(state =>
        stateModuleKey ? state[stateModuleKey] : {}
    );
    const {
        [nameKeyScheduling]: assignedName,
        [idKeyScheduling]: assignedId,
        [assignStudentOpenKey]: assignStudentOpen,
        [selectedStudentKey]: selectedStudent,
    } = schedulingState || {};

    const {
        [nameKey]: assignedTAName,
        taID,
        coachID,
        [editStudentKey]: assignedStudents,
    } = stateSelector || {};

    useEffect(() => {
        console.log(
            'stateModuleKey :',
            stateModuleKey,
            'assignStudentOpen :',
            assignStudentOpen
        );
        // dispatch(getAssignStudents(taaId));
        if (stateModuleKey && assignStudentOpen) {
            if (stateModuleKey == 'coachMenu' || stateModuleKey === 'taMenu') {
                dispatch(getAssignStudentAction());
            } else {
                dispatch(getAssignStudentAction(assignedId));
            }
        }
    }, [
        dispatch,
        stateModuleKey,
        assignStudentOpen,
        assignedId,
        getAssignStudentAction,
    ]);

    useEffect(() => {
        console.log('STUDENT BATCH MAPPING : ', assignedStudents);
        if (assignedStudents) {
            const transformedData = assignedStudents.map((stu, index) => ({
                'S. No.': index + 1,
                'Student Name': stu.student.name,
                Program:
                    stu.student.packages.map(pack => pack.name).join(', ') ||
                    'N/A',
                //'Academic Term': stu.student.academic_term,
                Batch:
                    stu.student.batches
                        .map(batch => batch.batch_name)
                        .join(', ') || 'N/A',
                Select: stu.is_active ? 'Active' : 'Inactive',
                // student_id: stu.student_id,
                is_active: stu.is_active,
                id: stu.student.id,
            }));

            console.log('Transformed Data : ', transformedData);

            /*
            const filtered = transformedData.filter(student => {
                const matchesTerm = selectedTerm
                    ? student.Program === selectedTerm
                    : true;
            
                const matchesBatch = selectedBatch
                    ? student.Batch.includes(selectedBatch)
                    : true;
                
                    const matchesName = searchName
                    ? student['Student Name']
                          .toLowerCase()
                          .includes(searchName.toLowerCase())
                    : true;
                return matchesTerm && matchesBatch && matchesName;
            });

            console.log('Filtered Data : ', filtered);

            setFilteredStudents(filtered);
            */
            setFilteredStudents(transformedData);
        }
    }, [assignedStudents, selectedTerm, selectedBatch, searchName]);

    const batchOptions =
        assignedStudents && Array.isArray(assignedStudents)
            ? [
                  ...new Set(
                      assignedStudents
                          .filter(
                              student =>
                                  !selectedTerm ||
                                  student.student.academic_term === selectedTerm
                          )
                          .flatMap(student =>
                              student.student.batches.map(
                                  batch => batch.batch_name
                              )
                          )
                  ),
              ]
            : [];

    const academicTermOptions =
        assignedStudents && Array.isArray(assignedStudents)
            ? [
                  ...new Set(
                      assignedStudents
                          //  .filter(
                          //     (student) =>
                          //     !selectedBatch ||
                          //     student.student.batches.some(
                          //         (batch) => batch.batch_name === selectedBatch
                          //     )
                          //  )
                          .flatMap(student =>
                              student.student.packages.map(pack => pack.name)
                          )
                  ),
              ]
            : [];

    useEffect(() => {
        console.log('Selected Student inside use Effect : ', selectedStudent);
        if (selectedStudent) {
            setSelectedStudents(selectedStudent.map(student => student.id));
        }
    }, [selectedStudent]);

    console.log('already selected students: ', selectedStudent);

    const handleSelectStudent = id => {
        setSelectedStudents(prev =>
            prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
        );
    };

    console.log('selectedStudents 278: ', selectedStudents);

    const handleSubmit = () => {
        const id =
            componentname === 'ADDITCOACH'
                ? coachID || assignedId
                : taID || assignedId;

        const data = {
            [componentname === 'ADDITCOACH' ? 'Coach_id' : 'ta_id']: id,
            name: assignedName,
            student: selectedStudents
                ? selectedStudents.map(id => ({ id }))
                : [],
        };

        console.log('SUBMIT DATA :', data);
        if (componentname === 'COACHMENU_CALENDER') {
            const student = selectedStudents.map(id => ({ id }));
            dispatch(openCreateSessionPopup({ student }));
            dispatch(closeDialogAction());
        } else if (componentname === 'TAMENU_CALENDER') {
            const student = selectedStudents.map(id => ({ id }));
            dispatch(openTaMenuCreateSessionsPopup({ student }));
            dispatch(closeDialogAction());
        } else {
            dispatch(
                openScheduleSession({
                    id,
                    name: assignedName,
                    student: selectedStudents.map(id => ({ id })),
                })
            );
        }

        dispatch(closeDialogAction());
    };

    const headers = ['S. No.', 'Student Name', 'Program', 'Batch', 'Select'];

    const content = (
        <>
            <Grid container spacing={2} justifyContent="center" sx={{ mt: 0 }}>
                <Grid item sm={6}>
                    <CustomTextField
                        select
                        label="Program"
                        value={selectedTerm}
                        onChange={e => setSelectedTerm(e.target.value)}
                    >
                        {academicTermOptions.map(term => (
                            <MenuItem key={term} value={term}>
                                {term}
                            </MenuItem>
                        ))}
                    </CustomTextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <CustomTextField
                        select
                        label="Batch"
                        value={selectedBatch}
                        onChange={e => setSelectedBatch(e.target.value)}
                    >
                        {batchOptions.map(batch => (
                            <MenuItem key={batch} value={batch}>
                                {batch}
                            </MenuItem>
                        ))}
                    </CustomTextField>
                </Grid>
                <Grid item xs={12}>
                    <Divider sx={{ border: '1px solid #C2C2E7' }} />
                </Grid>
                <Grid item xs={12} marginBottom={2}>
                    <CustomTextField
                        label="Search By Student Name"
                        value={searchName}
                        onChange={e => setSearchName(e.target.value)}
                    />
                </Grid>
            </Grid>
            <PopUpTable
                headers={headers}
                initialData={filteredStudents}
                onRowClick={handleSelectStudent}
                selectedBox={selectedStudents}
            />
            <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ mt: 2, textAlign: 'center' }}
            >
                {selectedStudents.length} Student(s) Selected
            </Typography>
        </>
    );

    const actions = (
        <CustomButton
            onClick={handleSubmit}
            style={{
                backgroundColor: '#F56D3B',
                borderColor: '#F56D3B',
                color: '#FFFFFF',
            }}
        >
            Submit
        </CustomButton>
    );

    const assignedTA = assignedTAName || assignedName;

    if (
        componentname === 'COACHMENU_CALENDER' ||
        componentname === 'TAMENU_CALENDER'
    ) {
        return (
            <ReusableDialog
                open={assignStudentOpen}
                handleClose={() => dispatch(closeDialogAction())}
                title={`Assign Students`}
                content={content}
                actions={actions}
            />
        );
    } else {
        return (
            <ReusableDialog
                open={assignStudentOpen}
                handleClose={() => dispatch(closeDialogAction())}
                title={`Assign Students to '${assignedTA}'`}
                content={content}
                actions={actions}
            />
        );
    }
};

export default EditStudents;
