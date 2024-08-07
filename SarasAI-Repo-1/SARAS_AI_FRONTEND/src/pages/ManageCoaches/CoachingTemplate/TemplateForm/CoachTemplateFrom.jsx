import React, { useState } from 'react';
import { Box, Grid, TextField, Button, MenuItem } from '@mui/material';
import CustomTextField from '../../../../components/CustomFields/CustomTextField';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createCoachTemplate } from '../../../../redux/features/CoachModule/CoachTemplateSlice';

const durations = [
    { value: 30, label: '30 mins' },
    { value: 45, label: '45 mins' },
    { value: 60, label: '60 mins' },
];

const CustomButton = styled(Button)(({ theme, active }) => ({
    borderRadius: '50px',
    border: '1px solid #F56D3B',
    color: active ? '#fff' : '#F56D3B',
    backgroundColor: active ? '#F56D3B' : '#FFF',
    padding: '8px 16px', // Add padding for horizontal and vertical spacing
    margin: '0 8px',
    '&:hover': {
        backgroundColor: '#F56D3B',
        color: '#fff',
        borderColor: '#F56D3B',
    },
}));

const CoachTemplateForm = () => {
    const dispatch = useDispatch();
    const [templateName, setTemplateName] = useState('');
    const [duration, setDuration] = useState('');
    const [errors, setErrors] = useState({});
    const navigation = useNavigate();

    const validateTemplateName = name => {
        // Regex to ensure the template name is more than 4 characters and contains at least one space between words
        const regex = /^(?=.*\s).{5,}$/;
        if (!regex.test(name)) {
            return 'Template Name must be more than 4 characters and contain at least one space between words';
        }
        return '';
    };

    const validateForm = () => {
        const newErrors = {};
        const templateNameError = validateTemplateName(templateName);
        if (templateNameError) newErrors.templateName = templateNameError;
        if (!duration) newErrors.duration = 'Duration is required';
        return newErrors;
    };

    const handleSubmit = e => {
        e.preventDefault();
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        const newTemplateData = {
            name: templateName,
            duration: duration,
        };

        dispatch(createCoachTemplate(newTemplateData));

        navigation('/template-name', { state: { newTemplateData } });
    };

    const handleTemplateNameChange = e => {
        setTemplateName(e.target.value);
        const error = validateTemplateName(e.target.value);
        setErrors(prevErrors => ({ ...prevErrors, templateName: error }));
    };

    const handleDurationChange = e => {
        setDuration(e.target.value);
        if (errors.duration) {
            setErrors(prevErrors => ({ ...prevErrors, duration: '' }));
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                backgroundColor: '#FFFFFF',
                borderRadius: '10px',
                padding: '20px',
                margin: '0 auto',
                marginTop: '50px',
            }}
        >
            <Grid container spacing={3} sx={{ maxWidth: '800px' }}>
                <Grid item xs={12} sm={6}>
                    <CustomTextField
                        label="Template Name"
                        variant="outlined"
                        value={templateName}
                        onChange={handleTemplateNameChange}
                        placeholder="Enter Template Name"
                        name="templateName"
                        error={!!errors.templateName}
                        helperText={errors.templateName}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <CustomTextField
                        select
                        label="Duration"
                        value={duration}
                        onChange={handleDurationChange}
                        variant="outlined"
                        name="duration"
                        error={!!errors.duration}
                        helperText={errors.duration}
                    >
                        {durations.map(option => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </CustomTextField>
                </Grid>
                <Grid item xs={12}>
                    <CustomButton type="submit" variant="contained">
                        Submit
                    </CustomButton>
                </Grid>
            </Grid>
        </Box>
    );
};

export default CoachTemplateForm;
