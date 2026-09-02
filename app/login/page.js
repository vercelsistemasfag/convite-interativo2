'use client';

import './login.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

export default function LoginPage() {
  const router = useRouter();

  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const recovery =
      typeof window !== 'undefined' &&
      new URLSearchParams(window.location.search).get('recovery') === '1';

    if (recovery) {
      setIsRecovery(true);
      return;
    }

    async function redirectIfLogged() {
      const { data } = await supabase.auth.getSession();

      if (data.session && !data.session.user?.is_anonymous) {
        router.replace('/anfitriao/inicio');
      }
    }

    redirectIfLogged();
  }, [router]);

  async function handleUpdatePassword(event) {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!password || !confirmPassword) {
      setError('Preencha e confirme a nova senha.');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password
      });

      if (updateError) throw updateError;

      setMessage('Senha atualizada com sucesso.');
      setPassword('');
      setConfirmPassword('');

      setTimeout(() => {
        router.replace('/anfitriao/inicio');
      }, 900);
    } catch (err) {
      setError(err?.message || 'Não foi possível atualizar a senha.');
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword() {
    setError('');
    setMessage('');

    if (!email.trim()) {
      setError('Informe seu e-mail para recuperar a senha.');
      return;
    }

    setLoading(true);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo: `${window.location.origin}/login?recovery=1`
        }
      );

      if (resetError) throw resetError;

      setMessage('Enviamos um link de recuperação para o seu e-mail.');
    } catch (err) {
      setError(err?.message || 'Não foi possível enviar o link de recuperação.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);
    setMessage('');
    setError('');

    try {
      if (mode === 'register') {
        if (!name.trim()) {
          throw new Error('Informe seu nome.');
        }

        if (password !== confirmPassword) {
          throw new Error('As senhas não conferem.');
        }

        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/login`,
            data: {
              name: name.trim()
            }
          }
        });

        if (signUpError) throw signUpError;

        if (signUpData.session) {
          router.push('/anfitriao/inicio');
          return;
        }

        setMessage('Conta criada. Verifique seu e-mail para confirmar o cadastro.');
        setMode('login');
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });

      if (signInError) throw signInError;

      router.push('/anfitriao/inicio');
    } catch (err) {
      setError(err?.message || 'Não foi possível continuar.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <img
          className="auth-logo"
          src="/brand/celebra-logo-v2.png"
          alt="Celebra"
        />

        <div className="auth-copy">
          <span>CONVITE INTERATIVO</span>
          <h1>
            {mode === 'login'
              ? 'Entre para continuar'
              : 'Crie sua conta'}
          </h1>
          <p>
            {mode === 'login'
              ? 'Acesse seus convites e acompanhe seus convidados.'
              : 'Crie seus convites e gerencie tudo em um só lugar.'}
          </p>
        </div>

        {isRecovery ? (
        <form className="auth-form" onSubmit={handleUpdatePassword}>
          <label>
            Nova senha
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Digite a nova senha"
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(v => !v)}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? '◉' : '◎'}
              </button>
            </div>
          </label>

          <label>
            Confirmar nova senha
            <div className="password-field">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Repita a nova senha"
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(v => !v)}
                aria-label={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showConfirmPassword ? '◉' : '◎'}
              </button>
            </div>
          </label>

          {error && <p className="auth-error">{error}</p>}
          {message && <p className="auth-success">{message}</p>}

          <button className="auth-primary" type="submit" disabled={loading}>
            {loading ? 'Atualizando...' : 'Salvar nova senha'}
          </button>
        </form>
      ) : (
      <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <label>
              Nome
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Seu nome"
                autoComplete="name"
              />
            </label>
          )}

          <label>
            E-mail
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="seu@email.com"
              autoComplete="email"
              required
            />
          </label>

        <label>
          Senha
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Sua senha"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(v => !v)}
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showPassword ? '◉' : '◎'}
            </button>
          </div>
        </label>

        {mode === 'login' && (
          <button
            type="button"
            className="forgot-password"
            onClick={handleForgotPassword}
            disabled={loading}
          >
            Esqueci minha senha
          </button>
        )}

          {mode === 'register' && (
          <label>
            Confirmar senha
            <div className="password-field">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Repita sua senha"
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(v => !v)}
                aria-label={showConfirmPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showConfirmPassword ? '◉' : '◎'}
              </button>
            </div>
          </label>
          )}

          {error && <p className="auth-error">{error}</p>}
          {message && <p className="auth-success">{message}</p>}

          <button className="auth-primary" type="submit" disabled={loading}>
            {loading
              ? 'Aguarde...'
              : mode === 'login'
                ? 'Entrar'
                : 'Criar conta'}
          </button>
        </form>
      )}

        <button
          className="auth-switch"
          type="button"
          onClick={() => {
            setMode(mode === 'login' ? 'register' : 'login');
            setError('');
            setMessage('');
          }}
        >
          {mode === 'login'
            ? 'Ainda não tenho conta'
            : 'Já tenho uma conta'}
        </button>
      </section>
    </main>
  );
}
