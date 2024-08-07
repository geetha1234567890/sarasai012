import React, { useState, useEffect } from 'react';
import { useGetStudentsQuery } from '../../../redux/services/students/studentsApi'; // Import your API hook
import { Box } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import { useNavigate } from 'react-router-dom';
import Header from '../../Header/Header';
import Sidebar from '../../Sidebar/Sidebar';
import { studentDummyDatadata } from '../../../fakeData/studentData';
import DynamicTable from '../../CommonComponent/DynamicTable';

const Mystudents = ({ role }) => {
    const [input, setInput] = useState('');
    const [students, setStudents] = useState([]);

    const handleChange = value => {
        setInput(value);
    };

    const useDummyData = false;

    const { data: apiData, error, isLoading } = useGetStudentsQuery();

    useEffect(() => {
        const dataToUse = useDummyData ? studentDummyDatadata : apiData;
        if (dataToUse) {
            const transformedData = dataToUse.map(item => ({
                id: item.id,
                Name: item.name,
                'Activities Sceduled': '',
                'Activities Completed': '',
                'Due Dates Missed': '',
                'Acedemic Term': item.academic_term,
                Batch: item.primary_phone,
            }));
            setStudents(transformedData);
        }
    }, [apiData, useDummyData]);

    if (isLoading) {
        return <div>Loading....</div>;
    }

    // const headers = ['S.No', 'Student Name', 'Acadamic Term', 'Batch', 'Live Sesions Scheduled', 'Live Sessions Attended', 'Status'];
    const headers = [
        'S.No',
        'Student Name',
        'Acadamic Term',
        'Batch',
        'Activities Scheduled',
        'Activities Completed',
        'Due Dates Missed',
        'Status',
    ];

    const actionButtons = [
        {
            type: 'view',
        },
    ];
    // Filter students based on the search input
    const filteredStudents = students.filter(student =>
        student.Name.toLowerCase().includes(input.toLowerCase())
    );

    return (
        <>
            {/* <Header /> */}
            <Box
                display={'flex'}
                justifyContent={'space-between'}
                marginTop={3}
                alignItems={'center'}
            >
                <p style={{ fontSize: '44px', justifyContent: 'center' }}>
                    My Students
                </p>
                <div className="inputBtnContainer">
                    <div className="inputContainer">
                        <input
                            className="inputField"
                            placeholder="Search Here ..."
                            value={input}
                            onChange={e => handleChange(e.target.value)}
                        />
                    </div>
                </div>
            </Box>
            <DynamicTable
                headers={headers}
                initialData={filteredStudents}
                actionButtons={actionButtons}
                componentName={'MYSTUDENTS'}
            />
        </>
    );
};

export default Mystudents;
