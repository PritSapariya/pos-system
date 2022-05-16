import { Grid, CssBaseline, Typography, TextField, Box, Avatar, Button, Snackbar, Alert } from '@mui/material'
import { Link, useNavigate } from "react-router-dom"
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { useForm } from "react-hook-form"
import axios from "axios"
import { useState } from 'react'
import { url } from '../config'
import { loginScreenImage } from './utilities/images'
import { invalidEmail, invalidPassword, notMatchConfirmPassword, requiredConfirmPassword, requiredEmail, requiredFirstName, requiredLastName, requiredPassword } from './utilities/validationMessages'

const initialState = {
  open: false,
  status: '',
  message: ''
}

const SignUp = (props) => {

  const { register , handleSubmit, formState: { errors }, watch, getValues, reset, setFocus, setError } = useForm();
  const [ message, setMessage ] = useState(initialState);
  const navigate = useNavigate()

  const onSubmit = () => {
    const userData = getValues();

    axios.post(`${url}/auth/signup`, userData).then((res) => {

      console.log(res);

      if(res.data.status === 'error') {

        if(res.status == 208) {
          setError('email', { message: 'Email is already registered. Please try to register with another email.' })
          setFocus('email');
        }
        setMessage({
          open: true,
          status: 'error',
          message: res.data.message
        })
      }
      else {
        setMessage({
          open: true,
          status: 'ok',
          message: 'User is registred successfully!'
        });
        reset();
        navigate("/");
      }

    })
    .catch((err) => console.log(err));
  }

  const handleClose = () => {
    setMessage(initialState);
  }

  return (
    <>
      <Box component="main" sx={{ display: 'flex', height:'100vh', alignItems: 'center', justifyContent: 'center'}}>
        <CssBaseline />

        <Snackbar 
          anchorOrigin={{ vertical: 'top', horizontal: 'center'}}
          onClose={handleClose}
          open={message.open}
          key={"top"}
          message={message.message}
          autoHideDuration={6000} >

            <Alert onClose={handleClose} severity={message.status === 'ok' ? "success" : "error" } sx={{ width: '100%' }}>
              {message.message}
            </Alert>

        </Snackbar>


        <Grid container component="div" sx={{ height: '100vh', width: "100%" }}>
          <Grid 
            item 
            xs={false} 
            sm={6} 
            sx={{
              backgroundImage: `url(${loginScreenImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}>
          </Grid>
          <Grid item sm={6} component="div" sx={{ display: 'flex', justifyContent: 'center'}}>

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: "10px",
                maxWidth: '460px',
                marginTop: 4,
                height: "100vh"
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Sign up
              </Typography>
              <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}> 
                    <TextField
                      name="firstName"
                      required
                      fullWidth
                      label="First Name"
                      autoFocus
                      {...register("firstName", { required: requiredFirstName})}
                      error={!!errors.firstName}
                      helperText={errors?.firstName ? errors.firstName.message : null}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id="lastName"
                      {...register("lastName", { required: requiredLastName})}
                      error={!!errors.lastName}
                      helperText={errors?.lastName ? errors.lastName.message : null}
                      label="Last Name"
                      name="lastName"
                      autoComplete="family-name"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      autoComplete="email"
                      {...register("email", { 
                        required: requiredEmail, 
                        pattern: { 
                          value: /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/, 
                          message: invalidEmail
                        } 
                      })}
                      error={!!errors.email}
                      helperText={errors?.email ? errors.email.message : null}
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
                        required: requiredPassword,
                        pattern: {
                          value: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
                          message: invalidPassword
                        }
                      })}
                      error={!!errors.password}
                      helperText={errors?.password ? errors.password.message : null}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      name="confirmPassword"
                      label="Confirm Password"
                      type="password"
                      id="confirmPassword"
                      {...register("confirmPassword", { 
                        required: requiredConfirmPassword,
                        validate: (val) => {
                          if(watch('password') !== val) {
                            return notMatchConfirmPassword
                          }
                        }
                      })}
                      error={!!errors.confirmPassword}
                      helperText={errors?.confirmPassword ? errors.confirmPassword.message : null}
                    />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign Up
                </Button>
                <Grid container justifyContent="flex-end">
                  <Grid item>
                    <Typography variant="body2">
                      <Link to="/">
                        Already have an account? Sign in
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

export default SignUp