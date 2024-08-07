import React, { useState, useEffect } from 'react';
import { Button, MenuItem, Typography, Grid, Divider } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
    closeAssignBatches,
    openSuccessPopup,
    getBatchMapping,
    getTA,
    postAssignBatches,
} from '../../redux/features/taModule/taSlice';

import {
    closeCoachAssignBatches,
    openCoachSuccessPopup,
    getCoachStudentBatchMapping,
    postCoachAssignBatches,
    getCoachBatchMapping,
} from '../../redux/features/CoachModule/coachSlice';

import CustomTextField from '../CustomFields/CustomTextField';
import ReusableDialog from '../CustomFields/ReusableDialog';
import PopUpTable from '../CommonComponent/PopUpTable';
import { openScheduleSession } from '../../redux/features/taModule/taScheduling';

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

const AssignBatches = ({ componentname }) => {
    const dispatch = useDispatch();
    const [selectedBatch, setSelectedBatch] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('');
    const [filteredBatches, setFilteredBatches] = useState([]);

    let stateModuleKey,
        nameKey,
        assignBatchOpenKey,
        batchMappingKey,
        closeDialogAction,
        openSuccessAction,
        getBatchMappingAction,
        postAssignAction;
    let schedulingState, nameKeyScheduling, idKeyScheduling;

    switch (componentname) {
        case 'ADDITCOACH':
            stateModuleKey = 'coachModule';
            nameKey = 'coach_name';
            assignBatchOpenKey = 'assignCoachBatchOpen';
            batchMappingKey = 'coachBatchMapping';
            closeDialogAction = closeCoachAssignBatches;
            openSuccessAction = openCoachSuccessPopup;
            getBatchMappingAction = getCoachBatchMapping;
            postAssignAction = postCoachAssignBatches;
            schedulingState = useSelector(state => state.coachScheduling);
            nameKeyScheduling = 'coachName';
            idKeyScheduling = 'coachID';
            break;
        case 'ADDEDITTA':
            stateModuleKey = 'taModule';
            nameKey = 'ta_name';
            assignBatchOpenKey = 'assignBatchOpen';
            batchMappingKey = 'batchMapping';
            closeDialogAction = closeAssignBatches;
            openSuccessAction = openSuccessPopup;
            getBatchMappingAction = getBatchMapping;
            postAssignAction = postAssignBatches;
            schedulingState = useSelector(state => state.taScheduling);
            nameKeyScheduling = 'taName';
            idKeyScheduling = 'taID';
            break;
        default:
            stateModuleKey = null;
            assignBatchOpenKey = null;
            nameKey = null;
            batchMappingKey = null;
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
        [assignBatchOpenKey]: assignBatchOpen,
        [nameKey]: assignedTAName,
        taID,
        coachID,
        [batchMappingKey]: batchMapping,
        loading,
    } = stateSelector || {};

    useEffect(() => {
        if (stateModuleKey && assignBatchOpen) {
            dispatch(getBatchMappingAction());
        }
    }, [assignBatchOpen, dispatch, getBatchMappingAction]);

    useEffect(() => {
        if (Array.isArray(batchMapping)) {
            console.log('BATCHMAPPING : ', batchMapping);
            const transformedData = batchMapping.map((batch, index) => ({
                'S. No.': index + 1,
                'Batch Name': batch.name,
                Branch: batch.branch.name,
                Select: batch.is_active ? 0 : 1,
                id: batch.id,
            }));

            const filtered = transformedData.filter(batch => {
                const matchesBranch = selectedBranch
                    ? batch.Branch === selectedBranch
                    : true;
                const matchesQuery = searchQuery
                    ? batch['Batch Name']
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase())
                    : true;
                return matchesBranch && matchesQuery;
            });

            setFilteredBatches(filtered);
        }
    }, [batchMapping, selectedBranch, searchQuery]);

    const batchOptions = Array.isArray(batchMapping)
        ? [...new Set(batchMapping.map(batch => batch.branch.name))]
        : [];

    const handleSelectBatch = id => {
        setSelectedBatch(prev =>
            prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
        );
    };

    const handleBranchChange = e => {
        const selectedBranchValue = e.target.value;
        setSelectedBranch(selectedBranchValue);

        if (!selectedBranchValue) {
            // If branch is cleared, reset the filtered batches to all batches
            setFilteredBatches(
                batchMapping.map((batch, index) => ({
                    'S. No.': index + 1,
                    'Batch Name': batch.name,
                    Branch: batch.branch.name,
                    Select: batch.is_active ? 0 : 1,
                    id: batch.id,
                }))
            );
        }
    };

    const handleSubmit = () => {
        const id =
            componentname === 'ADDITCOACH'
                ? coachID || assignedId
                : taID || assignedId;
        const data = {
            [componentname === 'ADDITCOACH' ? 'Coach_id' : 'ta_id']: id,
            batches: selectedBatch.map(id => ({ id: id.toString() })),
        };
        dispatch(postAssignAction({ id, data })).then(() => {
            if (assignedId) {
                dispatch(
                    openScheduleSession({
                        id: assignedId,
                        name: assignedName,
                        batches: selectedBatch.map(id => ({
                            id: id.toString(),
                        })),
                    })
                );
            }
            dispatch(openSuccessAction());
        });
        dispatch(closeDialogAction());
    };

    const headers = ['S. No.', 'Batch Name', 'Branch', 'Select'];

    const content = (
        <>
            <Grid container spacing={2} justifyContent="center" sx={{ mt: 0 }}>
                <Grid item sm={6}>
                    <CustomTextField
                        select
                        label="Branch"
                        value={selectedBranch}
                        onChange={handleBranchChange}
                        onClear={() =>
                            handleBranchChange({ target: { value: '' } })
                        } // Clear functionality
                    >
                        <MenuItem value="">
                            <em>All</em>
                        </MenuItem>
                        {batchOptions.map((branch, index) => (
                            <MenuItem key={index} value={branch}>
                                {branch}
                            </MenuItem>
                        ))}
                    </CustomTextField>
                </Grid>
                <Grid item xs={12}>
                    <Divider sx={{ border: '1px solid #C2C2E7' }} />
                </Grid>
                <Grid item xs={12} mb={2}>
                    <CustomTextField
                        label="Search By Batch Name"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </Grid>
            </Grid>
            <PopUpTable
                headers={headers}
                initialData={filteredBatches}
                onRowClick={handleSelectBatch}
                selectedBox={selectedBatch}
            />
            <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ mt: 2, textAlign: 'center' }}
            >
                {selectedBatch.length} batch(es) Selected
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

    if (loading) {
        return <div>Loading...</div>;
    }

    const assignedTA = assignedTAName || assignedName;

    return (
        <ReusableDialog
            open={assignBatchOpen}
            handleClose={() => dispatch(closeDialogAction())}
            title={`Assign Batches to '${assignedTA}'`}
            content={content}
            actions={actions}
        />
    );
};

export default AssignBatches;
