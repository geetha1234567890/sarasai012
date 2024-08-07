import React, { useEffect, useState } from 'react';
import ReusableDialog from '../../../../components/CustomFields/ReusableDialog';
import {
    Button,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
} from '@mui/material';
import CustomTextField from '../../../../components/CustomFields/CustomTextField';
import {
    closeEditModulePopup,
    getCoachTemplateModuleId,
    updateCoachTemplateModule,
} from '../../../../redux/features/CoachModule/CoachTemplateSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import CustomFormControl from '../../../../components/CustomFields/CustomFromControl';
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
const EditModule = () => {
    const dispatch = useDispatch();
    const { openEditModulePopUp, editModuleData, selectedCoachTemplate } =
        useSelector(state => state.coachTemplate);

    const {
        handleSubmit,
        control,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: {
            moduleName: '',
            status: 1,
        },
    });

    const statusOptions = [
        { value: 1, label: 'Active' },
        { value: 0, label: 'Inactive' },
    ];

    useEffect(() => {
        if (editModuleData) {
            setValue('moduleName', editModuleData.name);
            setValue('status', editModuleData.is_active ? 1 : 0);
        }
    }, [editModuleData, setValue]);

    const handleStatusChange = event => {
        setValue('status', event.target.value);
    };

    const onSubmit = data => {
        const updatedData = {
            module_id: editModuleData?.id,
            template_id: selectedCoachTemplate,
            is_active: data.status === 1,
        };
        dispatch(updateCoachTemplateModule(updatedData))
            .unwrap()
            .then(() => {
                dispatch(getCoachTemplateModuleId(selectedCoachTemplate));
                dispatch(closeEditModulePopup());
            });

        console.log(updatedData);
    };

    const content = (
        <Grid
            container
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
                    name="moduleName"
                    control={control}
                    render={({ field }) => (
                        <CustomTextField
                            label="Module Name"
                            variant="outlined"
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Enter Module Name"
                            name="moduleName"
                            fullWidth
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
                    name="status"
                    control={control}
                    render={({ field }) => (
                        <CustomFormControl
                            label="Status"
                            name="status"
                            value={field.value}
                            onChange={e => {
                                field.onChange(e);
                                handleStatusChange(e);
                            }}
                            errors={errors}
                            options={statusOptions}
                        />
                    )}
                />
            </Grid>
        </Grid>
    );

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
                open={openEditModulePopUp}
                handleClose={() => dispatch(closeEditModulePopup())}
                title="Edit Module"
                content={content}
                actions={actions}
            />
        </>
    );
};

export default EditModule;
