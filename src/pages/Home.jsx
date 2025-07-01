import React from 'react';
import {
  Box,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
  Slide,
  Stack,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import Attend from '../components/Attendance';

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const isInAttendance = location.pathname.includes('/attendance');

  const handleOpenAttendance = (type) => {
    navigate(`/attendance/${type}`);
  };

  const handleOpenReports = (type) => {
    navigate(`/get-reports/${type}`);
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <Box sx={{ p: isMobile ? 0 : 4, backgroundColor: 'black' }}>
      <Typography
        variant={isMobile ? 'h6' : 'h4'}
        fontWeight="bold"
        gutterBottom
        sx={{ color: 'white', pt: 5, pl: 2 }}
      >
        Welcome, Professor
      </Typography>

      <Slide direction="up" in={!isInAttendance} mountOnEnter unmountOnExit>
        <Box
          sx={{
            backgroundColor: '#f5f4f1',
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            p: 4,
            mt: 3,
            boxShadow: 4,
            height: '100vh',
          }}
        >
          <Stack spacing={5}>
            {/* Theory Section */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Theory Attendance
              </Typography>
              <Stack spacing={2} direction={isMobile ? 'column' : 'row'}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleOpenAttendance('theory')}
                  sx={{ borderRadius: 3, px: 3 }}
                >
                  Mark New Attendance
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  sx={{ borderRadius: 3, px: 3 }}
                   onClick={() => handleOpenReports('theory')}
                >
                  Get Reports
                </Button>
              </Stack>
            </Box>

            {/* Practical Section */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Practical Attendance
              </Typography>
              <Stack spacing={2} direction={isMobile ? 'column' : 'row'}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleOpenAttendance('practical')}
                  sx={{ borderRadius: 3, px: 3 }}
                >
                  Mark New Attendance
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  sx={{ borderRadius: 3, px: 3 }}
                   onClick={() => handleOpenReports('practical')}
                >
                  Get Reports
                </Button>
              </Stack>
            </Box>
          </Stack>
        </Box>
      </Slide>

      {isInAttendance && (
        <Slide direction="down" in={true} mountOnEnter unmountOnExit>
          <Box
            sx={{
              mt: 4,
              backgroundColor: '#f5f4f1',
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
            }}
          >
            <Button
              onClick={handleBack}
              variant="outlined"
              sx={{ mt: 4, mb: 2, borderRadius: 2, ml: 1 }}
            >
              ← Back
            </Button>
            <Attend />
          </Box>
        </Slide>
      )}
    </Box>
  );
}
