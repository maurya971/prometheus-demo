import React, { useState, useEffect } from 'react';
import axios from "axios";
import CssBaseline from '@mui/material/CssBaseline';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

export default function Time() {
    const [serverTime, setServerTime] = useState();
    const [difference, setDifference] = useState('00:00:00');
    const [loading, setLoading] = useState(false);

    const getTime = () => {
        (async function () {
            try {
                setLoading(true);
                const getTime = async () => {
                    const response = await axios(`${process.env.REACT_APP_API_END_POINT}time`, {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${process.env.REACT_APP_AUTH_TOKEN}`
                        }
                    });
                    const serverTimeDetail = response.data;
                    if (serverTimeDetail && serverTimeDetail.data) {
                        //setServerTime(serverTimeDetail.data.epoch);
                        setServerTime(() => {
                            return serverTimeDetail.data.epoch;
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
        getTime();
        const interval = setInterval(() => {
            getTime();
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    const getTimeDiff = (serverTime) => {
        const now = new Date();
        const localMilllisecondsSinceEpoch = now.getTime();
        const localSecondsSinceEpoch = Math.round(localMilllisecondsSinceEpoch / 1000);
        let total = serverTime - localSecondsSinceEpoch;
        total = Math.abs(total);
        const seconds = Math.floor((total) % 60);
        const minutes = Math.floor((total / 60) % 60);
        const hours = Math.floor((total / 60 / 60) % 24);
        return {
            total, hours, minutes, seconds
        };
    }

    const calculateDifference = () => {
        let newServerTime = serverTime;
        setInterval(() => {
            let { total, hours, minutes, seconds } = getTimeDiff(newServerTime);
            if (total >= 0) {
                console.log({ total, hours, minutes, seconds })
                setDifference(
                    (hours > 9 ? hours : '0' + hours) + ':' +
                    (minutes > 9 ? minutes : '0' + minutes) + ':'
                    + (seconds > 9 ? seconds : '0' + seconds)
                )
            }
        }, 1000)
    }

    useEffect(() => {
        if (serverTime && serverTime > 0) {
            calculateDifference();
        }
    }, [serverTime]);

    return (
        <React.Fragment>
            <CssBaseline />
            <Box sx={{ width: '100%' }}>
                <Stack spacing={2}>
                    <Item>{serverTime}</Item>
                    <Item>{difference}</Item>
                </Stack>
                {loading && <CircularProgress style={{ position: 'relative', top: '50%' }} />}
            </Box>
        </React.Fragment>
    );
}
