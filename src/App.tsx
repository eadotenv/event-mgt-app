import HomeContent from "./components/HomeContent";
import LastStep from "./components/LastStep";
import Login from "./components/Login";
import Message from "./components/Message";
import SignUp from "./components/SignUp";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Services from "./components/Services";
import Event from "./components/Event";
import Notifications from "./components/Notifications";
import PageLayout from "./components/PageLayout";
import Details from "./components/Details";

function App() {
  const routes = createBrowserRouter([
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/message",
      element: <Message />,
    },
    {
      path: "/signup",
      element: <SignUp />,
    },
    {
      path: "/last-step",
      element: <LastStep />,
    },
    {
      path: "/page-layout",
      element: <PageLayout />,
      // errorElement: <div>Something went wrong</div>,
      children: [
        { index: true, element: <HomeContent /> }, //default page
        { path: "event", element: <Event /> },
        { path: "details/:id", element: <Details /> },
        { path: "services", element: <Services /> },
        { path: "notifications", element: <Notifications /> },
      ],
    },
    // { path: "event", element: <Event /> },
    // { path: "services", element: <Services /> },
    // { path: "notifications", element: <Notifications /> },
  ]);
  return (
    <div className="App ">
      <RouterProvider router={routes} />
    </div>
  );
}

export default App;
