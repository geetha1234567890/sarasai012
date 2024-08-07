import React, { useEffect, useState } from 'react';
import Header from '../../../components/Header/Header';
import Sidebar from '../../../components/Sidebar/Sidebar';
import { useDispatch, useSelector } from 'react-redux';
import {
    addWOLTestConfig,
    getWOLCategory,
    getWolTestConfig,
} from '../../../redux/features/coachingTools/wol/wolSlice';
import {
    Box,
    Button,
    Container,
    Grid,
    Paper,
    styled,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useNavigate } from 'react-router-dom';
import CustomFormControl from '../../CustomFields/CustomFromControl';

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

const WOLTestConfig = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { wolCategoryData, wolTestConfig } = useSelector(state => state.wol);

    const [edit, setEdit] = useState(false);
    const [numberOfWolCategoriesOptions, setNumberOfWolCategoriesOptions] =
        useState([]);
    const [formValues, setFormValues] = useState({
        numberOfWolCategories: '',
        categories: [],
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        dispatch(getWOLCategory());
        dispatch(getWolTestConfig());
    }, [dispatch]);

    useEffect(() => {
        if (wolTestConfig.data && wolTestConfig.data.length > 0) {
            const testConfig = wolTestConfig.data[0];
            setFormValues({
                numberOfWolCategories: testConfig.number_of_categories,
                categories: testConfig.test_categories.map(item => ({
                    category_name: item.wol_category_id,
                    no_of_questions: item.number_of_questions,
                })),
            });
            setEdit(true);
        }
    }, [wolTestConfig]);

    useEffect(() => {
        if (wolCategoryData.data && wolCategoryData.data.length > 0) {
            const numberOfWolCategories = Array.from(
                { length: wolCategoryData.data.length },
                (_, i) => ({
                    value: i + 1,
                    label: i + 1,
                })
            );
            setNumberOfWolCategoriesOptions(numberOfWolCategories);
        }
    }, [wolCategoryData]);

    const WOLCategoriesOptions =
        wolCategoryData.data && wolCategoryData.data.length > 0
            ? wolCategoryData.data.map(item => ({
                  value: item.id,
                  label: item.name,
              }))
            : [];

    const numberOfQuestions = Array.from({ length: 10 }, (_, i) => ({
        value: i + 1,
        label: i + 1,
    }));

    const handleSubmit = e => {
        e.preventDefault();

        if (edit) {
            setEdit(false);
            setFormValues({ numberOfWolCategories: '', categories: [] });
            return;
        }
        const newErrors = {};

        if (!formValues.numberOfWolCategories) {
            newErrors.numberOfWolCategories =
                'Number of WOL Categories is required';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setEdit(true);
        setErrors({});
    };

    const handleFormSubmit = e => {
        e.preventDefault();
        const newErrors = {};
        const selectedNumberOfWolCategories = formValues.numberOfWolCategories;

        const categories = Array.from(
            { length: selectedNumberOfWolCategories },
            (_, i) => {
                const categoryName =
                    formValues.categories[i]?.category_name || '';
                const noOfQuestions =
                    formValues.categories[i]?.no_of_questions || '';

                if (!categoryName) {
                    newErrors[`category_name_${i}`] =
                        'Category name is required';
                }
                if (!noOfQuestions) {
                    newErrors[`no_of_questions_${i}`] =
                        'Number of questions is required';
                }

                return {
                    wol_category_id: categoryName,
                    number_of_questions: noOfQuestions,
                };
            }
        );

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const data = {
            number_of_categories: selectedNumberOfWolCategories,
            categories: categories,
        };

        console.log('Data :', data);

        dispatch(addWOLTestConfig(data));
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
                <form onSubmit={handleSubmit} noValidate>
                    <Grid container spacing={2}>
                        {numberOfWolCategoriesOptions && (
                            <Grid item xs={12} md={4}>
                                <CustomFormControl
                                    label="Number of WOL Categories"
                                    name="numberOfWolCategories"
                                    value={formValues.numberOfWolCategories}
                                    onChange={e =>
                                        setFormValues({
                                            ...formValues,
                                            numberOfWolCategories:
                                                e.target.value,
                                        })
                                    }
                                    errors={errors}
                                    options={numberOfWolCategoriesOptions}
                                    disabled={edit}
                                />
                            </Grid>
                        )}
                        <Grid item xs={12} md={4}>
                            <CustomButton
                                type="submit"
                                active={true}
                                variant="contained"
                                sx={{
                                    borderRadius: '50px',
                                    padding: '18px 30px',
                                    margin: '0 8px',
                                }}
                            >
                                {edit ? 'Edit' : 'Submit'}
                            </CustomButton>
                        </Grid>
                    </Grid>
                </form>
            </Box>

            {edit && (
                <form onSubmit={handleFormSubmit} noValidate>
                    <TableContainer sx={{ padding: 2 }} component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>S. No.</TableCell>
                                    <TableCell align="left">
                                        Wheel of Life Category
                                    </TableCell>
                                    <TableCell align="left">
                                        No. of Questions
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Array.from({
                                    length: formValues.numberOfWolCategories,
                                }).map((_, index) => (
                                    <TableRow key={index}>
                                        <TableCell component="th" scope="row">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell align="left">
                                            <CustomFormControl
                                                label="Category Name"
                                                name={`category_name_${index}`}
                                                value={
                                                    formValues.categories[index]
                                                        ?.category_name || ''
                                                }
                                                onChange={e => {
                                                    const newCategories = [
                                                        ...formValues.categories,
                                                    ];
                                                    newCategories[index] = {
                                                        ...newCategories[index],
                                                        category_name:
                                                            e.target.value,
                                                    };
                                                    setFormValues({
                                                        ...formValues,
                                                        categories:
                                                            newCategories,
                                                    });
                                                }}
                                                errors={errors}
                                                options={WOLCategoriesOptions}
                                            />
                                        </TableCell>
                                        <TableCell align="left">
                                            <CustomFormControl
                                                label="No. of Questions"
                                                name={`no_of_questions_${index}`}
                                                value={
                                                    formValues.categories[index]
                                                        ?.no_of_questions || ''
                                                }
                                                onChange={e => {
                                                    const newCategories = [
                                                        ...formValues.categories,
                                                    ];
                                                    newCategories[index] = {
                                                        ...newCategories[index],
                                                        no_of_questions:
                                                            e.target.value,
                                                    };
                                                    setFormValues({
                                                        ...formValues,
                                                        categories:
                                                            newCategories,
                                                    });
                                                }}
                                                errors={errors}
                                                options={numberOfQuestions}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {/* <Box display="flex" mt={2}>
                        <CustomButton
                            type="submit"
                            active={true}
                            variant="contained"
                            sx={{
                                borderRadius: '50px',
                                padding: '18px 30px',
                                margin: '0 8px',
                            }}
                        >
                            Submit
                        </CustomButton>
                    </Box> */}
                </form>
            )}
        </>
    );
};

export default WOLTestConfig;
