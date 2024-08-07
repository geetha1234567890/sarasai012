import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ReusableDialog from '../CustomFields/ReusableDialog';
import {
    closeCreateTa,
    closeEditTa,
    closeSuccessPopup,
    openAssignBatches,
    openAssignStudents,
} from '../../redux/features/taModule/taSlice';
import {
    openCoachAssignBatches,
    openCoachAssignStudents,
    closeCoachSuccessPopup,
    closeEditCoach,
    closeCreateCoach,
} from '../../redux/features/CoachModule/coachSlice';
import { Button, Typography } from '@mui/material';

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
                textTransform: 'none',
                ...sx,
            }}
            {...props}
        >
            {children}
        </Button>
    );
};

const SubmitPopup = ({ componentname }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    let stateModuleKey,
        nameKey,
        closeSuccessPopupAction,
        closeCreateAction,
        closeEditAction,
        openAssignBatchesAction,
        openAssignStudentsAction;

    switch (componentname) {
        case 'ADDITCOACH':
            stateModuleKey = 'coachModule';
            nameKey = 'coach_name';
            closeSuccessPopupAction = closeCoachSuccessPopup;
            closeCreateAction = closeCreateCoach;
            closeEditAction = closeEditCoach;
            openAssignBatchesAction = openCoachAssignBatches;
            openAssignStudentsAction = openCoachAssignStudents;
            break;
        case 'ADDEDITTA':
            stateModuleKey = 'taModule';
            nameKey = 'ta_name';
            closeSuccessPopupAction = closeSuccessPopup;
            closeCreateAction = closeCreateTa;
            closeEditAction = closeEditTa;
            openAssignBatchesAction = openAssignBatches;
            openAssignStudentsAction = openAssignStudents;
            break;
        default:
            stateModuleKey = null;
            nameKey = null;
            closeSuccessPopupAction = null;
            closeCreateAction = null;
            closeEditAction = null;
            openAssignBatchesAction = null;
            openAssignStudentsAction = null;
            break;
    }

    const {
        successPopup,
        coachSuccessPopup,
        error,
        loading,
        ta_name,
        coach_name,
    } =
        useSelector(state => (stateModuleKey ? state[stateModuleKey] : {})) ||
        {};

    const displayName = nameKey === 'ta_name' ? ta_name : coach_name;

    const handleAssignBatches = () => {
        dispatch(closeSuccessPopupAction());
        dispatch(openAssignBatchesAction());
    };

    const handleAssignStudents = () => {
        dispatch(closeSuccessPopupAction());
        dispatch(openAssignStudentsAction());
    };

    const handleCloseButton = () => {
        dispatch(closeSuccessPopupAction());
        dispatch(closeCreateAction());
        dispatch(closeEditAction());
        if (componentname === 'ADDITCOACH') {
            navigate('/coach-mapping');
        } else {
            navigate('/ta-mapping');
        }
    };

    const handleDoItLater = () => {
        if (componentname === 'ADDITCOACH') {
            navigate('/coach-mapping');
        } else {
            navigate('/ta-mapping');
        }
    };

    const actions = (
        <>
            <CustomButton
                onClick={handleAssignStudents}
                backgroundColor="#F56D3B"
                color="white"
                borderColor="#F56D3B"
            >
                Assign Students
            </CustomButton>
            <CustomButton
                onClick={handleAssignBatches}
                backgroundColor="white"
                color="#F56D3B"
                borderColor="#F56D3B"
            >
                Assign Batches
            </CustomButton>
            <Typography
                onClick={handleDoItLater}
                color="#1A1E3D"
                sx={{ marginTop: '10px', cursor: 'pointer' }}
            >
                Do it Later
            </Typography>
        </>
    );

    return (
        <ReusableDialog
            open={
                stateModuleKey === 'coachModule'
                    ? coachSuccessPopup
                    : successPopup
            }
            handleClose={handleCloseButton}
            title={`'${displayName}' successfully created.`}
            actions={actions}
        />
    );
};

export default SubmitPopup;
