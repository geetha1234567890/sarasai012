import React, { useEffect, useState } from 'react';
import ReusableDialog from '../../../../components/CustomFields/ReusableDialog';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import {
    Button,
    Grid,
    Typography,
    Box,
    Checkbox,
    FormControlLabel,
    FormControl,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import VideoUploadComponent from './videoUpload/VideoUploadComponent';
import CustomFormControl from '../../../../components/CustomFields/CustomFromControl';
import CustomTextField from '../../../../components/CustomFields/CustomTextField';
import CustomDateField from '../../../../components/CustomFields/CustomDateField';
import CustomTimeField from '../../../../components/CustomFields/CustomTimeField';
import { getActivityType } from '../../../../redux/features/ActivityType/activityTypeSlice';
import { getCoach } from '../../../../redux/features/CoachModule/coachSlice';
import { linkActivity } from '../../../../redux/features/ActivityType/LinkActivitySlice';

import { getCoachAvailableSlotsFromDate } from '../../../../redux/features/CoachModule/coachSchedule';
import { getTaAvailableSlotsFromDate } from '../../../../redux/features/taModule/taScheduling';
import { createCoachSchedule } from '../../../../redux/features/CoachModule/coachSchedule';
import TestActivityComponent from './Components/TestActivityComponent';
import OneOnOneSessionComponent from './Components/OneonOneSessionComponent';
import PDFUploadComponent from './Components/PDFUploadComponent';
import { getCoachTemplateModuleId } from '../../../../redux/features/CoachModule/CoachTemplateSlice';
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
                fontSize: '14px', // Reduced font size
                borderRadius: '50px',
                padding: '8px 16px', // Reduced padding
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

const LinkActivityPopup = ({ open, handleClose, activityId, templateId }) => {
    const dispatch = useDispatch();
    console.log('template id', templateId);
    const {
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm();
    const [fromDate, setFromDate] = useState(null);
    const [activityType, setActivityType] = useState('');
    const [selectedSessionType, setSelectedSessionType] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);
    const [askCoach, setAskCoach] = useState(false);
    const [selectedCoachId, setSelectedCoachId] = useState('');
    const [selectedAssessmentId, setSelectedAssessmentId] = useState('');
    const [selectedActivityId, setSelectedActivityId] = useState('');

    const onSubmit = async data => {
        // Prepare the payload
        console.log('clicked');
        console.log('activity data', data);
        console.log('selected assessment id', selectedAssessmentId);
        const payload = {
            activity_id: activityId, // Ensure this value is correctly set
            activity_type_id:
                activityType === 'test'
                    ? selectedAssessmentId
                    : selectedActivityId, // Ensure this value is correctly set
            link: data.virtualMeetLink, // Add other fields if needed
        };
        console.log('payload', payload);

        try {
            await dispatch(linkActivity(payload))
                .unwrap()
                .then(() => {
                    // Refetch the data to update the table
                    dispatch(getCoachTemplateModuleId(templateId));
                });
            handleClose();
        } catch (error) {
            console.error('Failed to link activity:', error);
        }
    };

    useEffect(() => {
        dispatch(getActivityType());
        dispatch(getCoach());
        // dispatch(getSlotsCoachTemplateModule());
    }, [dispatch]);

    const { typeList } = useSelector(state => state.activityType);
    const { coaches } = useSelector(state => state.coachModule);
    const { coachAvailableSlots } = useSelector(state => state.coachScheduling);
    console.log('coaches', coaches);
    console.log('coachesslot', coachAvailableSlots);
    const activityOptions = typeList
        .filter((_, index) => index < 5)
        .map(type => ({
            value: type.type_name,
            label:
                type.type_name.charAt(0).toUpperCase() +
                type.type_name.slice(1), // Capitalize the first letter of each type_name
            id: type.id,
        }));

    const assessmentOptions = typeList
        .filter((_, index) => index >= 5)
        .map(type => ({
            value: type.type_name,
            label:
                type.type_name.charAt(0).toUpperCase() +
                type.type_name.slice(1), // Capitalize the first letter of each type_name
            id: type.id,
        }));

    const sessionTypes = [
        { value: 'one-on-one', label: 'One-on-one session' },
        { value: 'group', label: 'Group session' },
    ];

    const coachOptions = coaches.map(coach => ({
        value: coach.name,
        label: coach.name,
        id: coach.id,
    }));

    const timeSlots = [
        { value: 'slot1', label: '10:00 AM - 11:00 AM' },
        { value: 'slot2', label: '11:00 AM - 12:00 PM' },
        { value: 'slot3', label: '1:00 PM - 2:00 PM' },
        { value: 'slot4', label: '2:00 PM - 3:00 PM' },
        { value: 'slot5', label: '3:00 PM - 4:00 PM' },
    ];
    const formatTime = time => {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours, 10);
        const minute = parseInt(minutes, 10);
        const ampm = hour >= 12 ? 'pm' : 'am';
        const formattedHour = hour % 12 || 12;
        return `${formattedHour}:${minute < 10 ? '0' : ''}${minute} ${ampm}`;
    };
    const timeZones = [
        { value: 'UTC', label: 'UTC' },
        { value: 'GMT', label: 'GMT' },
        { value: 'PST', label: 'Pacific Standard Time' },
        { value: 'EST', label: 'Eastern Standard Time' },
    ];
    const handleCoachChange = e => {
        const selected = coachOptions.find(
            option => option.value === e.target.value
        );

        if (selected) {
            setSelectedCoachId(selected.id);
            console.log('Selected Coach ID:', selected.id); // Log the selected coach ID
        }
    };

    console.log('hello coach id is', selectedCoachId);
    useEffect(() => {
        const data = {
            admin_user_id: selectedCoachId,
            date: fromDate,
        };
        console.log('data', data);
        if (fromDate && selectedCoachId) {
            dispatch(getTaAvailableSlotsFromDate(data));
            dispatch(getCoachAvailableSlotsFromDate(data));

            const data1 = {
                admin_user_id: selectedCoachId,
                meeting_name: 'Team Meeting',
                meeting_url: 'http://example.com/meeting',
                schedule_date: fromDate,
                slot_id: 'coachAvailableSlots.id',
                start_time: 'coachAvailableSlots.from_time',
                end_time: 'coachAvailableSlots.to_time',
                timezone: 'IST',
                event_status: 'scheduled',
                end_date: fromDate,
                studentId: [1, 2, 3],
                batchId: [12, 13],
                weeks: '[0,1, 0, 0, 0,1,0]',
            };
            if (coachAvailableSlots) {
                dispatch(createCoachSchedule(data1));
            }
        }
    }, [fromDate, dispatch]);

    useEffect(() => {
        // Reset `askCoach` when `activityType` or `selectedSessionType` changes
        setAskCoach(false);
        setSelectedSessionType('');
    }, [activityType]);
    const contentComponent = (
        <Grid
            container
            spacing={1} // Reduced spacing between items
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
                    name="activityName"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <CustomFormControl
                            label="Activity Type"
                            name="activityType"
                            value={field.value}
                            onChange={e => {
                                const selectedOption = activityOptions.find(
                                    option => option.value === e.target.value
                                );
                                setActivityType(e.target.value);
                                setSelectedActivityId(
                                    selectedOption ? selectedOption.id : ''
                                );
                                field.onChange(e);
                            }}
                            errors={errors}
                            options={activityOptions}
                        />
                    )}
                />
            </Grid>

            {activityType === 'videos' && <VideoUploadComponent />}
            {activityType === 'pdf' && <PDFUploadComponent />}

            {activityType === 'link' && (
                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    style={{ margin: '5px 0px', width: '80%' }}
                >
                    <Controller
                        name="link"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <CustomTextField
                                label="Link"
                                name="virtualMeetLink"
                                variant="outlined"
                                value={field.value}
                                onChange={e => {
                                    field.onChange(e);
                                }}
                                placeholder="Enter Link"
                                fullWidth
                            />
                        )}
                    />
                </Grid>
            )}

            {activityType === 'test' && (
                <TestActivityComponent
                    control={control}
                    errors={errors}
                    assessmentOptions={assessmentOptions}
                    setSelectedAssessmentId={setSelectedAssessmentId}
                />
            )}

            {activityType === 'virtual meet' && (
                <>
                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        style={{ margin: '5px 0px', width: '80%' }}
                    >
                        <Controller
                            name="virtualMeetLink"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <CustomTextField
                                    label="Link"
                                    name="virtualMeetLink"
                                    variant="outlined"
                                    value={field.value}
                                    onChange={e => {
                                        field.onChange(e);
                                    }}
                                    placeholder="Enter Link"
                                    fullWidth
                                />
                            )}
                        />
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        style={{ margin: '5px 0px', width: '80%' }}
                    >
                        <FormControl
                            component="fieldset"
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center',
                            }}
                        >
                            <Controller
                                name="sessionType"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <RadioGroup
                                        row
                                        value={field.value}
                                        onChange={e => {
                                            setSelectedSessionType(
                                                e.target.value
                                            );
                                            field.onChange(e.target.value);
                                        }}
                                    >
                                        <FormControlLabel
                                            control={<Radio />}
                                            label="One-on-one session"
                                            value="one-on-one"
                                        />
                                        <FormControlLabel
                                            control={<Radio />}
                                            label="Group session"
                                            value="group"
                                        />
                                    </RadioGroup>
                                )}
                            />
                        </FormControl>
                    </Grid>
                </>
            )}

            {selectedSessionType === 'one-on-one' && (
                <OneOnOneSessionComponent
                    askCoach={askCoach}
                    setAskCoach={setAskCoach}
                />
            )}
            {selectedSessionType === 'group' &&
                activityType === 'virtual meet' && (
                    <>
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={6}
                            style={{ margin: '5px 0px', width: '80%' }}
                        >
                            <Controller
                                name="coach"
                                control={control}
                                defaultValue="coach"
                                render={({ field }) => (
                                    <CustomFormControl
                                        label="Select Coach"
                                        name="coach"
                                        value={field.value}
                                        onChange={e => {
                                            field.onChange(e);
                                            handleCoachChange(e);
                                            // handleCoachChange(e); // Uncomment if you have a handleCoachChange function
                                        }}
                                        errors={errors}
                                        options={coachOptions}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={6}
                            style={{ margin: '5px 0px', width: '80%' }}
                        >
                            <Controller
                                name="date"
                                control={control}
                                defaultValue={null}
                                render={({ field }) => (
                                    <CustomDateField
                                        label="Select Date"
                                        name="date"
                                        value={fromDate}
                                        onChange={setFromDate}
                                        fullWidth
                                    />
                                )}
                            />
                        </Grid>

                        <Grid
                            item
                            xs={12}
                            style={{ margin: '5px 0px', width: '80%' }}
                        >
                            <Typography variant="h6">
                                Available Slots
                            </Typography>
                            {coachAvailableSlots &&
                            coachAvailableSlots.length > 0 ? (
                                <RadioGroup>
                                    {coachAvailableSlots.map((slot, index) => (
                                        <FormControlLabel
                                            key={index}
                                            control={<Radio />}
                                            label={`${formatTime(slot.from_time)} - ${formatTime(slot.to_time)}`}
                                            value={slot.timeFrom}
                                        />
                                    ))}
                                </RadioGroup>
                            ) : (
                                <Typography>No slots available</Typography>
                            )}
                        </Grid>
                        <Grid
                            container
                            spacing={1}
                            style={{ margin: '5px 0px', width: '80%' }}
                        >
                            <Grid item xs={6}>
                                <Controller
                                    name="fromTime"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <CustomTimeField
                                            {...field}
                                            label="From Time"
                                            fullWidth
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Controller
                                    name="toTime"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <CustomTimeField
                                            {...field}
                                            label="To Time"
                                            fullWidth
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={6}
                            style={{ margin: '5px 0px', width: '80%' }}
                        >
                            <Controller
                                name="timezone"
                                control={control}
                                defaultValue="IST"
                                render={({ field }) => (
                                    <CustomFormControl
                                        label="Time Zone"
                                        name="timezone"
                                        value={field.value}
                                        onChange={e => {
                                            field.onChange(e);
                                        }}
                                        errors={errors}
                                        options={timeZones.map(zone => ({
                                            value: zone.value,
                                            label: zone.label,
                                        }))}
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
            title="Link Activity"
            content={contentComponent}
            actions={actions}
        />
    );
};

export default LinkActivityPopup;
