import { Button, Grid } from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    closeReasonForLeave,
    reasonForLeave,
} from '../../redux/features/taModule/taAvialability';
import { closeCoachReasonForLeave } from '../../redux/features/CoachModule/CoachAvailabilitySlice';

import CustomTextField from '../CustomFields/CustomTextField';
import ReusableDialog from '../CustomFields/ReusableDialog';
import {
    closeReasonForLeavePopup,
    reasonForCoachMenuLeave,
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

const ReasonForLeave = ({ componentName }) => {
    const dispatch = useDispatch();

    let reasonForLeaveOpenKey,
        closeReasonForLeaveAction,
        markLeaveKey,
        slotEventKey,
        reasonForLeaveAction,
        sliceName;

    switch (componentName) {
        case 'TACALENDER':
            sliceName = 'taAvialability';
            reasonForLeaveOpenKey = 'reasonForLeaveOpen';
            closeReasonForLeaveAction = closeReasonForLeave;
            markLeaveKey = 'markLeaveData';
            slotEventKey = 'slotEventData';
            reasonForLeaveAction = 'reasonForLeave';
            break;
        case 'COACHCALENDER':
            sliceName = 'coachAvailability';
            reasonForLeaveOpenKey = 'reasonForCoachLeaveOpen'; // Adjust based on your actual key
            closeReasonForLeaveAction = closeCoachReasonForLeave;
            markLeaveKey = 'markLeaveData';
            slotEventKey = 'slotEventData';
            reasonForLeaveAction = '';
            break;
        case 'COACHMENU_CALENDER':
            sliceName = 'coachMenu';
            reasonForLeaveOpenKey = 'reasonForLeavePopup';
            closeReasonForLeaveAction = closeReasonForLeavePopup;
            markLeaveKey = 'markForLeaveData';
            slotEventKey = 'scheduledSessionForLeaveData';
            reasonForLeaveAction = reasonForCoachMenuLeave;
            break;

        case 'TAMENU_CALENDER':
            sliceName = 'taMenu';
            reasonForLeaveOpenKey = null;
            closeReasonForLeaveAction = null;
            markLeaveKey = null;
            slotEventKey = null;
            reasonForLeaveAction = null;
            break;
        default:
            sliceName = null;
            reasonForLeaveOpenKey = null;
            closeReasonForLeaveAction = null;
            markLeaveKey = null;
            slotEventKey = null;
            reasonForLeaveAction = null;
            break;
    }

    const {
        [reasonForLeaveOpenKey]: reasonForLeaveOpen,
        [markLeaveKey]: markLeaveData,
        [slotEventKey]: slotEventDetails,
    } = useSelector(
        state => state[sliceName] // Adjust to access the correct state slice
    );

    console.log('slots EVENT Details', slotEventDetails);

    const handleSubmit = () => {
        if (slotEventDetails && slotEventDetails.length > 0) {
            const slots = slotEventDetails?.map(slotId => {
                const slot = slotId?.data?.find(s => s.id === slotId);
                return {
                    slot_id: slot.id,
                    date: slot.slot_date,
                    start_time: slot.from_time,
                    end_time: slot.to_time,
                };
            });

            // Get the first and last slots
            const firstSlot = slots[0];
            const lastSlot = slots[slots.length - 1];

            const slotEventDetails = {
                admin_user_id: id, // Assuming 'id' is the admin user ID
                start_date: firstSlot.date,
                end_date: lastSlot.date,
                start_time: firstSlot.start_time,
                end_time: lastSlot.end_time,
                approve_status: 1,
                leave_type: 'full',
                reason: '',
                slot_id: slots.map(slot => slot.slot_id), // Collect all slot IDs into an array
            };

            const requestBody = {
                admin_user_id: id,
                approve_status: null,
                leave_type: null,
                reason: null,
                approve_status: null,
                leave_type: null,
                reason: null,

                data: slots.map(slot => slot),
            };

            console.log('SLOT EVENT DATA: ', requestBody);
            if (sliceName === 'coachMenu') {
                const { id, ...details } = requestBody;
                dispatch(reasonForCoachMenuLeave(details));
            } else {
                dispatch(reasonForLeaveAction(requestBody));
            }

            dispatch(closeReasonForLeaveAction());
        } else {
            console.log('No slots selected, opening reason for leave');
            dispatch(reasonForLeaveAction(markLeaveData));
            dispatch(closeReasonForLeaveAction());
        }
    };

    const content = (
        <Grid container spacing={2} justifyContent="center" sx={{ mt: 0 }}>
            <Grid item xs={120}>
                <CustomTextField
                    label="Reason for Leave"
                    fullWidth
                    placeholder="Enter reason for leave"
                    variant="outlined"
                    multiline
                    rows={4}
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
        <ReusableDialog
            open={reasonForLeaveOpen}
            handleClose={() => dispatch(closeReasonForLeaveAction())}
            title="Reason For Leave"
            content={content}
            actions={actions}
        />
    );
};

export default ReasonForLeave;
