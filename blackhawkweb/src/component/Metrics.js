import React, { useState, useEffect } from 'react';
import axios from "axios";
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';

export default function Metrics() {
  const [metrics, setMetrics] = useState("");
  const [loading, setLoading] = useState(false);

  const getMetrics = () => {
    (async function () {
      try {
        setLoading(true);
        const getTime = async () => {
          const response = await axios(`${process.env.REACT_APP_API_END_POINT}metrics`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${process.env.REACT_APP_AUTH_TOKEN}`
            }
          });
          const serverTimeDetail = response.data;
          if (serverTimeDetail) {
            //setServerTime(serverTimeDetail.data.epoch);
            setMetrics(() => {
              return serverTimeDetail;
            });
          }
          setLoading(false);
        };

        await getTime();
      } catch (error) {
        console.error(error.response);
      }
    })();
  }

  useEffect(() => {
    getMetrics();
    const interval = setInterval(() => {
      getMetrics();
    }, 30000);

    return () => clearInterval(interval);
  }, []);
  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="sm" style={{ height: '100vh', overflowY: 'scroll' }}>
        {loading && <CircularProgress style={{ position: 'relative', top: '50%', left: '50%' }} />}
        <code>{metrics}</code>
      </Container>
    </React.Fragment>
  );
}
