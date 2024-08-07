import React from 'react';
import { useEffect, useState } from 'react';
import Header from '../../Header/Header';
import Sidebar from '../../Sidebar/Sidebar';
import { useNavigate } from 'react-router-dom';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import DynamicTable from '../../CommonComponent/DynamicTable';
import { Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
    getWOLQuestions,
    seteditwolQuestionData,
    toggleWOLQuestionStatus,
} from '../../../redux/features/coachingTools/wol/wolSlice';

const WOLQuestions = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [WOLQuestions, setWOLQuestions] = useState([]);
    const { wolQuestionsData } = useSelector(state => state.wol);
    const headers = ['S. No.', 'Question', 'WOL Category', 'Action'];

    const actionButtons = [
        {
            type: 'switch',
            onChange: id => {
                {
                    console.log('toggled');
                    dispatch(toggleWOLQuestionStatus(id));
                }
            },
        },
        {
            type: 'edit',
            onClick: id => {
                console.log('Edit', id);
                dispatch(
                    seteditwolQuestionData(
                        wolQuestionsData.data.find(item => item.id === id)
                    )
                );
                navigate('add-Edit');
            },
        },
    ];

    useEffect(() => {
        dispatch(getWOLQuestions());
    }, [dispatch]);

    useEffect(() => {
        if (wolQuestionsData.data && wolQuestionsData.data.length > 0) {
            console.log(wolQuestionsData.message);
            const transformData = wolQuestionsData.data.map(item => ({
                id: item.id,
                Question: item.question,
                'WOL Category': item.wol_category_name
                    ? item.wol_category_name
                    : item.wol_category_id,
                is_active: item.is_active,
            }));
            setWOLQuestions(transformData);
        }
    }, [wolQuestionsData]);

    const handleAddQuestion = () => {
        console.log('Add Question');
        dispatch(seteditwolQuestionData(null));
        navigate('add-Edit');
    };

    return (
        <>
            <Header />
            <Sidebar />
            <>
                <Box
                    className="content-box"
                    display="flex"
                    justifyContent="space-between"
                    marginTop={3}
                    alignItems={'center'}
                >
                    <Box
                        className="content-box-header-left"
                        display="flex"
                        alignItems="center"
                        justifyContent={'center'}
                        padding="16px"
                    >
                        <ArrowBackIosIcon
                            style={{
                                fontSize: '25px',
                                marginBottom: '17px',
                                marginRight: '10px',
                                cursor: 'pointer',
                            }}
                            onClick={() => navigate('/wheel-of-life')}
                        />
                        <h3
                            style={{
                                fontSize: '40px',
                                fontWeight: 200,
                                justifyContent: 'center',
                            }}
                        >
                            Wheel Of Life Questions
                        </h3>
                    </Box>
                    <Box
                        className="content-box-header-right"
                        paddingBottom="16px"
                    >
                        <button
                            className="buttonContainer"
                            onClick={handleAddQuestion}
                        >
                            <i className="bi bi-plus-circle"></i>
                            <span>Add Question</span>
                        </button>
                    </Box>
                </Box>
                {WOLQuestions.length === 0 ? (
                    <h3>No Data Found</h3>
                ) : (
                    <DynamicTable
                        headers={headers}
                        initialData={WOLQuestions}
                        actionButtons={actionButtons}
                    />
                )}
            </>
        </>
    );
};

export default WOLQuestions;
