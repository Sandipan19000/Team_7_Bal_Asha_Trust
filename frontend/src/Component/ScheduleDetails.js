import { React, useState, useEffect } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Box, Grid, TextField, Typography } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import axios from 'axios';
import {useNavigate} from 'react-router-dom'
import {useSelector} from 'react-redux';
import {useParams} from 'react-router-dom'
import { useTranslation } from 'react-i18next';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const columns = [
    { field: 'col1', headerName: 'Email', width: 480 },
    { field: 'col2', headerName: 'Username', width: 250 },
];

const categories = [
    { value: 'abandoned', label: 'Abandoned' },
    { value: 'surrendered', label: 'Surrendared by Parents' },
    { value: 'orphanedNoGuardian', label: 'Orphaned - No Guardian' },
    { value: 'childAdmittedInCCIByFamily', label: 'Child Admitted In CCI By Family' }
];

const headingstyle = {
    color:'#CD366B',
    fontSize:'18px',
    fontWeight:"bolder",
    marginBottom: '10px',
}

export default function App(props) {

  
    const param = useParams();
    const navigate = useNavigate();
    const [volunteer, setVolunteer] = useState({});
    const [category, setCategory] = useState(param.category);
    const [rootData, setRootData] = useState([]);
    const [row, setRow] = useState([]);
    var state = useSelector((state) => ({ ...state }));
    const childID = param.id;
    const URL = process.env.REACT_APP_URL;

   
    const managerID = state.user != null ? state.user._id : "";


    useEffect(() => {

        async function fetchData() {
            try {
                var data = await axios.get(URL + "/get-social-worker-for-schedule");
                console.log(data);
                data = data.data;
                var arr = [];
                for (const item of data) {
                    const email = item.email;
                    const id = item._id;
                    const username = item.username;
                    arr.push({ id,  col1: email, col2: username });
                }
                setRow(arr);
                console.log(arr);

            } catch (err) {
                console.log(err);
            }
        }
        fetchData();
    }
        , []);


    const onRowsSelectionHandler = (ids) => {
        console.log(ids);
        const selectedRowsData = ids.map((id) => row.find((rows) => rows.id === id));
        console.log(selectedRowsData[0]);
        setVolunteer(selectedRowsData[0]);
    };

    const handleSchedule= async (e) => {
        console.log(childID,volunteer.id,managerID);
        const data = {
            childID,
            assignedWorkerID : volunteer.id,
            caseManagerID : managerID
        }
        try{
            const res = await axios.post(URL + "/assign-case",data);
            console.log(res);
            toast.success("Case Scheduled");
        }catch(err){
            if(err.response == null){
                toast.error(err.message);
            }else{
                toast.error(err.response.data.message);
            }
        }
    };

    const {t} = useTranslation();


    const handleChangeCategoery = async (e) => {

        console.log(category);
        
        
     
        try{
            const res = await axios.post(URL + "/change-category",childID,category);
            console.log(res);
            toast.success("Changed");
        }catch(err){
            if(err.response == null){
                toast.error(err.message);
            }else{
                toast.error(err.response.data.message);
            }
        }

    }


    return (
        <>
        <ToastContainer/>
            <Box sx={{
                flexDirection: { xs: "column", md: "row" },
                margin: {xs: "5px", md: "50px"},
                padding: '25px',
            }}>
                <Grid>
                    <Grid container spacing={3}>
                        <Grid sx={{ paddingX: {xs: "5px", md: "100px"}}} item xs={12} md={6}>
                            <Typography style={headingstyle}>{t('Select Volunteer')} : </Typography>
                            <TextField id="standard-basic" variant="standard" value={volunteer.col1} disabled fullWidth />
                        </Grid>
                        <Grid sx={{ paddingX: {xs: "5px", md: "100px"}}} item xs={12} md={6}>
                            <Typography style={headingstyle}>{t('Change Category')} : </Typography>
                            <TextField
                                id="standard-select-currency"
                                select
                                value={category}
                                variant="standard"
                                fullWidth
                                onChange={(event) => setCategory(event.target.value)}
                            >
                                
                                {categories.map((option) => (
                                    <MenuItem   key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                    </Grid>
                    <Grid sx={{ display: 'flex',justifyContent: 'center', alignItems: 'center', marginBottom: {xs: "25px", md: "50px"}}}>
                    <Button 
                        sx={{ mt:'50px' ,bgcolor:'#382A41' , fontSize:'15px' , ":hover": {
                            bgcolor: "#CD366B",
                            color: "white"
                        }}}
                        onClick={handleSchedule} 
                        variant="contained"
                    >
                        {t('Sechedule the Case')}
                    </Button>
                    {/* <Button 
                        sx={{ mt:'50px' ,bgcolor:'#382A41' , fontSize:'15px' , ":hover": {
                            bgcolor: "#CD366B",
                            color: "white"
                        }}}
                        onClick={handleChangeCategoery} 
                        variant="contained"
                    >
                        Change Category
                    </Button> */}
                    </Grid>
                    
                </Grid>

                <Grid sx={{display: 'flex',justifyContent: 'center', alignItems: 'center',}}>
                    <div style={{ height: 550, width: '80%' }}>
                        <DataGrid rows={row} columns={columns}
                         sx={{
                            boxShadow: 2,
                            border: 2,
                            borderColor: '#382A41',
                            '& .MuiDataGrid-cell:hover': {
                              color: '#CD366B',
                            },
                          }}
                        onRowSelectionModelChange={(ids) => onRowsSelectionHandler(ids)}
                        slots={{ toolbar: GridToolbar }} />
                    </div>
                </Grid>
            </Box>
        </>
    );
}
