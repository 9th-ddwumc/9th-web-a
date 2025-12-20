import Navbar from './components/Navbar';
import CartContainer from './components/CartContainer';
import Footer from './components/Footer';

function App() {
  return (
    <div className="bg-slate-100 min-h-screen">
      <Navbar />
      <CartContainer />
      <Footer />
    </div>
  );
}

export default App;
