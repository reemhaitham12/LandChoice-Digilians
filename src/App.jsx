import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Layout from './Components/Layout';
import  Home  from './Pages/Home';
import  Explore  from './Pages/Explore';
import  SalaryFit  from './Pages/SalaryFit';
import  ComparyCountry  from './Pages/CompareCountry';
import  Checklist  from './Pages/CheckList';
import  News  from './Pages/News';
import  CountryDetails  from './Pages/CountryDetails';
import  NotFound  from './Pages/NotFound';

const routers = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },

      { path: 'explore', element: <Explore /> },
      { path: 'salary-fit', element: <SalaryFit /> },
      { path: 'compare', element: <ComparyCountry /> },
      { path: 'checklist', element: <Checklist /> },
      { path: 'news', element: <News/> },
      { path: 'country/:id', element: <CountryDetails /> },
      { path: '*', element: <NotFound/> },
    ],
  },
]);

function App() {
  return <RouterProvider router={routers} />;
}

export default App;