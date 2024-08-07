import React, { useState } from 'react';
import {
    Button,
    DialogContent,
    DialogContentText,
    Grid,
    IconButton,
} from '@mui/material';
import ReusableDialog from '../../../components/CustomFields/ReusableDialog';

import CustomTextField from '../../../components/CustomFields/CustomTextField';
import { blue } from '@mui/material/colors';

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

const DenyDialog = ({ open, handleClose, handleDenySubmit, denyRequestId }) => {
    const [message, setMessage] = useState('');

    const handleDenyDialogClose = () => {
        setMessage('');
        handleClose();
    };

    const handleSubmit = () => {
        handleDenySubmit(denyRequestId, message);
        handleDenyDialogClose();
    };

    const content = (
        <>
            <DialogContentText
                sx={{
                    color: '#1A1E3D',
                    textAlign: 'center',
                }}
            >
                <h1>Are you sure you want to deny the call?</h1>
            </DialogContentText>

            <CustomTextField
                label="Message"
                fullWidth
                placeholder="Enter reason for denial"
                variant="outlined"
                multiline
                value={message}
                onChange={e => setMessage(e.target.value)}
            />
        </>
    );

    const actions = (
        <>
            <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: theme => theme.palette.grey[500],
                }}
            ></IconButton>
            <CustomButton
                onClick={handleSubmit}
                backgroundColor="#F56D3B"
                borderColor="#F56D3B"
                color="#FFFFFF"
            >
                Submit
            </CustomButton>
        </>
    );

    return (
        <ReusableDialog
            open={open}
            handleClose={handleDenyDialogClose}
            content={content}
            actions={actions}
        />
    );
};

export default DenyDialog;
