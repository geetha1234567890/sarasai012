import React, { useEffect, useState } from 'react';
import Header from '../../../components/Header/Header';
import Sidebar from '../../../components/Sidebar/Sidebar';
import {
    Box,
    Button,
    Container,
    Grid,
    IconButton,
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
import { useDispatch, useSelector } from 'react-redux';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useNavigate } from 'react-router-dom';
import CustomFormControl from '../../CustomFields/CustomFromControl';
import CustomTextField from '../../CustomFields/CustomTextField';
import star from '../../../assets/star.png';
import {
    addWOLOptionConfig,
    getWOLOptionConfig,
} from '../../../redux/features/coachingTools/wol/wolSlice';
import UploadFileIcon from '@mui/icons-material/UploadFile';

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

let scaleOptions = [];

// using for loop add 1 to 20 in scaleOptions
for (let i = 1; i <= 20; i++) {
    scaleOptions.push({ value: i, label: i });
}

const headers = ['Point', 'Text', 'Icon'];

const feedbackIcons = [
    { value: '😀', label: '😀' },
    { value: '😃', label: '😃' },
    { value: '😄', label: '😄' },
    { value: '😁', label: '😁' },
    { value: '😅', label: '😅' },
    { value: '😂', label: '😂' },
    { value: '😊', label: '😊' },
    { value: '😇', label: '😇' },
    { value: '🙂', label: '🙂' },
    { value: '😌', label: '😌' },
    { value: '😍', label: '😍' },
    { value: '😋', label: '😋' },
    { value: '🤨', label: '🤨' },
    { value: '🧐', label: '🧐' },
    { value: '🤓', label: '🤓' },
    { value: '😎', label: '😎' },
    { value: '🤩', label: '🤩' },
    { value: '🥳', label: '🥳' },
    { value: '😒', label: '😒' },
    { value: '😞', label: '😞' },
    { value: '😔', label: '😔' },
    { value: '😟', label: '😟' },
    { value: '😕', label: '😕' },
    { value: '🙁', label: '🙁' },
];

const WOLOptionsConfig = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { optionsConfigData } = useSelector(state => state.wol);

    const [edit, setEdit] = useState(false);
    const [formValues, setFormValues] = useState({
        minScale: '',
        maxScale: '',
        details: [],
    });
    const [errors, setErrors] = useState({});

    const [minScale, setMinScale] = useState(0);
    const [maxScale, setMaxScale] = useState(0);

    useEffect(() => {
        dispatch(getWOLOptionConfig());
    }, [dispatch]);

    useEffect(() => {
        if (optionsConfigData.data && optionsConfigData.data.length > 0) {
            const { minimum_scale, maximum_scale, get_config_details } =
                optionsConfigData.data[0];
            setFormValues({
                minScale: minimum_scale,
                maxScale: maximum_scale,
                details: get_config_details.map(detail => ({
                    point: detail.point,
                    text: detail.text,
                    icon: detail.icon,
                })),
            });
            setEdit(true);
        }
    }, [optionsConfigData]);

    ////////////////////////////////////////////////////////////////////////////////

    const handleChange = e => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleDetailChange = (e, index) => {
        const { name, value } = e.target;
        const updatedDetails = formValues.details.map((detail, i) =>
            i === index ? { ...detail, [name]: value } : detail
        );
        setFormValues({ ...formValues, details: updatedDetails });
    };

    const validate = () => {
        let tempErrors = {};
        if (!formValues.minScale)
            tempErrors.minScale = 'Minimum Scale is required';
        if (!formValues.maxScale)
            tempErrors.maxScale = 'Maximum Scale is required';
        formValues.details.forEach((detail, index) => {
            if (
                (index === 0 || index === formValues.details.length - 1) &&
                !detail.text
            ) {
                tempErrors[`detailText${index}`] = 'Text is required';
            }
            if (
                (index === 0 || index === formValues.details.length - 1) &&
                !detail.icon
            ) {
                tempErrors[`detailIcon${index}`] = 'Icon is required';
            }
        });
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = e => {
        e.preventDefault();

        console.log('handleSubmit', 'edit : ', edit);
        if (edit) {
            console.log('edit');
            setFormValues({ minScale: '', maxScale: '', details: [] });
            setEdit(false);
        } else {
            if (validate()) {
                const details = [];
                for (
                    let i = Number(formValues.minScale);
                    i <= Number(formValues.maxScale);
                    i++
                ) {
                    details.push({ point: i, text: '', icon: '' });
                }
                setFormValues({ ...formValues, details });
                setEdit(true);
            }
        }
    };

    const handleFormSubmit = e => {
        e.preventDefault();
        if (validate()) {
            const { minScale, maxScale, details } = formValues;
            const payload = {
                minimum_scale: minScale,
                maximum_scale: maxScale,
                details: details.map((detail, index) => ({
                    point: minScale + index,
                    text: detail.text,
                    icon: detail.icon,
                })),
            };
            dispatch(addWOLOptionConfig(payload));
        }
    };

    console.log('details', formValues.details.length);

    const handleImageChange = (e, index) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const updatedDetails = formValues.details.map((detail, i) =>
                    i === index ? { ...detail, icon: reader.result } : detail
                );
                setFormValues({ ...formValues, details: updatedDetails });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageRemove = index => {
        const updatedDetails = formValues.details.map((detail, i) =>
            i === index ? { ...detail, icon: '' } : detail
        );
        setFormValues({ ...formValues, details: updatedDetails });
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
                        style={{ fontSize: '25px', marginBottom: '17px' }}
                        onClick={() => navigate('/wheel-of-life')}
                    />
                    <Typography
                        variant="h1"
                        sx={{
                            fontSize: '44px',
                            marginLeft: '16px',
                        }}
                    >
                        Wheel of Life Options Config
                    </Typography>
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
                <Typography
                    variant="h4"
                    sx={{
                        color: '#1A1E3D',
                        fontSize: '16px',
                        fontWeight: 500,
                        marginBottom: '20px',
                    }}
                    component="h4"
                    gutterBottom
                >
                    Options Scale
                </Typography>

                <form noValidate onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                            <CustomFormControl
                                label="Minimum Scale"
                                name="minScale"
                                value={formValues.minScale}
                                onChange={handleChange}
                                errors={errors}
                                options={scaleOptions}
                                disabled={edit} // Disable when edit is true
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <CustomFormControl
                                label="Maximum Scale"
                                name="maxScale"
                                value={formValues.maxScale}
                                onChange={handleChange}
                                errors={errors}
                                options={scaleOptions}
                                disabled={edit} // Disable when edit is true
                            />
                        </Grid>
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
                    <TableContainer
                        sx={{
                            padding: 2,
                        }}
                        component={Paper}
                    >
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="left">Point</TableCell>
                                    <TableCell align="left">Text</TableCell>
                                    <TableCell align="left">Icon</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {formValues.details.map((detail, index) => (
                                    <TableRow key={index}>
                                        <TableCell component="th" scope="row">
                                            {detail.point}{' '}
                                            {index === 0 && (
                                                <img src={star} alt="str" />
                                            )}{' '}
                                            {index ===
                                                formValues.details.length -
                                                    1 && (
                                                <img src={star} alt="str" />
                                            )}
                                        </TableCell>
                                        <TableCell align="right">
                                            <CustomTextField
                                                label="Text"
                                                name="text"
                                                placeholder="Enter Text"
                                                value={
                                                    detail.text
                                                        ? detail.text
                                                        : ''
                                                }
                                                onChange={e =>
                                                    handleDetailChange(e, index)
                                                }
                                                error={
                                                    errors[`detailText${index}`]
                                                }
                                                fullWidth
                                            />
                                        </TableCell>
                                        {/* <TableCell align="right">
                                            <CustomFormControl
                                                label="Icon"
                                                name="icon"
                                                value={
                                                    detail.icon
                                                        ? detail.icon
                                                        : ''
                                                }
                                                onChange={e =>
                                                    handleDetailChange(e, index)
                                                }
                                                errors={errors}
                                                options={feedbackIcons}
                                            />
                                        </TableCell> */}
                                        <TableCell align="left">
                                            {detail.icon && (
                                                <Box
                                                    position="relative"
                                                    display="inline-block"
                                                    sx={{
                                                        width: '40px',
                                                        height: '40px',
                                                    }} // Ensure the Box has a fixed width and height
                                                >
                                                    <img
                                                        src={detail.icon}
                                                        alt="icon"
                                                        style={{
                                                            width: '100%',
                                                            height: '100%',
                                                            objectFit: 'cover', // Ensure the image covers the Box area
                                                        }}
                                                        onClick={() =>
                                                            handleImageRemove(
                                                                index
                                                            )
                                                        }
                                                    />
                                                    <IconButton
                                                        component="label"
                                                        sx={{
                                                            position:
                                                                'relative',
                                                            bottom: 0,
                                                            right: 0,
                                                            padding: '4px',
                                                            borderRadius: '50%',
                                                            backgroundColor:
                                                                'rgba(245, 109, 59, 0.08)',
                                                        }}
                                                    >
                                                        <UploadFileIcon
                                                            sx={{
                                                                color: '#F56D3B',
                                                                fontSize:
                                                                    '18px',
                                                            }}
                                                        />
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            hidden
                                                            onChange={e =>
                                                                handleImageChange(
                                                                    e,
                                                                    index
                                                                )
                                                            }
                                                        />
                                                    </IconButton>
                                                </Box>
                                            )}
                                            {!detail.icon && (
                                                <IconButton
                                                    component="label"
                                                    sx={{
                                                        padding: '4px',
                                                        borderRadius: '50%',
                                                        backgroundColor:
                                                            'rgba(245, 109, 59, 0.08)',
                                                    }}
                                                >
                                                    <UploadFileIcon
                                                        sx={{
                                                            color: '#F56D3B',
                                                            fontSize: '18px',
                                                        }}
                                                    />
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        hidden
                                                        onChange={e =>
                                                            handleImageChange(
                                                                e,
                                                                index
                                                            )
                                                        }
                                                    />
                                                </IconButton>
                                            )}
                                            {errors[`detailIcon${index}`] && (
                                                <Typography
                                                    variant="caption"
                                                    color="error"
                                                >
                                                    {
                                                        errors[
                                                            `detailIcon${index}`
                                                        ]
                                                    }
                                                </Typography>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Box display="flex" mt={2}>
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
                    </Box>
                </form>
            )}
        </>
    );
};

export default WOLOptionsConfig;
