import React, { useEffect, useState } from 'react';
import Header from '../../../components/Header/Header';
import Sidebar from '../../../components/Sidebar/Sidebar';
import { Box } from '@mui/material';
import CoachTemplateTable from './TemplateTable/CoachTemplateTable';
import {
    closeCreateTemplateCoach,
    closeEditTemplateCoach,
    getAllCoachTemplates,
    openCreateTemplateCoach,
    openEditTemplateCoach,
    setSelectedCoachTemplate,
    getCoachTemplateModuleId,
} from '../../../redux/features/CoachModule/CoachTemplateSlice';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

const CoachTemplate = () => {
    const navigation = useNavigate();
    const dispatch = useDispatch();
    const [coachTemplatesData, setCoachTemplatesData] = useState([]);

    const { coachTemplates } = useSelector(state => state.coachTemplate);

    useEffect(() => {
        dispatch(getAllCoachTemplates());
        dispatch(closeCreateTemplateCoach());
        dispatch(closeEditTemplateCoach());
    }, [dispatch]);

    useEffect(() => {
        if (coachTemplates.length > 0) {
            const transformData = coachTemplates.map(item => ({
                id: item.id,
                'Template Name': item.name,
                Duration: item.duration,
                Activities: item?.modules
                    ?.map(module => module?.module_name)
                    .join(', '),
                'Assigned To': 'John Doe',
                is_active: item.is_active,
            }));
            setCoachTemplatesData(transformData);
        }
    }, [coachTemplates]);

    const headers = [
        'S. No.',
        'Template Name',
        'Duration',
        'Activities',
        'Assigned To',
        'Action',
    ];

    const dummyData = [
        {
            id: 1,
            'Template Name': 'Template 1',
            Duration: '30 mins',
            Activities: 'Activity A, Activity B',
            'Assigned To': 'John Doe',
        },
        {
            id: 2,
            'Template Name': 'Template 2',
            Duration: '45 mins',
            Activities: 'Activity C, Activity D',
            'Assigned To': 'Jane Smith',
        },
        {
            id: 3,
            'Template Name': 'Template 3',
            Duration: '60 mins',
            Activities: 'Activity E, Activity F',
            'Assigned To': 'Michael Brown',
        },
    ];
    const data123 = [
        {
            id: 1,
            template_id: 1,
            module_name: 'Sandeep-Module-1',
            is_active: 1,
            created_by: null,
            updated_by: null,
            deleted_at: null,
            created_at: '2024-07-18T12:35:13.000000Z',
            updated_at: '2024-07-19T11:53:01.000000Z',
            template: {
                id: 1,
                name: 'test-sandeep 5',
                duration: 7,
                is_active: 1,
                created_by: null,
                updated_by: null,
                deleted_at: null,
                created_at: '2024-07-18T12:27:19.000000Z',
                updated_at: '2024-07-18T12:27:19.000000Z',
            },
            activities: [],
        },
    ];
    const actionButtons = [
        {
            type: 'switch',
        },
        {
            type: 'edit',
            onClick: id => {
                dispatch(openEditTemplateCoach());
                dispatch(setSelectedCoachTemplate(id));
                dispatch(getCoachTemplateModuleId(id));
                navigation('/template-name');
                console.log('CLICKED : ', id);
            },
        },
    ];

    const handleAddTemplate = () => {
        dispatch(openCreateTemplateCoach());
        navigation('/create-template');
    };

    return (
        <>
            <Box m="20px">
                <Header />
                <Sidebar />
                <>
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={2}
                    >
                        <p
                            style={{
                                fontSize: '44px',
                                justifyContent: 'center',
                                fontFamily: 'ExtraLight',
                            }}
                        >
                            Coaching Template
                        </p>
                        <div className="inputBtnContainer">
                            <button
                                className="buttonContainer"
                                onClick={handleAddTemplate}
                            >
                                <i className="bi bi-plus-circle"></i>
                                <span>Create New Template</span>
                            </button>
                        </div>
                    </Box>
                    {!coachTemplatesData || coachTemplatesData.length === 0 ? (
                        <div>
                            <p>No Data Available</p>
                        </div>
                    ) : (
                        <CoachTemplateTable
                            headers={headers}
                            initialData={coachTemplatesData}
                            actionButtons={actionButtons}
                            componentName={'COACHTEMPLATE'}
                        />
                    )}
                </>
            </Box>
        </>
    );
};

export default CoachTemplate;
