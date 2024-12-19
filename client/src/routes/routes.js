import HomePage from '../pages/Dashboard/Home';
import ArticlePage from '../pages/Dashboard/Article';
import PelaporanPage from '../pages/Dashboard/Pelaporan';
import DetailLaporan from '../pages/Reports/DetailLaporan';
import TentangKami from '../pages/Dashboard/TentangKami';
import RegisterPage from '../pages/register';
import LoginPage from '../pages/login';
import AdminPage from '../pages/Admin/Admin';
import DetailAdmin from '../pages/Admin/DetailAdmin';
import RiwayatAdmin from '../pages/Admin/RiwayatAdmin';
import LaporanMasuk from '../pages/Admin/LaporanMasuk';
import DetailRiwayat from '../pages/Admin/DetailRiwayat';
import ManagementUser from '../pages/Admin/ManagementUser';
import ManagementAdmin from '../pages/Admin/ManagementAdmin';
import RouteGuard from '../utils/route-guard';
import AdminProfile from '../pages/Admin/AdminProfile';
import ResetPasswordPage from '../pages/reset-password';

const routes = {
  // Public routes
  '/': HomePage,
  '/artikel': ArticlePage,
  '/tentang-kami': TentangKami,
  '/register': RouteGuard.publicOnly(RegisterPage),
  '/login': RouteGuard.publicOnly(LoginPage),
  '/forgot-password': RouteGuard.publicOnly(ResetPasswordPage),

  // Protected user routes
  '/pelaporan': RouteGuard.checkUser(PelaporanPage),
  // "/pelaporan/beranda": RouteGuard.checkUser(PelaporanPage),
  '/pelaporan/laporanaktif': RouteGuard.checkUser(PelaporanPage),
  '/pelaporan/riwayat': RouteGuard.checkUser(PelaporanPage),
  '/pelaporan/profile': RouteGuard.checkUser(PelaporanPage),
  '/pelaporan/riwayat/:id': RouteGuard.checkUser(DetailLaporan),

  // Protected admin routes
  '/admin': RouteGuard.checkAdmin(AdminPage),
  '/admin/profile': RouteGuard.checkAdmin(AdminProfile),
  '/admin/laporan': RouteGuard.checkAdmin(LaporanMasuk),
  '/admin/laporan/:id': RouteGuard.checkAdmin(DetailAdmin),
  '/admin/riwayat': RouteGuard.checkAdmin(RiwayatAdmin),
  '/admin/riwayat/:id': RouteGuard.checkAdmin(DetailRiwayat),
  '/admin/users': RouteGuard.checkAdmin(ManagementUser),
  '/admin/admins': RouteGuard.checkAdmin(ManagementAdmin),
};

export default routes;