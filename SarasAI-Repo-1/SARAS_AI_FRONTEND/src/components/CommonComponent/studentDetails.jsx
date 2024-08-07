import React from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Button,
    IconButton,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ReactivateIcon from '@mui/icons-material/RestartAlt';
import CoachMenu from '../../pages/MODULE/coachModule/CoachMenu';

const StudentDetails = () => {
    const data = [
        {
            module: 'Module 5',
            activities: [
                { name: 'Activity 1', type: 'Video', status: 'Completed' },
                { name: 'Activity 2', type: 'Assessment', status: 'Completed' },
                { name: 'Activity 3', type: 'Doc', status: 'Locked' },
            ],
        },
        {
            module: 'Module 4',
            activities: [
                { name: 'Activity 1', type: 'Assessment', status: 'Ongoing' },
                { name: 'Activity 2', type: 'Video', status: 'Ongoing' },
            ],
        },
        {
            module: 'Module 3',
            activities: [
                { name: 'Activity 1', type: 'Assessment', status: 'Lapsed' },
                { name: 'Activity 2', type: 'Video', status: 'Lapsed' },
            ],
        },
    ];

    return (
        <div>
            <CoachMenu />
            <Box sx={{ padding: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Aniket Sharma
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    Bs in AI: Spring 24-28 | OS 101: US Batch 3, CL 201: IN
                    Batch 6
                </Typography>

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mb: 4,
                    }}
                >
                    <Card>
                        <CardContent>
                            <Typography variant="h6">
                                Activities Scheduled
                            </Typography>
                            <Typography variant="h4">3</Typography>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">
                                Activities Completed
                            </Typography>
                            <Typography variant="h4">3</Typography>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">
                                Due Dates Missed
                            </Typography>
                            <Typography variant="h4">3</Typography>
                        </CardContent>
                    </Card>
                </Box>

                {data.map((module, index) => (
                    <Box key={index} sx={{ mb: 4 }}>
                        <Typography variant="h6" gutterBottom>
                            {module.module}
                        </Typography>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>S. No.</TableCell>
                                    <TableCell>Activity Name</TableCell>
                                    <TableCell>Activity Type</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>View</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {module.activities.map((activity, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell>{idx + 1}</TableCell>
                                        <TableCell>{activity.name}</TableCell>
                                        <TableCell>{activity.type}</TableCell>
                                        <TableCell>{activity.status}</TableCell>
                                        <TableCell>
                                            <IconButton>
                                                <VisibilityIcon />
                                            </IconButton>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                startIcon={<ReactivateIcon />}
                                                disabled={
                                                    activity.status ===
                                                    'Completed'
                                                }
                                            >
                                                {activity.status === 'Locked'
                                                    ? 'Unlock'
                                                    : 'Reactivate'}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Box>
                ))}
            </Box>
        </div>
    );
};

export default StudentDetails;
