import React, { useEffect } from 'react';
import {
    Box,
    Button,
    DialogContent,
    DialogContentText,
    Grid,
    TextField,
} from '@mui/material';
import ReusableDialog from '../CustomFields/ReusableDialog';
import CustomTextField from '../CustomFields/CustomTextField';
import { useDispatch, useSelector } from 'react-redux';
import {
    deleteFutureSlots,
    fetchCoachSlots,
    fetchTAScheduleById,
} from '../../redux/features/taModule/taAvialability';

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

const DeleteAllSlots = ({ open, handleClose, id, name }) => {
    const dispatch = useDispatch();

    const handleSubmit = async () => {
        try {
            console.log('TA ID : ', id);
            console.log('TA NAME : ', name);
            //get today date in YYYY-MM-DD format
            const today = new Date();
            const dd = String(today.getDate()).padStart(2, '0');
            const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            const yyyy = today.getFullYear();

            const todayDate = yyyy + '-' + mm + '-' + dd;

            const data = {
                date: todayDate,
            };

            // dispatch actions
            dispatch(deleteFutureSlots({ id, data })).then(() => {
                console.log('FEtching data after deleting slots');
                handleClose();
                dispatch(fetchCoachSlots(id));
                dispatch(fetchTAScheduleById(id));
            });
        } catch (error) {
            console.log('Error : ', error);
        }
    };

    useEffect(() => {
        if (!open) {
            setReason('');
        }
    }, [open]);

    const content = (
        <>
            <DialogContentText
                sx={{
                    color: '#1A1E3D',
                    textAlign: 'center',
                    p: 2,
                }}
            >
                Are you sure?
            </DialogContentText>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <CustomTextField
                        label="Delete All Future Slots"
                        fullWidth
                        placeholder="Reason for deletion"
                        variant="outlined"
                        multiline
                        rows={4}
                    />
                </Grid>
            </Grid>
        </>
    );

    const actions = (
        <>
            <CustomButton
                onClick={handleClose}
                backgroundColor="#FFFFFF"
                borderColor="#F56D3B"
                color="#F56D3B"
            >
                Back
            </CustomButton>
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
            handleClose={handleClose}
            title="Delete All Future Slots"
            content={content}
            actions={actions}
        />
    );
};

export default DeleteAllSlots;
