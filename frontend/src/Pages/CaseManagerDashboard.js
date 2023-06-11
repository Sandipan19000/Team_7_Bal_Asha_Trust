import * as React from 'react';
import Grid from '@mui/material/Grid';
import { Pie, getElementAtEvent } from "react-chartjs-2";
import 'chart.js/auto';
import { useNavigate } from 'react-router-dom';
import { Typography, Box } from '@mui/material/';
import ChildList from "../Component/ChildList";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Card } from '@material-ui/core';
import { useRef } from 'react';
import "../Css/Admin.css";
import { useTranslation } from 'react-i18next';

const generateRandomColors = (numColors) => {
    const colors = [];
    for (let i = 0; i < numColors; i++) {
        const color = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
            Math.random() * 256
        )}, ${Math.floor(Math.random() * 256)}, 0.6)`;
        colors.push(color);
    }
    return colors;
};

function formatString(inputString) {
    // Capitalize the first letter of the string
    const formattedString = inputString.charAt(0).toUpperCase() + inputString.slice(1);

    // Add a space before every capital letter
    const finalString = formattedString.replace(/([A-Z])/g, ' $1');

    return finalString;
}



const CaseManagerDashboard = () => {
    const URL = process.env.REACT_APP_URL;
    const labels1 = ["Assigned", "Not Assigned", "Completed"],
        labels2 = ["Andheri", "Borivali", "Kurla"],
        datasets = [
            {
                data: [20, 30, 23],
                backgroundColor: generateRandomColors(3)

            }
        ];

    const [label1, setLabel1] = useState([]);
    const [label2, setLabel2] = useState([]);
    const [label3, setLabel3] = useState([]);
    const [dataset3, setDataset3] = useState([]);
    const [dataset1, setDataset1] = useState([]);
    const [dataset2, setDataset2] = useState([]);



    var state = useSelector((state) => ({ ...state }));




    useEffect(() => {

        async function fetchData() {
            try {


                function createLabelAndCount1(data) {
                    const districtCounts = {};

                    for (const item of data) {
                        const district = item.district;
                        if (district in districtCounts) {
                            districtCounts[district] += 1;
                        } else {
                            districtCounts[district] = 1;
                        }
                    }
                    const labels = Object.keys(districtCounts);
                    const ldata = Object.values(districtCounts);
                    const backgroundColor = generateRandomColors(labels.length);

                    return {
                        labels: labels,
                        count: [{ data: ldata, backgroundColor }]
                    };
                }
                function createLabelAndCount2(data) {
                    const statusCounts = {};

                    for (const item of data) {
                        const status = item.status;
                        if (status in statusCounts) {
                            statusCounts[status] += 1;
                        } else {
                            statusCounts[status] = 1;
                        }
                    }
                    const labels = Object.keys(statusCounts);
                    const ldata = Object.values(statusCounts);
                    const backgroundColor = generateRandomColors(labels.length);

                    return {
                        labels: labels,
                        count: [{ data: ldata, backgroundColor }]
                    };
                }



                if (state.user != null && state.user.role == "manager") {
                    var data = await axios.post(URL + "/get-all-child-data");
                    data = data.data;
                    console.log("CASE MANAGER", data);


                    var pie1 = (createLabelAndCount1(data));
                    var pie2 = (createLabelAndCount2(data));
                    setLabel1(pie1.labels);
                    setLabel2(pie2.labels);
                    setDataset1(pie1.count);
                    setDataset2(pie2.count)

                    var rData = await axios.get(URL + "/get-social-worker");
                    rData = rData.data;

                    var pie3 = (createLabelAndCount1(rData));
                    setLabel3(pie3.labels);
                    setDataset3(pie3.count)



                } else if (state.user != null && state.user.role == "root") {

                }
            } catch (err) {
                console.log(err);
            }



        }
        fetchData();
    }
        , []);

    console.log(label1, label2, dataset1, dataset2);



    const chartRef = useRef();
    const navigate = useNavigate();
    const onClick = (event) => {
        var index = (getElementAtEvent(chartRef.current, event));

        const x = (label2[index[0].index]);
        if (x == "onGoing")
            navigate("/on-going-cases");
        else if (x == "completed")
            navigate("/completed");
        else if (x == "pending")
            navigate("/pending");
    }

    const {t} = useTranslation();

    return (

        <>

                <Box display="flex" justifyContent="center" alignItems="center" paddingTop={3} marginBottom={2} >
                    <Typography variant="h4" align="center" fontWeight="bold">
                    {t("Cases Information")}
                    </Typography>
                </Box>


            <Grid container spacing={3} padding={2} sx={{ justifyContent: 'center' }}>
                <Grid item xs={12} md={4} sx={{ mb: 4 }} className="gridItem">
                    <Card className="cardItem paper1" onClick={onClick} style={{ borderRadius: '25px' }} >
                        <Pie
                            ref={chartRef}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    title: {
                                        display: true,
                                        text: 'Cases Status',
                                        font: {
                                            size: 26,
                                            weight: 'bold',
                                        },
                                    },
                                    legend: {
                                        display: true,
                                        position: "bottom"
                                    }
                                },
                                height: 400,
                                width: 400,
                            }}
                            data={{
                                labels: label2,
                                datasets: dataset2,
                            }}
                        />
                    </Card>
                </Grid>
                <Grid item xs={12} md={4} sx={{ mb: 4 }} className="gridItem">
                    <Card className="cardItem paper1" onClick={onClick} style={{ borderRadius: '25px' }}>
                        <Pie
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    title: {
                                        display: true,
                                        text: 'Region Wise Cases',
                                        font: {
                                            size: 26,
                                            weight: 'bold',
                                        },
                                    },
                                    legend: {
                                        display: true,
                                        position: "bottom"
                                    }
                                },
                                height: 400,
                                width: 400,
                            }}
                            data={{
                                labels: label1,
                                datasets: dataset1,
                            }}
                        />
                    </Card>
                </Grid>
            </Grid>



            <Box display="flex" justifyContent="center" alignItems="center" paddingTop={3} marginBottom={2} >
                <Typography variant="h4" align="center" fontWeight="bold">
                {t("Region Wise Distribution")} 
                </Typography>
                </Box>
            <Grid marginBottom={7} container spacing={3} padding={2} sx={{ justifyContent: 'center' }}>
                <Grid item xs={12} md={4} sx={{ mb: 4 }} className="gridItem">
                    <Card className="cardItem paper3" style={{ borderRadius: '25px' }}>
                        <Pie
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    title: {
                                        display: true,
                                        text: 'Social Workers',
                                        font: {
                                            size: 26,
                                            weight: 'bold',
                                        },


                                    },
                                    legend: {
                                        display: true,
                                        position: "bottom"
                                    }
                                },
                                height: 400,
                                width: 400,
                            }}
                            data={{
                                labels: label3,
                                datasets: dataset3
                            }}
                        />
                    </Card>
                </Grid>
            </Grid>

            
        </>
    );
}

export default CaseManagerDashboard;

