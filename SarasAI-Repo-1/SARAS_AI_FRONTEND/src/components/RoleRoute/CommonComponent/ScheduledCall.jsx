import React, { useEffect, useState } from 'react';
import {
    Typography,
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    IconButton,
    Popover,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import editIcon from '../../../assets/editIcon.png';
import CreateMeetingDialog from '../../../pages/MODULE/coachModule/CreateMeetingDialog';
import calender from '../../../assets/calender.svg';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DateCalendar, LocalizationProvider } from '@mui/x-date-pickers';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { getCoachScheduledCalls } from '../../../redux/features/coach/coachmenuprofileSilce';
import { getTaScheduledCalls } from '../../../redux/features/teachingAssistant/tamenuSlice';

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

const ScheduledCall = ({ role }) => {
    const dispatch = useDispatch();
    const [newMeetingPopUpOpen, setNewMeetingPopUpOpen] = useState(false);
    const [date, setDate] = useState(moment());
    const [anchorEl, setAnchorEl] = useState(null);
    const { coachScheduledCalls } = useSelector(state => state.coachMenu);
    const { taScheduledCalls } = useSelector(state => state.taMenu);

    const [scheduledCalls, setScheduledCalls] = useState([]);

    function formatDate(date) {
        const localDate = new Date(date);
        const offset = 5.5 * 60 * 60000;
        const adjustedDate = new Date(localDate.getTime() + offset);
        return adjustedDate.toISOString().split('T')[0];
    }

    useEffect(() => {
        if (role == 'Coach') {
            dispatch(getCoachScheduledCalls(formatDate(date)));
        } else if (role == 'TA') {
            dispatch(getTaScheduledCalls(formatDate(date)))
                .then(response => console.log(response))
                .catch(error => console.error(error));
        }
    }, [dispatch, date, role]);

    function convertTo12HourFormat(time24) {
        // Split the time into hours, minutes, and seconds
        const [hours, minutes, seconds] = time24.split(':').map(Number);

        const suffix = hours >= 12 ? 'PM' : 'AM';

        const hours12 = hours % 12 || 12;

        const formattedMinutes = minutes.toString().padStart(2, '0');

        return `${hours12}:${formattedMinutes} ${suffix}`;
    }

    const isCallActive = (startTime, endTime) => {
        const nowUtc = new Date();
        const offset = 5.5 * 60 * 60 * 1000;
        const nowIst = new Date(nowUtc.getTime() + offset);
        const currentTime = nowIst.toISOString().split('T')[1].split('.')[0];

        return currentTime >= startTime && currentTime <= endTime;
    };

    const processScheduledCalls = requests => {
        const now = new Date();
        const offset = 5.5 * 60 * 60 * 1000;
        const currentTime = new Date(now.getTime() + offset)
            .toISOString()
            .split('T')[1]
            .split('.')[0];
        let filteredRequests = [];

        if (date > now) {
            filteredRequests = requests;
        } else {
            filteredRequests = requests.filter(
                request => request.end_time >= currentTime
            );
        }

        const sortedRequests = filteredRequests.sort((a, b) => {
            return a.start_time.localeCompare(b.start_time);
        });

        const processedCalls = sortedRequests.map(request => ({
            ...request,
            time: `${convertTo12HourFormat(request.start_time)} - ${convertTo12HourFormat(request.end_time)}`,
            callActive: isCallActive(request.start_time, request.end_time),
        }));
        setScheduledCalls(processedCalls);
    };

    useEffect(() => {
        if (role == 'Coach') {
            processScheduledCalls(coachScheduledCalls);
        } else if (role == 'TA') {
            processScheduledCalls(taScheduledCalls);
        }
    }, [coachScheduledCalls, taScheduledCalls]);

    const handleDateChange = newDate => {
        if (newDate && newDate.isValid()) {
            setDate(newDate);
            handleCalendarClose();
        }
    };

    const handleIncrement = () => {
        setDate(prevDate => moment(prevDate).add(1, 'days'));
    };

    const handleDecrement = () => {
        setDate(prevDate => moment(prevDate).subtract(1, 'days'));
    };

    const handleCalendarOpen = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleCalendarClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'calendar-popover' : undefined;

    const handleClose = () => {
        setNewMeetingPopUpOpen(false);
    };

    const onNewMeetingSubmit = props => {
        console.log(props);
        setNewMeetingPopUpOpen(false);
    };

    const handleClickJoinMeeting = meetingUrl => {
        if (meetingUrl) {
            window.open(meetingUrl, '_blank');
        } else {
            console.error('Meeting URL is not provided');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            {newMeetingPopUpOpen && (
                <CreateMeetingDialog
                    open={newMeetingPopUpOpen}
                    onClose={handleClose}
                    onSubmit={onNewMeetingSubmit}
                />
            )}
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
            >
                <Typography
                    variant="h4"
                    gutterBottom
                    sx={{
                        fontFamily: 'ExtraLight',
                    }}
                >
                    Scheduled Calls
                </Typography>
                <CustomButton
                    color="#FFFFFF"
                    backgroundColor="#F56D3B"
                    borderColor="#F56D3B"
                    style={{ textTransform: 'none' }}
                    onClick={() => setNewMeetingPopUpOpen(true)}
                >
                    <AddCircleOutlineIcon />
                    Create New Session
                </CustomButton>
            </Box>

            <LocalizationProvider dateAdapter={AdapterMoment}>
                <Box display="flex" alignItems="center" mb="20px">
                    <Typography variant="h6" mx="20px">
                        <img
                            src={calender}
                            style={{
                                width: '32px',
                                height: '32px',
                                marginRight: '10px',
                                cursor: 'pointer',
                            }}
                            onClick={handleCalendarOpen}
                        />
                        {date.format('MMMM DD, YYYY')}
                    </Typography>
                    <IconButton onClick={handleDecrement}>
                        <ArrowBackIosIcon />
                    </IconButton>
                    <IconButton onClick={handleIncrement}>
                        <ArrowForwardIosIcon />
                    </IconButton>
                    <Popover
                        id={id}
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleCalendarClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                    >
                        <DateCalendar date={date} onChange={handleDateChange} />
                    </Popover>
                </Box>
            </LocalizationProvider>

            <Grid container spacing={2}>
                {scheduledCalls.map(call => (
                    <Grid item key={call.id} xs={12} sm={6} md={4}>
                        <Card
                            sx={{
                                minHeight: '150px',
                                backgroundColor: 'white',
                                position: 'relative',
                            }}
                        >
                            <IconButton
                                color="primary"
                                sx={{
                                    position: 'absolute',
                                    top: '10px',
                                    right: '10px',
                                    marginLeft: '10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#F56D3B',
                                    backgroundColor: '#FEEBE3',
                                    gap: '4px',
                                    height: '30px',
                                    width: '70px',
                                    borderRadius: '15px',
                                    padding: '5px',
                                    '&:hover': {
                                        backgroundColor:
                                            'rgba(245, 235, 227, 0.8)',
                                    },
                                    '& img': {
                                        height: '16px', // adjust size as needed
                                        width: '16px', // adjust size as needed
                                    },
                                    '& small': {
                                        lineHeight: '16px', // match this with the image height for better alignment
                                    },
                                }}
                            >
                                <img src={editIcon} alt="" />
                                <small
                                    style={{
                                        fontSize: '14px',
                                    }}
                                >
                                    Edit
                                </small>
                            </IconButton>
                            <CardContent>
                                <Typography
                                    gutterBottom
                                    sx={{ fontWeight: 'bold' }}
                                >
                                    {call.meeting_name}
                                </Typography>
                                <Typography gutterBottom>
                                    {call.students.length > 0 ? (
                                        <a
                                            href="#"
                                            style={{
                                                textDecoration: 'underline',
                                                color: '#F56D3B',
                                            }}
                                        >
                                            Participants
                                        </a>
                                    ) : (
                                        'No bookings yet'
                                    )}
                                </Typography>
                                <Typography gutterBottom>
                                    {call.time}
                                </Typography>
                                <Box
                                    display="flex"
                                    justifyContent="flex-end"
                                    mt={2}
                                >
                                    {call.callActive ? (
                                        <CustomButton
                                            color="#FFFFFF"
                                            backgroundColor="#19B420"
                                            borderColor="#19B420"
                                            style={{ textTransform: 'none' }}
                                            onClick={() =>
                                                handleClickJoinMeeting(
                                                    call.meeting_url
                                                )
                                            }
                                        >
                                            Join Session
                                        </CustomButton>
                                    ) : (
                                        <CustomButton
                                            color="#FFFFFF"
                                            backgroundColor="#F56D3B"
                                            borderColor="#F56D3B"
                                            style={{ textTransform: 'none' }}
                                        >
                                            Scheduled
                                        </CustomButton>
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

export default ScheduledCall;
