import {
    Box,
    Button,
    Container,
    Typography,
    Paper,
    styled,
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Header from '../../Header/Header';
import Sidebar from '../../Sidebar/Sidebar';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import editIcon_White from '../../../assets/editIcon_White.png';
import { Navigate } from 'react-router-dom';
import {
    getLifeInstruction,
    editLifeInstruction,
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

const WOLInstructions = () => {
    const [value, setValue] = useState();
    const [editData, setEditData] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { instructionData } = useSelector(state => state.wol);
    const [instruction, setInstruction] = useState('');

    const handleEditWOLInstructions = () => {
        setValue(instruction);
        setEditData(true);
    };

    const handleUpdateWOLInstructions = () => {
        try {
            dispatch(editLifeInstruction({ message: value }))
                .unwrap()
                .then(() => {
                    dispatch(getLifeInstruction());
                });
            setEditData(false);
        } catch (error) {
            console.log(error.message); //TODO: Show toast message
        }
    };

    useEffect(() => {
        dispatch(getLifeInstruction());
    }, [dispatch]);

    useEffect(() => {
        if (instructionData && instructionData.data.length > 0) {
            console.log(instructionData.message);
            setInstruction(instructionData.data[0].message);
        }
    }, [instructionData]);

    const modules = {
        toolbar: [
            [{ header: '1' }, { header: '2' }, { font: [] }],
            [{ size: [] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [
                { list: 'ordered' },
                { list: 'bullet' },
                { indent: '-1' },
                { indent: '+1' },
            ],
            ['link'], //, 'image', 'video'],
            ['clean'],
            [{ undo: 'undo' }, { redo: 'redo' }], // Add undo and redo buttons
        ],
        history: {
            delay: 2000,
            maxStack: 500,
            userOnly: true,
        },
    };

    const formats = [
        'header',
        'font',
        'size',
        'bold',
        'italic',
        'underline',
        'strike',
        'blockquote',
        'list',
        'bullet',
        'indent',
        'link',
        'image',
        'video',
    ];

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
                        {editData
                            ? 'Edit Instructions'
                            : 'Wheel of Life Instructions'}
                    </p>
                </Box>
                {!editData && (
                    <div
                        className="inputBtnContainer"
                        style={{ marginRight: '20px', paddingBottom: '16px' }}
                    >
                        <button
                            className="buttonContainer"
                            onClick={handleEditWOLInstructions}
                        >
                            <img
                                src={editIcon_White}
                                backgroundColor="white"
                                alt=""
                            />
                            <small
                                style={{
                                    fontSize: '16px',
                                    fontWeight: 700,
                                    marginLeft: '5px',
                                }}
                            >
                                Edit
                            </small>
                        </button>
                    </div>
                )}
            </Box>
            <Box
                sx={{
                    mt: 2,
                    mb: 2,
                    backgroundColor: 'white',
                    borderRadius: 2, // 10px border radius
                    minHeight: 550, // Minimum height of 400px
                    padding: 2,
                }}
            >
                <Typography
                    variant="h7"
                    sx={{
                        color: '#1A1E3D',
                        fontSize: '16px',
                        fontWeight: 500,
                        marginBottom: '20px',
                    }}
                    component="h4"
                    gutterBottom
                >
                    Instructions
                </Typography>
                {editData ? (
                    <>
                        <Paper
                            elevation={3}
                            sx={{ padding: 2, borderRadius: 2 }}
                        >
                            <ReactQuill
                                value={value}
                                onChange={setValue}
                                modules={modules}
                                formats={formats}
                            />
                        </Paper>
                        <Box
                            className="inputBtnContainer"
                            sx={{
                                display: 'flex',
                                justifyContent: 'flex-start',
                                marginTop: 2,
                            }}
                        >
                            <button
                                className="buttonContainer"
                                onClick={handleUpdateWOLInstructions}
                            >
                                <small style={{ fontSize: '14px' }}>
                                    Update
                                </small>
                            </button>
                        </Box>
                    </>
                ) : (
                    <Typography
                        sx={{ color: '#5F6383' }}
                        variant="body1"
                        gutterBottom
                    >
                        {instruction.split('\n').map((line, index) => (
                            <span key={index}>
                                {line}
                                <br />
                            </span>
                        ))}
                    </Typography>
                )}
            </Box>
        </>
    );
};

export default WOLInstructions;
