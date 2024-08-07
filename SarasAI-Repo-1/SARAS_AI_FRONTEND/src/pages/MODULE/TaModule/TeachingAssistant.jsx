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
import {
    transformedTimeZones,
    genders,
    qualificationOptions,
    validateTimeZone,
} from '../../../components/CustomFields/FormOptions';

const AddEditTeachingAssistant = () => {
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

    const [selectedImage, setSelectedImage] = useState(null);
    const [dateOfBirth, setDateOfBirth] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState('');

    const nameValue = watch('name', '');
    const aboutMeValue = watch('about_me', '');

    const handleDateChange = (date, field) => {
        const formattedDate = date ? moment(date).format('YYYY-MM-DD') : '';
        setDateOfBirth(formattedDate);
        field.onChange(formattedDate);
    };

    const onSubmit = async formData => {
        // Handle form submission
    };

    return (
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
                        <Box ml={3}>
                            <Typography
                                variant="h5"
                                sx={{
                                    fontSize: '20px',
                                    fontWeight: '600',
                                    color: '#1A1E3D',
                                }}
                            >
                                {nameValue || 'Name of the Teaching Assistant'}
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    fontSize: '14px',
                                    fontWeight: '400',
                                    mb: 3,
                                    color: '#5F6383',
                                }}
                            >
                                {aboutMeValue || 'Short Description'}
                            </Typography>
                        </Box>
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
                            />
                        </Grid>

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
                                            'PIN Code must be at least 3 characters long',
                                    },
                                    maxLength: {
                                        value: 10,
                                        message:
                                            'PIN Code cannot exceed 10 characters',
                                    },
                                }}
                                errors={errors}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <Controller
                                name="time_zone"
                                control={control}
                                rules={{ required: 'Time Zone is required' }}
                                render={({ field }) => {
                                    return (
                                        <CustomFormControl
                                            label="Time Zone"
                                            name="time_zone"
                                            value={field.value}
                                            onChange={field.onChange}
                                            errors={errors}
                                            options={transformedTimeZones}
                                        />
                                    );
                                }}
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
                            />
                        </Grid>
                    </Grid>
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
                </form>
            </Box>
        </Box>
    );
};

export default AddEditTeachingAssistant;
