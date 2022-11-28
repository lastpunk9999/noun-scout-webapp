import Navbar from './navbar'
import Footer from './footer'
import MatchBanner from './MatchBanner'

export default function Layout({ children }) {
  return (
    <div className='font-sans'>
      <MatchBanner />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  )
}