import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "@/Lib/adminAuth";
import { LoginForm } from "./LoginForm";
import styles from "./LoginPage.module.scss";

interface AdminLoginPageProps {
  searchParams?: Promise<{
    next?: string;
  }>;
}

const normalizeNextPath = (nextPath?: string) => {
  if (!nextPath?.startsWith("/admin") || nextPath.startsWith("/admin/login")) {
    return "/admin";
  }

  return nextPath;
};

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  const isAuthenticated = await verifyAdminSession(sessionCookie);
  const resolvedSearchParams = await searchParams;
  const nextPath = normalizeNextPath(resolvedSearchParams?.next);

  if (isAuthenticated) {
    redirect(nextPath);
  }

  return (
    <main className={styles.loginShell}>
      <section className={styles.loginIntro}>
        <div className={styles.brand} aria-label="Hashtag Innovations">
          <span className={styles.brandMark}>#</span>
          <span>innovations</span>
        </div>

        <div className={styles.introTitle}>
          <span>Admin area</span>
          <h1>Content administration</h1>
        </div>
      </section>

      <section className={styles.loginPanel} aria-label="Administrator login">
        <div className={styles.loginBox}>
          <div className={styles.loginHeader}>
            <span>Secure access</span>
            <h2>Sign in</h2>
          </div>

          <LoginForm nextPath={nextPath} />
        </div>
      </section>
    </main>
  );
}
