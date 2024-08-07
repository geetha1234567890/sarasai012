import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Checkbox,
    Container,
    FormControlLabel,
    Radio,
    styled,
    Typography,
} from '@mui/material';
import Header from '../../Header/Header';
import Sidebar from '../../Sidebar/Sidebar';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import editIcon_White from '../../../assets/editIcon_White.png';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { set } from 'date-fns';
import {
    addQuestionToCategory,
    getWolTestConfigCategoryWise,
    handleIdToSubmitSelectedQuestions,
    selectedQuestionsList,
} from '../../../redux/features/coachingTools/wol/wolSlice';

const CustomButton = styled(Button)(({ theme, active }) => ({
    borderRadius: '50px',
    border: '1px solid #F56D3B',
    color: active ? '#fff' : '#F56D3B',
    backgroundColor: active ? '#F56D3B' : '#FFF',
    padding: '8px 16px',
    margin: '0 8px',
    '&:hover': {
        backgroundColor: '#F56D3B',
        color: '#fff',
        borderColor: '#F56D3B',
    },
}));

const WOLSelectQuestions = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {
        wolQuestionCategoryWise,
        categoryIdToSubmitSelectedQuestions,
        selectedQuestionsListData,
    } = useSelector(state => state.wol);

    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [categoryId, setCategoryId] = useState();

    useEffect(() => {
        if (
            wolQuestionCategoryWise.data &&
            wolQuestionCategoryWise.data.length > 0
        ) {
            // console.log("Wol Question Category Wise", wolQuestionCategoryWise.data)
            setQuestions(wolQuestionCategoryWise.data);
            setTotalQuestions(wolQuestionCategoryWise.data.length);
            setSelectedCategory(
                wolQuestionCategoryWise.data[0].wol_category_name
            );
            setCategoryId(wolQuestionCategoryWise.data[0].id);
        }
    }, [wolQuestionCategoryWise.data]);

    useEffect(() => {
        dispatch(selectedQuestionsList(categoryIdToSubmitSelectedQuestions));
    }, [dispatch]);

    console.log('selectedQuestionsListData', selectedQuestionsListData);

    useEffect(() => {
        if (
            selectedQuestionsListData.data &&
            selectedQuestionsListData.data.length > 0
        ) {
            // Map over the data array to extract the 'wol_question_id'
            console.log(
                'selectedQuestionsListData',
                selectedQuestionsListData.data
            );
            setSelectedQuestions(
                selectedQuestionsListData.data.map(
                    question => question.wol_question_id
                )
            );
        }
    }, [selectedQuestionsListData]);

    console.log('selectedQuestions', selectedQuestions);

    const handleSelectQuestion = index => {
        console.log(`Toggling question ${index}`);
        setSelectedQuestions(prevSelected => {
            const updatedSelection = prevSelected.includes(index)
                ? prevSelected.filter(i => i !== index)
                : [...prevSelected, index];
            console.log('Updated Selection:', updatedSelection);
            return updatedSelection;
        });
    };

    const handleSubmit = () => {
        //const selectedQuestionData = selectedQuestions.map(index => questions[index]);
        // console.log('Selected Questions:', selectedQuestionData);
        // Dispatch an action or call an API to save the selected questions

        const data = {
            wol_test_category_id: categoryIdToSubmitSelectedQuestions,
            wol_questions_id: selectedQuestions,
            //selectedQuestionData.map(question => question.id)
        };
        dispatch(addQuestionToCategory(data)).then(() => {
            dispatch(getWolTestConfigCategoryWise());
            dispatch(handleIdToSubmitSelectedQuestions(''));
        });
        navigate('/WOLTestConfigSelectQuestions');
    };

    return (
        <>
            <Header />
            <Sidebar />
            <Box
                display="flex"
                justifyContent="space-between"
                marginTop={3}
                alignItems="center"
            >
                <Box display="flex" alignItems="center" padding="16px">
                    <ArrowBackIosIcon
                        style={{
                            fontSize: '25px',
                            marginBottom: '17px',
                            marginRight: '10px',
                            cursor: 'pointer',
                        }}
                        onClick={() => navigate('/wheel-of-life')}
                    />
                    <p
                        style={{
                            fontSize: '40px',
                            fontWeight: 200,
                            justifyContent: 'center',
                        }}
                    >
                        Wheel Of Test Config
                    </p>
                </Box>
            </Box>
            <Box
                sx={{
                    mt: 2,
                    mb: 2,
                    backgroundColor: 'white',
                    borderRadius: 2,
                    minHeight: 160,
                    padding: 2,
                }}
            >
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ marginBottom: '20px' }}
                >
                    <Box>
                        <Box display="flex" alignItems="center" padding="16px">
                            <ArrowBackIosIcon
                                style={{
                                    fontSize: '25px',
                                    marginBottom: '17px',
                                    marginRight: '10px',
                                    cursor: 'pointer',
                                }}
                                onClick={() =>
                                    navigate('/WOLTestConfigSelectQuestions')
                                }
                            />
                            <p
                                style={{
                                    fontSize: '20px',
                                    fontWeight: 500,
                                    justifyContent: 'center',
                                }}
                            >
                                Total Questions: {totalQuestions}
                            </p>
                        </Box>

                        <Typography
                            variant="h6"
                            sx={{
                                color: '#1A1E3D',
                                fontSize: '16px',
                                fontWeight: 500,
                            }}
                            component="h4"
                            gutterBottom
                        >
                            Wheel of life category: {selectedCategory}
                        </Typography>

                        <Typography
                            variant="h6"
                            sx={{
                                color: '#1A1E3D',
                                fontSize: '16px',
                                fontWeight: 500,
                            }}
                            component="h4"
                            gutterBottom
                        >
                            Selected Questions: {selectedQuestions.length}/
                            {totalQuestions}
                        </Typography>
                    </Box>

                    <CustomButton
                        type="submit"
                        active={true}
                        onClick={() => navigate('/WOLTestConfig')}
                        variant="contained"
                        sx={{
                            borderRadius: '50px',
                            padding: '18px 30px',
                            margin: '0 8px',
                        }}
                    >
                        <img
                            src={editIcon_White}
                            backgroundColor="white"
                            alt="edit icon"
                        />
                        Edit Config
                    </CustomButton>
                </Box>

                {questions.slice(0, totalQuestions).map((question, index) => (
                    <Box
                        key={question.id}
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        mb={2}
                        p={2}
                        border="1px solid #E0E0E0"
                        borderRadius="8px"
                    >
                        <Box flex="1">
                            <Typography
                                variant="body1"
                                sx={{
                                    color: '#1A1E3D',
                                    fontWeight: 500,
                                    mb: 1,
                                }}
                            >
                                Q{index + 1}: {question.question}
                            </Typography>
                        </Box>
                        <Box>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={selectedQuestions.includes(
                                            question.id
                                        )}
                                        onChange={() =>
                                            handleSelectQuestion(question.id)
                                        }
                                    />
                                }
                                label=""
                            />
                        </Box>
                    </Box>
                ))}

                <Box display="flex" mt={2}>
                    <CustomButton
                        variant="contained"
                        color="primary"
                        sx={{
                            borderRadius: '50px',
                            padding: '8px 16px',
                            margin: '0 8px',
                        }}
                        onClick={handleSubmit}
                    >
                        Submit
                    </CustomButton>
                </Box>
            </Box>
        </>
    );
};

export default WOLSelectQuestions;
