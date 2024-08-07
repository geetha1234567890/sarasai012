// OneOnOneSessionComponent.jsx
import React from 'react';
import { Checkbox, FormControlLabel, Grid } from '@mui/material';

const OneOnOneSessionComponent = ({ askCoach, setAskCoach }) => {
    return (
        <Grid
            item
            xs={12}
            style={{
                margin: '2px 0px',
                width: '80%',
                paddingTop: '2px',
            }}
        >
            <FormControlLabel
                control={
                    <Checkbox
                        checked={askCoach}
                        onChange={e => setAskCoach(e.target.checked)}
                        sx={{
                            color: 'black',
                            '&.Mui-checked': {
                                color: 'black',
                            },
                        }}
                    />
                }
                label="Ask respective coach to schedule the session with the student before due date"
            />
        </Grid>
    );
};

export default OneOnOneSessionComponent;
