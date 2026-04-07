import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { CircularProgress, Box, Typography } from "@mui/material";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const PDFViewer = ({ filePath }) => {
  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setValid(false);

    // Check if URL points to a PDF by inspecting headers
    fetch(filePath, { method: "HEAD" })
      .then(res => {
        if (!active) return;
        const contentType = res.headers.get("content-type") || "";
        if (res.ok && contentType.includes("application/pdf")) {
          setValid(true);
        }
      })
      .catch(() => {
        // network or CORS error
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [filePath]);

  // Loading state
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="200px">
        <CircularProgress size={40} sx={{ color: '#A98614' }} />
      </Box>
    );
  }

  // If URL is not a valid PDF, show fallback
  if (!valid) {
    return (
      <Box textAlign="center" p={2}>
        <Typography color="error" gutterBottom>
          Unable to load PDF document.
        </Typography>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open(filePath, '_blank')}
          sx={{
            borderColor: '#A98614',
            color: '#A98614',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <OpenInNewIcon fontSize="small" />
          Open in new tab
        </Button>
      </Box>
    );
  }

  // Valid PDF: embed in iframe
  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
      <Box
        component="iframe"
        src={filePath}
        width="100%"
        height="60vh"
        sx={{ border: 'none', borderRadius: 1 }}
        title="PDF Viewer"
      />
      <Button
        variant="outline"
        size="sm"
        onClick={() => window.open(filePath, '_blank')}
        sx={{
          borderColor: '#A98614',
          color: '#A98614',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        <OpenInNewIcon fontSize="small" />
        Open in new tab
      </Button>
    </Box>
  );
};

export default PDFViewer;
