import {createBrowserRouter} from "react-router-dom"
import HomePage from "../page/HomePage"
import QuizPage from "../page/QuizPage"
import Leaderboard from "../page/LeaderboardPage"
import LandingPage from "../page/LandingPage"
export const pageRoutes = createBrowserRouter([
    {
        path:'/',
        element:<LandingPage/>
    },
    {
        path:'/start',
        element:<HomePage/>
    },
    {
        path:'/quiz/:subject',
        element:<QuizPage/>
    },

    {
        path:'/leaderboard',
        element:<Leaderboard/>
    },
])
