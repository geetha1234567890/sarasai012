import React, { useState } from 'react';
import { Grid, Button, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const UploadBox = styled(Box)(({ theme }) => ({
    border: '2px dashed #ccc',
    borderRadius: '10px',
    padding: '10px',
    textAlign: 'center',
    color: '#888',
    cursor: 'pointer',
    marginTop: '10px',
    '&:hover': {
        borderColor: '#888',
    },
}));

const PDFUploadComponent = () => {
    const [fileName, setFileName] = useState('');

    const handleFileChange = event => {
        const file = event.target.files[0];
        if (file) {
            setFileName(file.name);
            console.log('File selected:', file);
        }
    };

    return (
        <Grid item xs={12} sm={6} md={6} style={{ width: '80%' }}>
            <UploadBox>
                <Typography>Drag and Drop the file</Typography>
                <Typography>Or</Typography>
                <input
                    type="file"
                    style={{ display: 'none' }}
                    id="upload-button"
                    onChange={handleFileChange}
                    accept=".pdf" // Restrict file types to PDF
                />
                <label htmlFor="upload-button">
                    <Button
                        variant="text"
                        sx={{ color: '#F56D3B' }}
                        component="span"
                    >
                        Browse File
                    </Button>
                </label>
                {fileName && (
                    <Typography variant="body2" style={{ marginTop: '10px' }}>
                        Selected file: {fileName}
                    </Typography>
                )}
            </UploadBox>
        </Grid>
    );
};

export default PDFUploadComponent;
// import React, { useState } from 'react';
// import { Grid, Button, Typography, Box } from '@mui/material';
// import { styled } from '@mui/material/styles';
// import { Document, Page } from 'react-pdf';
// import 'react-pdf/dist/esm/Page/AnnotationLayer.css'; // Import the styles

// const UploadBox = styled(Box)(({ theme }) => ({
//     border: '2px dashed #ccc',
//     borderRadius: '10px',
//     padding: '10px',
//     textAlign: 'center',
//     color: '#888',
//     cursor: 'pointer',
//     marginTop: '10px',
//     '&:hover': {
//         borderColor: '#888',
//     },
// }));

// const PDFUploadComponent = () => {
//     const [selectedFile, setSelectedFile] = useState(null);
//     const [fileUrl, setFileUrl] = useState('');
//     const [numPages, setNumPages] = useState(null);

//     const handleFileChange = (event) => {
//         const file = event.target.files[0];
//         if (file) {
//             setSelectedFile(file);
//             const url = URL.createObjectURL(file);
//             setFileUrl(url);
//         }
//     };

//     function onDocumentLoadSuccess({ numPages }) {
//         setNumPages(numPages);
//     }

//     return (
//         <Grid item xs={12} sm={6} md={6} style={{ width: '80%' }}>
//             <UploadBox>
//                 <Typography>Drag and Drop the file</Typography>
//                 <Typography>Or</Typography>
//                 <input
//                     type="file"
//                     style={{ display: 'none' }}
//                     id="upload-button"
//                     accept=".pdf"
//                     onChange={handleFileChange}
//                 />
//                 <label htmlFor="upload-button">
//                     <Button
//                         variant="text"
//                         sx={{ color: '#F56D3B' }}
//                         component="span"
//                     >
//                         Browse File
//                     </Button>
//                 </label>
//                 {fileUrl && (
//                     <Box mt={2} style={{ height: '500px', overflowY: 'auto' }}>
//                         <Document
//                             file={fileUrl}
//                             onLoadSuccess={onDocumentLoadSuccess}
//                         >
//                             {Array.from(new Array(numPages), (el, index) => (
//                                 <Page
//                                     key={`page_${index + 1}`}
//                                     pageNumber={index + 1}
//                                     width={800} // Adjust width as needed
//                                 />
//                             ))}
//                         </Document>
//                     </Box>
//                 )}
//             </UploadBox>
//         </Grid>
//     );
// };

// export default PDFUploadComponent;
