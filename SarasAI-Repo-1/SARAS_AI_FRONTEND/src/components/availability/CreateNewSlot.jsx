import React, { useEffect } from 'react';
import {
    Grid,
    Button,
    FormControl,
    RadioGroup,
    FormControlLabel,
    Radio,
    FormGroup,
    Checkbox,
    Box,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import CustomDateField from '../CustomFields/CustomDateField';
import CustomTimeField from '../CustomFields/CustomTimeField'; // Assuming you have a CustomTimeField component
import ReusableDialog from '../CustomFields/ReusableDialog';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CustomTimeZoneForm from '../CustomFields/CustomTimeZoneForm';
import { getTimezone } from '../../redux/features/timezone/timezoneSlice';
import { useParams } from 'react-router-dom';

import {
    createSlots,
    closeCreateNewSlots,
    fetchCoachSlots,
} from '../../redux/features/taModule/taAvialability';
import {
    createCoachSlots,
    closeCoachCreateNewSlots,
} from '../../redux/features/CoachModule/CoachAvailabilitySlice';
import { toast } from 'react-toastify';
import {
    closeCreateSlotsPopup,
    createCoachMenuSlot,
    createCoachSlot,
    getCoachSlots,
} from '../../redux/features/coach/coachmenuprofileSilce';
import {
    closeTaMenuCreateSlotsPopup,
    createTaMenuSlots,
} from '../../redux/features/teachingAssistant/tamenuSlice';
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
const weekDays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
];

const CreateNewSlot = ({ componentName }) => {
    const taId = useParams();
    console.log('taId', taId.id);

    const dispatch = useDispatch();

    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [selectedDays, setSelectedDays] = useState([]);
    const [repeat, setRepeat] = useState('onetime');
    const [fromTime, setFromTime] = useState(null);
    const [toTime, setToTime] = useState(null);

    let schedulingStateKey,
        createNewSlotAction,
        slotEventKey,
        createSlotActions,
        closeCreateNewSlotAction,
        openCreateNewSlotAction;
    switch (componentName) {
        case 'TACALENDER':
            schedulingStateKey = 'taAvialability';
            slotEventKey = 'slotEventData';
            createNewSlotAction = '';
            createSlotActions = createSlots;
            closeCreateNewSlotAction = closeCreateNewSlots;
            openCreateNewSlotAction = 'createNewSlotOpen';
            break;

        case 'COACHCALENDER':
            schedulingStateKey = 'coachAvailability';
            slotEventKey = 'slotCoachEventData';
            createNewSlotAction = '';
            createSlotActions = createCoachSlots;
            closeCreateNewSlotAction = closeCoachCreateNewSlots;
            openCreateNewSlotAction = 'createNewCoachSlotOpen';
            break;

        case 'COACHMENU_CALENDER':
            schedulingStateKey = 'coachMenu';
            slotEventKey = 'slotsEventDataForLeave';
            createNewSlotAction = '';
            createSlotActions = createCoachMenuSlot;
            closeCreateNewSlotAction = closeCreateSlotsPopup;
            openCreateNewSlotAction = 'openCreteSlotsPopup';
            break;

        case 'TAMENU_CALENDER':
            schedulingStateKey = 'taMenu';
            slotEventKey = '';
            createNewSlotAction = '';
            createSlotActions = createTaMenuSlots;
            closeCreateNewSlotAction = closeTaMenuCreateSlotsPopup;
            openCreateNewSlotAction = 'createTaSlotsPopup';
            break;

        default:
            schedulingStateKey = null;
            slotEventKey = null;
            createNewSlotAction = null;
            createSlotActions = null;
            closeCreateNewSlotAction = null;
            openCreateNewSlotAction = null;
            break;
    }

    console.log({
        schedulingStateKey,
        createNewSlotAction,
        slotEventKey,
        createSlotActions,
        closeCreateNewSlotAction,
        openCreateNewSlotAction,
    });

    const schedulingState = useSelector(state =>
        schedulingStateKey ? state[schedulingStateKey] : {}
    );

    const { [slotEventKey]: slotEventData } = schedulingState;

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const { timezones } = useSelector(state => state.timezone);

    const handleDayChange = day => {
        setSelectedDays(prev => {
            if (prev.includes(day)) {
                return prev.filter(d => d !== day);
            } else {
                return [...prev, day];
            }
        });
    };

    useEffect(() => {
        dispatch(getTimezone());
    }, [dispatch]);

    const validate = () => {
        if (!fromDate) {
            toast.error('Please select From Date');
            return false;
        }
        if (!fromTime) {
            toast.error('Please select From Time');
            return false;
        }
        if (!toTime) {
            toast.error('Please select To Time');
            return false;
        }
        if (repeat === 'recurring' && !toDate) {
            toast.error('Please select To Date');
            return false;
        }
        if (repeat === 'recurring' && selectedDays.length === 0) {
            toast.error('Please select at least one day');
            return false;
        }
        return true;
    };

    const onSubmit = formData => {
        console.log('form data', formData);

        if (!validate()) {
            return;
        }

        let weeksArray = Array(7).fill(0);
        if (repeat === 'recurring') {
            selectedDays.forEach(day => {
                const index = weekDays.indexOf(day);
                weeksArray[index] = 1;
            });
        } else if (repeat === 'onetime') {
            const index = new Date(fromDate).getDay();
            weeksArray[index] = 1;
        }

        formData.slot_date = fromDate;
        formData.from_time = fromTime;
        formData.to_time = toTime;
        formData.timezone = 'Asia/Kolkata';
        formData.end_date = repeat === 'recurring' ? toDate : fromDate;
        formData.weeks = weeksArray;
        formData.admin_user_id = taId.id;

        dispatch(createSlotActions(formData)).then(() => {
            dispatch(closeCreateNewSlotAction());
            return dispatch(fetchCoachSlots(taId.id));
        });
    };

    const content = (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{ height: '100%', width: '100%' }}
        >
            <Grid container spacing={2} justifyContent="center">
                <form
                    id="createForm"
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                >
                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        m={4}
                    >
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            display="flex"
                            justifyContent="center"
                        >
                            <CustomDateField
                                label="From Date"
                                value={fromDate}
                                onChange={date => setFromDate(date)}
                                name="fromDate"
                                register={register}
                                validation={{
                                    required: 'From Date is required',
                                }}
                                sx={{ width: '100%' }}
                            />
                        </Grid>
                        <Grid
                            container
                            spacing={3}
                            sx={{ pt: 3, pb: 3 }}
                            justifyContent="center"
                        >
                            <Grid
                                item
                                xs={12}
                                sm={6}
                                display="flex"
                                justifyContent="center"
                            >
                                <CustomTimeField
                                    label="From Time"
                                    name="fromTime"
                                    value={fromTime}
                                    onChange={time => setFromTime(time)}
                                    register={register}
                                    validation={{
                                        required: 'From Time is required',
                                    }}
                                    errors={errors}
                                />
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                sm={6}
                                display="flex"
                                justifyContent="center"
                            >
                                <CustomTimeField
                                    label="To Time"
                                    name="toTime"
                                    value={toTime}
                                    onChange={time => setToTime(time)}
                                    register={register}
                                    validation={{
                                        required: 'To Time is required',
                                    }}
                                    errors={errors}
                                />
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            spacing={3}
                            sx={{ pt: 3 }}
                            justifyContent="center"
                        >
                            <Controller
                                name="time_zone"
                                control={control}
                                // rules={{ required: 'Time Zone is required' }}
                                render={({ field }) => (
                                    <CustomTimeZoneForm
                                        label="Time Zone"
                                        name="time_zone"
                                        value={field.value}
                                        onChange={field.onChange}
                                        errors={errors}
                                        options={timezones}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid
                            container
                            spacing={3}
                            justifyContent="center"
                            sx={{ pt: 3 }}
                        >
                            <Grid
                                item
                                xs={12}
                                display="flex"
                                justifyContent="center"
                            >
                                <FormControl component="fieldset">
                                    <RadioGroup
                                        row
                                        value={repeat}
                                        onChange={e =>
                                            setRepeat(e.target.value)
                                        }
                                        sx={{ justifyContent: 'center' }}
                                    >
                                        <FormControlLabel
                                            value="onetime"
                                            control={<Radio />}
                                            label="One-Time"
                                        />
                                        <FormControlLabel
                                            value="recurring"
                                            control={<Radio />}
                                            label="Recurring"
                                        />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                        </Grid>
                        {repeat === 'recurring' && (
                            <>
                                <Grid
                                    container
                                    spacing={3}
                                    justifyContent="center"
                                    sx={{ pt: 3 }}
                                >
                                    <Grid item xs={12}>
                                        <FormControl component="fieldset">
                                            <FormGroup row>
                                                {weekDays.map(day => (
                                                    <FormControlLabel
                                                        key={day}
                                                        control={
                                                            <Checkbox
                                                                checked={selectedDays.includes(
                                                                    day
                                                                )}
                                                                onChange={() =>
                                                                    handleDayChange(
                                                                        day
                                                                    )
                                                                }
                                                                name={day}
                                                            />
                                                        }
                                                        label={day}
                                                    />
                                                ))}
                                            </FormGroup>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    display="flex"
                                    sx={{ pt: 3 }}
                                    justifyContent="center"
                                >
                                    <CustomDateField
                                        label="To Date"
                                        value={toDate}
                                        onChange={date => setToDate(date)}
                                        name="end_date"
                                        register={register}
                                        validation={{
                                            required: 'To Date is required',
                                        }}
                                        sx={{ width: '100%' }}
                                    />
                                </Grid>
                            </>
                        )}
                    </Box>
                </form>
            </Grid>
        </Box>
    );

    const actions = (
        <>
            <CustomButton
                onClick={() => dispatch(closeCreateNewSlotAction())}
                backgroundColor="white"
                color="#F56D3B"
                borderColor="#F56D3B"
            >
                Back
            </CustomButton>
            <CustomButton
                type="submit"
                form="createForm"
                backgroundColor="#F56D3B"
                color="white"
                borderColor="#F56D3B"
            >
                Submit
            </CustomButton>
        </>
    );

    return (
        <ReusableDialog
            open={openCreateNewSlotAction}
            handleClose={() => dispatch(closeCreateNewSlotAction())}
            title="Create New Slot"
            actions={actions}
            content={content}
        />
    );
};

export default CreateNewSlot;
