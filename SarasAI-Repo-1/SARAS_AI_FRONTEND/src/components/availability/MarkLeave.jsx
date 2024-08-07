import React, { useState } from 'react';
import {
    DialogContent,
    Grid,
    TextField,
    Button,
    IconButton,
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CloseIcon from '@mui/icons-material/Close';
import ReusableDialog from '../CustomFields/ReusableDialog';
import CustomDateField from '../CustomFields/CustomDateField';
import { toast } from 'react-toastify';
import Slots from './Slots';

import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { useParams } from 'react-router-dom';

import {
    openScheduledSlots,
    closeMarkLeave,
    getSlots,
} from '../../redux/features/taModule/taAvialability';

import {
    openCoachScheduledSlots,
    closeCoachMarkLeave,
    getCoachSlots,
} from '../../redux/features/CoachModule/CoachAvailabilitySlice';
import {
    closeMarkLeavePopup,
    getCoachMenuSlotsByData,
    getSlotsForLeave,
    openMarkLeavePopup,
    openScheduledSessionForLeave,
    openSlotsForLeave,
} from '../../redux/features/coach/coachmenuprofileSilce';

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

const MarkLeave = ({ componentName }) => {
    const { id: taId } = useParams(); // Ensure taId is correctly extracted
    const dispatch = useDispatch();
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);

    let scheduleSessionOpenKey,
        schedulingStateKey,
        openAvailableSlotsAction,
        closeMarkLeaveAction,
        getSlotsAction,
        sliceName;

    switch (componentName) {
        case 'TACALENDER':
            sliceName = 'taAvialability';
            scheduleSessionOpenKey = 'markLeaveOpen';
            schedulingStateKey = 'taAvialability';
            openAvailableSlotsAction = openScheduledSlots;
            closeMarkLeaveAction = closeMarkLeave;
            getSlotsAction = getSlots;
            break;

        case 'COACHCALENDER':
            sliceName = 'coachAvailability';
            scheduleSessionOpenKey = 'coachMarkLeaveOpen';
            schedulingStateKey = 'coachAvailability';
            openAvailableSlotsAction = openCoachScheduledSlots;
            closeMarkLeaveAction = closeCoachMarkLeave;
            getSlotsAction = getCoachSlots;
            break;

        case 'COACHMENU_CALENDER':
            (sliceName = 'coachMenu'),
                (scheduleSessionOpenKey = 'createCoachLeavePopup');
            schedulingStateKey = 'coachMenu';
            openAvailableSlotsAction = openSlotsForLeave;
            closeMarkLeaveAction = closeMarkLeavePopup;
            getSlotsAction = getSlotsForLeave;
            break;

        case 'TAMENU_CALENDER':
            sliceName = 'taMenu';
            scheduleSessionOpenKey = '';
            schedulingStateKey = 'taMenu';
            openAvailableSlotsAction = '';
            closeMarkLeaveAction = '';
            getSlotsAction = '';
            break;

        default:
            sliceName = null;
            scheduleSessionOpenKey = null;
            schedulingStateKey = null;
            openAvailableSlotsAction = null;
            closeMarkLeaveAction = null;
            getSlotsAction = null;
            break;
    }

    const schedulingState = useSelector(state =>
        schedulingStateKey ? state[schedulingStateKey] : {}
    );
    const { [scheduleSessionOpenKey]: markLeaveOpen } = schedulingState;

    const validateDates = () => {
        if (!fromDate || !toDate) {
            toast.error('Please select dates');
            return false;
        }
        return true;
    };

    const handleSubmit = () => {
        if (validateDates()) {
            const formattedFromDate = moment(fromDate).format('YYYY-MM-DD');
            const formattedToDate = moment(toDate).format('YYYY-MM-DD');

            const leaveData = {
                admin_user_id: taId, // Ensure taId is correctly extracted
                start_date: formattedFromDate,
                end_date:
                    formattedFromDate === formattedToDate
                        ? formattedFromDate
                        : formattedToDate,
                start_time: '00:00:00',
                end_time: '23:59:59',
            };

            dispatch(getSlotsAction(leaveData))
                .unwrap()
                .then(() => {
                    if (sliceName === 'coachMenu') {
                        console.log('ComponetName :', componentName);
                        dispatch(openAvailableSlotsAction());
                        dispatch(closeMarkLeaveAction());
                    } else {
                        dispatch(openAvailableSlotsAction(leaveData));
                        dispatch(closeMarkLeaveAction());
                    }
                })
                .catch(error => {
                    console.error('Failed to fetch scheduled slots:', error);
                    dispatch(openAvailableSlotsAction(leaveData));
                });
        }
    };

    const content = (
        <Grid
            container
            sx={{
                pt: 3,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
            }}
        >
            <Grid item xs={12} sm={6}>
                <CustomDateField
                    label="From Date"
                    value={fromDate}
                    onChange={setFromDate}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <CustomDateField
                    label="To Date"
                    value={toDate}
                    onChange={setToDate}
                />
            </Grid>
        </Grid>
    );

    const actions = (
        <CustomButton
            onClick={handleSubmit}
            backgroundColor="#F56D3B"
            borderColor="#F56D3B"
            color="#FFFFFF"
        >
            Submit
        </CustomButton>
    );

    return (
        <>
            <ReusableDialog
                open={markLeaveOpen}
                handleClose={() => dispatch(closeMarkLeaveAction())}
                title="Mark Leave"
                content={content}
                actions={actions}
            />
        </>
    );
};

export default MarkLeave;
