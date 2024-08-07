import React from 'react';
import EditIcon from '@mui/icons-material/Edit';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    IconButton,
} from '@mui/material';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';

const ScheduledCalls = () => {
    const calls = [
        {
            id: 1,
            title: 'Meeting Flow > Aman Gupta',
            participants: 'Participants > 3',
            time: '12:30 PM - 01:30 PM',
            status: 'Join Meeting',
        },
        {
            id: 2,
            title: 'Lorem Ipsum is simply dummy',
            participants: 'No Booking Yet',
            time: '12:30 PM - 01:30 PM',
            status: 'Scheduled',
        },
        {
            id: 3,
            title: 'Lorem Ipsum is simply dummy',
            participants: 'No Booking Yet',
            time: '12:30 PM - 01:30 PM',
            status: 'Scheduled',
        },
    ];

    return (
        <>
            <Box m="40px">
                <Header />
                <Sidebar />
                <Box
                    display={'flex'}
                    justifyContent="space-between"
                    alignItems="center"
                    mb="20px"
                >
                    <p
                        style={{
                            fontSize: '44px',
                            justifyContent: 'center',
                            fontFamily: 'ExtraLight',
                        }}
                    >
                        Schedule Calls
                    </p>
                    <Box display={'flex'}>
                        <Button
                            variant="contained"
                            color="warning"
                            startIcon={<CalendarTodayIcon />}
                        >
                            Create New Meeting
                        </Button>
                    </Box>
                </Box>

                <Box display={'flex'} alignItems="center" mb="20px">
                    <IconButton>
                        <ArrowBackIosIcon />
                    </IconButton>
                    <Typography variant="h6" mx="20px">
                        10 July, 2024
                    </Typography>
                    <IconButton>
                        <ArrowForwardIosIcon />
                    </IconButton>
                </Box>

                <Box display="flex" gap="20px">
                    {calls.map(call => (
                        <Card
                            key={call.id}
                            sx={{ minWidth: 275, backgroundColor: 'white' }}
                        >
                            <CardContent>
                                <Box
                                    display="flex"
                                    justifyContent="space-between"
                                >
                                    <Typography variant="h6">
                                        {call.title}
                                    </Typography>
                                    <IconButton>
                                        <EditIcon />
                                    </IconButton>
                                </Box>
                                <Typography color="textSecondary">
                                    {call.participants}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="textSecondary"
                                >
                                    {call.time}
                                </Typography>
                                <Button
                                    variant="contained"
                                    color={
                                        call.status === 'Join Meeting'
                                            ? 'success'
                                            : 'warning'
                                    }
                                    sx={{ mt: 2 }}
                                >
                                    {call.status}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            </Box>
        </>
    );
};

export default ScheduledCalls;
