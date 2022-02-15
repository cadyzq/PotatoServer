import "./UserForm.css";
import GoogleMapReact from "google-map-react";
import { useEffect, useState } from "react";
import { Marker } from "../map/Marker";
import {registerUser, saveStudent} from "../api/axios_wrapper";
import { Link, use, useNavigate } from "react-router-dom";
import { Users } from "./Users";
import { filterAllUsers, filterAllSchools, getOneUser } from "../api/axios_wrapper";
import { StudentForm } from "../students/StudentForm";


import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { ListItemButton } from "@mui/material";
import Divider from '@mui/material/Divider';
import CloseIcon from '@mui/icons-material/Close';


export const UserForm = () => {
    let navigate = useNavigate(); 

    // user 
    const [user, setUser] = useState({});
    const [students, setStudents] = useState([]); 
    const [addressValid, setAddressValid] = useState(false);

    // show student form 
    const [makeStudent, setMakeStudent] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState({});

    // maps
    const [ mapApi, setMapApi ] = useState();
    const [ lat, setLat ] = useState();
    const [ lng, setLng ] = useState();
    const [ map, setMap ] = useState();
    const [ apiLoaded, setApiLoaded ] = useState(false);
    const [ geocoder, setGeocoder ] = useState();
    const [ error, setError ] = useState(null);
    const defaultProps = {
        center: {
        lat: 0,
        lng: 0
        },
        zoom: 13
    };

    // functions passed to student form to update students state
    const addStudentToUser = (student) => {
        students.forEach((stud) => {
            if (stud.student.id === student.studentid) {
                alert("A Student with this ID is already associated with this user.")
            }
        });
        setStudents(students => [...students, student]);
    }

    async function handleCreateUser (e) {
        e.preventDefault(); // prevents page reload on submission

        if (!user.firstName || !user.lastName) {
            alert("User First Name and Last Name are Required.")
          }
          else if (!addressValid) {
            alert("Please Validate User Address.")
          }
       
        let form_results = {
          email: user.email.toLowerCase(),
          firstName: user.firstName,
          middleName: user.middleName,
          lastName: user.lastName,
          address: user.address,
          isAdmin: user.isAdmin,
          password: user.password,
          latitude: lat,
          longitude: lng
        }
        console.log(form_results)
    
        try {
          const create_user_response = await registerUser(form_results);
          const madeUser = await getOneUser(create_user_response.data);
    
          for(const student of students) {
            const name = await addStudent(student, madeUser.data);
          };

        } catch (error) {
            let message = error.response.data;
            throw alert (message);
        }
        alert("User Successfully Created");
        navigate('/Users/list');
      }

      async function addStudent(student, parent) {
        try {
          const created = await saveStudent({...student, parentUser: parent});
          return created;
        } catch (e) {
        }
      }
    
    // ensure new student form closes on submission
    useEffect(() => {
        setMakeStudent(false); 
      }, [students]);

    //maps
    const checkMap = (e) => {
        e.preventDefault();
        if (apiLoaded) {
          searchLocation()
        } 
    }
    const searchLocation = () => {
        mapApi.geocoder.geocode( { 'address': user.address }, (results, status) => {
          if (!user.address || user.address.trim().length === 0) {
            alert("Please Enter an Address"); 
            return;
          }
          if (status === "OK") {
            mapApi.map.setCenter(results[0].geometry.location);
            setLng(results[0].geometry.location.lng());
            setLat(results[0].geometry.location.lat());
            setError(null);
            setUser({...user, address : user.address});
            setAddressValid(true);
          } else if (status === "ZERO_RESULTS") {
            setAddressValid(false);
            setError("No results for that address");
            alert ("No results for that address");
     
          } else {
            setAddressValid(false);
            setError("Server Error. Try again later");
            alert("Server Error. Try again later");
            
          }
        });
    }
    const handleApiLoaded = (map, maps) => {
        const geocoder = new maps.Geocoder();
        setMapApi({geocoder: geocoder, map: map});
        setApiLoaded(true);
    }

    return <div id="content"> 
        <h1>Create User Form </h1>
        
        <div id = "user_create_form">
        
        <Divider>User Info </Divider>
        <label for = "firstName"> First Name </label> 
        <input
            id = "username"
            type="text"
            maxLength="100"
            value={user.firstName}
            onChange={(e) => setUser({...user, firstName : e.target.value})}
        />
            
        <label for = "middleName"> Middle Name </label>
        <input
            id = "middleName"
            maxLength="100"
            type="text"
            value={user.middleName}
            onChange={(e) => setUser({...user, middleName : e.target.value})}
        />
  
        <label for = "lastName"> Last Name </label>
        <input
            id = 'lastName'
            maxLength="100"
            type="text"
            value={user.lastName}
            onChange={(e) => setUser({...user, lastName : e.target.value})}
        />
  
        <label for = "email"> Email </label>
        <input
            id = 'email'
            maxLength="100"
            type="text"
            value={user.email}
            onChange={(e) => setUser({...user, email : e.target.value})}
        />

        <label for = "password"> Password </label>    
        <input
            id = "password"
            maxLength="100"
            type="password"
            value={user.password}
            onChange={(e) => setUser({...user, password : e.target.value})}
        />
 
        <label for = "address"> Address {addressValid} </label>
        <input
            id = 'address'
            maxLength="100"
            type="text"
            value={user.address}
            onChange={(e) => {setUser({...user, address: e.target.value}); setAddressValid(false); }} 
        />
        
        <label for = "isAdmin"> Admin </label>
        <input
            id = "isAdmin"
            type="checkbox"
            value={user.isAdmin}
            onInput={(e) => setUser({...user, isAdmin : e.target.checked})}
        />

        <p> </p>
        <Divider>Students</Divider>

        <Box sx={{width: '100%', maxWidth: 360, bgcolor: 'background.paper', margin: 'auto'}}>
            <List dense sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper'}} 
            >
            {students.map((student) => {
                const labelId = `checkbox-list-secondary-label-${student.studentid}`;
                return (
                <ListItem
                    key={student.studentid}

                    secondaryAction={
                        <IconButton aria-label="delete" style={{backgroundColor: 'transparent'}}>
                            <DeleteIcon onClick = {(e) => {
                                let filtered = students.filter(function(el) { return el.studentid != student.studentid;});
                                setStudents(filtered); 
                            }}/>
                        </IconButton>
                    }
                    disablePadding
                >
                <ListItemButton onClick = {(e) => {setSelectedStudent(student)}}>
                    <PersonIcon> </PersonIcon>
                    <ListItemText id={labelId} primary={student.firstName + " " + student.lastName} />
                </ListItemButton>
                </ListItem>
                );
            })}
            
            <ListItem
                key={'-1'}
                disablePadding
            >
                <ListItemButton
                    onClick = {(e) => {setMakeStudent(true);}}>
                    <PersonAddIcon />
                    <ListItemText primary={"Add New Student"} />
                </ListItemButton>
            </ListItem>

            </List>
        </Box>

        <div>
         {makeStudent && <div style = {{position: 'relative', margin: '25px', border:'1px solid lightgrey'}}> 
            <CloseIcon onClick = {(e) => {setMakeStudent(false)}} style = {{
                        position: 'absolute',
                        right: '10px',
                        top: '10px',
                        }}></CloseIcon>
             {makeStudent && <StudentForm addStudentToUser = {addStudentToUser}> </StudentForm>}
        
             </div>
        }
         </div>
        <button style = {{display: 'in-line block', margin: '20px'}} onClick = {(e) => checkMap(e)}> {addressValid ? "Address Valid!": "Validate Address" }  </button>  
        <button style = {{display: 'in-line block', margin: '20px'}} className = "button" onClick = {(e) => {handleCreateUser(e)}} type="button"> Make User </button>
        </div>

        

        <div id="user_create_map">
          {error && (<div>{error}</div>)}
            <div style={{ height: '50vh', width: '80%', display: "inline-block" }}>
                <GoogleMapReact
                    bootstrapURLKeys={{ key: `${process.env.REACT_APP_GOOGLE_MAPS_API}` }}
                    defaultCenter={defaultProps.center}
                    defaultZoom={defaultProps.zoom}
                    yesIWantToUseGoogleMapApiInternals
                    onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
                >
                <Marker
                    text="Your Address"
                    lat={lat}
                    lng={lng}
                />
                </GoogleMapReact>
            </div>
        </div>
    </div>

}