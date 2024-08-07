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
    setAddEditWolCategory,
    setEditData,
    getWOLCategory,
} from '../../../redux/features/coachingTools/wol/wolSlice';
import AddEditWOLCategory from './AddEditWOLCategory';

const WOLCategories = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { openAddEditWolCategory, wolCategoryData } = useSelector(
        state => state.wol
    );
    const [WOLCategoriesData, setWOLCategoriesData] = useState([]);

    const headers = ['S. No.', 'Wheel Of Life Category', 'Action'];

    useEffect(() => {
        dispatch(getWOLCategory());
    }, [dispatch]);

    useEffect(() => {
        if (wolCategoryData.status) {
            console.log(wolCategoryData.message);
            const transformData = wolCategoryData.data.map(item => ({
                id: item.id,
                'Wheel Of Life Category': item.name,
                is_active: item.is_active,
            }));
            setWOLCategoriesData(transformData);
        }
    }, [wolCategoryData]);

    const actionButtons = [
        {
            type: 'switch',
        },
        {
            type: 'edit',
            onClick: id => {
                console.log('Edit', id);
                dispatch(
                    setEditData(
                        wolCategoryData.data.find(item => item.id === id)
                    )
                );
                dispatch(setAddEditWolCategory(true));
            },
        },
    ];

    const handleAddNewWOLCategory = () => {
        console.log('Add New WOL Category');
        dispatch(setAddEditWolCategory(true));
    };

    // console.log("openAddEditWolCategory", openAddEditWolCategory)

    return (
        <>
            <Header />
            <Sidebar />
            <>
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
                            Wheel Of Life Categories
                        </p>
                    </Box>
                    <Box className="inputBtnContainer" paddingBottom="16px">
                        <button
                            className="buttonContainer"
                            onClick={handleAddNewWOLCategory}
                        >
                            <i className="bi bi-plus-circle"></i>
                            <span>Add New WOL Category</span>
                        </button>
                    </Box>
                </Box>
                {WOLCategoriesData.length > 0 ? (
                    <DynamicTable
                        headers={headers}
                        initialData={WOLCategoriesData}
                        actionButtons={actionButtons}
                        componentName={'WOLCATEGORY'}
                    />
                ) : (
                    <div>
                        <p>No Data Available</p>
                    </div>
                )}
                {openAddEditWolCategory && <AddEditWOLCategory />}
            </>
        </>
    );
};

export default WOLCategories;
