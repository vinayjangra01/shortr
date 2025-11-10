import { createContext, useState, useEffect, ReactNode, Children, useContext } from "react";


interface User {
  id: string;
  name: string;
  email: string;
}


//what context will provide to consumers
interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
  isLoggedIn: boolean;
}

// only defines the context and its default values.
// createContext defines a React context with a default value.
export const AuthContext = createContext<AuthContextType>({
    user:null,
    token: null,
    login: () => {},
    logout: () => {},
    isLoggedIn: false
})

//provider: makes that data available to all child components
// it's just a react component
export const AuthProvider = ({children}: {children : ReactNode}) => {
    const[user, setUser] = useState<User | null>(null);
    const[token, setToken] = useState<string | null>(null);
    
    //from localstorage on app start
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (userData: User, token: string) => {
        setUser(userData);
        setToken(token);
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
    };


    const isLoggedIn = !!token;

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isLoggedIn }}>
        {children}
        </AuthContext.Provider>
    );
}


export const useAuth = () => {
    const context = useContext(AuthContext);

    if(!context){
        throw new Error("useAuth must be used within an Authprovider");
    }

    return context;
}