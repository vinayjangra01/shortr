import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { FastField, useFormik } from 'formik';
import * as Yup from 'yup';
import { login } from '@/api/auth';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Eye, EyeOff, ShowerHead } from 'lucide-react';

const loginSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

const Login = ({ switchToSignup }: { switchToSignup: () => void }) => {

  const {login : AuthLogin} = useAuth();

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      console.log('Login Submitted:', values);
      const {email, password} = values;

      try{
        const response = await login({email, password});
        
        if(response.success)
        {
          toast.success(response.message)
          
          const user = response.data?.user || null;
          const token = response.data?.token || null;

          if(user && token)
          {
            AuthLogin(user, token);
            navigate("/", {replace: true});
          }
          else{
            toast.error("Something went wrong. Please try again.")
          }
        }
        else{
          toast.error(response?.message || "Login failed. Please try again.")
        }
      }
      catch(error){
        toast.error("Something went wrong.")
      }
    },
  });

  return (
    <Card className="max-w-md mx-auto shadow-lg border rounded-2xl">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>Welcome back! Please enter your credentials.</CardDescription>
      </CardHeader>

      <form onSubmit={formik.handleSubmit}>
        <CardContent className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-sm">Email</label>
            <Input
              name="email"
              type="email"
              placeholder="Enter your email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium text-sm">Password</label>
            <div className='relative flex flex-row items-center gap-2'>
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className=" text-gray-500 hover:text-gray-700"
                tabIndex={-1}
                >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex mt-5 flex-col space-y-2">
          <Button type="submit" className="w-full">
            Log In
          </Button>
           <p className="text-sm text-gray-500 text-center">
            Don’t have an account?{' '}
            <button
              type="button"
              onClick={switchToSignup}
              className="text-blue-600 hover:underline"
            >
              Sign up
          </button>
        </p>
        </CardFooter>
      </form>
    </Card>
  );
};

export default Login;
