import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Masthead from './components/Masthead';
import Footer from './components/Footer';
import Home from './pages/Home';
import ArticlePage from './pages/ArticlePage';
import { Reviews, Features, Essays, News, Columns } from './pages/Sections';
import { SearchPage, ArchivePage } from './pages/SearchArchive';
import { ArtistsIndex, ArtistPage, ReleasesIndex, ReleasePage } from './pages/ArtistsReleases';
import { LabelsIndex, LabelPage, GenresIndex, GenrePage, WritersIndex, WriterPage } from './pages/EntityPages';
import About from './pages/About';

function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    document.title = 'Countercurrent — Experimental & Avant-Garde Music Journal';
  }, []);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollTop />
      <div className="min-h-screen paper-grain">
        <Masthead issueNo={168} />
        <main id="main" className="max-w-[1280px] mx-auto px-4 md:px-6 py-6 md:py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/articles/:slug" element={<ArticlePage />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/features" element={<Features />} />
            <Route path="/essays" element={<Essays />} />
            <Route path="/news" element={<News />} />
            <Route path="/columns" element={<Columns />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/archive" element={<ArchivePage />} />
            <Route path="/artists" element={<ArtistsIndex />} />
            <Route path="/artists/:id" element={<ArtistPage />} />
            <Route path="/releases" element={<ReleasesIndex />} />
            <Route path="/releases/:id" element={<ReleasePage />} />
            <Route path="/labels" element={<LabelsIndex />} />
            <Route path="/labels/:id" element={<LabelPage />} />
            <Route path="/genres" element={<GenresIndex />} />
            <Route path="/genres/:id" element={<GenrePage />} />
            <Route path="/writers" element={<WritersIndex />} />
            <Route path="/writers/:id" element={<WriterPage />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
