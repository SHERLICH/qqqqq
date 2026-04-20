import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../lib/authApi.js";
import { CURRENT_USER_KEY } from "../lib/userStorage.js";

function EyeIcon({ open, className }) {
  return open ? (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M2.25 12s3.75-7.5 9.75-7.5S21.75 12 21.75 12 18 19.5 12 19.5 2.25 12 2.25 12Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 15.375a3.375 3.375 0 1 0 0-6.75 3.375 3.375 0 0 0 0 6.75Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M10.58 10.58A2.999 2.999 0 0 0 12 15a2.999 2.999 0 0 0 2.42-4.42" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.23 6.23C3.86 7.84 2.25 12 2.25 12S6 19.5 12 19.5c1.84 0 3.45-.49 4.82-1.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.18 4.71C10.06 4.54 11 4.5 12 4.5 18 4.5 21.75 12 21.75 12s-1.25 2.5-3.57 4.58" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function UnderlineField({ label, right, children, hint }) {
  return (
    <div className="space-y-2">
      <div className="flex items-end gap-3">
        <label className="sr-only">{label}</label>
        <div className="min-w-0 flex-1">{children}</div>
        {right ? <div className="shrink-0">{right}</div> : null}
      </div>
      <div className="h-px bg-slate-200" />
      {hint ? <p className="text-xs text-slate-500">{hint}</p> : null}
    </div>
  );
}

export default function Register() {
  const navigate = useNavigate();
  const countryCodes = useMemo(
    () => [
      { code: "+86", name: "中国" },
      { code: "+852", name: "香港" },
      { code: "+853", name: "澳门" },
      { code: "+886", name: "台湾" },
      { code: "+81", name: "日本" },
      { code: "+82", name: "韩国" },
      { code: "+1", name: "美国/加拿大" },
      { code: "+44", name: "英国" },
      { code: "+61", name: "澳大利亚" },
      { code: "+65", name: "新加坡" },
    ],
    []
  );

  const [mode, setMode] = useState("register");
  const [countryCode, setCountryCode] = useState("+86");
  const [phone, setPhone] = useState("");
  const [smsCode, setSmsCode] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!cooldown) return undefined;
    const id = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  const phoneDigits = phone.replace(/\s/g, "");
  const fullPhone = `${countryCode}${phoneDigits}`;
  const phoneValid = phoneDigits.length >= 6;
  const isRegister = mode === "register";
  const canSendCode = isRegister && phoneValid && cooldown === 0;
  const canSubmit = phoneValid && password.length >= 6 && (!isRegister || smsCode.trim().length >= 4) && !submitting;

  function onSendCode() {
    if (!canSendCode) return;
    setCooldown(60);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setErrorMessage("");
    try {
      const payload = isRegister
        ? { phone: fullPhone, password, smsCode: smsCode.trim() }
        : { phone: fullPhone, password };
      const data = isRegister ? await registerUser(payload) : await loginUser(payload);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(data.user));
      localStorage.setItem("circle_auth_token", data.token);
      navigate("/home", { replace: true });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "请求失败，请稍后重试");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-[440px] flex-col bg-white px-6 py-10 text-slate-900">
      <header className="pt-2">
        <div className="mx-auto grid place-items-center">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 shadow-soft ring-8 ring-orange-50" aria-hidden />
          <h1 className="mt-5 text-center text-2xl font-semibold tracking-tight">
            {isRegister ? "欢迎加入，认识新朋友" : "欢迎回来"}
          </h1>
          <p className="mt-2 text-center text-sm text-slate-500">
            {isRegister ? "用一个账号，开启你的社交旅程" : "登录后继续你的社交旅程"}
          </p>
        </div>
      </header>

      <section className="mt-8 flex justify-center">
        <div className="inline-flex rounded-full bg-slate-100 p-1 text-sm">
          <button
            type="button"
            onClick={() => {
              setMode("register");
              setErrorMessage("");
            }}
            className={`rounded-full px-4 py-2 transition ${isRegister ? "bg-white text-red-500 shadow-sm" : "text-slate-500"}`}
          >
            注册
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setErrorMessage("");
            }}
            className={`rounded-full px-4 py-2 transition ${!isRegister ? "bg-white text-red-500 shadow-sm" : "text-slate-500"}`}
          >
            登录
          </button>
        </div>
      </section>

      <section className="mt-8 flex-1">
        <form className="space-y-7" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <div className="flex items-end gap-3">
              <div className="shrink-0">
                <label className="sr-only">国家区号</label>
                <select value={countryCode} onChange={(e) => setCountryCode(e.target.value)} className="h-11 rounded-xl bg-slate-50 px-3 text-sm text-slate-700 outline-none ring-1 ring-transparent focus:ring-2 focus:ring-orange-200" aria-label="国家区号">
                  {countryCodes.map((c) => (
                    <option key={c.code} value={c.code}>{c.code} {c.name}</option>
                  ))}
                </select>
              </div>
              <div className="min-w-0 flex-1">
                <label className="sr-only">手机号</label>
                <input inputMode="tel" autoComplete="tel" placeholder="手机号" value={phone} onChange={(e) => setPhone(e.target.value)} className="h-11 w-full bg-transparent text-base outline-none placeholder:text-slate-400" />
                <div className="h-px bg-slate-200" />
              </div>
            </div>
            <p className="text-xs text-slate-500">{isRegister ? "我们会发送短信验证码用于验证身份" : "请输入已注册手机号进行登录"}</p>
          </div>

          {isRegister ? (
            <UnderlineField
              label="验证码"
              hint="未收到？可尝试稍后重新获取"
              right={
                <button type="button" onClick={onSendCode} disabled={!canSendCode} className={["h-10 rounded-xl px-4 text-sm font-medium", canSendCode ? "bg-orange-500 text-white shadow-soft hover:bg-orange-600 active:bg-orange-700" : "bg-slate-100 text-slate-400"].join(" ")}>
                  {cooldown ? `${cooldown}s` : "获取验证码"}
                </button>
              }
            >
              <input inputMode="numeric" autoComplete="one-time-code" placeholder="验证码" value={smsCode} onChange={(e) => setSmsCode(e.target.value)} className="h-11 w-full bg-transparent text-base outline-none placeholder:text-slate-400" />
            </UnderlineField>
          ) : null}

          <UnderlineField
            label="密码"
            hint={isRegister ? "至少 6 位，建议包含字母与数字" : "请输入你的账户密码"}
            right={
              <button type="button" onClick={() => setShowPassword((v) => !v)} className="grid h-10 w-10 place-items-center rounded-xl text-slate-500 hover:bg-slate-50" aria-label={showPassword ? "隐藏密码" : "显示密码"}>
                <EyeIcon open={showPassword} className="h-5 w-5" />
              </button>
            }
          >
            <input type={showPassword ? "text" : "password"} autoComplete={isRegister ? "new-password" : "current-password"} placeholder={isRegister ? "设置密码" : "输入密码"} value={password} onChange={(e) => setPassword(e.target.value)} className="h-11 w-full bg-transparent text-base outline-none placeholder:text-slate-400" />
          </UnderlineField>

          {errorMessage ? <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-500 ring-1 ring-red-100">{errorMessage}</div> : null}

          <button type="submit" disabled={!canSubmit} className={["mt-2 h-12 w-full rounded-2xl text-base font-semibold tracking-wide transition", canSubmit ? "bg-orange-500 text-white shadow-soft hover:bg-orange-600 active:bg-orange-700" : "bg-orange-100 text-orange-400"].join(" ")}>
            {submitting ? "处理中…" : isRegister ? "注册并登录" : "登录"}
          </button>

          <div className="pt-1 text-center text-xs text-slate-500">
            {isRegister ? "注册即代表同意" : "登录即代表同意"}
            <a className="text-slate-700 hover:text-orange-600" href="#" onClick={(e) => e.preventDefault()}>
              用户协议
            </a>
          </div>
        </form>
      </section>

      <footer className="mt-10 flex flex-col items-center gap-2 text-center text-xs text-slate-400">
        <button type="button" onClick={() => navigate("/home")} className="text-slate-500 hover:text-orange-600">返回首页</button>
        <span>v1.1.0</span>
      </footer>
    </main>
  );
}
