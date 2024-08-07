// import React from 'react';
// import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
// import CloseIcon from '@mui/icons-material/Close';

// const StudentListPopup = ({ open, onClose, studentNames }) => {
//     return (
//         <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
//             <DialogTitle>
//                 Students
//                 <IconButton
//                     onClick={onClose}
//                     aria-label="close"
//                     sx={{
//                         position: 'absolute',
//                         right: 8,
//                         top: 8,
//                         color: '#F56D3B',
//                     }}
//                 >
//                     <CloseIcon />
//                 </IconButton>
//             </DialogTitle>
//             <DialogContent>
//                 <div>
//                     {studentNames.length > 0 ? (
//                         studentNames.map((student, index) => (
//                             <h6 key={index}>{student.student_name}</h6> // Adjust this to the correct property
//                         ))
//                     ) : (
//                         <p>No students available.</p>
//                     )}
//                 </div>
//             </DialogContent>
//         </Dialog>
//     );
// };

// export default StudentListPopup;

import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const StudentListPopup = ({ open, onClose, studentNames }) => {
    // Remove duplicate student names
    const uniqueStudentNames = Array.from(
        new Set(studentNames.map(student => student.student_name))
    );

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                Students
                <IconButton
                    onClick={onClose}
                    aria-label="close"
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: '#F56D3B',
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <div>
                    {uniqueStudentNames.length > 0 ? (
                        uniqueStudentNames.map((name, index) => (
                            <h6 key={index}>{name}</h6>
                        ))
                    ) : (
                        <p>No students available.</p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default StudentListPopup;
