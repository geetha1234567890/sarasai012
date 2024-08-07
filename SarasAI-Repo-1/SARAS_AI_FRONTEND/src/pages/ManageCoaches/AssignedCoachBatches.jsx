import React, { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    getCoachAssignBatches,
    getAssignStudents,
} from '../../redux/features/CoachModule/coachSlice';
import AdminDataTable from '../../components/CommonComponent/AdminDataTable';
const headers = ['Sr. No.', 'Batch Name', 'Branch', 'Actions'];
const actionButtons = [
    {
        type: 'switch',
    },
    {
        type: 'delete',
        onClick: id => console.log(`Edit clicked for id ${id}`),
    },
];

const AssignCoachBatches = () => {
    const { id } = useParams();
    console.log('ID : ', id);
    const dispatch = useDispatch();
    const { assignedBatches, loading } = useSelector(
        state => state.coachModule
    );
    const [CoachAssignBatchesData, setCoachAssignBatchesData] = useState([]);
    console.log('Assigned BAtches', assignedBatches);
    useEffect(() => {
        if (id) {
            dispatch(getCoachAssignBatches(id));
        }
    }, [dispatch, id]);

    useEffect(() => {
        if (assignedBatches && assignedBatches.length > 0) {
            const transformData = assignedBatches.map((item, index) => ({
                id: item.id,
                batch_name: item.batch.name,
                branch: item.batch.branch.name,
                is_active: item.is_active,
            }));
            console.log('TRANSFORM DATA : ', transformData);
            setCoachAssignBatchesData(transformData);
        }
    }, [assignedBatches]);

    return (
        <>
            <Header />
            <Sidebar />
            <AdminDataTable
                headers={headers}
                initialData={CoachAssignBatchesData}
                title="Assign Batches"
                actionButtons={actionButtons}
                ta_id={id}
                dispatch={dispatch}
                componentName={'ASSIGNCOACHBATCH'}
            />
        </>
    );
};

export default AssignCoachBatches;
