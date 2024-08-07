import React, { useState, useCallback } from 'react';
import { Box, Button, Switch } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import LinkActivityPopup from '../TemplateModulePopup/LinkActivity';
import PrerequisitesPopup from '../TemplateModulePopup/Prerequisites';
import editIcon from '../../../../assets/editIcon.png'; // Assuming this is the correct path to your edit icon
import {
    getCoachTemplateModuleId,
    openEditActivityPopup,
    openEditModulePopup,
    openTemplateActivityPopup,
    updateCoachActivity,
} from '../../../../redux/features/CoachModule/CoachTemplateSlice';

const CustomButton = styled(Button)(({ theme, backgroundColor = '' }) => ({
    borderRadius: '20px',
    border: `1px solid #F56D3B`,
    color: '#F56D3B',
    padding: '8px 16px',
    margin: '0 8px',
    backgroundColor: backgroundColor,
    '&:hover': {
        backgroundColor: '#F56D3B',
        color: '#fff',
        borderColor: backgroundColor,
    },
}));

const AntSwitch = styled(Switch)(({ theme }) => ({
    width: 36,
    height: 20,
    padding: 0,
    marginTop: 5,
    display: 'flex',
    '&:active': {
        '& .MuiSwitch-thumb': {
            width: 17,
        },
        '& .MuiSwitch-switchBase.Mui-checked': {
            transform: 'translateX(16px)',
        },
    },
    '& .MuiSwitch-switchBase': {
        padding: 3,
        '&.Mui-checked': {
            transform: 'translateX(18px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor:
                    theme.palette.mode === 'dark' ? '#177ddc' : '#14D249',
            },
        },
    },
    '& .MuiSwitch-thumb': {
        boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
        width: 14,
        height: 14,
        borderRadius: 7,
        transition: theme.transitions.create(['width'], {
            duration: 200,
        }),
    },
    '& .MuiSwitch-track': {
        borderRadius: 20 / 2,
        opacity: 1,
        backgroundColor:
            theme.palette.mode === 'dark'
                ? 'rgba(255,255,255,.35)'
                : 'rgba(0,0,0,.25)',
        boxSizing: 'border-box',
    },
}));

const TemplateModuleTable = ({ modulesData }) => {
    const [linkActivityPopupOpen, setLinkActivityPopupOpen] = useState(false);
    const [prerequisitesPopupOpen, setPrerequisitesPopupOpen] = useState(false);
    const [selectedActivityId, setSelectedActivityId] = useState(null); // State for selected activity ID
    const dispatch = useDispatch();
    const { selectedCoachTemplate } = useSelector(state => state.coachTemplate);

    const handleToggle = (moduleId, activityId, currentStatus) => {
        const newStatus = !currentStatus;
        const data = {
            activity_id: activityId,
            status: newStatus,
        };

        // Dispatch the updateCoachActivity action
        dispatch(updateCoachActivity({ data }))
            .unwrap()
            .then(() => {
                // console.log("SLOT EVENT DATA : ", slotEventData)
                dispatch(getCoachTemplateModuleId(selectedCoachTemplate));
            });
    };

    const openLinkActivityPopup = activityId => {
        setSelectedActivityId(activityId); // Set the selected activity ID
        setLinkActivityPopupOpen(true);
    };

    const closeLinkActivityPopup = () => {
        setLinkActivityPopupOpen(false);
    };

    const openPrerequisitesPopup = () => {
        setPrerequisitesPopupOpen(true);
    };

    const closePrerequisitesPopup = () => {
        setPrerequisitesPopupOpen(false);
    };

    const handleActivity = (id, templateId) => {
        console.log('Add Activity clicked for module:', id, templateId);
        const data = {
            id,
            templateId,
        };
        dispatch(openTemplateActivityPopup(data));
        // Implement your logic for adding activity
    };

    const handleEditModule = (id, name, is_active) => {
        console.log('Edit Module clicked', id);
        const data = {
            id,
            name,
            is_active,
        };
        console.log('DATA : ', data);
        dispatch(openEditModulePopup(data));
        // Implement your logic for editing module
    };
    const handleEditActivity = activity => {
        console.log('Clicked Activity !');
        dispatch(openEditActivityPopup(activity));
    };
    const handleActivityClick = activity => {
        console.log('clicked');
    };

    const headers = [
        'S. No.',
        'Activity Name',
        'Due Date',
        'Activity',
        'Points',
        'Prerequisites',
        'After Due Date',
        'Actions',
    ];

    const { typeList } = useSelector(state => state.activityType);
    const activityOptions = typeList.map(type => ({
        value: type.type_name,
        label: type.type_name.charAt(0).toUpperCase() + type.type_name.slice(1), // Capitalize the first letter of each type_name
        id: type.id,
    }));

    const getActivityLabel = activityTypeId => {
        const option = activityOptions.find(opt => opt.id === activityTypeId);
        return option ? option.label : 'Unknown';
    };

    return (
        <>
            {console.log('MODULE DATA : ', modulesData)}
            {modulesData?.modules.map(module => (
                <Box key={module.id}>
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        padding={2}
                        borderRadius="0px"
                        border="0px solid #e0e0e0"
                    >
                        <p
                            style={{
                                fontSize: '24px',
                                justifyContent: 'center',
                                margin: 0,
                            }}
                        >
                            {module.module_name}
                            <span
                                style={{
                                    borderRadius: '50px',
                                    backgroundColor: module.is_active
                                        ? '#14D249'
                                        : 'red',
                                    color: 'white',
                                    padding: '3px 10px',
                                    marginLeft: '10px',
                                    fontSize: '12px',
                                }}
                            >
                                {module.is_active ? 'Active' : 'Inactive'}
                            </span>
                        </p>
                        <div
                            className="inputBtnContainer"
                            style={{ display: 'flex', alignItems: 'center' }}
                        >
                            <CustomButton
                                // className="buttonTemplateContainer"
                                onClick={() =>
                                    handleActivity(
                                        module.id,
                                        module?.template[0]?.id
                                    )
                                }
                            >
                                <i className="bi bi-plus-circle"></i>
                                <span style={{ marginLeft: '5px' }}>
                                    Add Activity
                                </span>
                            </CustomButton>

                            <CustomButton
                                // className="buttonTemplateContainer"
                                onClick={() =>
                                    handleEditModule(
                                        module.id,
                                        module.module_name,
                                        module.is_active
                                    )
                                }
                            >
                                <FontAwesomeIcon
                                    icon={faPenToSquare}
                                    className="bi"
                                />
                                <span style={{ marginLeft: '5px' }}>
                                    Edit Module
                                </span>
                            </CustomButton>
                        </div>
                    </Box>
                    {module.activities?.length > 0 && (
                        <Box
                            marginTop={1}
                            padding={2}
                            border="1px solid #e0e0e0"
                            borderRadius="8px"
                            backgroundColor="#fff"
                        >
                            <div className="tableContainer">
                                <table
                                    style={{
                                        width: '100%',
                                        borderCollapse: 'collapse',
                                    }}
                                >
                                    <thead className="tableHead">
                                        <tr>
                                            {headers.map((header, index) => (
                                                <th
                                                    key={index}
                                                    style={{ padding: '8px 0' }}
                                                >
                                                    {header}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="tableBody">
                                        {module.activities.map(
                                            (activity, index) => (
                                                <tr key={activity.id}>
                                                    <td
                                                        style={{
                                                            padding: '8px 0',
                                                            borderBottom:
                                                                '1px solid #e0e0e0',
                                                        }}
                                                    >
                                                        {index + 1}
                                                    </td>
                                                    <td
                                                        style={{
                                                            padding: '8px 0',
                                                            borderBottom:
                                                                '1px solid #e0e0e0',
                                                        }}
                                                    >
                                                        {activity.activity_name}
                                                    </td>
                                                    <td
                                                        style={{
                                                            padding: '8px 0',
                                                            borderBottom:
                                                                '1px solid #e0e0e0',
                                                        }}
                                                    >
                                                        {activity.due_date}
                                                    </td>
                                                    <td
                                                        style={{
                                                            padding: '8px 0',
                                                            borderBottom:
                                                                '1px solid #e0e0e0',
                                                        }}
                                                    >
                                                        {activity.activity_type_id ? (
                                                            <Button
                                                                onClick={() =>
                                                                    handleActivityClick(
                                                                        activity
                                                                    )
                                                                }
                                                                style={{
                                                                    backgroundColor:
                                                                        'transparent',
                                                                    border: 'none',
                                                                    cursor: 'pointer',
                                                                    color: 'black',
                                                                }}
                                                            >
                                                                {getActivityLabel(
                                                                    activity.activity_type_id
                                                                )}
                                                                <FontAwesomeIcon
                                                                    icon={faEye}
                                                                    style={{
                                                                        marginLeft:
                                                                            '5px',
                                                                        color: '#F56D3B',
                                                                    }}
                                                                />
                                                            </Button>
                                                        ) : (
                                                            <CustomButton
                                                                backgroundColor="#FEEBE3"
                                                                onClick={() => {
                                                                    console.log(
                                                                        'selectedcoachtemplate',
                                                                        selectedCoachTemplate
                                                                    );
                                                                    openLinkActivityPopup(
                                                                        activity.id
                                                                    );
                                                                }}
                                                            >
                                                                Link Activity
                                                            </CustomButton>
                                                        )}
                                                    </td>
                                                    <td
                                                        style={{
                                                            padding: '8px 0',
                                                            borderBottom:
                                                                '1px solid #e0e0e0',
                                                        }}
                                                    >
                                                        {activity.points}
                                                    </td>
                                                    <td
                                                        style={{
                                                            padding: '8px 0',
                                                            borderBottom:
                                                                '1px solid #e0e0e0',
                                                        }}
                                                    >
                                                        <CustomButton
                                                            onClick={
                                                                openPrerequisitesPopup
                                                            }
                                                            backgroundColor="#FEEBE3"
                                                        >
                                                            Prerequisite
                                                        </CustomButton>
                                                    </td>
                                                    <td
                                                        style={{
                                                            padding: '8px 0',
                                                            borderBottom:
                                                                '1px solid #e0e0e0',
                                                        }}
                                                    >
                                                        {
                                                            activity.after_due_date
                                                        }
                                                    </td>
                                                    <td
                                                        style={{
                                                            padding: '8px 0',
                                                            borderBottom:
                                                                '1px solid #e0e0e0',
                                                        }}
                                                    >
                                                        <AntSwitch
                                                            checked={
                                                                activity.is_active
                                                            }
                                                            onChange={() =>
                                                                handleToggle(
                                                                    module.id,
                                                                    activity.id,
                                                                    activity.is_active
                                                                )
                                                            }
                                                            inputProps={{
                                                                'aria-label':
                                                                    'ant design',
                                                            }}
                                                        />
                                                    </td>
                                                    <td
                                                        style={{
                                                            padding: '8px 0',
                                                            borderBottom:
                                                                '1px solid #e0e0e0',
                                                        }}
                                                    >
                                                        <CustomButton
                                                            onClick={() =>
                                                                handleEditActivity(
                                                                    activity
                                                                )
                                                            }
                                                            className="editBtn"
                                                        >
                                                            <FontAwesomeIcon
                                                                icon={
                                                                    faPenToSquare
                                                                }
                                                                className="icon" // Apply class name for icon
                                                                style={{
                                                                    color: 'inherit',
                                                                }} // Inherit color from button
                                                            />
                                                            <span
                                                                className="text" // Apply class name for text
                                                                style={{
                                                                    fontSize:
                                                                        '14px',
                                                                    marginLeft:
                                                                        '5px',
                                                                    color: 'inherit', // Inherit color from button
                                                                }}
                                                            >
                                                                Edit
                                                            </span>
                                                        </CustomButton>
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </Box>
                    )}
                </Box>
            ))}
            <LinkActivityPopup
                open={linkActivityPopupOpen}
                handleClose={closeLinkActivityPopup}
                activityId={selectedActivityId}
                templateId={selectedCoachTemplate}
            />
            <PrerequisitesPopup
                open={prerequisitesPopupOpen}
                handleClose={closePrerequisitesPopup}
            />
        </>
    );
};

export default TemplateModuleTable;
