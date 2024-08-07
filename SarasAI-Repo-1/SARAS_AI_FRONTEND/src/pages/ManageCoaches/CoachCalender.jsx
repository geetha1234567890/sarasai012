import { Box, DialogActions, Grid, Typography, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CalendarComponent from '../../components/Calender/BigCalendar';
import MarkLeave from '../../components/availability/MarkLeave';
import DeleteAllSlots from '../../components/availability/DeleteAllSlots';
import CreateNewSlot from '../../components/availability/CreateNewSlot';
// import ScheduleSession from '../../components/availability/ScheduleSession';
import Slots from '../../components/availability/Slots';
import CancelSchedule from '../../components/availability/CancelSchedule';
import ReasonForLeave from '../../components/availability/ReasonForLeave';
import ReschedulingSession from '../../components/availability/ReschedulingSession';
import ScheduledSessions from '../../components/availability/ScheduledSessions';

import {
    openCoachMarkLeave,
    fetchCoachSlots,
    fetchCoachScheduleById,
    openCoachCreateNewSlots,
} from '../../redux/features/CoachModule/CoachAvailabilitySlice';
import EditBatches from '../../components/availability/EditBatches';
import EditStudents from '../../components/availability/EditStudents';
import { openCoachScheduleSession } from '../../redux/features/CoachModule/coachSchedule';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import Schedule from '../../components/availability/Schedule';

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
                textTransform: 'none',
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

const CoachCalender = () => {
    const dispatch = useDispatch();
    const { id, name } = useParams();
    const [sheduleNewSession, setSheduleNewSession] = useState(false);
    const [deleteFutureSlots, setDeleteFutureSlots] = useState(false);

    const [eventsList, setEventsList] = useState([]);
    const [slotViewData, setSlotViewData] = useState([]);

    const {
        coachMarkLeaveOpen,
        scheduledCoachSlotsOpen,
        scheduledCoachSessionOpen,
        cancelCoachSessionOpen,
        reasonForCoachLeaveOpen,
        resheduleCoachSessionOpen,
        createNewCoachSlotOpen,
        slotCoachData,
        scheduleCoachData,
    } = useSelector(state => state.coachAvailability);

    const {
        scheduleCoachSessionOpen,
        openCoachEditBatch,
        openCoachEditStudent,
    } = useSelector((state) => state.coachScheduling)

    console.log('ta Id :', id);

    useEffect(() => {
        dispatch(fetchCoachSlots(id));
        dispatch(fetchCoachScheduleById(id));
    }, [id]);

    useEffect(() => {
        if (scheduleCoachData && scheduleCoachData.data) {
            const transformedEvents = scheduleCoachData.data.map(event => ({
                title: event.meeting_name,
                start: new Date(
                    event.date.split(' ')[0] + 'T' + event.start_time
                ),
                end: new Date(event.date.split(' ')[0] + 'T' + event.end_time),
            }));
            setEventsList(transformedEvents);
        } else {
            setEventsList([]);
        }
    }, [scheduleCoachData]);

    useEffect(() => {
        if (slotCoachData.data && slotCoachData.data.length > 0) {
            const transformedSlots = slotCoachData.data.map(slot => ({
                startDate: new Date(slot.slot_date + 'T' + slot.from_time),
                endDate: new Date(slot.slot_date + 'T' + slot.to_time),
            }));
            setSlotViewData(transformedSlots);
        } else {
            setSlotViewData([]);
        }
    }, [slotCoachData]);

    console.log(
        'slotCoachData',
        slotCoachData,
        'scheduleCoachData',
        scheduleCoachData
    );

    // useEffect(() => {
    //     ); // Replace `2` with the actual ID you need
    // }, [dispatch]);

    const handleScheduleNewSession = () => {
        console.log('Pressed');
        // setSheduleNewSession();
        dispatch(openCoachScheduleSession({ id, name }));
    };

    const handleMarkLeave = () => {
        dispatch(openCoachMarkLeave());
    };

    const handleDeleteFutureSlots = () => {
        setDeleteFutureSlots(true);
    };

    const handleCreateNewSlot = () => {
        dispatch(openCoachCreateNewSlots());
    };

    return (
        <>
            <Box m={'20px'}>
                <Header />
                <Sidebar />
                <Box sx={{ backgroundColor: '#f8f9fa', p: 3 }}>
                    <DialogActions sx={{ p: 2 }}>
                        <Grid container alignItems="center">
                            <Grid item xs>
                                <Typography
                                    variant="h4"
                                    sx={{ mb: 4, fontFamily: 'ExtraLight' }}
                                >
                                    {name}'s Calendar
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Box
                                    display="flex"
                                    justifyContent="center"
                                    gap={2}
                                >
                                    <CustomButton
                                        onClick={handleScheduleNewSession}
                                        color="#FFFFFF"
                                        backgroundColor="#4E18A5"
                                        borderColor="#4E18A5"
                                    >
                                        <AddCircleOutlineIcon />
                                        Schedule New Session
                                    </CustomButton>

                                    <CustomButton
                                        onClick={handleMarkLeave}
                                        color="#F56D3B"
                                        backgroundColor="#FFFFFF"
                                        borderColor="#F56D3B"
                                    >
                                        Mark Leave
                                    </CustomButton>

                                    <CustomButton
                                        onClick={handleDeleteFutureSlots}
                                        color="#F56D3B"
                                        backgroundColor="#FFFFFF"
                                        borderColor="#F56D3B"
                                    >
                                        Delete All Future Slots
                                    </CustomButton>

                                    <CustomButton
                                        color="#FFFFFF"
                                        backgroundColor="#F56D3B"
                                        borderColor="#F56D3B"
                                        onClick={handleCreateNewSlot}
                                    >
                                        {/* <AddCircleOutlineIcon /> */}
                                        Create New Slot
                                    </CustomButton>
                                </Box>
                            </Grid>
                        </Grid>
                    </DialogActions>

                    <CalendarComponent
                        eventsList={eventsList}
                        // addEvent={   }
                        slotData={slotViewData}
                        componentName={'COACHCALENDER'}
                    />

                    {/* {scheduledCoachSessionOpen && (
                        <ScheduleSession
                            open={sheduleNewSession}
                            handleClose={() => setSheduleNewSession(false)}
                        />
                    )} */}

                    {scheduleCoachSessionOpen && (
                        <Schedule componentName={'COACHSCHEDULE'} />
                    )}
                    {openCoachEditBatch && (
                        <EditBatches componentname={'COACHCALENDER'} />
                    )}
                    {openCoachEditStudent && (
                        <EditStudents componentname={'COACHCALENDER'} />
                    )}
                    {coachMarkLeaveOpen && (
                        <MarkLeave
                            id={id}
                            name={name}
                            componentName={'COACHCALENDER'}
                        />
                    )}

                    {scheduledCoachSlotsOpen && (
                        <Slots
                            id={id}
                            name={name}
                            componentName={'COACHCALENDER'}
                        />
                    )}

                    {scheduledCoachSessionOpen && (
                        <ScheduledSessions
                            id={id}
                            name={name}
                            componentName={'COACHCALENDER'}
                        />
                    )}

                    {cancelCoachSessionOpen && (
                        <CancelSchedule
                            id={id}
                            name={name}
                            componentName={'COACHCALENDER'}
                        />
                    )}

                    {reasonForCoachLeaveOpen && (
                        <ReasonForLeave
                            id={id}
                            name={name}
                            componentName={'COACHCALENDER'}
                        />
                    )}

                    {resheduleCoachSessionOpen && (
                        <ReschedulingSession
                            id={id}
                            name={name}
                            componentName={'COACHCALENDER'}
                        />
                    )}

                    {deleteFutureSlots && (
                        <DeleteAllSlots
                            open={deleteFutureSlots}
                            handleClose={() => setDeleteFutureSlots(false)}
                            id={id}
                            name={name}
                            componentName={'COACHCALENDER'}
                        />
                    )}

                    {createNewCoachSlotOpen && (
                        <CreateNewSlot
                            // addEvent={addEvent}
                            componentName={'COACHCALENDER'}
                        />
                    )}
                </Box>
            </Box>
        </>
    );
};

export default CoachCalender;
