import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { register } from '@/api/auth';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useNavigation } from 'react-router-dom';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const signupSchema = Yup.object({
  name: Yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});


const Signup = ({switchToLogin} : {switchToLogin: () => void}) => {

  const {login} = useAuth();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
    },
    validationSchema: signupSchema,
    onSubmit: async (values) => {
     const {name, email, password} = values;

      try{
        const response = await register({email, password, name});
        
        if(response.success)
        {
          toast.success(response.message)
          const token = response.data?.token ?? null;
          const user = response.data?.user ?? null;

          if(user && token)
          {
              login(user, token);
              navigate("/", {replace: true});
          }
          else{
            toast.error("Something went wrong. Please try again.")
          }
        }
        else{
          toast.error(response?.message || "Signup failed. Please try again.")
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
        <CardTitle>Create a new account</CardTitle>
        <CardDescription>If you are new here, please register below.</CardDescription>
      </CardHeader>

      <form onSubmit={formik.handleSubmit}>
        <CardContent className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-sm">Name</label>
            <Input
              name="name"
              type="text"
              placeholder="Enter your name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.name}</p>
            )}
          </div>

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
          <Button type="submit" className="w-full">Sign Up</Button>
          <p className="text-sm text-gray-500 text-center">
              Already have an account?{' '}
              <button
                type="button"
                onClick={switchToLogin}
                className="text-blue-600 hover:underline"
              >
                Log in
              </button>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
};

export default Signup