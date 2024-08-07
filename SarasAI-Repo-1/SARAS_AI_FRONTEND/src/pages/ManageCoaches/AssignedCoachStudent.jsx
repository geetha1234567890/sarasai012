import React, { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCoachAssignStudents } from '../../redux/features/CoachModule/coachSlice';
import AdminDataTable from '../../components/CommonComponent/AdminDataTable';
const headers = ['Sr. No.', 'Student Name', 'Program', 'Batch', 'Actions'];
const actionButtons = [
    {
        type: 'switch',
    },
    {
        type: 'delete',
        onClick: id => console.log(`Edit clicked for id ${id}`),
    },
];

const AssignCoachStudent = () => {
    const { id } = useParams();
    console.log('ID : ', id);
    const dispatch = useDispatch();
    const { assignedStudents, loading } = useSelector(
        state => state.coachModule
    );
    const [CoachAssignBatchesData, setCoachAssignBatchesData] = useState([]);
    console.log('Assigned Students', assignedStudents);
    useEffect(() => {
        if (id) {
            dispatch(getCoachAssignStudents(id));
        }
    }, [dispatch, id]);

    useEffect(() => {
        if (assignedStudents && assignedStudents.length > 0) {
            const transformData = assignedStudents.map(item => {
                const studentName = item.student
                    ? item.student.name
                    : 'Unknown Student';
                const academicTerm = item.student
                    ? item.student.packages.map(pack => pack.name).join(', ')
                    : 'N/A';
                const batchName =
                    item.student.batches && item.student.batches.length > 0
                        ? item.student.batches[0].batch_name
                        : 'N/A';
                const isActive = item.is_active === 1;

                return {
                    id: item.id,
                    // item.student ? item.student.id : null,
                    student_name: studentName,
                    Acedimic_term: academicTerm,
                    Batch: batchName,
                    is_active: isActive,
                };
            });
            setCoachAssignBatchesData(transformData);
        }
    }, [assignedStudents]);

    return (
        <>
            <Header />
            <Sidebar />
            <AdminDataTable
                headers={headers}
                initialData={CoachAssignBatchesData}
                title="Assigned Students"
                actionButtons={actionButtons}
                ta_id={id}
                dispatch={dispatch}
                componentName={'ASSIGNCOACHSTUDENT'}
            />
        </>
    );
};

export default AssignCoachStudent;
