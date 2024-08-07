import React from 'react';
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
} from '@mui/material';

const CustomTimeZoneForm = ({
    label,
    name,
    value,
    onChange,
    errors,
    options,
    disabled,
}) => {
    const hasError = !!errors[name];
    // console.log("label", label , name , value )
    return (
        <FormControl variant="outlined" disabled={disabled} fullWidth>
            <InputLabel
                style={{ margin: 0 }}
                sx={{
                    color: hasError ? 'red' : '#1A1E3D',
                    '&.Mui-focused': {
                        color: '#1A1E3D', // Change label color on focus regardless of error
                    },
                    '&.MuiFormLabel-filled': {
                        color: hasError ? 'red' : '#1A1E3D', // Change label color when the field is filled
                    },
                }}
            >
                {label}
            </InputLabel>
            <Select
                label={label}
                name={name}
                value={value}
                onChange={onChange}
                error={!!errors[name]}
                disabled={disabled}
                MenuProps={{
                    PaperProps: {
                        style: {
                            maxHeight: 200, // Set max height to make it scrollable
                        },
                    },
                }}
                sx={{
                    borderRadius: '50px',
                    height: '60px',
                    padding: '18px 2px',
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#D0D0EC',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#D0D0EC',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: hasError ? 'red' : 'rgb(245, 109, 59)', // Change border color on focus based on error
                        color: '#1A1E3D',
                    },
                }}
            >
                {options.map(option => (
                    <MenuItem key={option.country} value={option.utc_offset}>
                        {option.time_zone}
                    </MenuItem>
                ))}
            </Select>
            {hasError && (
                <Typography
                    variant="body2"
                    color="error"
                    sx={{ fontSize: '0.75rem' }}
                >
                    {errors[name].message}
                </Typography>
            )}
        </FormControl>
    );
};

export default CustomTimeZoneForm;
