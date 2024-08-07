import React from 'react';
import { Controller } from 'react-hook-form';
import { Grid } from '@mui/material';
import CustomFormControl from '../../../../../components/CustomFields/CustomFromControl';

const TestActivityComponent = ({
    control,
    errors,
    assessmentOptions,
    setSelectedAssessmentId,
}) => {
    return (
        <Grid
            item
            xs={12}
            sm={6}
            md={6}
            style={{ margin: '5px 0px', width: '80%' }}
        >
            <Controller
                name="assessment"
                control={control}
                defaultValue=""
                render={({ field }) => (
                    <CustomFormControl
                        label="Assessment"
                        name="assessment"
                        value={field.value}
                        onChange={e => {
                            const selectedValue = e.target.value;
                            field.onChange(e);
                            const selectedOption = assessmentOptions.find(
                                option => option.value === selectedValue
                            );
                            setSelectedAssessmentId(
                                selectedOption ? selectedOption.id : ''
                            );
                        }}
                        errors={errors}
                        options={assessmentOptions}
                    />
                )}
            />
        </Grid>
    );
};

export default TestActivityComponent;
