import { PasswordResetForm } from '@/app/password-reset/password-reset-form';
import Providers from '@/components/providers';

export default function PasswordResetPage() {
  return (
    <main>
      <h1>Jelszó visszaállítása</h1>
      <Providers>
        <PasswordResetForm />
      </Providers>
    </main>
  );
}
