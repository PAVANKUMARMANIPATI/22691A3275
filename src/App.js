import { useState } from 'react';
import UrlForm from './components/UrlForm';
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from '@mui/material';

const App = () => {
  const [results, setResults] = useState([]);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
        URL Shortener App
      </Typography>

      <UrlForm setResults={setResults} />

      {results.length > 0 && (
        <Paper elevation={3} sx={{ mt: 4, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            📊 Analytics Table
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Short URL</strong></TableCell>
                <TableCell><strong>Expires At</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {results.map((r, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <a
                      href={`http://localhost:5000/${r.shortCode}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      http://localhost:5000/{r.shortCode}
                    </a>
                  </TableCell>
                  <TableCell>{new Date(r.expiresAt).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  );
};

export default App;
