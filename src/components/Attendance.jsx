import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button,
  Typography, Box, useMediaQuery, TextField, Grid, Skeleton
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useParams } from 'react-router-dom';
import { Snackbar, Alert } from '@mui/material';

const STATUS_CYCLE = ['0', '1', '2'];
const STATUS_LABEL = { '0': 'Absent', '1': 'Present', '2': 'NR' };
const STATUS_COLOR = { '0': 'error', '1': 'success', '2': 'warning' };

export default function Attend() {
  const { type } = useParams(); // "theory" or "practical"
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState('');
  const [teacher, setTeacher] = useState('');
  const [batch, setBatch] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [snackOpen, setSnackOpen] = useState(false);
const [snackMessage, setSnackMessage] = useState('');
const [snackSeverity, setSnackSeverity] = useState('info'); // "info" | "success" | "error"

  useEffect(() => {
    if (type === 'theory') {
      setLoading(true);
      fetch('https://markapp-backend.onrender.com/v1/students/getlist/theory')
        .then(res => res.json())
        .then(data => {
          const initialized = data.map(stud => ({
            ...stud,
            status: '1',
          }));
          setStudents(initialized);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching students:', err);
          setLoading(false);
        });
    }
  }, [type]);

  const fetchPracticalStudents = () => {
    if (!batch) {
      alert('Please enter a batch name first.');
      return;
    }
    setLoading(true);
    fetch('https://markapp-backend.onrender.com/v1/students/getlist/practical', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ batch }),
    })
      .then(res => res.json())
      .then(data => {
        const initialized = data.map(stud => ({
          ...stud,
          status: '1',
        }));
        setStudents(initialized);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching practical students:', err);
        setLoading(false);
      });
  };

  const toggleStatus = (index) => {
    setStudents(prev =>
      prev.map((s, i) => {
        if (i === index) {
          const nextStatus = STATUS_CYCLE[(STATUS_CYCLE.indexOf(s.status) + 1) % STATUS_CYCLE.length];
          return { ...s, status: nextStatus };
        }
        return s;
      })
    );
  };

  const handleSave = async () => {
  if (!date || !teacher) {
    alert('Please enter both date and teacher name.');
    return;
  }

  const payload = {
    date,
    teacher,
    batch: type === 'practical' ? batch : undefined,
    students: students.map(s => ({
      roll: s.RollNo,
      name: s.NameStud,
      status: s.status,
       batch: type === 'practical' ? batch : undefined,
    })),
  };

  setSnackMessage('Saving attendance...');
  setSnackSeverity('info');
  setSnackOpen(true);

  try {
    const response = await fetch(type==='theory'?'https://markapp-backend.onrender.com/v1/attend/mark/theory':'https://markapp-backend.onrender.com/v1/attend/mark/practical', {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error('Failed to save');

    setSnackMessage('Attendance saved successfully!');
    setSnackSeverity('success');
  } catch (err) {
    console.error(err);
    setSnackMessage('Error saving attendance.');
    setSnackSeverity('error');
  }
};


  return (
    <Box sx={{ p: isMobile ? 2 : 5, backgroundColor: '#f5f4f1', maxHeight: '70vh', overflowY: 'auto'}}>
      <Typography variant={isMobile ? 'h5' : 'h4'} gutterBottom fontWeight="bold">
        Mark {type === 'practical' ? 'Practical' : 'Theory'} Attendance
      </Typography>

      <Grid container spacing={2} mb={3}>
        {type === 'practical' && (
          <>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Batch"
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                sx={{ height: '100%' }}
                onClick={fetchPracticalStudents}
              >
                Fetch Students
              </Button>
            </Grid>
          </>
        )}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="date"
            label="Class Date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Teacher Name and Subject"
            value={teacher}
            onChange={(e) => setTeacher(e.target.value)}
          />
        </Grid>
      </Grid>

      <TableContainer component={Paper} elevation={4} sx={{ borderRadius: 3, overflowX: 'auto', overflowY: 'auto' }}>
        <Table size={isMobile ? 'small' : 'medium'}>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell><b>Roll Number</b></TableCell>
              <TableCell><b>Student Name</b></TableCell>
              <TableCell align="center"><b>Status</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              [...Array(5)].map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell><Skeleton /></TableCell>
                  <TableCell><Skeleton /></TableCell>
                  <TableCell align="center"><Skeleton variant="rectangular" width={80} height={36} /></TableCell>
                </TableRow>
              ))
            ) : (
              students.map((stud, index) => (
                <TableRow key={stud.RollNo}>
                  <TableCell>{stud.RollNo}</TableCell>
                  <TableCell>{stud.NameStud}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      color={STATUS_COLOR[stud.status]}
                      onClick={() => toggleStatus(index)}
                      size={isMobile ? 'small' : 'medium'}
                      sx={{ minWidth: 100, borderRadius: 6, textTransform: 'none' }}
                    >
                      {STATUS_LABEL[stud.status]}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box mt={4} display="flex" justifyContent="center">
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          size="large"
          sx={{
            px: 5,
            py: 1.5,
            borderRadius: 40,
            fontWeight: 'bold',
            boxShadow: 4,
            textTransform: 'none'
          }}
        >
          Save Attendance
        </Button>
      </Box>
      <Snackbar
  open={snackOpen}
  autoHideDuration={3000}
  onClose={() => setSnackOpen(false)}
  anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
>
  <Alert
    onClose={() => setSnackOpen(false)}
    severity={snackSeverity}
    sx={{ width: '100%' }}
  >
    {snackMessage}
  </Alert>
</Snackbar>

    </Box>
  );
}
