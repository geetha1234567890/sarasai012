import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Box, Button, Typography, Grid, Divider } from '@mui/material';
import CustomFormControl from '../../../components/CustomFields/CustomFromControl';
import CustomTextField from '../../../components/CustomFields/CustomTextField';
import CustomDateField from '../../../components/CustomFields/CustomDateField';
import AvatarInput from '../../../components/CustomFields/AvatarInput';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import CustomTimeZoneForm from '../../../components/CustomFields/CustomTimeZoneForm';
import Header from '../../../components/Header/Header';
import CoachMenu from './CoachMenu';
import {
    transformedTimeZones,
    genders,
    qualificationOptions,
    validateTimeZone,
} from '../../../components/CustomFields/FormOptions';
import moment from 'moment';
import { updateCoachmenuprofile } from '../../../redux/features/CoachModule/coachmenuprofileSilce';
import { useDispatch, useSelector } from 'react-redux';
import { getCoachMenuProfile } from '../../../redux/features/coach/coachmenuprofileSilce';
import { formatInTimeZone } from 'date-fns-tz';

const CoachMenuProfile = () => {
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        control,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: {
            gender: '',
            time_zone: '',
            highest_qualification: '',
            date_of_birth: null,
        },
    });

    const { coachProfileData } = useSelector(state => state.coachMenu);

    //edit button
    const [isEditing, setIsEditing] = useState(false);
    const toggleEdit = () => {
        setIsEditing(true);
    };

    const [selectedImage, setSelectedImage] = useState(null);
    const [dateOfBirth, setDateOfBirth] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [ipData, setIpData] = useState(null);
    const [error, setError] = useState(null);
    const nameValue = watch('name', '');
    const aboutMeValue = watch('about_me', '');

    const handleDateChange = (date, field) => {
        const formattedDate = date ? moment(date).format('YYYY-MM-DD') : '';
        setDateOfBirth(formattedDate);
        field.onChange(formattedDate);
    };

    useEffect(() => {
        dispatch(getCoachMenuProfile());
    }, [dispatch]);

    useEffect(() => {
        if (coachProfileData) {
            populateForm(coachProfileData);
        }
    }, [coachProfileData]);

    useEffect(() => {
        const fetchIP = async () => {
            try {
                // Fetch IP data from ipapi
                const response = await axios.get('https://ipapi.co/json/');
                setIpData(response.data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchIP();
    }, []);

    const convertTimezone = (time, fromTimeZone, toTimeZone) => {
        const formattedTime = formatInTimeZone(
            time,
            fromTimeZone,
            'yyyy-MM-dd HH:mm:ssXXX',
            { timeZone: toTimeZone }
        );
        return formattedTime;
    };

    const getConvertedTime = () => {
        if (ipData && ipData.timezone) {
            const currentTime = new Date();
            return convertTimezone(
                currentTime,
                ipData.timezone,
                coachProfileData.time_zone
            );
        }
        return null;
    };

    const populateForm = data => {
        const formattedDate = moment(data.date_of_birth).format('YYYY-MM-DD');
        setDateOfBirth(formattedDate);

        if (data.profile_picture) {
            const blobUrl = base64ToBlobUrl(data.profile_picture);
            setSelectedImage(blobUrl);
        }

        const formValues = {
            name: data.name,
            username: data.username,
            password: data.password,
            location: data.location,
            address: data.address,
            pincode: data.pincode,
            phone: data.phone,
            time_zone: data.time_zone,
            gender: data.gender,
            email: data.email,
            date_of_birth: formattedDate,
            highest_qualification: data.highest_qualification,
            about_me: data.about_me,
        };

        Object.entries(formValues).forEach(([key, value]) =>
            setValue(key, value)
        );
        Object.entries(formValues).forEach(([key, value]) =>
            setValue(key, value)
        );

        // setPhoneNumber(data.phone);
    };

    const base64ToBlobUrl = base64Data => {
        const byteCharacters = atob(base64Data);
        const byteNumbers = Array.from(byteCharacters, char =>
            char.charCodeAt(0)
        );
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/jpeg' });
        return URL.createObjectURL(blob);
    };

    const onSubmit = async formData => {
        // Handle form submission
        const { email, ...updatedFormData } = formData;
        setIsEditing(false); // Disable edit mode after submit

        updatedFormData.date_of_birth = dateOfBirth;

        if (selectedImage) {
            const base64Data = selectedImage.replace(
                /^data:image\/(png|jpeg|jpg);base64,/,
                ''
            );
            updatedFormData.profile_picture = base64Data;
        }

        console.log('updatedFormData', updatedFormData);
        dispatch(updateCoachmenuprofile(updatedFormData));
    };

    return (
        <>
            <Header />
            <CoachMenu />
            <Box sx={{ p: 2 }}>
                <p
                    style={{
                        fontSize: '44px',
                        justifyContent: 'center',
                        marginBottom: '20px',
                        fontFamily: 'ExtraLight',
                    }}
                >
                    My Profile
                </p>
                <Box
                    sx={{
                        bgcolor: 'white',
                        borderRadius: 2,
                        p: 3,
                        boxShadow: 3,
                        mx: 'auto',
                    }}
                >
                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        <Box display="flex " alignItems="center" mb={3}>
                            <AvatarInput
                                name="profile_picture"
                                selectedImage={selectedImage}
                                setSelectedImage={setSelectedImage}
                            />

                            {!isEditing && (
                                <Button
                                    onClick={toggleEdit}
                                    sx={{
                                        top: 3,
                                        left: 799,
                                        borderRadius: 40,
                                        textTransform: 'none',
                                        backgroundColor: '#F56D3B',
                                        color: 'white',
                                        '&:hover': {
                                            backgroundColor: '#F56D3B',
                                        },
                                    }}
                                >
                                    Edit
                                </Button>
                            )}
                        </Box>
                        <Divider
                            sx={{ mt: 1, mb: 3, border: '1px solid #C2C2E7' }}
                        />

                        <Grid container spacing={4}>
                            <Grid item xs={12} sm={6} md={4}>
                                <CustomTextField
                                    label="Name"
                                    name="name"
                                    placeholder="Enter TA Name"
                                    register={register}
                                    validation={{
                                        required: 'Name is required',
                                        minLength: {
                                            value: 3,
                                            message:
                                                'Name must be at least 3 characters long',
                                        },
                                        pattern: {
                                            value: /^[A-Za-z\s]+$/,
                                            message:
                                                'Name must contain only letters and spaces',
                                        },
                                    }}
                                    errors={errors}
                                    disabled={!isEditing}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6} md={4}>
                                <CustomTextField
                                    label="Username"
                                    name="username"
                                    placeholder="Enter Username"
                                    register={register}
                                    validation={{
                                        required: 'Username is required',
                                        minLength: {
                                            value: 3,
                                            message:
                                                'Username must be at least 3 characters long',
                                        },
                                        maxLength: {
                                            value: 20,
                                            message:
                                                'Username cannot exceed 20 characters',
                                        },
                                        pattern: {
                                            message:
                                                'Username can only contain letters, numbers, and underscores',
                                        },
                                    }}
                                    errors={errors}
                                    disabled={!isEditing}
                                />
                            </Grid>
                            {/*
                            <Grid item xs={12} sm={6} md={4}>
                                <CustomTextField
                                    label="Password"
                                    name="password"
                                    type="password"
                                    placeholder="Enter Password"
                                    register={register}
                                    validation={{
                                        required: 'Password is required',
                                        minLength: {
                                            value: 8,
                                            message:
                                                'Password must be at least 8 characters long',
                                        },
                                        maxLength: {
                                            value: 20,
                                            message:
                                                'Password cannot exceed 20 characters',
                                        },
                                        pattern: {
                                            value: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/,
                                            message:
                                                'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character',
                                        },
                                    }}
                                    errors={errors}
                                />
                            </Grid>
                            */}

                            <Grid item xs={12} sm={6} md={4}>
                                <CustomTextField
                                    label="Email Address"
                                    name="email"
                                    placeholder="Enter Email Address"
                                    register={register}
                                    validation={{
                                        required: 'Email is required',
                                        pattern: {
                                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                            message: 'Invalid email address',
                                        },
                                    }}
                                    errors={errors}
                                    disabled={!isEditing}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <Controller
                                    name="phone"
                                    control={control}
                                    rules={{
                                        required: 'Phone number is required',
                                    }}
                                    render={({ field }) => (
                                        <PhoneInput
                                            {...field}
                                            country={'in'}
                                            // containerStyle={{ width: "100%" }}

                                            inputStyle={{
                                                width: '100%',
                                                borderRadius: '50px',
                                                borderColor: errors.phone
                                                    ? 'red'
                                                    : '#D0D0EC',
                                                outline: 'none',
                                                height: '60px',
                                                // boxShadow: errors.phone ? "0 0 0 2px red" : "none",
                                            }}
                                            buttonStyle={{
                                                borderRadius: '50px 0 0 50px',
                                                borderColor: errors.phone
                                                    ? 'red'
                                                    : '#D0D0EC',
                                                height: '60px',
                                                outline: 'none',
                                                paddingLeft: '10px',
                                                // boxShadow: errors.phone ? "0 0 0 2px red" : "none",
                                            }}
                                            onFocus={e =>
                                                (e.target.style.borderColor =
                                                    errors.phone
                                                        ? 'red'
                                                        : '#D0D0EC')
                                            }
                                            onChange={field.onChange}
                                            disabled={!isEditing}
                                        />
                                    )}
                                />
                                {errors.phone && (
                                    <Typography
                                        variant="body2"
                                        color="error"
                                        sx={{ fontSize: '0.75rem' }}
                                    >
                                        {errors.phone.message}
                                    </Typography>
                                )}
                            </Grid>

                            <Grid item xs={12} sm={6} md={4}>
                                <Controller
                                    name="time_zone"
                                    control={control}
                                    rules={{
                                        required: 'Time Zone is required',
                                    }}
                                    render={({ field }) => {
                                        return (
                                            <CustomFormControl
                                                label="Time Zone"
                                                name="time_zone"
                                                value={field.value}
                                                onChange={field.onChange}
                                                errors={errors}
                                                options={transformedTimeZones}
                                                disabled={!isEditing}
                                            />
                                        );
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6} md={4}>
                                <CustomTextField
                                    label="Address"
                                    name="address"
                                    placeholder="Enter Address"
                                    register={register}
                                    validation={{
                                        required: 'Address is required',
                                        maxLength: {
                                            value: 200,
                                            message:
                                                'Address must not exceed 200 characters',
                                        },
                                    }}
                                    errors={errors}
                                    disabled={!isEditing}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6} md={4}>
                                <CustomTextField
                                    label="Location"
                                    name="location"
                                    placeholder="Enter Location"
                                    register={register}
                                    validation={{
                                        required: 'Location is required',
                                        maxLength: {
                                            value: 200,
                                            message:
                                                'Location must not exceed 200 characters',
                                        },
                                    }}
                                    errors={errors}
                                    disabled={!isEditing}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6} md={4}>
                                <CustomTextField
                                    label="PIN Code"
                                    name="pincode"
                                    type="number"
                                    placeholder="Enter PIN Code"
                                    register={register}
                                    validation={{
                                        required: 'PIN Code is required',
                                        pattern: {
                                            value: /^[a-zA-Z0-9-]*$/,
                                            message:
                                                'PIN Code must be alphanumeric',
                                        },
                                        minLength: {
                                            value: 3,
                                            message:
                                                'PIN Code must be at least 3 digits long',
                                        },
                                        maxLength: {
                                            value: 6,
                                            message:
                                                'PIN Code cannot exceed 6 digits',
                                        },
                                    }}
                                    errors={errors}
                                    disabled={!isEditing}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6} md={4}>
                                <Controller
                                    name="gender"
                                    control={control}
                                    rules={{ required: 'Gender is required' }}
                                    render={({ field }) => (
                                        <CustomFormControl
                                            label="Gender"
                                            name="gender"
                                            value={field.value}
                                            onChange={field.onChange}
                                            errors={errors}
                                            options={genders}
                                            disabled={!isEditing}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <Controller
                                    control={control}
                                    name="date_of_birth"
                                    render={({ field }) => (
                                        <CustomDateField
                                            label="Date of Birth"
                                            name="date_of_birth"
                                            value={dateOfBirth}
                                            onChange={date =>
                                                handleDateChange(date, field)
                                            }
                                            error={!!errors.date_of_birth}
                                            helperText={
                                                errors.date_of_birth?.message
                                            }
                                            disabled={!isEditing}
                                        />
                                    )}
                                    rules={{
                                        required: 'Date of Birth is required',
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6} md={4}>
                                <Controller
                                    name="highest_qualification"
                                    control={control}
                                    rules={{
                                        required:
                                            'Highest Qualification is required',
                                    }}
                                    render={({ field }) => (
                                        <CustomFormControl
                                            label="Highest Qualification"
                                            name="highest_qualification"
                                            value={field.value}
                                            onChange={field.onChange}
                                            errors={errors}
                                            options={qualificationOptions}
                                            disabled={!isEditing}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <CustomTextField
                                    label="About Me"
                                    name="about_me"
                                    placeholder="Write something about yourself"
                                    register={register}
                                    multiline
                                    rows={4}
                                    validation={{
                                        maxLength: {
                                            value: 500,
                                            message:
                                                'About Me must not exceed 500 characters',
                                        },
                                    }}
                                    errors={errors}
                                    disabled={!isEditing}
                                />
                            </Grid>
                        </Grid>
                        {isEditing && (
                            <Button
                                type="submit"
                                variant="contained"
                                style={{
                                    borderRadius: '50px',
                                    padding: '15px 25px',
                                    marginTop: 20,
                                    backgroundColor: '#F56D3B',
                                    height: '50px',
                                    width: '110px',
                                    fontSize: '14px',
                                    fontWeight: '700',
                                    text: '#FFFFFF',
                                }}
                            >
                                Submit
                            </Button>
                        )}
                    </form>
                </Box>
            </Box>
        </>
    );
};

export default CoachMenuProfile;
