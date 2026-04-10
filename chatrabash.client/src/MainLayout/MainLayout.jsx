import { Outlet } from 'react-router-dom'
import LanHeader from '../Home/LandingPage/LanHeader'
import LanFooter from '../Home/LandingPage/LanFooter'

const MainLayout = () => {
  return (
    <div className=''>
        
        <LanHeader></LanHeader>
        <Outlet></Outlet>
        <LanFooter></LanFooter>
    </div>
  )
}

export default MainLayout
