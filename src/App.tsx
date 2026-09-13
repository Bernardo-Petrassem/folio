import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Shell } from "@/components/Shell";
import { HomePage } from "@/pages/HomePage";
import { CreatePage } from "@/pages/CreatePage";
import { ProfilePage } from "@/pages/ProfilePage";
import { IdentityPage } from "@/pages/IdentityPage";
import { YarnListPage, YarnPage } from "@/pages/YarnPage";
import { BooksPage } from "@/pages/BooksPage";
import { BookEditorPage } from "@/pages/BookEditorPage";
import { ExtensionsPage } from "@/pages/ExtensionsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/livro/:bookId" element={<BookEditorPage />} />
        <Route element={<Shell />}>
          <Route path="/" element={<Navigate to="/perfil" replace />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/criar" element={<CreatePage />} />
          <Route path="/perfil" element={<ProfilePage />} />
          <Route path="/perfil/:userId" element={<ProfilePage />} />
          <Route path="/identidade" element={<IdentityPage />} />
          <Route path="/identidade/:userId" element={<IdentityPage />} />
          <Route path="/yarns" element={<YarnListPage />} />
          <Route path="/yarn/:yarnId" element={<YarnPage />} />
          <Route path="/livros" element={<BooksPage />} />
          <Route path="/extensoes" element={<ExtensionsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/perfil" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
