import { Box, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';

const UrlStats = () => {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:5000/shorturls');
        setStats(response.data);
      } catch (error) {
        console.error('Failed to load stats:', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        URL Statistics
      </Typography>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Short URL</TableCell>
              <TableCell>Clicks</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Expires At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stats.map((item, idx) => (
              <TableRow key={idx}>
                <TableCell>
                  <a href={item.shortLink} target="_blank" rel="noreferrer">
                    {item.shortLink}
                  </a>
                </TableCell>
                <TableCell>{item.clicks}</TableCell>
                <TableCell>{new Date(item.createdAt).toLocaleString()}</TableCell>
                <TableCell>{new Date(item.expiry).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default UrlStats;
