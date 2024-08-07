import { Box, DialogActions, Grid, Typography, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Calendar from '../../../components/Calender/indexCalender';
import CalendarNew from '../../../components/Calender/IndexCalenderNew';
import CalendarComponent from '../../../components/Calender/BigCalendar';
import MarkLeave from '../../../components/availability/MarkLeave';

import CreateNewSlot from '../../../components/availability/CreateNewSlot';
import ScheduleSession from '../../../components/availability/ScheduleSession';
import {
    openMarkLeave,
    closeMarkLeave,
    getSlots,
    fetchCoachSlots,
    fetchTAScheduleById,
    selectTAScheduleData,
    openCreateNewSlots,
} from '../../../redux/features/taModule/taAvialability';
import { useDispatch, useSelector } from 'react-redux';
import Slots from '../../../components/availability/Slots';
import ScheduledSessions from '../../../components/availability/ScheduledSessions';
import CancelSchedule from '../../../components/availability/CancelSchedule';
import ReasonForLeave from '../../../components/availability/ReasonForLeave';
import ReschedulingSession from '../../../components/availability/ReschedulingSession';
import { useParams } from 'react-router-dom';
import {
    getTAScheduledSessions,
    openScheduleSession,
} from '../../../redux/features/taModule/taScheduling';
import moment from 'moment';
import Schedule from '../../../components/availability/Schedule';
import EditBatches from '../../../components/availability/EditBatches';
import EditStudents from '../../../components/availability/EditStudents';
import CoachMenu from './CoachMenu';
import {
    getCoachMenuSessions,
    getCoachMenuSlots,
    openCreateSessionPopup,
    openCreteSlotsPopup,
    openMarkLeavePopup,
} from '../../../redux/features/coach/coachmenuprofileSilce';

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
                // padding: "18px 25px",
                border: `1.5px solid ${borderColor}`,
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

const CoachMenuCalendar = () => {
    const dispatch = useDispatch();
    const [slotEvent, setSlotEvent] = useState([]);
    const [sessionEvent, setSessionEvent] = useState([]);

    const {
        coachSlots,
        coachSessions,
        createCoachSlotsPopup,
        createCoachSessionPopup,
        coachSlotsByDate,
        selectStudent,
        selectBatches,
        createCoachLeavePopup,
        LeaveSlotsPopup,
        cancelSessionOnLeave,
        leaveScheduledSessionPopup,
        leaveRescheduleSessionPopup,
        reasonForLeavePopup,
    } = useSelector(state => state.coachMenu);

    useEffect(() => {
        dispatch(getCoachMenuSlots());
        dispatch(getCoachMenuSessions());
    }, [dispatch]);

    console.log('coach slots :', coachSlots);
    console.log('coachSessions', coachSessions);

    useEffect(() => {
        if (coachSessions && coachSessions.length > 0) {
            const transformedEvents = coachSessions.map(event => ({
                title: event.meeting_name,
                start: new Date(
                    event.date.split(' ')[0] + 'T' + event.start_time
                ),
                end: new Date(event.date.split(' ')[0] + 'T' + event.end_time),
            }));
            setSessionEvent(transformedEvents);
        }
    }, [coachSessions]);

    useEffect(() => {
        if (coachSlots && coachSlots.length > 0) {
            const transformedSlots = coachSlots.map(slot => ({
                startDate: new Date(slot.slot_date + 'T' + slot.from_time),
                endDate: new Date(slot.slot_date + 'T' + slot.to_time),
            }));
            setSlotEvent(transformedSlots);
        }
    }, [coachSlots]);

    const handleScheduleNewSession = () => {
        dispatch(openCreateSessionPopup(true));
    };

    const handleMarkLeave = () => {
        dispatch(openMarkLeavePopup(true));
    };

    const handleCreateNewSlot = () => {
        dispatch(openCreteSlotsPopup(true));
    };

    return (
        <>
            <CoachMenu />

            <Box sx={{ backgroundColor: '#f8f9fa', p: 3 }}>
                <DialogActions sx={{ p: 2 }}>
                    <Grid container alignItems="center">
                        <Grid item xs>
                            <Typography
                                variant="h4"
                                sx={{ mb: 4, fontFamily: 'ExtraLight' }}
                            >
                                {'My Calendar'}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Box display="flex" justifyContent="center" gap={2}>
                                <CustomButton
                                    onClick={handleScheduleNewSession}
                                    color="#FFFFFF"
                                    backgroundColor="#4E18A5"
                                    borderColor="#4E18A5"
                                    style={{ textTransform: 'none' }}
                                >
                                    <AddCircleOutlineIcon />
                                    Schedule New Session
                                </CustomButton>

                                <CustomButton
                                    onClick={handleMarkLeave}
                                    color="#F56D3B"
                                    backgroundColor="#FFFFFF"
                                    borderColor="#F56D3B"
                                    style={{ textTransform: 'none' }}
                                >
                                    Mark Leave
                                </CustomButton>

                                <CustomButton
                                    color="#FFFFFF"
                                    backgroundColor="#F56D3B"
                                    borderColor="#F56D3B"
                                    onClick={handleCreateNewSlot}
                                    style={{ textTransform: 'none' }}
                                >
                                    {/* <AddCircleOutlineIcon /> */}
                                    Create New Slot
                                </CustomButton>
                            </Box>
                        </Grid>
                    </Grid>
                </DialogActions>

                <CalendarComponent
                    eventsList={sessionEvent}
                    slotData={slotEvent}
                    componentName={'COACHMENU_CALENDER'}
                />
                {createCoachSessionPopup && (
                    <Schedule componentName={'COACHMENU_CALENDER'} />
                )}
                {createCoachSlotsPopup && (
                    <CreateNewSlot componentName={'COACHMENU_CALENDER'} />
                )}
                {createCoachLeavePopup && (
                    <MarkLeave componentName={'COACHMENU_CALENDER'} />
                )}
                {selectStudent && (
                    <EditStudents componentname={'COACHMENU_CALENDER'} />
                )}
                {selectBatches && (
                    <EditBatches componentname={'COACHMENU_CALENDER'} />
                )}
                {LeaveSlotsPopup && (
                    <Slots componentName={'COACHMENU_CALENDER'} />
                )}
                {leaveScheduledSessionPopup && (
                    <ScheduledSessions componentName={'COACHMENU_CALENDER'} />
                )}
                {cancelSessionOnLeave && (
                    <CancelSchedule componentName={'COACHMENU_CALENDER'} />
                )}
                {leaveRescheduleSessionPopup && (
                    <ReschedulingSession componentName={'COACHMENU_CALENDER'} />
                )}
                {reasonForLeavePopup && (
                    <ReasonForLeave componentName={'COACHMENU_CALENDER'} />
                )}

                {/*{sheduleNewSession && <ScheduleSession open={sheduleNewSession} handleClose={() => setSheduleNewSession(false)} componentName={"TACALENDER"} />}
                 */}
            </Box>
        </>
    );
};

export default CoachMenuCalendar;
