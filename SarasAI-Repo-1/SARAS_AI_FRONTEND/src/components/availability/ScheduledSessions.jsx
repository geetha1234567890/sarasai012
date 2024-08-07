import React from 'react';
import ReusableDialog from '../CustomFields/ReusableDialog';
import { Box, Button, DialogContent, Typography } from '@mui/material';
import DynamicTable from '../CommonComponent/DynamicTable';
import { useDispatch, useSelector } from 'react-redux';
import PopUpTable from '../CommonComponent/PopUpTable';

import {
    closeScheduledSession,
    openCancelSession,
    openRescheduleSession,
    openScheduledSlots,
    reasonForLeave,
    openReasonForLeave,
} from '../../redux/features/taModule/taAvialability';

import {
    closeCoachScheduledSession,
    openCoachCancelSession,
    openCoachRescheduleSession,
    openCoachScheduledSlots,
    openCoachReasonForLeave,
    reasonForCoachLeave,
} from '../../redux/features/CoachModule/CoachAvailabilitySlice';
import { useParams } from 'react-router-dom';
import {
    closeReasonForLeavePopup,
    closeScheduledSessionForLeave,
    openCancelSessionForLeave,
    openReasonForLeavePopup,
    openRescheduleSessionForLeave,
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

const ScheduledSessions = ({ componentName }) => {
    const dispatch = useDispatch();
    const { id } = useParams();
    let scheduleSessionOpenKey,
        scheduledSessionDataKey,
        schedulingStateKey,
        closeSessionAction,
        openCancelAction,
        openRescheduleAction,
        openSlotsAction,
        slotEventKey,
        openReasonAction,
        reasonForLeaveAction;

    switch (componentName) {
        case 'TACALENDER':
            scheduleSessionOpenKey = 'scheduledSessionOpen';
            scheduledSessionDataKey = 'scheduledSessionData';
            schedulingStateKey = 'taAvialability';
            closeSessionAction = closeScheduledSession;
            openCancelAction = openCancelSession;
            openRescheduleAction = openRescheduleSession;
            openSlotsAction = openScheduledSlots;
            slotEventKey = 'slotEventData';
            openReasonAction = openReasonForLeave;
            reasonForLeaveAction = reasonForLeave;
            break;
        case 'COACHCALENDER':
            scheduleSessionOpenKey = 'scheduledCoachSessionOpen';
            scheduledSessionDataKey = 'scheduledCoachSessionData';
            schedulingStateKey = 'coachAvailability';
            closeSessionAction = closeCoachScheduledSession;
            openCancelAction = openCoachCancelSession;
            openRescheduleAction = openCoachRescheduleSession;
            openSlotsAction = openCoachScheduledSlots;
            slotEventKey = 'slotCoachEventData';
            openReasonAction = openCoachReasonForLeave;
            reasonForLeaveAction = reasonForCoachLeave;
            break;

        case 'COACHMENU_CALENDER':
            scheduleSessionOpenKey = 'leaveScheduledSessionPopup';
            scheduledSessionDataKey = 'coachSessionsForLeave';
            schedulingStateKey = 'coachMenu';
            closeSessionAction = closeScheduledSessionForLeave;
            openCancelAction = openCancelSessionForLeave;
            openRescheduleAction = openRescheduleSessionForLeave;
            openSlotsAction = openScheduledSessionForLeave;
            slotEventKey = 'slotsEventDataForLeave';
            openReasonAction = openReasonForLeavePopup;
            reasonForLeaveAction = closeReasonForLeavePopup;
            break;

        case 'TAMENU_CALENDER':
            scheduleSessionOpenKey = '';
            scheduledSessionDataKey = '';
            schedulingStateKey = '';
            closeSessionAction = '';
            openCancelAction = '';
            openRescheduleAction = '';
            openSlotsAction = '';
            slotEventKey = '';
            openReasonAction = '';
            reasonForLeaveAction = '';
            break;

        default:
            scheduleSessionOpenKey = null;
            scheduledSessionDataKey = null;
            schedulingStateKey = null;
            closeSessionAction = null;
            openCancelAction = null;
            openRescheduleAction = null;
            openSlotsAction = null;
            slotEventKey = null;
            openReasonAction = null;
            reasonForLeaveAction = null;
            break;
    }

    const schedulingState = useSelector(state =>
        schedulingStateKey ? state[schedulingStateKey] : {}
    );
    const {
        [scheduleSessionOpenKey]: scheduledSessionOpen,
        [scheduledSessionDataKey]: scheduledSessionData = [],
        [slotEventKey]: slotEventData,
    } = schedulingState;

    const headers = [
        'S. No.',
        'Session Name',
        'Date',
        'Time',
        'Students',
        'Actions',
    ];

    const formattedData = scheduledSessionData.map((session, index) => ({
        'S. No.': index + 1,
        'Session Name': session.meeting_name,
        Date: session.date.split(' ')[0],
        Time: `${session.start_time} - ${session.end_time}`,
        Students: session.Students.length,
        StudentList: session.Students,
        id: session.id,
    }));

    const handleViewClick = students => {
        // Open a popup to view the students
        console.log('View clicked!', students);
    };

    const handleRescheduleClick = session => {
        dispatch(closeSessionAction());
        console.log('SESSION : ', session);
        dispatch(openRescheduleAction(session));
        console.log('Reschedule clicked!', session);
    };

    const handleCancelClick = session => {
        console.log('Handle Cancel Sessions');
        console.log('component Name :', componentName, session);
        dispatch(closeSessionAction());
        dispatch(openCancelAction(session));
        console.log('Cancel clicked!', session);
    };

    const handleSubmit = () => {
        console.log('*** ScheduledSessions', slotEventData);
        dispatch(openReasonAction(slotEventData));
    };

    const content =
        formattedData.length === 0 ? (
            <DialogContent
                style={{ justifyContent: 'center', display: 'flex' }}
            >
                <Typography>No scheduled sessions.</Typography>
            </DialogContent>
        ) : (
            <PopUpTable
                headers={headers}
                initialData={formattedData}
                onViewClick={handleViewClick}
                onRescheduleClick={handleRescheduleClick}
                onCancelClick={handleCancelClick}
            />
        );

    const actions = (
        <Box>
            <CustomButton
                onClick={handleSubmit}
                backgroundColor="#F56D3B"
                borderColor="#F56D3B"
                color="#FFFFFF"
            >
                Submit
            </CustomButton>
        </Box>
    );

    return (
        <ReusableDialog
            open={scheduledSessionOpen}
            handleClose={() => {
                dispatch(openSlotsAction());
                dispatch(closeSessionAction());
            }}
            title="Scheduled Sessions"
            content={content}
            actions={scheduledSessionData.length === 0 ? actions : undefined}
        />
    );
};

export default ScheduledSessions;
