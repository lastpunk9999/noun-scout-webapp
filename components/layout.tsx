import Navbar from './navbar'
import Footer from './footer'
import MatchBanner from './MatchBanner'
import { useRouter } from 'next/router'
import FocusedNav from './FocusedNav';

export default function Layout({ children }) {
  const router = useRouter();
  return (
    <div className='font-sans'>
      {router.pathname === '/add' ? (
        <>
          <FocusedNav />
        </>
      ) : (
        <>
          <MatchBanner />
          <Navbar />
        </>
      )}
      <main>{children}</main>
      <Footer />
    </div>
  )
}