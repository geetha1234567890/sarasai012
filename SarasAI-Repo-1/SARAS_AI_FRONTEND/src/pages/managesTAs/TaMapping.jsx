import React, { useEffect, useState } from 'react';
import { Box, InputBase } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { showTAMapping } from '../../redux/features/taModule/taSlice';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import DynamicTable from '../../components/CommonComponent/DynamicTable';
import { mockMappingDat } from '../../fakeData/mappingData';

const headers = [
    'S. No.',
    'TA Name',
    'Username',
    'Active Students',
    'Active Batches',
    'Actions',
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

const TaMapping = () => {
    const dispatch = useDispatch();
    const { taMapping, loading } = useSelector(state => state.taModule);
    const [taMappingData, setTaMappingData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    console.log('tamapping ', taMapping);

    useEffect(() => {
        dispatch(showTAMapping());
    }, [dispatch]);

    useEffect(() => {
        if (taMapping && taMapping.length > 0) {
            const transformData = taMapping.map((item, index) => ({
                id: item.id,
                name: item.name,
                Username: item.username,
                Active_Students: item.Active_Students,
                Active_Batches: item.Active_Batches,
            }));

            setTaMappingData(transformData);
        }
    }, [taMapping]);
    const handleSearch = event => {
        setSearchQuery(event.target.value); // Handle search input change
    };
    const filteredData = taMappingData.filter(
        item => item.name.toLowerCase().includes(searchQuery.toLowerCase()) // Filter data based on search query
    );

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
                            marginBottom: '20px',
                            fontFamily: 'ExtraLight',
                        }}
                    >
                        TA Mapping
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
                                onChange={handleSearch} // Added search box
                            />
                        </Box>
                    </Box>
                </Box>
                <DynamicTable
                    headers={headers}
                    initialData={filteredData}
                    actionButtons={actionButtons}
                    componentName={'TAMAPPING'}
                />
            </Box>
        </>
    );
};

export default TaMapping;
