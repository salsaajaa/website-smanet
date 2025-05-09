const MainLayout = () => import('layouts/MainLayout.vue')
const AdminLayout = () => import('layouts/AdminLayout.vue')
const AuthLayout = () => import('layouts/AuthLayout.vue')

const BerandaPage = () => import('pages/Beranda.vue')
const ProfilPage = () => import('pages/Profil.vue')
const AkademikPage = () => import('pages/Akademik.vue')
const KontakPage = () => import('pages/Kontak.vue')

const NewsAndAnnouncementsListPage = () => import('pages/NewsAndAnnouncementsListPage.vue')

const AdminDashboardHubPage = () => import('pages/Admin/AdminDashboardHub.vue')
const AdminKelolaBeritaPage = () => import('pages/Admin/AdminKelolaBerita.vue')
const AdminNewsFormPage = () => import('pages/Admin/AdminNewsFormPage.vue')
const AdminKelolaPengumumanPage = () => import('pages/Admin/AdminKelolaPengumuman.vue')
const AdminAnnouncementFormPage = () => import('pages/Admin/AdminAnnouncementFormPage.vue')
const AdminEditDashboardPage = () => import('pages/Admin/AdminEditDashboard.vue')
const AdminPesanKontakPage = () => import('pages/Admin/AdminPesanKontak.vue')

const LoginPage = () => import('pages/LoginView.vue')
const RegisterUserViewPage = () => import('pages/RegisterUserView.vue')
const ForgotPasswordPage = () => import('pages/ForgotPasswordPage.vue')
const ErrorNotFoundPage = () => import('pages/ErrorNotFound.vue')
const ResetPasswordPage = () => import('pages/ResetPasswordPage.vue')

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', name: 'Home', component: BerandaPage },
      {
        path: 'dashboard',
        name: 'DashboardPublik',
        component: () => import('pages/Dashboard.vue'),
      },
      { path: 'profil', name: 'Profil', component: ProfilPage },
      { path: 'akademik', name: 'Akademik', component: AkademikPage },
      { path: 'kontak', name: 'Kontak', component: KontakPage },
      {
        path: ':type(berita|pengumuman)?/:action(detail)?/:id?',
        name: 'NewsAndAnnouncementsListDetail',
        component: NewsAndAnnouncementsListPage,
        props: true,
      },
    ],
  },

  {
    path: '/admin',
    component: AdminLayout,
    children: [
      { path: '', redirect: { name: 'AdminDashboard' } },
      { path: 'dashboard', name: 'AdminDashboard', component: AdminDashboardHubPage },
      { path: 'kelola-berita', name: 'AdminKelolaBerita', component: AdminKelolaBeritaPage },
      { path: 'kelola-berita/create', name: 'AdminTambahBerita', component: AdminNewsFormPage },
      { path: 'kelola-berita/:id/edit', name: 'AdminEditBerita', component: AdminNewsFormPage },
      {
        path: 'kelola-pengumuman',
        name: 'AdminKelolaPengumuman',
        component: AdminKelolaPengumumanPage,
      },
      {
        path: 'kelola-pengumuman/create',
        name: 'AdminTambahPengumuman',
        component: AdminAnnouncementFormPage,
      },
      {
        path: 'kelola-pengumuman/:id/edit',
        name: 'AdminEditPengumuman',
        component: AdminAnnouncementFormPage,
      },
      { path: 'edit-dashboard', name: 'AdminEditDashboard', component: AdminEditDashboardPage },
      { path: 'pesan-kontak', name: 'AdminPesanKontak', component: AdminPesanKontakPage },
    ],
    meta: { requiresAuth: true },
  },

  {
    path: '/',
    component: AuthLayout,
    children: [
      { path: 'login', name: 'Login', component: LoginPage },
      { path: 'register', name: 'Register', component: RegisterUserViewPage },
      { path: 'forgot-password', name: 'ForgotPassword', component: ForgotPasswordPage },
      {
        path: 'reset-password',
        name: 'ResetPassword',
        component: ResetPasswordPage,
      },
      { path: '/:catchAll(.*)*', name: 'Error404', component: ErrorNotFoundPage },
    ],
  },
]

export default routes
