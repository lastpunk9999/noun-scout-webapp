import Navbar from './navbar'
import Footer from './footer'
import MatchBanner from './MatchBanner'

export default function Layout({ children }) {
  return (
    <>
      <MatchBanner />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}