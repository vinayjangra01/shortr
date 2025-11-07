import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';

function Header() {

    const navigate = useNavigate();
    const user = false;

  return (
    <nav className='py-4 flex justify-between items-center'>
        <Link to="/">
            <img src="/logo.png" className='h-10 border-2' alt="Shortr logo"/>
        </Link>
        <div>
            {!user ?
            <Button  onClick={() => navigate("/auth")}>Login</Button> : (
                    <div></div>
                    )
        }
        </div>
    </nav>
  )
}

export default Header;