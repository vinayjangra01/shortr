import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { LinkIcon, LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

function Header() {

    const navigate = useNavigate();
    const location = useLocation(); 

    const isAuthPage = location.pathname === "/auth"

    const {isLoggedIn, logout, user} = useAuth();

  return (
    <nav className='p-4 flex justify-between items-center'>
        <Link to="/">
            <img src="/logo.png" className='h-10' alt="Shortr logo"/>
        </Link>
        <div>
            {!isLoggedIn ? (
                !isAuthPage && (   // 👈 hide Login button on /auth page
                    <Button onClick={() => navigate("/auth")}>Login</Button>
                )
                ) : (
                    <DropdownMenu>
                    <DropdownMenuTrigger className='w-10 rounded-full overflow-hidden'>
                            <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>VJ</AvatarFallback>
                            </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <User />
                            Profile</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                            <LinkIcon className='mr-2 h-4 w-4' />
                            My Links
                        </DropdownMenuItem>
                        <DropdownMenuItem className='text-red-400' onClick={logout}>
                            <LogOut className='mr-2 h-4 w-4'/>
                            <span>Logout</span></DropdownMenuItem>
                    </DropdownMenuContent>
                    </DropdownMenu>
                )
        }
        </div>
    </nav>
  )
}

export default Header;