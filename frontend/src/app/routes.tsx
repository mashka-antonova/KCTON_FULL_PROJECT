import { createBrowserRouter } from "react-router";
import { Layout } from "./Layout";
import { Monitoring } from "./pages/Monitoring";
import { Forecasting } from "./pages/Forecasting";
import { AIReport } from "./pages/AIReport";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Monitoring },
      { path: "forecasting", Component: Forecasting },
      { path: "ai-report", Component: AIReport },
    ],
  },
]);