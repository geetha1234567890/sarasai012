import React, { useEffect, useState } from 'react';
import { Button, IconButton, Switch, Pagination, Box } from '@mui/material';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import CallMadeOutlinedIcon from '@mui/icons-material/CallMadeOutlined';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import { styled } from '@mui/material/styles';
import './CommonComponent.css';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import { mockDataAvilable } from '../../fakeData/availableData';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getTodayTaAvailability } from '../../redux/features/taModule/taAvialability';
import DynamicTable from '../../components/CommonComponent/DynamicTable';

const CustomButton = styled(Button)(({ theme }) => ({
    borderRadius: '20px',
    border: '1px solid #F56D3B',
    color: '#F56D3B',
    '&:hover': {
        backgroundColor: '#F56D3B',
        color: '#fff',
        borderColor: '#F56D3B',
    },
}));

const AntSwitch = styled(Switch)(({ theme }) => ({
    width: 28,
    height: 16,
    padding: 0,
    marginTop: 12,
    display: 'flex',
    '&:active': {
        '& .MuiSwitch-thumb': {
            width: 15,
        },
        '& .MuiSwitch-switchBase.Mui-checked': {
            transform: 'translateX(9px)',
        },
    },
    '& .MuiSwitch-switchBase': {
        padding: 2,
        '&.Mui-checked': {
            transform: 'translateX(12px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor:
                    theme.palette.mode === 'dark' ? '#177ddc' : '#14D249',
            },
        },
    },
    '& .MuiSwitch-thumb': {
        boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
        width: 12,
        height: 12,
        borderRadius: 6,
        transition: theme.transitions.create(['width'], {
            duration: 200,
        }),
    },
    '& .MuiSwitch-track': {
        borderRadius: 16 / 2,
        opacity: 1,
        backgroundColor:
            theme.palette.mode === 'dark'
                ? 'rgba(255,255,255,.35)'
                : 'rgba(0,0,0,.25)',
        boxSizing: 'border-box',
    },
}));

const headers = [
    'Sr. No.',
    'TA Name',
    'Username',
    'Current Availability',
    'Calendar',
];

const TaAvialability = () => {
    const dispatch = useDispatch();
    const { todaysAvailableTa } = useSelector(state => state.taAvailability);
    const [taAvailabilityData, setTaAvailabilityData] = useState([]);

    useEffect(() => {
        dispatch(getTodayTaAvailability());
    }, [dispatch]);

    useEffect(() => {
        if (todaysAvailableTa && todaysAvailableTa.length > 0) {
            const transformData = todaysAvailableTa.map((item, index) => ({
                id: item.id,
                taName: item.name,
                username: item.username,
                Availability: item.availability_status,
                // calendar: 'Check',
            }));
            setTaAvailabilityData(transformData);
        }
    }, [todaysAvailableTa]);

    console.log('TA Availability Data : ', taAvailabilityData);

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
                    <p
                        style={{
                            fontSize: '44px',
                            justifyContent: 'center',
                            fontFamily: 'ExtraLight',
                        }}
                    >
                        TA Availability
                    </p>
                </Box>
                <DynamicTable
                    headers={headers}
                    initialData={taAvailabilityData}
                    actionButtons={actionButtons}
                    componentName={'TAAVAILABLE'}
                />
            </Box>
        </>
    );
};

export { DynamicTable };
export default TaAvialability;
