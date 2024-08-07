import React, { useState, useEffect } from 'react';
import { Button, MenuItem, Typography, Grid, Divider } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
    closeAssignStudents,
    openSuccessPopup,
    getStudentBatchMapping,
    postAssignStudents,
} from '../../redux/features/taModule/taSlice';
import CustomTextField from '../CustomFields/CustomTextField';
import ReusableDialog from '../CustomFields/ReusableDialog';
import PopUpTable from '../CommonComponent/PopUpTable';
import { openScheduleSession } from '../../redux/features/taModule/taScheduling';
import {
    closeCoachAssignStudents,
    openCoachSuccessPopup,
    getCoachStudentBatchMapping,
    postCoachAssignStudents,
} from '../../redux/features/CoachModule/coachSlice';

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

const AssignStudents = ({ componentname }) => {
    const dispatch = useDispatch();
    const [selectedTerm, setSelectedTerm] = useState('');
    const [selectedBatch, setSelectedBatch] = useState('');
    const [searchName, setSearchName] = useState('');
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);

    let stateModuleKey,
        nameKey,
        assignStudentOpenKey,
        assignMappingKey,
        closeDialogAction,
        openSuccessAction,
        getBatchMappingAction,
        postAssignAction;
    let schedulingState, nameKeyScheduling, idKeyScheduling;

    switch (componentname) {
        case 'ADDITCOACH':
            stateModuleKey = 'coachModule';
            nameKey = 'coach_name';
            assignStudentOpenKey = 'assignCoachStudentOpen';
            assignMappingKey = 'coachStudentBatchMapping';
            closeDialogAction = closeCoachAssignStudents;
            openSuccessAction = openCoachSuccessPopup;
            getBatchMappingAction = getCoachStudentBatchMapping;
            postAssignAction = postCoachAssignStudents;
            schedulingState = useSelector(state => state.coachScheduling);
            nameKeyScheduling = 'coachName';
            idKeyScheduling = 'coachID';
            break;
        case 'ADDEDITTA':
            stateModuleKey = 'taModule';
            nameKey = 'ta_name';
            assignStudentOpenKey = 'assignStudentOpen';
            assignMappingKey = 'studentBatchMapping';
            closeDialogAction = closeAssignStudents;
            openSuccessAction = openSuccessPopup;
            getBatchMappingAction = getStudentBatchMapping;
            postAssignAction = postAssignStudents;
            schedulingState = useSelector(state => state.taScheduling);
            nameKeyScheduling = 'taName';
            idKeyScheduling = 'taID';
            break;
        default:
            stateModuleKey = null;
            nameKey = null;
            assignStudentOpenKey = null;
            assignMappingKey = null;
            closeDialogAction = null;
            openSuccessAction = null;
            getBatchMappingAction = null;
            postAssignAction = null;
            schedulingState = null;
            nameKeyScheduling = null;
            idKeyScheduling = null;
            break;
    }

    const stateSelector = useSelector(state =>
        stateModuleKey ? state[stateModuleKey] : {}
    );
    const { [nameKeyScheduling]: assignedName, [idKeyScheduling]: assignedId } =
        schedulingState || {};

    const {
        [assignStudentOpenKey]: assignStudentOpen,
        [nameKey]: assignedTAName,
        taID,
        coachID,
        [assignMappingKey]: studentBatchMapping,
    } = stateSelector || {};

    useEffect(() => {
        if (stateModuleKey && assignStudentOpen) {
            dispatch(getBatchMappingAction());
        }
    }, [assignStudentOpen, dispatch, getBatchMappingAction]);

    useEffect(() => {
        if (studentBatchMapping) {
            const transformedData = studentBatchMapping.map(
                (student, index) => ({
                    'S. No.': index + 1,
                    'Student Name': student.student_name,
                    Program:
                        student.packages.map(pack => pack.name).join(', ') ||
                        'N/A',
                    Batch:
                        student.batches
                            .map(batch => batch.batch_name)
                            .join(', ') || 'N/A',
                    Select: student.is_active ? 1 : 0,
                    id: student.student_id,
                    is_active: student.is_active,
                })
            );

            const filtered = transformedData.filter(student => {
                const matchesTerm = selectedTerm
                    ? student.Program.includes(selectedTerm)
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

            setFilteredStudents(filtered);
        }
    }, [studentBatchMapping, selectedTerm, selectedBatch, searchName]);

    // Generate unique batch options and program options
    const batchOptions = studentBatchMapping
        ? [
              ...new Set(
                  studentBatchMapping
                      .filter(
                          student =>
                              !selectedTerm ||
                              student.packages
                                  .map(pack => pack.name)
                                  .includes(selectedTerm)
                      )
                      .flatMap(student =>
                          student.batches.map(batch => batch.batch_name)
                      )
              ),
          ]
        : [];

    const academicTermOptions = studentBatchMapping
        ? [
              ...new Set(
                  studentBatchMapping.flatMap(student =>
                      student.packages.map(pack => pack.name)
                  )
              ),
          ]
        : [];

    const handleSelectStudent = id => {
        setSelectedStudents(prev =>
            prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
        );
    };

    const handleSubmit = () => {
        const id =
            componentname === 'ADDITCOACH'
                ? coachID || assignedId
                : taID || assignedId;
        const data = {
            [componentname === 'ADDITCOACH' ? 'Coach_id' : 'ta_id']: id,
            student: selectedStudents.map(id => ({ id: id.toString() })),
        };
        dispatch(postAssignAction({ id, data })).then(() => {
            if (assignedId) {
                dispatch(
                    openScheduleSession({
                        id: assignedId,
                        name: assignedName,
                        student: selectedStudents.map(id => ({
                            id: id.toString(),
                        })),
                    })
                );
            }
            dispatch(openSuccessAction());
        });
        dispatch(closeDialogAction());
    };

    const headers = ['S. No.', 'Student Name', 'Program', 'Batch', 'Select'];

    const content = (
        <>
            <Grid container spacing={2}>
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
    return (
        <ReusableDialog
            open={assignStudentOpen}
            handleClose={() => dispatch(closeDialogAction())}
            title={`Assign Students to '${assignedTA}'`}
            content={content}
            actions={actions}
        />
    );
};

export default AssignStudents;
