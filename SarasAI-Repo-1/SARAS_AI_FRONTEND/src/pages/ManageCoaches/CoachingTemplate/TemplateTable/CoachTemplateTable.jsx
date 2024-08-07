import React, { useEffect, useState } from 'react';
import { Button, IconButton, Switch, Pagination } from '@mui/material';

import { styled } from '@mui/material/styles';
import './CoachTemplateTable.css';
import { useNavigate } from 'react-router-dom';
import editIcon from '../../../../assets/editIcon.png';
import bin from '../../../../assets/bin.png';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useDispatch } from 'react-redux';

const CoachTemplateTable = ({
    headers,
    initialData,
    actionButtons,
    componentName,
}) => {
    const [data, setData] = useState(
        initialData.map(item => ({
            ...item,
            is_active: item.is_active !== undefined ? item.is_active : 0,
        }))
    );

    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        setData(
            initialData.map(item => ({
                ...item,
                is_active: item.is_active !== undefined ? item.is_active : 0,
            }))
        );
        setCurrentPage(1); // Reset to first page whenever initialData changes
    }, [initialData]);

    const itemsPerPage = 10;
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const currentData = data.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handlePageChange = (event, pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleDelete = id => {
        console.log('Deleting item with id:', id);
    };

    const handlePopup = (id, name, timezone) => {
        const data = { id, name, timezone };
        if (componentName === 'TAMAPPING') {
            //   dispatch(openScheduleSession(data));
        } else {
            if (componentName === 'COACHMAPPING') {
                // dispatch(openCoachScheduleSession(data));
            }
        }
    };

    const handleToggle = id => {
        const updatedData = data.map(item =>
            item.id === id
                ? { ...item, is_active: item.is_active === 1 ? 0 : 1 }
                : item
        );
        setData(updatedData);

        const toggledItem = updatedData.find(item => item.id === id);
        const requestData = { is_active: toggledItem.is_active };

        switch (componentName) {
            case 'MANAGETA':
                // dispatch(updateTA({ id, data: requestData }));
                break;
            default:
                console.warn(
                    `No API call defined for component: ${componentName}`
                );
                break;
        }
    };

    //   const getColorForAvailability = (availability) => {
    //     switch (availability) {
    //       case "available":
    //         return "#06DD0F";
    //       case "on leave":
    //         return "#F48606";
    //       case "Inactive":
    //         return "#808080";
    //       default:
    //         return "#000000";
    //     }
    //   };
    return (
        <div className="tableContainer">
            <table>
                <thead className="tableHead">
                    <tr>
                        {headers.map(
                            (header, index) =>
                                header !== 'timezone' && (
                                    <th key={index}>{header}</th>
                                )
                        )}
                    </tr>
                </thead>
                <tbody className="tableBody">
                    {currentData.length === 0 ? (
                        <tr>
                            <td
                                colSpan={headers.length}
                                style={{ textAlign: 'center' }}
                            >
                                No Data Available
                            </td>
                        </tr>
                    ) : (
                        currentData.map((item, index) => (
                            <tr key={item.id} id="tableRow">
                                {/* {console.log("CUURENT : ", item)} */}
                                <td>
                                    {(currentPage - 1) * itemsPerPage +
                                        index +
                                        1}
                                </td>
                                {Object.keys(item).map((key, idx) => {
                                    // {console.log("KEY : ", key)}
                                    //   if (key === "Availability") {
                                    //     return (
                                    //       <td
                                    //         key={idx}
                                    //         style={{
                                    //           color: getColorForAvailability(item[key]),
                                    //           fontFamily: "Regular",
                                    //           letterSpacing: "0.8px",
                                    //         }}
                                    //       >
                                    //         {item[key]}
                                    //       </td>
                                    //     );
                                    //   }  else
                                    if (
                                        key !== 'id' &&
                                        key !== 'is_active' &&
                                        key !== 'timezone'
                                    ) {
                                        // Check if item[key] is an object, and handle accordingly
                                        if (
                                            typeof item[key] === 'object' &&
                                            item[key] !== null
                                        ) {
                                            // Render a string representation or a relevant property of the object
                                            return (
                                                <td key={idx}>
                                                    {JSON.stringify(item[key])}
                                                </td>
                                            );
                                        } else {
                                            return (
                                                <td key={idx}>{item[key]}</td>
                                            );
                                        }
                                    }
                                    return null; // Ensure all paths return a value
                                })}

                                {actionButtons && (
                                    <td
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            verticalAlign: 'middle',
                                        }}
                                    >
                                        {actionButtons.map((button, idx) => {
                                            if (button.type === 'switch') {
                                                return (
                                                    <AntSwitch
                                                        key={idx}
                                                        checked={item.is_active}
                                                        onChange={() =>
                                                            handleToggle(
                                                                item.id
                                                            )
                                                        }
                                                        inputProps={{
                                                            'aria-label':
                                                                'ant design',
                                                        }}
                                                    />
                                                );
                                            }
                                            if (button.type === 'edit') {
                                                return (
                                                    <IconButton
                                                        key={idx}
                                                        color="primary"
                                                        sx={{
                                                            marginLeft: '10px',
                                                            display: 'flex',
                                                            alignItems:
                                                                'center',
                                                            justifyContent:
                                                                'center',
                                                            color: '#F56D3B',
                                                            backgroundColor:
                                                                '#FEEBE3',
                                                            gap: '4px',
                                                            height: '30px',
                                                            width: '70px',
                                                            borderRadius:
                                                                '15px',
                                                            padding: '5px',
                                                            '&:hover': {
                                                                backgroundColor:
                                                                    'rgba(245, 235, 227, 0.8)',
                                                            },
                                                            '& img': {
                                                                height: '16px', // adjust size as needed
                                                                width: '16px', // adjust size as needed
                                                            },
                                                            '& small': {
                                                                lineHeight:
                                                                    '16px', // match this with the image height for better alignment
                                                            },
                                                        }}
                                                        onClick={() =>
                                                            button.onClick(
                                                                item.id
                                                            )
                                                        }
                                                    >
                                                        <img
                                                            src={editIcon}
                                                            alt=""
                                                        />
                                                        <small
                                                            style={{
                                                                fontSize:
                                                                    '14px',
                                                            }}
                                                        >
                                                            Edit
                                                        </small>
                                                    </IconButton>
                                                );
                                            }
                                            if (button.type === 'delete') {
                                                return (
                                                    <IconButton
                                                        key={idx}
                                                        color="primary"
                                                        onClick={() =>
                                                            handleDelete(
                                                                item.id
                                                            )
                                                        }
                                                    >
                                                        <img
                                                            src={bin}
                                                            alt=""
                                                            style={{
                                                                width: '20px',
                                                                height: '20px',
                                                            }}
                                                        />
                                                    </IconButton>
                                                );
                                            }
                                            if (button.type === 'calendar') {
                                                return (
                                                    <CalenderButton
                                                        key={idx}
                                                        variant="outlined"
                                                        color="secondary"
                                                        startIcon={
                                                            <CalendarMonthIcon />
                                                        }
                                                        onClick={() =>
                                                            handlePopup(
                                                                item.id,
                                                                item.name,
                                                                item.timezone
                                                            )
                                                        }
                                                    >
                                                        Schedule
                                                    </CalenderButton>
                                                );
                                            }
                                            return null; // Handle unexpected button types gracefully
                                        })}
                                    </td>
                                )}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            <div className="pagination">
                <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    variant="outlined"
                    color="primary"
                    sx={{
                        width: '65vw',
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: '20px',
                        '.MuiPaginationItem-root': {
                            backgroundColor: '#fff',
                            border: '1px solid #ddd',
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'background-color 0.3s, transform 0.3s',
                            '&:hover': {
                                backgroundColor: '#DFDFF4',
                                transform: 'scale(1.1)',
                            },
                            '&.Mui-selected': {
                                backgroundColor: '#F56D3B',
                                color: '#fff',
                            },
                            '&.Mui-disabled': {
                                backgroundColor: '#DFDFF4',
                                cursor: 'not-allowed',
                            },
                        },
                    }}
                />
            </div>
        </div>
    );
};

const CustomButton = styled(Button)(({ theme }) => ({
    borderRadius: '20px',
    border: '1px solid #F56D3B',
    color: '#F56D3B',
    padding: '8px 16px', // Add padding for horizontal and vertical spacing
    margin: '0 8px', // Add horizontal margin between buttons
    textTransform: 'none',
    '&:hover': {
        backgroundColor: '#F56D3B',
        color: '#fff',
        borderColor: '#F56D3B',
    },
    '&.active': {
        backgroundColor: '#F56D3B',
        color: '#fff',
    },
}));

const CalenderButton = styled(Button)(({ theme }) => ({
    borderRadius: '20px',
    border: 'none',
    color: '#F56D3B',
    backgroundColor: '#FEEBE3',
    transition: 'all 0.3s ease', // Corrected transition syntax
    '&:hover': {
        backgroundColor: '#FEEBE3',
        color: '#F56D3B',
        border: 'none', // Corrected border removal syntax
    },
    '&:focus': {
        outline: 'none', // Remove default focus outline if desired
    },
}));

const AntSwitch = styled(Switch)(({ theme }) => ({
    width: 36, // adjust width as needed
    height: 20, // increased height
    padding: 0,
    marginTop: 5,
    display: 'flex',
    '&:active': {
        '& .MuiSwitch-thumb': {
            width: 17, // adjust width to keep thumb proportional
        },
        '& .MuiSwitch-switchBase.Mui-checked': {
            transform: 'translateX(16px)', // adjust translation to match increased height
        },
    },
    '& .MuiSwitch-switchBase': {
        padding: 3, // increased padding for larger height
        '&.Mui-checked': {
            transform: 'translateX(18px)', // adjust translation to match increased height
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
        width: 14, // increased width for larger thumb
        height: 14, // increased height for larger thumb
        borderRadius: 7, // adjusted to keep thumb circular
        transition: theme.transitions.create(['width'], {
            duration: 200,
        }),
    },
    '& .MuiSwitch-track': {
        borderRadius: 20 / 2, // adjusted to match new height
        opacity: 1,
        backgroundColor:
            theme.palette.mode === 'dark'
                ? 'rgba(255,255,255,.35)'
                : 'rgba(0,0,0,.25)',
        boxSizing: 'border-box',
    },
}));
export default CoachTemplateTable;
