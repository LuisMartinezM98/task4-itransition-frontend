import { BrowserRouter, Route, Routes} from 'react-router-dom';
import { LogIn } from './pages/LogIn';
import HomeLayout from './layout/HomeLayout';
import Home from './pages/Home';
import HelperRedirect from './pages/HelperRedirect';


function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<HomeLayout/>}>
        <Route index element={<HelperRedirect/>}/>
        <Route path='/home' element={<Home/>}/>
      </Route>
      <Route path='/login' element={<LogIn/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App