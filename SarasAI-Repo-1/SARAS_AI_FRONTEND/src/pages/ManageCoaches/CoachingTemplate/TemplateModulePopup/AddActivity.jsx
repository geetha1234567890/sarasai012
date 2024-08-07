import React, { useState } from 'react';
import ReusableDialog from '../../../../components/CustomFields/ReusableDialog';
import { Button, Grid } from '@mui/material';
import CustomTextField from '../../../../components/CustomFields/CustomTextField';
import CustomFormControl from '../../../../components/CustomFields/CustomFromControl';
import CustomDateField from '../../../../components/CustomFields/CustomDateField';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form'; // Import Controller and useForm
import {
    closeTemplateActivityPopup,
    createCoachTemplateActivity,
    getCoachTemplateModuleId,
} from '../../../../redux/features/CoachModule/CoachTemplateSlice';

// Custom button component for consistent styling
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

const AddActivity = () => {
    const dispatch = useDispatch();
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const [afterDueDate, setAfterDueDate] = useState('');
    const { openActivityPopUp, moduleID, selectedCoachTemplate } = useSelector(
        state => state.coachTemplate
    );

    const handleAfterDueDateChange = event => {
        setAfterDueDate(event.target.value);
    };

    const content = (
        <Grid
            container
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                width: '100%', // Ensure the container takes the full width
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
                    name="activityName"
                    control={control}
                    rules={{ required: 'Activity Name is required' }}
                    render={({ field }) => (
                        <CustomTextField
                            label="Activity Name"
                            variant="outlined"
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Enter Activity Name"
                            name="activityName"
                            fullWidth
                            error={!!errors.activityName}
                            helperText={errors.activityName?.message}
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
                    name="dueDate"
                    control={control}
                    rules={{ required: 'Due Date is required' }}
                    render={({ field }) => (
                        <CustomDateField
                            label="Due Date"
                            name="dueDate"
                            value={field.value}
                            onChange={field.onChange}
                            disableFutureDates={false} // Adjust this as needed
                            error={!!errors.dueDate}
                            helperText={errors.dueDate?.message}
                            sx={{ width: '100%' }}
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
                    name="points"
                    control={control}
                    rules={{ required: 'Points are required' }}
                    render={({ field }) => (
                        <CustomTextField
                            label="Points"
                            variant="outlined"
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Enter Points"
                            name="points"
                            fullWidth
                            error={!!errors.points}
                            helperText={errors.points?.message}
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
                    name="afterDueDate"
                    control={control}
                    rules={{ required: 'After Due Date is required' }}
                    render={({ field }) => (
                        <CustomFormControl
                            label="After Due Date"
                            name="afterDueDate"
                            value={field.value}
                            onChange={field.onChange}
                            errors={errors}
                            options={[
                                {
                                    value: 'Close Activity',
                                    label: 'Close Activity',
                                },
                                { value: 'No Points', label: 'No Penalty' },
                                { value: 'No Effect', label: 'No Effect' },
                            ]}
                        />
                    )}
                />
            </Grid>
        </Grid>
    );

    const onSubmit = data => {
        const formData = {
            module_id: moduleID?.id,
            activity_name: data.activityName,
            due_date: data.dueDate,
            points: data.points,
            after_due_date: data.afterDueDate,
        };

        dispatch(createCoachTemplateActivity(formData))
            .unwrap()
            .then(() => {
                dispatch(getCoachTemplateModuleId(selectedCoachTemplate));
            });
        dispatch(closeTemplateActivityPopup());
    };

    const actions = (
        <CustomButton
            onClick={handleSubmit(onSubmit)}
            backgroundColor="#F56D3B"
            borderColor="#F56D3B"
            color="#FFFFFF"
        >
            Submit
        </CustomButton>
    );

    return (
        <>
            <ReusableDialog
                open={openActivityPopUp}
                handleClose={() => dispatch(closeTemplateActivityPopup())}
                title="Add Activity"
                content={content}
                actions={actions}
            />
        </>
    );
};

export default AddActivity;
