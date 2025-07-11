import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { useState } from 'react';

const UrlForm = ({ setResults }) => {
  const [urls, setUrls] = useState([{ url: '', validity: '', shortcode: '' }]);

  const handleChange = (index, field, value) => {
    const updated = [...urls];
    updated[index][field] = value;
    setUrls(updated);
  };

  const addField = () => {
    if (urls.length < 5) {
      setUrls([...urls, { url: '', validity: '', shortcode: '' }]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleaned = urls.filter((u) => u.url && u.url.startsWith('http'));

    if (cleaned.length === 0) {
      alert('Please enter at least one valid URL.');
      return;
    }

    try {
      const responses = await Promise.all(
        cleaned.map((u) =>
          axios.post('http://localhost:5000/shorturls/', {
            url: u.url,
            validity: u.validity ? parseInt(u.validity) : 30,
            shortcode: u.shortcode,
          })
        )
      );
      setResults(responses.map((r) => r.data));
    } catch (error) {
      console.error('❌ Failed request:', error.response?.data || error.message);
      alert('Failed to shorten one or more URLs.\n\n' + (error.response?.data?.error || error.message));
    }
  };

  return (
    <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: '12px', mb: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ color: '#1976d2' }}>
        🔗 Shorten URLs
      </Typography>

      {urls.map((u, index) => (
        <Grid container spacing={2} key={index} sx={{ mt: 1 }}>
          <Grid item xs={5}>
            <TextField
              label="Long URL *"
              fullWidth
              required
              value={u.url}
              onChange={(e) => handleChange(index, 'url', e.target.value)}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              label="Validity (min)"
              type="number"
              fullWidth
              value={u.validity}
              onChange={(e) => handleChange(index, 'validity', e.target.value)}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="Shortcode (optional)"
              fullWidth
              value={u.shortcode}
              onChange={(e) => handleChange(index, 'shortcode', e.target.value)}
            />
          </Grid>
        </Grid>
      ))}

      <Box sx={{ mt: 2 }}>
        <Button onClick={addField} variant="outlined" color="primary" sx={{ mr: 2 }}>
          Add More
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default UrlForm;
