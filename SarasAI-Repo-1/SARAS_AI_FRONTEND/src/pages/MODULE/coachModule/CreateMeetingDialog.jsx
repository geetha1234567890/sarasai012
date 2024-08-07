import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    Box,
    IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CustomTextField from '../../../components/CustomFields/CustomTextField';
import CustomDateField from '../../../components/CustomFields/CustomDateField';
import CustomTimeField from '../../../components/CustomFields/CustomTimeField';
//import CustomFormControl from '../../../components/CustomFields/CustomFromControl';

//const inputPropsStyle = multiline ? { borderRadius: '25px', padding: '25px 30px 18px 30px' } : { height: '60px', borderRadius: '50px', padding: '18px 2px' };

const CreateMeetingDialog = ({ open, onClose, onSubmit }) => {
    const [meeting, setMeeting] = useState('');
    const [duration, setDuration] = useState('');
    const [participants, setParticipants] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = () => {
        onSubmit({ meeting, duration, participants, date, time, message });
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>
                Create New Meeting
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: '#F56D3B',
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Box mt={2} mb={2}>
                    <CustomTextField
                        select
                        label="Meeting"
                        value={meeting}
                        onChange={e => setMeeting(e.target.value)}
                        fullWidth
                        placeholder="select"
                    >
                        <MenuItem value="Meeting 1">Meeting 1</MenuItem>

                        {/* Add more options as needed */}
                    </CustomTextField>
                </Box>
                <Box mb={2}>
                    <CustomTextField
                        select
                        label="Duration"
                        value={duration}
                        onChange={e => setDuration(e.target.value)}
                        fullWidth
                    >
                        <MenuItem value="30 mins">30 mins</MenuItem>
                        <MenuItem value="45 mins">45 mins</MenuItem>
                        <MenuItem value="60 mins">60 mins</MenuItem>

                        {/* Add more options as needed */}
                    </CustomTextField>
                </Box>
                <Box mb={2}>
                    <CustomTextField
                        label="Number of Participants"
                        placeholder="Enter number of participants"
                        value={participants}
                        onChange={e => setParticipants(e.target.value)}
                        fullWidth
                    />
                </Box>
                <Box mb={2}>
                    <CustomDateField
                        label="Date"
                        InputLabelProps={{ shrink: true }}
                        value={date}
                        onChange={date => setDate(date)}
                        fullWidth
                    />
                </Box>
                <Box mb={2}>
                    <CustomTimeField
                        label="Time"
                        type="time"
                        InputLabelProps={{ shrink: true }}
                        value={time}
                        onChange={time => setTime(time)}
                        fullWidth
                    />
                </Box>
                <Box mb={2}>
                    <CustomTextField
                        label="Message"
                        placeholder="Enter the message"
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        fullWidth
                    />
                </Box>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', height: '80px' }}>
                <Button
                    onClick={handleSubmit}
                    style={{
                        backgroundColor: '#F56D3B',
                        color: 'white',
                        borderRadius: '50px',
                        fontSize: '16px',
                    }}
                >
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateMeetingDialog;
