import Login from '@/components/login'
import Signup from '@/components/signup'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useState } from 'react';

const Auth = () => {

  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

  return (
    <div className='mt-36 flex flex-col items-center gap-10'>
      <h1 className='text-5xl font-extrabold'>Login | Signup</h1>
      <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as 'login' | 'signup')} className="w-[400px]">
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Signup</TabsTrigger>
        </TabsList>
        <TabsContent value="login"><Login switchToSignup={() => setActiveTab('signup')} /></TabsContent>
        <TabsContent value="signup"><Signup switchToLogin={() => setActiveTab('login')} /></TabsContent>
    </Tabs>
    </div>
  )
}

export default Auth