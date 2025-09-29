import './App.css'
import { Link } from './router/Link'
import { Route } from './router/Route'
import { Routes } from './router/Router'

const BbungyaPage = () => <h1>뿡야 페이지</h1>
const YediPage = () => <h1>예디 페이지</h1>
const LianPage = () => <h1>리안 페이지</h1>
const NuaPage = () => <h1>누아 페이지</h1>
const NotFoundPage = () => <h1>404</h1>

const Header = () => {
  return (
    <nav style={{ display: 'flex', gap: '10px' }}>
      <Link to='/bbungya'>BBUNGYA</Link>
      <Link to='/yedi'>YEDI</Link>
      <Link to='/lian'>LIAN</Link>
      <Link to='/nua'>NUA</Link>
      <Link to='/not-found'>404</Link>
    </nav>
  );
};

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path='/bbungya' component={BbungyaPage} />
        <Route path='/yedi' component={YediPage} />
        <Route path='/lian' component={LianPage} />
        <Route path='/nua' component={NuaPage} />
        <Route path='/not-found' component={NotFoundPage} />
      </Routes>
    </>
  )
}

export default App
