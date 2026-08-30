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

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function redirectIfLogged() {
      const { data } = await supabase.auth.getSession();

      if (data.session && !data.session.user?.is_anonymous) {
        router.replace('/inicio');
      }
    }

    redirectIfLogged();
  }, [router]);

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
            data: {
              name: name.trim()
            }
          }
        });

        if (signUpError) throw signUpError;

        if (signUpData.session) {
          router.push('/inicio');
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

      router.push('/inicio');
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
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Sua senha"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              required
            />
          </label>

          {mode === 'register' && (
            <label>
              Confirmar senha
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Repita sua senha"
                autoComplete="new-password"
                required
              />
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
