import React from 'react';
import { useEffect, useState } from 'react';
import Header from '../../Header/Header';
import Sidebar from '../../Sidebar/Sidebar';
import { useForm, Controller, set } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import {
    Box,
    Button,
    Container,
    InputLabel,
    TextField,
    styled,
    MenuItem,
    Paper,
} from '@mui/material';
import CustomFormControl from '../../CustomFields/CustomFromControl';
import ReactQuill from 'react-quill';
import { useDispatch, useSelector } from 'react-redux';
import {
    seteditwolQuestionData,
    getWOLCategory,
    createWOLQuestion,
    updateWOLQuestion,
    getWOLQuestions,
} from '../../../redux/features/coachingTools/wol/wolSlice';

const AddEditWOLQuestions = () => {
    const [questionValue, setQuestionValue] = useState('');
    const [categories, setCategories] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { editwolQuestionData, wolCategoryData } = useSelector(
        state => state.wol
    );

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            category: editwolQuestionData
                ? editwolQuestionData.wol_category_id
                : '',
        },
    });

    useEffect(() => {
        dispatch(getWOLCategory());
    }, [dispatch]);

    useEffect(() => {
        if (wolCategoryData.data && wolCategoryData.data.length > 0) {
            console.log(wolCategoryData.message);
            const transformData = wolCategoryData.data.map(item => ({
                id: item.id,
                name: item.name,
            }));
            setCategories(transformData);
        }
    }, [wolCategoryData]);

    const WOLCategoriesOptions =
        wolCategoryData.data && wolCategoryData.data.length > 0
            ? wolCategoryData.data.map(item => ({
                  value: item.id,
                  label: item.name,
              }))
            : [];

    const QuillContainer = styled('div')(({ theme }) => ({
        position: 'relative',
        '& .ql-container': {
            borderColor: '#D0D0EC',
            borderBottomLeftRadius: '30px',
            borderBottomRightRadius: '30px',
            '&.ql-container.ql-snow.ql-focused': {
                borderColor: '#FF6D3B', // Change border color on focus
            },
        },
        '& .ql-toolbar': {
            borderColor: '#D0D0EC',
            borderTopLeftRadius: '30px',
            borderTopRightRadius: '30px',
            color: '#D0D0EC',
            '&:hover': {
                borderColor: '##FF6D3B',
            },
            '& .ql-formats button': {
                color: '#D0D0EC',
            },
            '& .ql-picker': {
                color: '#D0D0EC',
            },
        },
        '& .ql-toolbar.ql-snow': {
            borderBottom: 'none',
        },
    }));

    const StyledLabel = styled(InputLabel)(({ theme }) => ({
        position: 'absolute',
        top: '-25px',
        left: '20px',
        backgroundColor: 'white',
        padding: '0 8px',
        color: '#1A1E3D',
        fontSize: '14px',
        fontWeight: 500,
        zIndex: 1,
    }));

    const modules = {
        toolbar: [
            ['bold', 'italic', 'underline'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ align: [] }],
            ['link'],
            ['clean'],
        ],
    };

    const formats = ['bold', 'italic', 'underline', 'align', 'link'];

    const onSubmit = formData => {
        console.log('formData', formData.category);
        console.log('questionValue', questionValue);

        const data = {
            wol_category_id: Number(formData.category),
            question: questionValue,
        };

        if (editwolQuestionData) {
            const id = editwolQuestionData.id;
            dispatch(updateWOLQuestion({ id, data }));
        } else {
            dispatch(createWOLQuestion(data));
        }
        dispatch(getWOLQuestions());
        dispatch(seteditwolQuestionData(null));
        navigate('/wolQuestions');
    };

    useEffect(() => {
        if (editwolQuestionData) {
            setQuestionValue(editwolQuestionData.question);
            /*
            setQuestionValue({
                category: editwolQuestionData.wol_category_id,
                question: editwolQuestionData.question
            })
            */
        }
    }, [editwolQuestionData]);

    return (
        <>
            <Header />
            <Sidebar />
            <Box
                display="flex"
                justifyContent="space-between"
                marginTop={3}
                alignItems={'center'}
            >
                <Box display="flex" alignItems="center" padding="16px">
                    <ArrowBackIosIcon
                        style={{
                            fontSize: '25px',
                            marginBottom: '16px',
                            marginRight: '10px',
                            cursor: 'pointer',
                        }}
                        onClick={() => navigate(-1)}
                    />
                    <p
                        style={{
                            fontSize: '40px',
                            fontWeight: 200,
                            justifyContent: 'center',
                        }}
                    >
                        {editwolQuestionData ? 'Edit Question' : 'Add Question'}
                    </p>
                </Box>
            </Box>
            <Box
                sx={{
                    backgroundColor: 'white',
                    borderRadius: 2,
                    padding: 2,
                }}
            >
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Box sx={{ marginBottom: 2, width: '40%' }}>
                        <Controller
                            name="category"
                            control={control}
                            rules={{ required: 'Category is required' }}
                            render={({ field }) => (
                                <CustomFormControl
                                    label="Wheel of Life Category"
                                    name="category"
                                    value={field.value}
                                    onChange={field.onChange}
                                    errors={errors}
                                    options={WOLCategoriesOptions}
                                />
                            )}
                        />
                    </Box>

                    <Box
                        sx={{
                            marginTop: '50px',
                            position: 'relative',
                            padding: '2px',
                        }}
                    >
                        <StyledLabel>Question</StyledLabel>
                        <Paper
                            elevation={3}
                            sx={{ padding: 2, borderRadius: 2 }}
                        >
                            <ReactQuill
                                theme="snow"
                                value={questionValue}
                                onChange={setQuestionValue}
                                modules={modules}
                                formats={formats}
                                //style={{ height: '100px', backgroundColor: 'transparent' }}
                                placeholder="Write your question here..."
                            />
                        </Paper>
                        {/* <QuillContainer>
                            <ReactQuill
                                theme='snow'
                                value={questionValue}
                                onChange={setQuestionValue}
                                modules={modules}
                                formats={formats}
                                style={{ height: '100px', backgroundColor: 'transparent' }}
                                placeholder='Write your question here...'
                            />
                        </QuillContainer> */}
                    </Box>

                    <Box
                        className="inputBtnContainer"
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-start',
                            marginTop: 8,
                        }}
                    >
                        {editwolQuestionData ? (
                            <button type="submit" className="buttonContainer">
                                {' '}
                                Update{' '}
                            </button>
                        ) : (
                            <button type="submit" className="buttonContainer">
                                {' '}
                                Submit{' '}
                            </button>
                        )}
                    </Box>
                </form>
            </Box>
        </>
    );
};

export default AddEditWOLQuestions;
