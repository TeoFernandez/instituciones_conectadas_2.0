'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import {
  LockIcon,
  UserIcon,
  SignOutIcon,
  PencilSimpleIcon,
  TrashIcon,
  PlusIcon,
  XIcon,
  WarningCircleIcon,
  CalendarBlankIcon,
  CheckCircleIcon,
  SpinnerGapIcon,
  UploadSimpleIcon,
  KeyIcon,
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { isAuthenticated, login, logout, changePassword } from '@/lib/auth-store';
import {
  MONTH_NAMES,
  dateToInputValue,
  fetchEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  uploadImage,
  normalizeImageUrl,
  type EventItem,
  type EventInput,
} from '@/lib/events-store';

const COLOR_PRESETS = ['#5273C2', '#2EC4B6', '#22C55E', '#F43F5E', '#FF9F1C'];

type FormState = {
  title: string;
  programa: string;
  color: string;
  date: string;
  time: string;
  location: string;
  image: string;
  formUrl: string;
};

function emptyForm(): FormState {
  return {
    title: '',
    programa: '',
    color: COLOR_PRESETS[0],
    date: dateToInputValue(new Date()),
    time: '',
    location: '',
    image: '',
    formUrl: '',
  };
}

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    setLoading(true);
    const ok = await login(username, password);
    setLoading(false);
    if (ok) {
      setError('');
      onSuccess();
    } else {
      setError('Usuario o contraseña incorrectos.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: '#001A33' }}>
      <div className="w-full max-w-sm bg-white rounded-[1.75rem] p-8 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5)]">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: '#5273C215' }}>
            <LockIcon size={24} weight="duotone" color="#5273C2" />
          </div>
          <h1 className="font-headline font-extrabold text-[#001A33] text-2xl">Panel de agenda</h1>
          <p className="text-[#64748B] text-sm mt-1 font-body">Ingresá para gestionar los eventos de la red.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="username">Usuario</Label>
            <div className="relative">
              <UserIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
              <Input
                id="username"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-9"
                placeholder="admin"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Contraseña</Label>
            <div className="relative">
              <LockIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-[#F43F5E] text-xs font-body">
              <WarningCircleIcon size={14} weight="bold" />
              {error}
            </div>
          )}

          <Button type="submit" disabled={loading} className="mt-2 bg-[#5273C2] hover:bg-[#435E9F]">
            {loading ? 'Ingresando…' : 'Ingresar'}
          </Button>
        </form>
      </div>
    </div>
  );
}

function EventForm({
  initial,
  onCancel,
  onSubmit,
}: {
  initial: FormState;
  onCancel: () => void;
  onSubmit: (form: FormState) => void;
}) {
  const [form, setForm] = useState<FormState>(initial);
  const [imageCheck, setImageCheck] = useState<'idle' | 'checking' | 'ok' | 'error'>('idle');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleFileSelected = async (file: File | undefined) => {
    if (!file) return;
    setUploadError('');
    setUploading(true);
    try {
      const url = await uploadImage(file);
      set('image', url);
      checkImage(url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'No se pudo subir la imagen.');
    } finally {
      setUploading(false);
      // Permite volver a elegir el mismo archivo si hizo falta reintentar.
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const checkImage = (url: string) => {
    if (!url) {
      setImageCheck('idle');
      return;
    }
    setImageCheck('checking');
    const probe = new window.Image();
    probe.onload = () => setImageCheck('ok');
    probe.onerror = () => setImageCheck('error');
    probe.src = url;
  };

  useEffect(() => {
    if (initial.image) checkImage(initial.image);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleImageBlur = (raw: string) => {
    const normalized = normalizeImageUrl(raw);
    set('image', normalized);
    checkImage(normalized);
  };

  const handleSubmit = (ev: FormEvent) => {
    ev.preventDefault();
    if (!form.title || !form.programa || !form.date || !form.time || !form.location) return;
    onSubmit({ ...form, image: normalizeImageUrl(form.image) });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-[1.5rem] p-6 shadow-[0_10px_30px_-15px_rgba(0,26,51,0.25)] border border-[#001A33]/10 flex flex-col gap-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <Label htmlFor="title">Título del evento</Label>
          <Input id="title" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Torneo de Iniciación Deportiva" />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="programa">Programa</Label>
          <Input id="programa" value={form.programa} onChange={(e) => set('programa', e.target.value)} placeholder="Pasitos" />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="location">Lugar</Label>
          <Input id="location" value={form.location} onChange={(e) => set('location', e.target.value)} placeholder="Polideportivo Norte" />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="date">Fecha</Label>
          <Input id="date" type="date" value={form.date} onChange={(e) => set('date', e.target.value)} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="time">Hora</Label>
          <Input id="time" value={form.time} onChange={(e) => set('time', e.target.value)} placeholder="10:00 hs" />
        </div>

        <div className="flex flex-col gap-1.5 md:col-span-2">
          <Label htmlFor="image">Imagen (opcional — subila desde tu compu o pegá una URL / link de Drive)</Label>
          <div className="flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={(e) => handleFileSelected(e.target.files?.[0])}
            />
            <Button
              type="button"
              variant="outline"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="shrink-0 flex items-center gap-2"
            >
              {uploading ? (
                <SpinnerGapIcon size={16} className="animate-spin" />
              ) : (
                <UploadSimpleIcon size={16} weight="bold" />
              )}
              {uploading ? 'Subiendo…' : 'Subir imagen'}
            </Button>
            <Input
              id="image"
              value={form.image}
              onChange={(e) => {
                set('image', e.target.value);
                setImageCheck('idle');
              }}
              onBlur={(e) => handleImageBlur(e.target.value)}
              placeholder="/img/enraizando.png o link de Drive"
            />
            {imageCheck === 'ok' && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.image} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0 border border-[#001A33]/10" />
            )}
          </div>

          {uploadError && (
            <span className="flex items-center gap-1.5 text-[11px] text-[#F43F5E] font-body">
              <WarningCircleIcon size={12} weight="fill" />
              {uploadError}
            </span>
          )}
          {imageCheck === 'checking' && (
            <span className="flex items-center gap-1.5 text-[11px] text-[#94A3B8] font-body">
              <SpinnerGapIcon size={12} className="animate-spin" />
              Comprobando la imagen...
            </span>
          )}
          {imageCheck === 'ok' && (
            <span className="flex items-center gap-1.5 text-[11px] text-[#22C55E] font-body">
              <CheckCircleIcon size={12} weight="fill" />
              Se ve bien, así va a aparecer en el sitio.
            </span>
          )}
          {imageCheck === 'error' && (
            <span className="flex items-center gap-1.5 text-[11px] text-[#F43F5E] font-body">
              <WarningCircleIcon size={12} weight="fill" />
              No pudimos mostrar esta imagen ahora. Puede ser que: el archivo no sea público, esté en un formato no compatible (ej. HEIC de iPhone — convertilo a JPG/PNG antes de subirlo), o si es de Drive, que se haya agotado su cuota de vistas por un rato. Probá guardar igual y revisar el sitio más tarde.
            </span>
          )}
          {imageCheck === 'idle' && !uploadError && (
            <span className="text-[11px] text-[#94A3B8] font-body">
              &quot;Subir imagen&quot; acepta JPG, PNG, WEBP o GIF de hasta 5 MB. También podés pegar el link de &quot;Compartir&quot; de Google Drive tal cual — se convierte solo (tiene que estar compartido como &quot;Cualquiera con el enlace&quot;).
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5 md:col-span-2">
          <Label htmlFor="formUrl">Link de inscripción (opcional)</Label>
          <Input id="formUrl" value={form.formUrl} onChange={(e) => set('formUrl', e.target.value)} placeholder="https://forms.gle/..." />
          <span className="text-[11px] text-[#94A3B8] font-body">Si lo cargás, va a aparecer un botón para anotarse a este evento.</span>
        </div>

        <div className="flex flex-col gap-1.5 md:col-span-2">
          <Label>Color</Label>
          <div className="flex items-center gap-2">
            {COLOR_PRESETS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => set('color', c)}
                className="w-8 h-8 rounded-full border-2 transition-transform"
                style={{ background: c, borderColor: form.color === c ? '#001A33' : 'transparent', transform: form.color === c ? 'scale(1.1)' : 'scale(1)' }}
                aria-label={`Color ${c}`}
              />
            ))}
            <input
              type="color"
              value={form.color}
              onChange={(e) => set('color', e.target.value)}
              className="w-8 h-8 rounded-full overflow-hidden border border-[#001A33]/10 cursor-pointer"
              aria-label="Color personalizado"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-2">
        <Button type="submit" className="bg-[#5273C2] hover:bg-[#435E9F]">Guardar evento</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
      </div>
    </form>
  );
}

function ChangePasswordForm({ onClose }: { onClose: () => void }) {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [repeat, setRepeat] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    setError('');
    if (next.length < 8) {
      setError('La nueva contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (next !== repeat) {
      setError('Las contraseñas nuevas no coinciden.');
      return;
    }
    setSaving(true);
    try {
      await changePassword(current, next);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo cambiar la contraseña.');
    } finally {
      setSaving(false);
    }
  };

  if (done) {
    return (
      <div className="bg-white rounded-[1.5rem] p-6 shadow-[0_10px_30px_-15px_rgba(0,26,51,0.25)] border border-[#001A33]/10 flex items-center justify-between gap-4">
        <span className="flex items-center gap-2 text-[13px] text-[#22C55E] font-body">
          <CheckCircleIcon size={18} weight="fill" />
          Contraseña actualizada. Usala la próxima vez que ingreses.
        </span>
        <Button type="button" variant="outline" onClick={onClose}>Cerrar</Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-[1.5rem] p-6 shadow-[0_10px_30px_-15px_rgba(0,26,51,0.25)] border border-[#001A33]/10 flex flex-col gap-4"
    >
      <h3 className="font-headline font-extrabold text-[#001A33] text-lg">Cambiar contraseña</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="pwd-current">Contraseña actual</Label>
          <Input
            id="pwd-current"
            type="password"
            autoComplete="current-password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="pwd-new">Nueva contraseña</Label>
          <Input
            id="pwd-new"
            type="password"
            autoComplete="new-password"
            value={next}
            onChange={(e) => setNext(e.target.value)}
            placeholder="Mínimo 8 caracteres"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="pwd-repeat">Repetir nueva contraseña</Label>
          <Input
            id="pwd-repeat"
            type="password"
            autoComplete="new-password"
            value={repeat}
            onChange={(e) => setRepeat(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-[#F43F5E] text-xs font-body">
          <WarningCircleIcon size={14} weight="bold" />
          {error}
        </div>
      )}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={saving} className="bg-[#5273C2] hover:bg-[#435E9F]">
          {saving ? 'Guardando…' : 'Guardar contraseña'}
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
      </div>
    </form>
  );
}

function AdminPanel({ onLogout }: { onLogout: () => void }) {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const reload = async () => {
    const list = await fetchEvents();
    setEvents([...list].sort((a, b) => a.date.getTime() - b.date.getTime()));
  };

  useEffect(() => {
    reload();
  }, []);

  const formToInput = (form: FormState): EventInput => ({
    title: form.title,
    programa: form.programa,
    color: form.color,
    date: form.date,
    time: form.time,
    location: form.location,
    image: form.image || undefined,
    formUrl: form.formUrl || undefined,
  });

  const handleCreate = async (form: FormState) => {
    try {
      await createEvent(formToInput(form));
      await reload();
      setCreating(false);
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'No se pudo guardar el evento.');
    }
  };

  const handleUpdate = async (id: string, form: FormState) => {
    try {
      await updateEvent(id, formToInput(form));
      await reload();
      setEditingId(null);
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'No se pudo actualizar el evento.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Eliminar este evento de la agenda?')) return;
    try {
      await deleteEvent(id);
      await reload();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'No se pudo eliminar el evento.');
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#EDE9E0' }}>
      <div className="max-w-4xl mx-auto px-6 py-14">
        <div className="flex items-center justify-between mb-10">
          <div>
            <span className="text-[10px] font-headline font-bold uppercase tracking-[0.28em] text-[#5273C2]">Panel privado</span>
            <h1 className="font-headline font-extrabold text-[#001A33] text-3xl mt-1">Agenda de eventos</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setChangingPassword((v) => !v)}
              className="flex items-center gap-2"
            >
              <KeyIcon size={16} weight="bold" />
              Cambiar contraseña
            </Button>
            <Button variant="outline" onClick={onLogout} className="flex items-center gap-2">
              <SignOutIcon size={16} weight="bold" />
              Salir
            </Button>
          </div>
        </div>

        {changingPassword && (
          <div className="mb-6">
            <ChangePasswordForm onClose={() => setChangingPassword(false)} />
          </div>
        )}

        {!creating && !editingId && (
          <Button onClick={() => setCreating(true)} className="mb-6 bg-[#5273C2] hover:bg-[#435E9F] flex items-center gap-2">
            <PlusIcon size={16} weight="bold" />
            Nuevo evento
          </Button>
        )}

        {creating && (
          <div className="mb-6">
            <EventForm initial={emptyForm()} onCancel={() => setCreating(false)} onSubmit={handleCreate} />
          </div>
        )}

        <div className="flex flex-col gap-3">
          {events.length === 0 && !creating && (
            <div className="rounded-[1.5rem] bg-white/60 border border-dashed border-[#001A33]/15 py-16 text-center text-sm text-[#64748B] font-body">
              No hay eventos cargados todavía.
            </div>
          )}

          {events
            .slice()
            .sort((a, b) => a.date.getTime() - b.date.getTime())
            .map((e) =>
              editingId === e.id ? (
                <EventForm
                  key={e.id}
                  initial={{
                    title: e.title,
                    programa: e.programa,
                    color: e.color,
                    date: dateToInputValue(e.date),
                    time: e.time,
                    location: e.location,
                    image: e.image ?? '',
                    formUrl: e.formUrl ?? '',
                  }}
                  onCancel={() => setEditingId(null)}
                  onSubmit={(form) => handleUpdate(e.id, form)}
                />
              ) : (
                <div
                  key={e.id}
                  className="flex gap-4 items-center bg-white rounded-2xl p-4 shadow-[0_6px_16px_-10px_rgba(0,26,51,0.2)] border"
                  style={{ borderColor: `${e.color}22` }}
                >
                  <div className="shrink-0 w-14 h-14 rounded-xl flex flex-col items-center justify-center" style={{ background: `${e.color}15` }}>
                    <span className="font-headline font-black text-[18px] leading-none" style={{ color: e.color }}>
                      {e.date.getDate()}
                    </span>
                    <span className="text-[9px] font-headline font-bold uppercase tracking-[0.08em]" style={{ color: e.color }}>
                      {MONTH_NAMES[e.date.getMonth()].slice(0, 3)}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <span
                      className="inline-block text-[9px] font-headline font-bold uppercase tracking-[0.14em] px-2 py-0.5 rounded-full mb-1.5"
                      style={{ background: `${e.color}15`, color: e.color }}
                    >
                      {e.programa}
                    </span>
                    <h4 className="font-headline font-extrabold text-[#001A33] text-[15px] leading-snug truncate">{e.title}</h4>
                    <div className="flex items-center gap-3 mt-1 text-[11px] text-[#64748B] font-body">
                      <span className="flex items-center gap-1">
                        <CalendarBlankIcon size={12} weight="duotone" />
                        {e.time} · {e.location}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      aria-label="Editar evento"
                      onClick={() => {
                        setCreating(false);
                        setEditingId(e.id);
                      }}
                      className="w-9 h-9 rounded-full flex items-center justify-center text-[#001A33] border border-[#001A33]/10 hover:bg-[#5273C2] hover:text-white hover:border-[#5273C2] transition-colors duration-200"
                    >
                      <PencilSimpleIcon size={14} weight="bold" />
                    </button>
                    <button
                      type="button"
                      aria-label="Eliminar evento"
                      onClick={() => handleDelete(e.id)}
                      className="w-9 h-9 rounded-full flex items-center justify-center text-[#F43F5E] border border-[#F43F5E]/20 hover:bg-[#F43F5E] hover:text-white transition-colors duration-200"
                    >
                      <TrashIcon size={14} weight="bold" />
                    </button>
                  </div>
                </div>
              )
            )}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const [authed, setAuthed] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setAuthed(isAuthenticated());
    setChecked(true);
  }, []);

  if (!checked) return null;

  return authed ? (
    <AdminPanel
      onLogout={() => {
        logout();
        setAuthed(false);
      }}
    />
  ) : (
    <LoginForm onSuccess={() => setAuthed(true)} />
  );
}
