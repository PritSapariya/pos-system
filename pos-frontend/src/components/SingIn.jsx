import { useState } from 'react'
import { Container, Grid, CssBaseline, Typography, Snackbar, Alert, TextField, Box, Avatar, Button } from '@mui/material'
import { Link, useNavigate } from "react-router-dom"
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { useForm } from "react-hook-form"
import axios from "axios"
import { url } from '../config.js'

const initialState = {
  open: false,
  status: '',
  message: ''
}

const SignIn = (props) => {

  const [ message, setMessage ] = useState(initialState);
  const { register, getValues, handleSubmit, formState: { errors }, setError, setFocus } = useForm({ mode: 'onTouched'});
  let navigate =  useNavigate();

  const handleClose = () => {
    setMessage({
      open: false,
      status: '',
      message: ''
    })
  }
  

  const onSubmit = (event) => {
    
    const data = getValues();
    
    let updatedUrl = url + "/auth/signin"
    axios.post(updatedUrl, data).then((res) => {

      if(res.data.status === 'error') {
        console.log("error");
        setMessage({
          open: true,
          status: 'error',
          message: res.data.message
        })
      } 
      else {
  
        localStorage.setItem('token', JSON.stringify(res.data.token));
        localStorage.setItem('user', JSON.stringify(res.data.user))
        console.log(res.data);
  
        const role = res.data.user.role;
        if(role === 'user') {
          navigate('/home');
        }
        else if(role === 'admin') {
          navigate("/dashboard")
        }
        else {
          navigate("/")
        }
      }

    }).catch((err) => {
      console.log(err.response, err.response.status);

      if(err.response.status == 401) {
        setError("email", { message: "Email is not registerd yet." });
        setFocus("email");
      }
      if(err.response.status == 400) {
        setError("password", { message: "Invalid password. Please enter corrent one." });
        setFocus("password");
      }


      setMessage({
          open: true,
          status: 'error',
          message: err.response.data.message 
      })
    })

  }

  return (
    <>
      <Box component="main" sx={{ display: 'flex', height:'100vh', alignItems: 'center', justifyContent: 'center'}}>
        <CssBaseline />

        <Snackbar 
          anchorOrigin={{ vertical: 'top', horizontal: 'center'}}
          onClose={handleClose}
          open={message.open}
          key={ "top"}
          message={message.message}
          autoHideDuration={6000} >

            <Alert onClose={handleClose} severity={message.status === 'ok' ? "success" : "error" } sx={{ width: '100%' }}>
              {message.message}
            </Alert>

        </Snackbar>

        
        <Grid container component="div" sx={{ height: '100vh', width: "100%"}}>
          <Grid 
            item 
            xs={false} 
            sm={6} 
            sx={{
              backgroundImage: "url(/images/login-img1.jpg)",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}>
          </Grid>
          <Grid item xs={12} sm={6} component="div" sx={{ display: 'flex', justifyContent: 'center' }}>

            <Box 
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '10px',
                marginTop: 4,
                maxWidth: '460px',
                height: '100vh'
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Sign In
              </Typography>
              <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      required
                      autoFocus
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      autoComplete="email"
                      {...register("email", {
                        required : "Email is required", 
                        pattern: { 
                          value: /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/, 
                          message: "Enter valid email"
                        } 
                      })}
                      error={!!errors.email}
                      helperText={errors?.email ? errors?.email.message : null}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type="password"
                      id="password"
                      autoComplete="new-password"
                      {...register("password", { 
                        required: "Password is required",
                        pattern: {
                          value: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
                          message: "Password should be of at least 8 characters including Capital, Small and Special character with at least one number"
                        }
                      })}
                      error={!!errors.password}
                      helperText={errors?.password ? errors.password.message : null}
                    />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign In
                </Button>
                <Grid container justifyContent="flex-end">
                  <Grid item>
                    <Typography variant="body2">
                      <Link to="/signup" variant="body2">
                        Don't have an account? Sign Up
                      </Link>
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  )
}

export default SignIn