// import React, { useEffect, useState } from 'react';
// import { IconButton, Checkbox, Button } from '@mui/material';
// import './popUpTable.css';
// import { useNavigate } from 'react-router-dom';
// import editIcon from '../../assets/editIcon.png';
// import bin from '../../assets/bin.png';
// import CallMadeOutlinedIcon from '@mui/icons-material/CallMadeOutlined';

// const CustomButton = ({
//     onClick,
//     children,
//     variant = 'contained',
//     color = '#FFFFFF',
//     backgroundColor = '#4E18A5',
//     borderColor = '#FFFFFF',
//     sx,
//     ...props
// }) => {
//     const variantStyles = {
//         contained: {
//             backgroundColor: backgroundColor,
//             color: color,
//             border: `2px solid ${borderColor}`,
//             '&:hover': {
//                 backgroundColor: color,
//                 color: backgroundColor,
//                 borderColor: borderColor,
//             },
//         },
//         outlined: {
//             backgroundColor: 'transparent',
//             color: '#F56D38',
//             border: '2px solid #F56D38',
//             '&:hover': {
//                 backgroundColor: '#F56D38',
//                 color: '#FFFFFF',
//             },
//         },
//         text: {
//             backgroundColor: 'transparent',
//             color: '#F56D38',
//             '&:hover': {
//                 backgroundColor: '#F56D38',
//                 color: '#FFFFFF',
//             },
//         },
//     };

//     return (
//         <Button
//             onClick={onClick}
//             variant={variant}
//             sx={{
//                 ...variantStyles[variant],
//                 fontWeight: '700',
//                 fontSize: '16px',
//                 borderRadius: '50px',
//                 padding: '10px 20px',
//                 textTransform: 'none',
//                 ...sx,
//             }}
//             {...props}
//         >
//             {children}
//         </Button>
//     );
// };

// const PopUpTable = ({
//     headers,
//     initialData,
//     onRowClick,
//     selectedBox = [],
//     onViewClick,
//     onRescheduleClick,
//     onCancelClick,
//     itemsPerPage = 4,
// }) => {
//     const [data, setData] = useState(initialData ?? []);

//     useEffect(() => {
//         setData(initialData ?? []);
//     }, [initialData]);

//     const handleCheckboxChange = id => {
//         onRowClick(id);
//     };

//     const [currentPage, setCurrentPage] = useState(1);
//     const totalPages = Math.ceil(data.length / itemsPerPage);
//     const currentData = data.slice(
//         (currentPage - 1) * itemsPerPage,
//         currentPage * itemsPerPage
//     );

//     return (
//         <div className="table-container popUpModel">
//             <table>
//                 <thead>
//                     <tr>
//                         {headers.map((header, index) => (
//                             <th key={index}>{header}</th>
//                         ))}
//                     </tr>
//                 </thead>
//                 <tbody className="popUpBody">
//                     {currentData && currentData.length > 0 ? (
//                         currentData.map((item, index) => (
//                             <tr key={item.id ?? index} id="popUpRow">
//                                 {headers.map((header, idx) => (
//                                     <td key={idx}>
//                                         {header === 'Select' ? (
//                                             <Checkbox
//                                                 checked={selectedBox.includes(
//                                                     item.id
//                                                 )}
//                                                 onChange={() =>
//                                                     handleCheckboxChange(
//                                                         item.id
//                                                     )
//                                                 }
//                                                 sx={{
//                                                     '& .MuiSvgIcon-root': {
//                                                         color: '#C2C2E7',
//                                                     },
//                                                 }}
//                                                 inputProps={{
//                                                     'aria-label': 'select all',
//                                                 }}
//                                             />
//                                         ) : header === 'Actions' ? (
//                                             <div>
//                                                 <CustomButton
//                                                     backgroundColor="#F56D38"
//                                                     color="#FFFFFF"
//                                                     borderColor="#F56D38"
//                                                     variant="contained"
//                                                     onClick={() =>
//                                                         onCancelClick(item)
//                                                     }
//                                                     endIcon={
//                                                         <CallMadeOutlinedIcon />
//                                                     }
//                                                     style={{
//                                                         textTransform: 'none',
//                                                         padding: '4px 8px',
//                                                         fontSize: '0.875rem',
//                                                         minWidth: 'auto',
//                                                     }}
//                                                 >
//                                                     Cancel
//                                                 </CustomButton>
//                                                 <div
//                                                     style={{
//                                                         textDecoration:
//                                                             'underline',
//                                                         cursor: 'pointer',
//                                                         marginTop: '4px',
//                                                         color: '#F56D3B',
//                                                         fontSize: '0.570rem',
//                                                     }}
//                                                     onClick={() =>
//                                                         onRescheduleClick(item)
//                                                     }
//                                                 >
//                                                     Reschedule
//                                                 </div>
//                                             </div>
//                                         ) : header === 'Students' ? (
//                                             <>
//                                                 {item.Students}
//                                                 <CustomButton
//                                                     variant="outlined"
//                                                     backgroundColor="#FFFFFF"
//                                                     borderColor="#F56D38"
//                                                     color="#F56D38"
//                                                     padding="4px 16px 4px 16px"
//                                                     endIcon={
//                                                         <CallMadeOutlinedIcon />
//                                                     }
//                                                     onClick={() =>
//                                                         onViewClick(
//                                                             'calendar',
//                                                             item.StudentList
//                                                         )
//                                                     }
//                                                     style={{
//                                                         textTransform: 'none',
//                                                         padding:
//                                                             '4px 16px 4px 16px',
//                                                         marginBottom: '15px',
//                                                         fontSize: '0.875rem',
//                                                         minWidth: 'auto',
//                                                     }}
//                                                 >
//                                                     View
//                                                 </CustomButton>
//                                             </>
//                                         ) : header === 'S. No.' ? (
//                                             index + 1
//                                         ) : typeof item[header] === 'object' ? (
//                                             JSON.stringify(item[header])
//                                         ) : (
//                                             (item[header] ?? 'N/A')
//                                         )}
//                                     </td>
//                                 ))}
//                             </tr>
//                         ))
//                     ) : (
//                         <tr id="popUpRow">
//                             <td
//                                 colSpan={headers.length}
//                                 style={{ textAlign: 'center' }}
//                             >
//                                 No Data Available
//                             </td>
//                         </tr>
//                     )}
//                 </tbody>
//             </table>
//         </div>
//     );
// };
// export default PopUpTable;

import React, { useEffect, useState } from 'react';
import { IconButton, Checkbox, Button } from '@mui/material';
import './popUpTable.css';
import { useNavigate } from 'react-router-dom';
import editIcon from '../../assets/editIcon.png';
import bin from '../../assets/bin.png';
import CallMadeOutlinedIcon from '@mui/icons-material/CallMadeOutlined';
import StudentListPopup from '../availability/StudentListPopup';

const CustomButton = ({
    onClick,
    children,
    variant = 'contained',
    color = '#FFFFFF',
    backgroundColor = '#4E18A5',
    borderColor = '#FFFFFF',
    sx,
    ...props
}) => {
    const variantStyles = {
        contained: {
            backgroundColor: backgroundColor,
            color: color,
            border: `2px solid ${borderColor}`,
            '&:hover': {
                backgroundColor: color,
                color: backgroundColor,
                borderColor: borderColor,
            },
        },
        outlined: {
            backgroundColor: 'transparent',
            color: '#F56D38',
            border: '2px solid #F56D38',
            '&:hover': {
                backgroundColor: '#F56D38',
                color: '#FFFFFF',
            },
        },
        text: {
            backgroundColor: 'transparent',
            color: '#F56D38',
            '&:hover': {
                backgroundColor: '#F56D38',
                color: '#FFFFFF',
            },
        },
    };

    return (
        <Button
            onClick={onClick}
            variant={variant}
            sx={{
                ...variantStyles[variant],
                fontWeight: '700',
                fontSize: '16px',
                borderRadius: '50px',
                padding: '10px 20px',
                textTransform: 'none',
                ...sx,
            }}
            {...props}
        >
            {children}
        </Button>
    );
};

const PopUpTable = ({
    headers,
    initialData,
    onRowClick,
    selectedBox = [],
    onViewClick,
    onRescheduleClick,
    onCancelClick,
    itemsPerPage = 4,
}) => {
    const [data, setData] = useState(initialData ?? []);
    const [openPopup, setOpenPopup] = useState(false);
    const [currentStudentNames, setCurrentStudentNames] = useState([]);

    useEffect(() => {
        setData(initialData ?? []);
    }, [initialData]);

    const handleCheckboxChange = id => {
        onRowClick(id);
    };

    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const currentData = data.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleViewClick = studentList => {
        setCurrentStudentNames(studentList);
        setOpenPopup(true);
    };

    const handleClosePopup = () => {
        setOpenPopup(false);
    };

    return (
        <div className="table-container popUpModel">
            <table>
                <thead>
                    <tr>
                        {headers.map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="popUpBody">
                    {currentData && currentData.length > 0 ? (
                        currentData.map((item, index) => (
                            <tr key={item.id ?? index} id="popUpRow">
                                {headers.map((header, idx) => (
                                    <td key={idx}>
                                        {header === 'Select' ? (
                                            <Checkbox
                                                checked={selectedBox.includes(
                                                    item.id
                                                )}
                                                onChange={() =>
                                                    handleCheckboxChange(
                                                        item.id
                                                    )
                                                }
                                                sx={{
                                                    '& .MuiSvgIcon-root': {
                                                        color: '#C2C2E7',
                                                    },
                                                }}
                                                inputProps={{
                                                    'aria-label': 'select all',
                                                }}
                                            />
                                        ) : header === 'Actions' ? (
                                            <div>
                                                <CustomButton
                                                    backgroundColor="#F56D38"
                                                    color="#FFFFFF"
                                                    borderColor="#F56D38"
                                                    variant="contained"
                                                    onClick={() =>
                                                        onCancelClick(item)
                                                    }
                                                    endIcon={
                                                        <CallMadeOutlinedIcon />
                                                    }
                                                    style={{
                                                        textTransform: 'none',
                                                        padding: '4px 8px',
                                                        fontSize: '0.875rem',
                                                        minWidth: 'auto',
                                                    }}
                                                >
                                                    Cancel
                                                </CustomButton>
                                                <div
                                                    style={{
                                                        textDecoration:
                                                            'underline',
                                                        cursor: 'pointer',
                                                        marginTop: '4px',
                                                        color: '#F56D3B',
                                                        fontSize: '0.570rem',
                                                    }}
                                                    onClick={() =>
                                                        onRescheduleClick(item)
                                                    }
                                                >
                                                    Reschedule
                                                </div>
                                            </div>
                                        ) : header === 'Students' ? (
                                            <>
                                                {item.Students}
                                                <CustomButton
                                                    variant="outlined"
                                                    backgroundColor="#FFFFFF"
                                                    borderColor="#F56D38"
                                                    color="#F56D38"
                                                    padding="4px 16px 4px 16px"
                                                    endIcon={
                                                        <CallMadeOutlinedIcon />
                                                    }
                                                    onClick={() =>
                                                        handleViewClick(
                                                            item.StudentList
                                                        )
                                                    }
                                                    style={{
                                                        textTransform: 'none',
                                                        padding:
                                                            '4px 16px 4px 16px',
                                                        marginBottom: '15px',
                                                        fontSize: '0.875rem',
                                                        minWidth: 'auto',
                                                    }}
                                                >
                                                    View
                                                </CustomButton>
                                            </>
                                        ) : header === 'S. No.' ? (
                                            index + 1
                                        ) : typeof item[header] === 'object' ? (
                                            JSON.stringify(item[header])
                                        ) : (
                                            (item[header] ?? 'N/A')
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr id="popUpRow">
                            <td
                                colSpan={headers.length}
                                style={{ textAlign: 'center' }}
                            >
                                No Data Available
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            <StudentListPopup
                open={openPopup}
                onClose={handleClosePopup}
                studentNames={currentStudentNames}
            />
        </div>
    );
};

export default PopUpTable;
