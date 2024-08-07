import { Box, Button, InputBase, Typography, useTheme } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getTodayCoachAvailability } from '../../redux/features/CoachModule/CoachAvailabilitySlice';
import { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import { DynamicTable } from '../managesTAs/TaAvaialablity';

const headers = [
    'S. No.',
    'Coach Name',
    'Username',
    'Current Availability',
    'Calendar',
];

const CoachAvialablity = () => {
    const dispatch = useDispatch();
    const { todaysAvailableCoach } = useSelector(
        state => state.coachAvailability
    );
    const [coachAvailabilityData, setCoachAvailabilityData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        dispatch(getTodayCoachAvailability());
    }, [dispatch]);

    useEffect(() => {
        if (todaysAvailableCoach && todaysAvailableCoach.length > 0) {
            const transformData = todaysAvailableCoach.map((item, index) => ({
                id: item.id,
                taName: item.name,
                username: item.username,
                Availability: item.availability_status,
                // calendar: 'Check',
            }));
            setCoachAvailabilityData(transformData);
        }
    }, [todaysAvailableCoach]);

    useEffect(() => {
        if (searchTerm === '') {
            setFilteredData(coachAvailabilityData);
        } else {
            const lowercasedTerm = searchTerm.toLowerCase();
            const filtered = coachAvailabilityData.filter(
                item =>
                    item.taName.toLowerCase().includes(lowercasedTerm) ||
                    item.username.toLowerCase().includes(lowercasedTerm) ||
                    item.Availability.toLowerCase().includes(lowercasedTerm)
            );
            setFilteredData(filtered);
        }
    }, [searchTerm, coachAvailabilityData]);

    const handleSearchChange = e => {
        setSearchTerm(e.target.value);
    };

    const actionButtons = [
        {
            type: 'calender',
        },
    ];

    return (
        <>
            <Box m="20px">
                <Header />
                <Sidebar />
                <Box display={'flex'} justifyContent={'space-between'}>
                    <Typography variant="h4" sx={{ fontFamily: 'ExtraLight' }}>
                        Coach Availability
                    </Typography>
                    <Box
                        display={'flex'}
                        backgroundColor="#FFF"
                        borderRadius={'30px'}
                        width={'20vw'}
                        height={'5vh'}
                    >
                        <InputBase
                            sx={{ ml: 2, flex: 1 }}
                            placeholder="Search here ..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </Box>
                </Box>
                <DynamicTable
                    headers={headers}
                    initialData={filteredData}
                    componentName={'COACHAVAILABLE'}
                    actionButtons={actionButtons}
                />
            </Box>
        </>
    );
};

export default CoachAvialablity;
