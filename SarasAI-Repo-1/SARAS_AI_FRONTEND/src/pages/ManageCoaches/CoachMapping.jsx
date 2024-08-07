import { Box, InputBase, Button, Modal, Typography } from '@mui/material';

import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import { useState, useEffect } from 'react';
import { OnOffSwitch } from '../../components/Switch';
import editIcon from '../../assets/editIcon.png';
import DynamicTable from '../../components/CommonComponent/DynamicTable';
import { showCoachMapping } from '../../redux/features/CoachModule/coachSlice';
import { useDispatch, useSelector } from 'react-redux';

const headers = [
    'S. No.',
    'COACH Name',
    'Username',
    'Active Students',
    'Active Batches',
    'Action',
];

const actionButtons = [
    // {
    //   type: "switch",
    // },
    {
        type: 'delete',
        onClick: id => console.log(`Delete clicked for id ${id}`),
    },
];

const CoachMapping = () => {
    const dispatch = useDispatch();
    const { coachMapping, loading } = useSelector(state => state.coachModule);
    const [caMappingData, setcaMappingData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    // console.log("camapping" , coachMapping);
    useEffect(() => {
        dispatch(showCoachMapping());
    }, [dispatch]);

    useEffect(() => {
        if (coachMapping && coachMapping.length > 0) {
            const transformData = coachMapping.map((item, index) => ({
                id: item.id,
                name: item.name,
                Username: item.username,
                Active_Students: item.Active_Students,
                Active_Batches: item.Active_Batches,
            }));

            setcaMappingData(transformData);
        }
    }, [coachMapping]);

    const handleSearch = event => {
        setSearchQuery(event.target.value);
    };

    const filteredData = caMappingData.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <Box m={'10px'}>
                <Header />
                <Sidebar />
                <Box
                    display={'flex'}
                    justifyContent={'space-between'}
                    marginTop={3}
                >
                    <p
                        style={{
                            fontSize: '44px',
                            justifyContent: 'center',
                            marginBottom: '20px',
                            fontFamily: 'ExtraLight',
                        }}
                    >
                        Coach Mapping
                    </p>
                    <Box display={'flex'}>
                        <Box
                            marginTop={1}
                            display={'flex'}
                            backgroundColor="#FFF"
                            borderRadius={'30px'}
                            width={'20vw'}
                            height={'5vh'}
                            marginRight={'10px'}
                        >
                            <InputBase
                                sx={{ ml: 2, flex: 1 }}
                                placeholder="Search here ..."
                                value={searchQuery}
                                onChange={handleSearch}
                            />
                        </Box>
                    </Box>
                </Box>

                <DynamicTable
                    headers={headers}
                    initialData={filteredData}
                    actionButtons={actionButtons}
                    componentName={'COACHMAPPING'}
                />
            </Box>
        </>
    );
};

export default CoachMapping;
