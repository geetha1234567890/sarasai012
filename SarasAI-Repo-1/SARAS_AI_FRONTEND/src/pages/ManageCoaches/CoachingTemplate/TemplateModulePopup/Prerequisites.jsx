import React, { useState } from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    FormControlLabel,
    Checkbox,
    Grid,
    Typography,
} from '@mui/material';
import CustomTimeField from '../../../../components/CustomFields/CustomTimeField';
import CustomDateField from '../../../../components/CustomFields/CustomDateField';
import { Controller, useForm } from 'react-hook-form';
import CustomFormControl from '../../../../components/CustomFields/CustomFromControl';
import ReusableDialog from '../../../../components/CustomFields/ReusableDialog';

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
                fontSize: '14px',
                borderRadius: '50px',
                padding: '8px 16px',
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

const PrerequisitesPopup = ({ open, handleClose }) => {
    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm();
    const [activityDependence, setActivityDependence] = useState(false);

    const onSubmit = data => {
        console.log(data);
        handleClose();
    };

    const handleCheckboxChange = event => {
        setActivityDependence(event.target.checked);
    };

    const content = (
        <Grid
            container
            spacing={1}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                width: '100%',
            }}
        >
            <Grid
                item
                xs={12}
                sm={6}
                md={6}
                style={{ margin: '10px 0px', width: '80%' }}
            >
                <Controller
                    name="lockUntil"
                    control={control}
                    render={({ field }) => (
                        <CustomDateField
                            label="Lock Until"
                            fullWidth
                            {...field}
                        />
                    )}
                />
            </Grid>
            <Grid
                item
                xs={12}
                sm={6}
                md={6}
                style={{ margin: '10px 0px', width: '80%' }}
            >
                <Controller
                    name="lockTime"
                    control={control}
                    render={({ field }) => (
                        <CustomTimeField label="Time" fullWidth {...field} />
                    )}
                />
            </Grid>
            <Grid
                item
                xs={12}
                sm={6}
                md={6}
                style={{ margin: '10px 0px', width: '80%' }}
            >
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={activityDependence}
                            onChange={handleCheckboxChange}
                            sx={{
                                color: 'black',
                                '&.Mui-checked': {
                                    color: 'black',
                                },
                            }}
                        />
                    }
                    label="Activity Dependence"
                />
            </Grid>
            {activityDependence && (
                <>
                    <Grid
                        item
                        xs={12}
                        style={{ margin: '10px 0px', width: '80%' }}
                    >
                        <Controller
                            name="module"
                            control={control}
                            render={({ field }) => (
                                <CustomFormControl
                                    label="Module"
                                    name={field.name}
                                    value={field.value}
                                    onChange={e => {
                                        field.onChange(e);
                                        // handleCoachChange(e); // Uncomment if you have a handleCoachChange function
                                    }}
                                    options={[
                                        { value: 'module1', label: 'Module 1' },
                                        { value: 'module2', label: 'Module 2' },
                                        { value: 'module3', label: 'Module 3' },
                                    ]}
                                    errors={errors}
                                />
                            )}
                        />
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        style={{ margin: '10px 0px', width: '80%' }}
                    >
                        <Controller
                            name="activity"
                            control={control}
                            render={({ field }) => (
                                <CustomFormControl
                                    label="Activity"
                                    name={field.name}
                                    value={field.value}
                                    onChange={e => {
                                        field.onChange(e);
                                        // handleCoachChange(e); // Uncomment if you have a handleCoachChange function
                                    }}
                                    errors={errors}
                                    options={[
                                        {
                                            value: 'activity1',
                                            label: 'Activity 1',
                                        },
                                        {
                                            value: 'activity2',
                                            label: 'Activity 2',
                                        },
                                        {
                                            value: 'activity3',
                                            label: 'Activity 3',
                                        },
                                    ]}
                                />
                            )}
                        />
                    </Grid>
                </>
            )}
        </Grid>
    );

    const actions = (
        <>
            <CustomButton
                onClick={handleSubmit(onSubmit)}
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
            title="Prerequisites"
            content={content}
            actions={actions}
        />
    );
};

export default PrerequisitesPopup;
