import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  Paper,
  Button,
  useTheme,
  useMediaQuery,
  Skeleton,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

export default function GetReports() {
  const { type } = useParams(); // "theory" or "practical"
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetch(`https://markapp-backend.onrender.com/v1/attend/getall/${type}`,{method:'GET'})
      .then((res) => res.json())
      .then((data) => {
        setStudents(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching reports:', err);
        setLoading(false);
      });
  }, [type]);

  return (
    <Box sx={{ p: isMobile ? 2 : 5, backgroundColor: '#f5f4f1', minHeight: '100vh' }}>
      <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 3 }}>
        ← Back
      </Button>

      <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight="bold" gutterBottom>
        {type === 'practical' ? 'Practical' : 'Theory'} Attendance Report
      </Typography>

      <TableContainer component={Paper} elevation={4} sx={{ borderRadius: 3 }}>
        <Table size={isMobile ? 'small' : 'medium'}>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell><b>Roll Number</b></TableCell>
              <TableCell><b>Student Name</b></TableCell>
              {type === 'practical' && <TableCell><b>Batch</b></TableCell>}
              <TableCell><b>No. of Classes</b></TableCell>
              <TableCell><b>Present</b></TableCell>
              <TableCell><b>Attendance %</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              [...Array(5)].map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell><Skeleton /></TableCell>
                  <TableCell><Skeleton /></TableCell>
                  {type === 'practical' && <TableCell><Skeleton /></TableCell>}
                  <TableCell><Skeleton /></TableCell>
                  <TableCell><Skeleton /></TableCell>
                  <TableCell><Skeleton /></TableCell>
                </TableRow>
              ))
            ) : (
              students.map((stud, idx) => (
                <TableRow key={idx}>
                  <TableCell>{stud.RollNo}</TableCell>
                  <TableCell>{stud.NameStud}</TableCell>
                  {type === 'practical' && <TableCell>{stud.Batch}</TableCell>}
                  <TableCell>{stud.Noclass}</TableCell>
                  <TableCell>{stud.Present}</TableCell>
                  <TableCell>{stud.Attper}%</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
