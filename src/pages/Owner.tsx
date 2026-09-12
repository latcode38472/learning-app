/**
 * Owner settings for the AI assistant. Everything here talks to the backend;
 * the page itself grants nothing: without the server-side owner session every
 * request below is refused with 401.
 */
import { useCallback, useEffect, useState } from 'react';
import { useI18n } from '@/i18n';
import { ApiError, fetchStatus, getOwnerConfig, getUsage, ownerLogin, ownerLogout, removeKey, saveKey, saveSettings, testKey, type AssistantLimits, type KeyTestResult, type OwnerConfig, type UsageReport } from '@/assistant/client';
import { describeAssistantError } from '@/assistant/errors';
import { Badge, Notice, useDocumentTitle } from '@/components/ui';

export function OwnerPage() {
  const { t } = useI18n();
  useDocumentTitle(t('owner.title'));
  const [state, setState] = useState<'loading' | 'no-backend' | 'login' | 'ready'>('loading');
  const [serverConfigured, setServerConfigured] = useState(true);
  const [config, setConfig] = useState<OwnerConfig | null>(null);

  const load = useCallback(async () => {
    const status = await fetchStatus();
    if (!status) {
      setState('no-backend');
      return;
    }
    setServerConfigured(status.serverConfigured);
    if (status.role !== 'owner') {
      setState('login');
      return;
    }
    try {
      setConfig(await getOwnerConfig());
      setState('ready');
    } catch {
      setState('login');
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="stack" style={{ maxWidth: 820 }} data-testid="owner">
      <div>
        <h1>{t('owner.title')}</h1>
        <p className="muted">{t('owner.intro')}</p>
      </div>
      {state === 'loading' && <p className="muted">{t('app.loading')}</p>}
      {state === 'no-backend' && (
        <Notice tone="warning" title={t('owner.noBackendTitle')}>
          <p>{t('owner.noBackendBody')}</p>
        </Notice>
      )}
      {state === 'login' && <LoginForm serverConfigured={serverConfigured} onLoggedIn={load} />}
      {state === 'ready' && config && (
        <OwnerPanel
          config={config}
          onConfig={setConfig}
          onLogout={async () => {
            await ownerLogout();
            setConfig(null);
            setState('login');
          }}
        />
      )}
    </div>
  );
}

function LoginForm({ serverConfigured, onLoggedIn }: { serverConfigured: boolean; onLoggedIn: () => void }) {
  const { t, lang } = useI18n();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  return (
    <form
      className="card stack-sm"
      data-testid="owner-login"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setError(null);
        try {
          await ownerLogin(password);
          setPassword('');
          onLoggedIn();
        } catch (err) {
          setError(err instanceof ApiError ? (err.code === 'bad_password' ? t('owner.badPassword') : err.code === 'too_many_attempts' ? t('owner.tooManyAttempts') : describeAssistantError(err.code, lang, err.message)) : t('common.error'));
        } finally {
          setBusy(false);
        }
      }}
    >
      <h2>{t('owner.signIn')}</h2>
      {!serverConfigured && <Notice tone="warning">{t('owner.serverNotConfigured')}</Notice>}
      <p className="small muted">{t('owner.signInNote')}</p>
      <div className="field">
        <label htmlFor="owner-password">{t('owner.password')}</label>
        <input id="owner-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" data-testid="owner-password" />
      </div>
      {error && <Notice tone="danger">{error}</Notice>}
      <div className="btn-row">
        <button type="submit" className="btn btn-primary" disabled={busy || !password} data-testid="owner-login-submit">
          {t('owner.signIn')}
        </button>
      </div>
    </form>
  );
}

function OwnerPanel({ config, onConfig, onLogout }: { config: OwnerConfig; onConfig: (c: OwnerConfig) => void; onLogout: () => Promise<void> }) {
  const { t, lang } = useI18n();
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState(config.model);
  const [limits, setLimits] = useState<AssistantLimits>(config.limits);
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<{ tone: 'success' | 'warning' | 'danger' | 'info'; text: string } | null>(null);
  const [test, setTest] = useState<KeyTestResult | null>(null);
  const [usage, setUsage] = useState<UsageReport | null>(null);
  // Shown immediately when toggled; reverted if the server refuses the change.
  const [learnerAccess, setLearnerAccess] = useState(config.learnerAccess);

  useEffect(() => {
    setModel(config.model);
    setLimits(config.limits);
    setLearnerAccess(config.learnerAccess);
  }, [config]);

  useEffect(() => {
    void getUsage().then(setUsage).catch(() => setUsage(null));
  }, [config.updatedAt]);

  const run = async (label: string, fn: () => Promise<void>) => {
    setBusy(label);
    setMessage(null);
    try {
      await fn();
    } catch (err) {
      setMessage({ tone: 'danger', text: err instanceof ApiError ? describeAssistantError(err.code, lang, err.message) : t('common.error') });
    } finally {
      setBusy(null);
    }
  };

  const fmtUsd = (n: number | null | undefined) => (typeof n === 'number' ? `$${n.toFixed(4)}` : '—');

  return (
    <div className="stack" data-testid="owner-panel">
      <section className="card stack-sm">
        <div className="section-head" style={{ marginBottom: 0 }}>
          <h2 style={{ margin: 0 }}>{t('owner.keyTitle')}</h2>
          {config.key.configured ? <Badge tone="success">{t('owner.keySaved')}</Badge> : <Badge tone="warning">{t('owner.keyMissing')}</Badge>}
        </div>
        {config.key.configured && (
          <p className="small" data-testid="owner-key-status">
            {t('owner.keyMasked')}: <code dir="ltr">{config.key.masked}</code> · {t('owner.keySavedAt')}: {new Date(config.key.savedAt).toLocaleString()}
            {config.key.label ? ` · ${t('owner.keyLabel')}: ${config.key.label}` : ''}
          </p>
        )}
        <p className="small muted">{t('owner.keyHow')}</p>
        <div className="field">
          <label htmlFor="owner-key">{config.key.configured ? t('owner.keyReplace') : t('owner.keyPaste')}</label>
          <input id="owner-key" type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} autoComplete="off" spellCheck={false} dir="ltr" placeholder="sk-or-v1-…" data-testid="owner-key-input" />
          <span className="help">{t('owner.keyPrivacy')}</span>
        </div>
        <div className="btn-row">
          <button
            type="button"
            className="btn btn-primary"
            disabled={!apiKey.trim() || busy !== null}
            data-testid="owner-key-save"
            onClick={() =>
              run('save', async () => {
                onConfig(await saveKey(apiKey.trim()));
                setApiKey('');
                setTest(null);
                setMessage({ tone: 'success', text: t('owner.keySavedMessage') });
              })
            }
          >
            {t('owner.saveKey')}
          </button>
          <button
            type="button"
            className="btn"
            disabled={!config.key.configured || busy !== null}
            data-testid="owner-key-test"
            onClick={() =>
              run('test', async () => {
                const result = await testKey(true);
                setTest(result);
                onConfig(await getOwnerConfig());
              })
            }
          >
            {busy === 'test' ? t('owner.testing') : t('owner.testKey')}
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            style={{ color: 'var(--danger)' }}
            disabled={!config.key.configured || busy !== null}
            data-testid="owner-key-remove"
            onClick={() => {
              if (!window.confirm(t('owner.removeConfirm'))) return;
              void run('remove', async () => {
                onConfig(await removeKey());
                setTest(null);
                setMessage({ tone: 'info', text: t('owner.keyRemoved') });
              });
            }}
          >
            {t('owner.removeKey')}
          </button>
        </div>
        {test && <TestReport test={test} />}
      </section>

      <section className="card stack-sm">
        <h2>{t('owner.modelTitle')}</h2>
        <p className="small muted">{t('owner.modelHow')}</p>
        <div className="field">
          <label htmlFor="owner-model">{t('owner.modelId')}</label>
          <input id="owner-model" type="text" value={model} onChange={(e) => setModel(e.target.value)} dir="ltr" spellCheck={false} data-testid="owner-model-input" />
        </div>
        <label className="toggle">
          <input
            type="checkbox"
            checked={learnerAccess}
            disabled={!config.key.configured || busy !== null}
            data-testid="owner-learner-access"
            onChange={(e) => {
              const next = e.target.checked;
              setLearnerAccess(next);
              void run('access', async () => {
                try {
                  onConfig(await saveSettings({ learnerAccess: next }));
                } catch (err) {
                  setLearnerAccess(!next);
                  throw err;
                }
                setMessage({ tone: 'success', text: next ? t('owner.accessOn') : t('owner.accessOff') });
              });
            }}
          />{' '}
          {t('owner.learnerAccess')}
        </label>
        <p className="small muted">{t('owner.learnerAccessNote')}</p>
      </section>

      <section className="card stack-sm">
        <h2>{t('owner.limitsTitle')}</h2>
        <p className="small muted">{t('owner.limitsNote')}</p>
        <div className="grid-2">
          {(
            [
              ['maxOutputTokens', t('owner.limitOutputTokens')],
              ['requestsPerMinute', t('owner.limitPerMinute')],
              ['requestsPerDay', t('owner.limitPerDay')],
              ['dailyBudgetUsd', t('owner.limitDailyBudget')],
              ['monthlyBudgetUsd', t('owner.limitMonthlyBudget')],
              ['maxMessageChars', t('owner.limitMessageChars')],
              ['maxConversationChars', t('owner.limitConversationChars')],
              ['maxMessages', t('owner.limitMessages')],
            ] as Array<[keyof AssistantLimits, string]>
          ).map(([key, label]) => (
            <div className="field" key={key}>
              <label htmlFor={`limit-${key}`}>{label}</label>
              <input id={`limit-${key}`} type="number" min={0} step={key.includes('Budget') ? 0.1 : 1} value={limits[key]} onChange={(e) => setLimits({ ...limits, [key]: Number(e.target.value) })} dir="ltr" style={{ maxWidth: 200 }} />
            </div>
          ))}
        </div>
        <div className="btn-row">
          <button
            type="button"
            className="btn btn-primary"
            disabled={busy !== null}
            data-testid="owner-settings-save"
            onClick={() =>
              run('settings', async () => {
                onConfig(await saveSettings({ model: model.trim(), limits }));
                setMessage({ tone: 'success', text: t('owner.settingsSaved') });
              })
            }
          >
            {t('owner.saveSettings')}
          </button>
        </div>
      </section>

      {message && <Notice tone={message.tone}>{message.text}</Notice>}

      <section className="card stack-sm">
        <h2>{t('owner.usageTitle')}</h2>
        {usage ? (
          <>
            <div className="pill-row">
              <Badge tone="info">
                {t('owner.usageToday')}: {fmtUsd(usage.todayCost)} / {fmtUsd(usage.limits.dailyBudgetUsd)}
              </Badge>
              <Badge tone="info">
                {t('owner.usageMonth')}: {fmtUsd(usage.monthCost)} / {fmtUsd(usage.limits.monthlyBudgetUsd)}
              </Badge>
            </div>
            <p className="small muted">{t('owner.usageNote')}</p>
            {usage.days.length === 0 ? (
              <p className="small muted">{t('owner.usageEmpty')}</p>
            ) : (
              <div className="table-wrap">
                <table className="lesson-table" dir="ltr">
                  <thead>
                    <tr>
                      <th>{t('owner.usageDay')}</th>
                      <th>{t('owner.usageRequests')}</th>
                      <th>{t('owner.usageDevices')}</th>
                      <th>{t('owner.usageTokens')}</th>
                      <th>{t('owner.usageCost')}</th>
                      <th>{t('owner.usageProblems')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usage.days.map((d) => (
                      <tr key={d.day}>
                        <td>{d.day}</td>
                        <td>{d.requests}</td>
                        <td>{d.clients}</td>
                        <td>
                          {d.promptTokens} + {d.completionTokens}
                        </td>
                        <td>{fmtUsd(d.cost)}</td>
                        <td>{d.errors || d.aborted ? `${d.errors} / ${d.aborted}` : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        ) : (
          <p className="small muted">{t('app.loading')}</p>
        )}
      </section>

      <section className="card stack-sm">
        <h2>{t('owner.aboutTitle')}</h2>
        <ul className="small">
          <li>{t('owner.aboutStorage', { storage: config.storage })}</li>
          <li>{t('owner.aboutKeyNever')}</li>
          <li>{t('owner.aboutConversations')}</li>
          <li>{t('owner.aboutHardCap')}</li>
        </ul>
        <div className="btn-row">
          <button type="button" className="btn" onClick={() => void onLogout()} data-testid="owner-logout">
            {t('owner.signOut')}
          </button>
        </div>
      </section>
    </div>
  );
}

function TestReport({ test }: { test: KeyTestResult }) {
  const { t, lang } = useI18n();
  const fmtUsd = (n: number | null | undefined) => (typeof n === 'number' ? `$${n.toFixed(4)}` : '—');
  return (
    <div className="card-soft stack-sm" data-testid="owner-test-result">
      {test.error && (
        <Notice tone="danger">
          <strong>{t('owner.testKeyFailed')}</strong> {describeAssistantError(test.error.code, lang, test.error.message)}
          {test.error.detail ? <div className="tiny muted" dir="ltr">{test.error.detail}</div> : null}
        </Notice>
      )}
      {test.key && (
        <p className="small">
          ✓ {t('owner.testKeyOk')}
          {test.key.label ? ` · ${t('owner.keyLabel')}: ${test.key.label}` : ''} · {t('owner.testKeyRemaining')}: {test.key.limitRemaining === null ? t('owner.testKeyUnlimited') : fmtUsd(test.key.limitRemaining)}
          {test.key.isFreeTier ? ` · ${t('owner.testFreeTier')}` : ''}
        </p>
      )}
      {test.model && (
        <p className="small">
          {test.model.found === true ? '✓' : test.model.found === false ? '✗' : '?'} {t('owner.testModel')}: <code dir="ltr">{test.model.id}</code>{' '}
          {test.model.found === true
            ? `· ${test.model.name} · ${t('owner.testModelPrice', { prompt: (test.model.promptPrice ?? 0) * 1_000_000, completion: (test.model.completionPrice ?? 0) * 1_000_000 })}`
            : test.model.found === false
              ? `· ${t('owner.testModelMissing')}`
              : `· ${describeAssistantError(test.model.error?.code, lang, test.model.error?.message)}`}
        </p>
      )}
      {test.sample && (
        <p className="small">
          {test.sample.ok ? '✓' : '✗'} {t('owner.testSample')}:{' '}
          {test.sample.ok ? (
            <>
              <code dir="ltr">{test.sample.text}</code> · {t('owner.testSampleCost')}: {fmtUsd(test.sample.usage?.cost)}
            </>
          ) : (
            describeAssistantError(test.sample.error?.code, lang, test.sample.error?.message)
          )}
        </p>
      )}
    </div>
  );
}
