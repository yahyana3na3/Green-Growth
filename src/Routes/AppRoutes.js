import { Routes, Route } from 'react-router-dom';
import React, { lazy, Suspense } from 'react';

const Home = lazy(() => import('../pages/HomePage'));
const CropRecommend = lazy(() => import('../pages/CroprecommendPage'));
const Disease = lazy(() => import('../pages/DiseaseDetectionPage'));
const Calendar = lazy(() => import('../pages/GardenCalendarPage'));

export default function AppRoutes() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/croprecommend" element={<CropRecommend />} />
        <Route path="/disease" element={<Disease />} />
        <Route path="/calendar" element={<Calendar />} />
      </Routes>
    </Suspense>
  );
}
