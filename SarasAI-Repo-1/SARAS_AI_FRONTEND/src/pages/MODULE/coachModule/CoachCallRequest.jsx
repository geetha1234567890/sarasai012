import React, { useEffect, useState } from 'react';
import {
    Typography,
    Box,
    Button,
    Card,
    CardContent,
    Grid,
} from '@mui/material';
import CoachMenu from './CoachMenu';
import DenyDialog from './DenyDialog';
import {
    approveCallRequest,
    denyCallRequest,
    getCoachCallRequests,
} from '../../../redux/features/coach/coachmenuprofileSilce';
import { useDispatch, useSelector } from 'react-redux';

const CoachCallRequest = () => {
    const [open, setOpen] = useState(false);
    const { coachCallRequests } = useSelector(state => state.coachMenu);
    const [callRequests, setCallRequests] = useState([]);
    const [showFullMessages, setShowFullMessages] = useState({});
    const [denyRequestId, setDenyRequestId] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getCoachCallRequests());
    }, [dispatch]);

    function convertTo12HourFormat(time24) {
        // Split the time into hours, minutes, and seconds
        const [hours, minutes, seconds] = time24.split(':').map(Number);

        const suffix = hours >= 12 ? 'PM' : 'AM';

        const hours12 = hours % 12 || 12;

        const formattedMinutes = minutes.toString().padStart(2, '0');

        return `${hours12}:${formattedMinutes} ${suffix}`;
    }

    const processCoachCallRequests = requests => {
        const processedRequests = requests.map(request => ({
            ...request,
            title: `Meeting request by ${request.sender.name}`,
            For: `${request.date} | ${convertTo12HourFormat(request.start_time)}`,
        }));
        setCallRequests(processedRequests);
    };

    useEffect(() => {
        if (coachCallRequests) {
            processCoachCallRequests(coachCallRequests);
        }
    }, [coachCallRequests]);

    const handleClickOpen = id => {
        setDenyRequestId(id);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleDenySubmit = (id, reason) => {
        dispatch(denyCallRequest(id, reason));
        setOpen(false);
    };

    const handleApprove = id => {
        dispatch(approveCallRequest(id));
    };

    const toggleShowFullMessage = id => {
        setShowFullMessages(prevState => ({
            ...prevState,
            [id]: !prevState[id],
        }));
    };

    const truncateText = (text, limit) => {
        if (text.length <= limit) return text;
        return `${text.slice(0, limit)}...`;
    };

    return (
        <div style={{}}>
            <CoachMenu />

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
                        width: '274px',
                        height: '40px',
                        justifyContent: 'center',
                        fontFamily: 'ExtraLight',
                    }}
                >
                    Call Request
                </Typography>
            </Box>

            <Grid container spacing={2}>
                {callRequests.length &&
                    callRequests.map(callRequest => (
                        <Grid item key={callRequest.id} xs={12} sm={6} md={4}>
                            <Card
                                sx={{
                                    minHeight: '250px',
                                    backgroundColor: 'white',
                                }}
                            >
                                <CardContent>
                                    <Typography gutterBottom sx={{ ml: 2 }}>
                                        {callRequest.title}
                                    </Typography>
                                    <Typography gutterBottom sx={{ ml: 2 }}>
                                        For:{' '}
                                        <span style={{ color: '#5F6383' }}>
                                            {callRequest.For}
                                        </span>
                                    </Typography>
                                    <Typography gutterBottom sx={{ ml: 2 }}>
                                        Requested By:{' '}
                                        <span style={{ color: '#5F6383' }}>
                                            {callRequest.sender.name}
                                        </span>
                                    </Typography>
                                    <Typography gutterBottom sx={{ ml: 2 }}>
                                        Message:{' '}
                                        <span style={{ color: '#5F6383' }}>
                                            {showFullMessages[callRequest.id]
                                                ? callRequest.message
                                                : truncateText(
                                                      callRequest.message,
                                                      50
                                                  )}
                                        </span>
                                        {callRequest.message.length > 50 && (
                                            <Button
                                                onClick={() =>
                                                    toggleShowFullMessage(
                                                        callRequest.id
                                                    )
                                                }
                                                sx={{
                                                    color: '#F56D3B',
                                                    textTransform: 'none',
                                                }}
                                            >
                                                {showFullMessages[
                                                    callRequest.id
                                                ]
                                                    ? 'less'
                                                    : 'more'}
                                            </Button>
                                        )}
                                    </Typography>
                                    {callRequest.status == 'Approved' ? (
                                        <Button
                                            sx={{
                                                height: 43,
                                                width: 112,
                                                borderRadius: 40,
                                                backgroundColor: '#19B420',
                                                color: 'white',
                                                mt: 2,
                                                ml: 6,
                                                '&:hover': {
                                                    backgroundColor: '#19B420',
                                                },
                                            }}
                                        >
                                            Approved
                                        </Button>
                                    ) : (
                                        <Box display="flex" mt={2} ml={6}>
                                            <Button
                                                onClick={() =>
                                                    handleApprove(
                                                        callRequest.id
                                                    )
                                                }
                                                sx={{
                                                    height: 43,
                                                    width: 112,
                                                    borderRadius: 40,
                                                    backgroundColor: '#F56D3B',
                                                    color: 'white',
                                                    '&:hover': {
                                                        backgroundColor:
                                                            '#F56D3B',
                                                    },
                                                }}
                                            >
                                                Approve
                                            </Button>
                                            <Button
                                                onClick={() =>
                                                    handleClickOpen(
                                                        callRequest.id
                                                    )
                                                } // Open the Deny dialog
                                                sx={{
                                                    height: 43,
                                                    width: 112,
                                                    borderRadius: 40,
                                                    color: '#F56D3B', // Font color
                                                    border: '2px solid #F56D3B', // Border color
                                                    ml: 1,
                                                    '&:hover': {
                                                        backgroundColor:
                                                            '#F56D3B',
                                                        color: 'white',
                                                    },
                                                }}
                                            >
                                                Deny
                                            </Button>
                                        </Box>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
            </Grid>

            <DenyDialog
                open={open}
                handleClose={handleClose}
                handleDenySubmit={handleDenySubmit}
                denyRequestId={denyRequestId}
            />
        </div>
    );
};

export default CoachCallRequest;
