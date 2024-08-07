import React, { useState } from 'react';
import { Grid, Button, Typography, Box } from '@mui/material';
import tus from 'tus-js-client';
import { styled } from '@mui/material/styles';
const VIMEO_ACCESS_TOKEN = process.env.VIMEO_ACCESS_TOKEN;

const UploadBox = styled(Box)(({ theme }) => ({
    border: '2px dashed #ccc',
    borderRadius: '10px',
    padding: '10px', // Reduced padding
    textAlign: 'center',
    color: '#888',
    cursor: 'pointer',
    marginTop: '10px',
    '&:hover': {
        borderColor: '#888',
    },
}));

const VideoUploadComponent = () => {
    const [file, setFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleFileChange = event => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) return;

        const requestData = {
            upload: {
                approach: 'tus',
                size: file.size.toString(),
            },
            name: 'Video Name', // Replace with your video name
            description: 'Video Description', // Replace with your video description
        };

        try {
            const response = await fetch('https://api.vimeo.com/me/videos', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${VIMEO_ACCESS_TOKEN}`,
                    Accept: 'application/vnd.vimeo.*+json;version=3.4',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            if (!response.ok) {
                throw new Error('Failed to upload video. Please try again.');
            }

            const vimeoResultData = await response.json();
            const uploadLink = vimeoResultData.upload.upload_link;

            if (uploadLink) {
                const upload = new tus.Upload(file, {
                    uploadUrl: uploadLink,
                    retryDelays: [0, 3000, 5000, 10000, 20000],
                    metadata: {
                        filename: file.name,
                        filetype: file.type,
                    },
                    onError: function (error) {
                        console.error(error);
                    },
                    onProgress: function (bytesUploaded, bytesTotal) {
                        const percentage = (bytesUploaded / bytesTotal) * 100;
                        setUploadProgress(percentage);
                    },
                    onSuccess: function () {
                        console.log('Upload complete');
                    },
                });
                upload.start();
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <Grid item xs={12} sm={6} md={6} style={{ width: '80%' }}>
            <UploadBox>
                <Typography>Drag and Drop the file</Typography>
                <Typography>Or</Typography>
                <input
                    type="file"
                    accept="video/*"
                    style={{ display: 'none' }}
                    id="upload-button"
                    onChange={handleFileChange}
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
            </UploadBox>
            {file && (
                <div>
                    <Typography>{file.name}</Typography>
                    <Button
                        onClick={handleUpload}
                        variant="contained"
                        color="primary"
                    >
                        Upload
                    </Button>
                    {uploadProgress > 0 && (
                        <Typography>
                            Upload Progress: {uploadProgress.toFixed(2)}%
                        </Typography>
                    )}
                </div>
            )}
        </Grid>
    );
};

export default VideoUploadComponent;
