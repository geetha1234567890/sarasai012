import React, { useEffect, useState } from 'react';
import { Button, IconButton, Switch, Pagination, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import LinkActivityPopup from '../TemplateModulePopup/LinkActivity';
import PrerequisitesPopup from '../TemplateModulePopup/Prerequisites';
import editIcon from '../../../../assets/editIcon.png';

const CustomButton = styled(Button)(({ theme }) => ({
    borderRadius: '20px',
    border: '1px solid #F56D3B',
    color: '#F56D3B',
    padding: '8px 16px',
    margin: '0 8px',
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

const TemplateModuleTable = ({
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

    useEffect(() => {
        setData(
            initialData.map(item => ({
                ...item,
                is_active: item.is_active !== undefined ? item.is_active : 0,
            }))
        );
    }, [initialData]);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const currentData = data.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [linkActivityPopupOpen, setLinkActivityPopupOpen] = useState(false);
    const [prerequisitesPopupOpen, setPrerequisitesPopupOpen] = useState(false); // State for prerequisites popup

    const handlePageChange = (event, pageNumber) => {
        setCurrentPage(pageNumber);
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
                dispatch(updateTA({ id, data: requestData }));
                break;
            case 'TAMAPPING':
                console.log('TA MAPPING : ', id, requestData);
                break;
            default:
                console.warn(
                    `No API call defined for component: ${componentName}`
                );
                break;
        }
    };

    const openLinkActivityPopup = () => {
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

    return (
        <div className="tableContainer">
            <table>
                <thead className="tableHead">
                    <tr>
                        {headers.map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}
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
                                <td>
                                    {(currentPage - 1) * itemsPerPage +
                                        index +
                                        1}
                                </td>
                                {Object.keys(item).map((key, idx) => {
                                    if (
                                        key === 'Activity' ||
                                        key === 'Prerequisites'
                                    ) {
                                        const value = item[key];
                                        if (
                                            value === 'Link Activity' ||
                                            value === 'Prerequisites'
                                        ) {
                                            return (
                                                <td
                                                    key={idx}
                                                    style={{
                                                        borderRadius: '50px',
                                                        backgroundColor:
                                                            '#FEEBE3',
                                                        color: '#F56D3B',
                                                        padding: '8px',
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    <Button
                                                        style={{
                                                            color: '#F56D3B',
                                                        }}
                                                        onClick={() =>
                                                            key ===
                                                            'Prerequisites'
                                                                ? openPrerequisitesPopup()
                                                                : openLinkActivityPopup()
                                                        }
                                                    >
                                                        {value}
                                                    </Button>
                                                </td>
                                            );
                                        } else if (
                                            key === 'Activity' &&
                                            value === 'Video Name'
                                        ) {
                                            return (
                                                <td key={idx}>
                                                    {value}
                                                    <FontAwesomeIcon
                                                        icon={faEye}
                                                        style={{
                                                            marginLeft: '10px',
                                                        }}
                                                    />
                                                </td>
                                            );
                                        } else
                                            return <td key={idx}> {value}</td>;
                                    } else if (
                                        key !== 'id' &&
                                        key !== 'is_active'
                                    ) {
                                        if (
                                            typeof item[key] === 'object' &&
                                            item[key] !== null
                                        ) {
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
                                    return null;
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
                                                                height: '16px',
                                                                width: '16px',
                                                            },
                                                            '& small': {
                                                                lineHeight:
                                                                    '16px',
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
                                            return null;
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
            <LinkActivityPopup
                open={linkActivityPopupOpen}
                handleClose={closeLinkActivityPopup}
            />
            <PrerequisitesPopup
                open={prerequisitesPopupOpen}
                handleClose={closePrerequisitesPopup}
            />
        </div>
    );
};

export default TemplateModuleTable;
