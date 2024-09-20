
import { Poppins } from 'next/font/google'
// import '../global.css'
const manrope = Poppins({
  weight: ['200', '300', '400', '600', '700', '800'],
  subsets: ['latin'],
})

export default function App({ Component, pageProps }) {
  return (
    <>
      <div className={`${manrope.className}`}>
      <Component {...pageProps} />
      </div>
    </>
  );
}