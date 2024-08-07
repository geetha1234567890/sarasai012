import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import ReusableDialog from '../CustomFields/ReusableDialog';
import DynamicTable from '../CommonComponent/DynamicTable';
import { useDispatch, useSelector } from 'react-redux';
import PopUpTable from '../CommonComponent/PopUpTable';
import { useParams } from 'react-router-dom';

import {
    closeScheduledSlots,
    openScheduledSession,
    getScheduleSession,
    openReasonForLeave,
} from '../../redux/features/taModule/taAvialability';

import {
    closeCoachScheduledSlots,
    openCoachScheduledSession,
    getCoachScheduleSession,
    openCoachReasonForLeave,
} from '../../redux/features/CoachModule/CoachAvailabilitySlice';
import {
    getSessionForLeave,
    openSlotsForLeave,
    closeSlotsForLeave,
    openScheduledSessionForLeave,
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

const Slots = ({ componentName }) => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const [selectedSlots, setSelectedSlots] = useState([]);
    const [data, setData] = useState([]);

    let scheduleSessionOpenKey,
        scheduledSlotsDataKey,
        schedulingStateKey,
        getAvailableSlotsAction,
        closeScheduleSessionAction,
        getScheduleSessionAction,
        markLeaveKey,
        sliceName;

    switch (componentName) {
        case 'TACALENDER':
            sliceName = 'taAvailability';
            scheduleSessionOpenKey = 'scheduledSlotsOpen';
            scheduledSlotsDataKey = 'scheduledSlotsData';
            schedulingStateKey = 'taAvailability';
            getAvailableSlotsAction = openScheduledSession;
            closeScheduleSessionAction = closeScheduledSlots;
            getScheduleSessionAction = getScheduleSession;
            markLeaveKey = 'markLeaveData';
            break;

        case 'COACHCALENDER':
            sliceName = 'coachAvailability';
            scheduleSessionOpenKey = 'scheduledCoachSlotsOpen';
            scheduledSlotsDataKey = 'scheduledCoachSlotsData';
            schedulingStateKey = 'coachAvailability';
            getAvailableSlotsAction = openCoachScheduledSession;
            closeScheduleSessionAction = closeCoachScheduledSlots;
            getScheduleSessionAction = getCoachScheduleSession;
            markLeaveKey = 'markLeaveData';
            break;

        case 'COACHMENU_CALENDER':
            sliceName = 'coachMenu';
            scheduleSessionOpenKey = 'LeaveSlotsPopup';
            scheduledSlotsDataKey = 'coachSlotsForLeave';
            schedulingStateKey = 'coachMenu';
            getAvailableSlotsAction = openScheduledSessionForLeave;
            closeScheduleSessionAction = closeSlotsForLeave;
            getScheduleSessionAction = getSessionForLeave;
            markLeaveKey = 'markForLeaveData';
            break;

        case 'TAMENU_CALENDER':
            sliceName = 'taMenu';
            scheduleSessionOpenKey = '';
            scheduledSlotsDataKey = '';
            schedulingStateKey = '';
            getAvailableSlotsAction = '';
            closeScheduleSessionAction = '';
            getScheduleSessionAction = '';
            markLeaveKey = '';
            break;

        default:
            sliceName = null;
            scheduleSessionOpenKey = null;
            scheduledSlotsDataKey = null;
            schedulingStateKey = null;
            getAvailableSlotsAction = null;
            closeScheduleSessionAction = null;
            getScheduleSessionAction = null;
            markLeaveKey = null;
            break;
    }

    const schedulingState = useSelector(state => state[sliceName]);

    const {
        [scheduleSessionOpenKey]: scheduledSlotsOpen,
        [scheduledSlotsDataKey]: scheduledSlotsData = [],
        [markLeaveKey]: markLeaveData,
    } = schedulingState;

    useEffect(() => {
        if (scheduledSlotsData) {
            const formattedData = scheduledSlotsData.map((slot, index) => ({
                'S. No.': index + 1,
                Date: slot.slot_date,
                'Slot Time': `${slot.from_time} - ${slot.to_time}`,
                Select: selectedSlots.includes(slot.id),
                id: slot.id,
            }));
            setData(formattedData);
        } else {
            setData([]);
            setSelectedSlots([]);
        }
    }, [scheduledSlotsData]);

    const handleSelect = id => {
        setSelectedSlots(prev =>
            prev.includes(id)
                ? prev.filter(slotId => slotId !== id)
                : [...prev, id]
        );
    };

    const handleSubmit = () => {
        if (selectedSlots.length > 0) {
            const data = selectedSlots.map(slotId => {
                const slot = scheduledSlotsData.find(s => s.id === slotId);
                return {
                    slot_id: slot.id,
                    date: slot.slot_date,
                    start_time: slot.from_time,
                    end_time: slot.to_time,
                };
            });

            const requestData = {
                admin_user_id: id,
                data,
            };

            console.log('Submitting selected slots:', requestData);

            dispatch(getScheduleSessionAction(requestData))
                .then(response => {
                    console.log('API response:', response);
                    dispatch(closeScheduleSessionAction());
                    dispatch(getAvailableSlotsAction(requestData));
                })
                .catch(error => {
                    console.error('API error:', error);
                });
        } else {
            console.log('No slots selected, opening reason for leave');
            dispatch(closeScheduleSessionAction());
            // dispatch(openMarkLeaveAction(markLeaveData));
        }
    };

    const headers = ['S. No.', 'Date', 'Slot Time', 'Select'];

    const table = (
        <PopUpTable
            headers={headers}
            initialData={data}
            onRowClick={handleSelect}
            selectedBox={selectedSlots}
        />
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
            open={scheduledSlotsOpen}
            handleClose={() => dispatch(closeScheduleSessionAction())}
            title="Slots"
            content={table}
            actions={actions}
        />
    );
};

export default Slots;
