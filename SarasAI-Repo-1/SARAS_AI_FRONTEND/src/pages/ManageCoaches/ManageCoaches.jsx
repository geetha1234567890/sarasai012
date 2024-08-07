import {
    Box,
    InputBase,
    Button,
    Modal,
    TextField,
    IconButton,
    Switch,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Snackbar,
    Alert,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import { useEffect, useState } from 'react';
import AddEditCoach from '../../components/adminModule/coaches/manageCoaches/AddEditCoach';
import { useNavigate } from 'react-router-dom';
import DynamicTable from '../../components/CommonComponent/DynamicTable';
import { useDispatch, useSelector } from 'react-redux';
import {
    getCoach,
    openCreateCoach,
    closeCreateCoach,
    openEditCoach,
    closeEditCoach,
    setSelectedCoach,
    openSuccessPopup,
    accessCoachName,
    closeSuccessPopup,
    openAssignStudents,
    closeAssignStudents,
    openAssignBatches,
    closeAssignBatches,
} from '../../redux/features/CoachModule/coachSlice';

const ManageCoaches = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // State variables
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCoachData, setSelectedCoachData] = useState(null);
    const [coachesData, setCoachesData] = useState([]);
    const [isAddEditCoachOpen, setIsAddEditCoachOpen] = useState(false);
    const [formValues, setFormValues] = useState({});
    const [editData, setEditData] = useState();
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [searchQuery, setSearchQuery] = useState(''); // State for search query

    const { coaches, loading, error, createCoachOpen, editCoachOpen } =
        useSelector(state => state.coachModule);

    // Fetch coach data on component mount
    useEffect(() => {
        dispatch(closeCreateCoach());
        dispatch(closeEditCoach());
        dispatch(getCoach());
    }, [dispatch]);

    // Action buttons for the DynamicTable
    const actionButtons = [
        {
            type: 'switch',
        },
        {
            type: 'edit',
            onClick: id => {
                handleEditCoaches(id);
            },
        },
    ];

    useEffect(() => {
        if (coaches.length > 0) {
            const transformData = coaches.map(item => ({
                id: item.id,
                'Coach Name': item.name,
                Username: item.username,
                Location: item.location,
                'Time Zone': item.time_zone,
                is_active: item.is_active,
            }));

            setCoachesData(transformData);
        }
    }, [coaches]);

    const handleAddTa = () => {
        dispatch(openCreateCoach());
    };

    const handleEditCoaches = id => {
        const coachData = coaches.find(ta => ta.id === id);
        setSelectedCoachData(coachData);
        setEditData(coachData);
        dispatch(openEditCoach());
        //navigate('/editcoach', { state: { fromManageCoaches: true } });
    };

    const handleAddCoach = () => {
        navigate('/createcoach');
    };

    const handleCloseAddEditCoach = () => {
        setIsAddEditCoachOpen(false);
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const headers = [
        'S. No.',
        'Coach Name',
        'Username',
        'Location',
        'Time Zone',
        'Action',
    ];

    const handleSubmitForm = event => {
        event.preventDefault();
        console.log(formValues);
        setOpenSnackbar(true); // Show the success popup
        handleCloseModal();
    };

    const handleInputChange = event => {
        const { name, value } = event.target;
        setFormValues({
            ...formValues,
            [name]: value,
        });
    };

    const handleToggle = id => {
        console.log(`Toggle TA with ID: ${id}`);
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    // Filter coachesData based on the search query
    const filteredCoachesData = coachesData.filter(coach =>
        ['Coach Name', 'Username', 'Location', 'Time Zone'].some(
            key =>
                coach[key] &&
                coach[key]
                    .toString()
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
        )
    );

    return (
        <>
            {!createCoachOpen && !editCoachOpen && (
                <Box m="20px">
                    <Header />
                    <Sidebar />
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
                            Manage Coach
                        </p>
                        <Box display={'flex'}>
                            <Box
                                display={'flex'}
                                backgroundColor="#FFF"
                                borderRadius={'30px'}
                                width={'30vh'}
                                marginRight={'10px'}
                            >
                                <InputBase
                                    sx={{ m1: 2, flex: 1, marginLeft: 5 }}
                                    placeholder="Search here ..."
                                    value={searchQuery}
                                    onChange={e =>
                                        setSearchQuery(e.target.value)
                                    } // Update search query
                                />
                            </Box>
                            <Button
                                variant="contained"
                                onClick={handleAddCoach}
                                style={{
                                    backgroundColor: '#F56D3B',
                                    borderRadius: '30px',
                                    textTransform: 'none',
                                }}
                            >
                                <i
                                    style={{
                                        marginRight: '5px',
                                    }}
                                    className="bi bi-plus-circle"
                                ></i>
                                <span>Create Coach</span>
                            </Button>
                        </Box>
                    </Box>
                    <Box
                        m="20px 0 0 0"
                        height={'70vh'}
                        sx={{
                            '& .MuiDataGrid-root': {
                                border: 'none',
                            },
                            '& .MuiDataGrid-cell': {
                                borderBottom: 'none',
                            },
                            '& .name-column--cell': {
                                color: '#5F6383',
                            },
                            '& .MuiDataGrid-columnHeader': {
                                backgroundColor: '#FFF',
                                borderBottom: 'none',
                            },
                            '& .MuiDataGrid-columnHeaderTitle': {
                                color: '#1A1E3D',
                                fontWeight: '600',
                                fontSize: 16,
                            },
                            '& .MuiDatGrid-virtualScroller': {
                                backgroundColor: '#FFF',
                            },
                            '& .MuiDataGrid-footerContainer': {
                                borderTop: 'none',
                                backgroundColor: '#FFF',
                            },
                            '& .MuiDataGrid-virtualScrollerContent': {
                                backgroundColor: '#FFF',
                            },
                        }}
                    >
                        <DynamicTable
                            headers={headers}
                            initialData={filteredCoachesData} // Use filtered data
                            actionButtons={actionButtons}
                            componentName={'MANAGECOACH'}
                        />
                    </Box>
                </Box>
            )}
            {createCoachOpen && <AddEditCoach />}
            {editCoachOpen && <AddEditCoach data={editData} />}
            {/* Snackbar for success message */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity="success"
                    sx={{ width: '100%' }}
                >
                    Form submitted successfully!
                </Alert>
            </Snackbar>
        </>
    );
};

export default ManageCoaches;
