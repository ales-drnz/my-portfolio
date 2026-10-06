import { Command } from 'cmdk';
import { navigate } from 'astro:transitions/client';
import { useEffect, useState } from 'react';

interface Props {
  projects: { id: string; title: string; tagline: string }[];
  socials: { label: string; url: string }[];
  emailParts: string[];
}

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

export default function CommandPalette({ projects, socials, emailParts }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const email = `${emailParts[0]}.${emailParts[1]}@${emailParts[2]}`;

  // ⌘K / Ctrl+K / "/" to open, header button too; konami toggles retro mode
  useEffect(() => {
    let k = 0;
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !isTyping(e))) {
        e.preventDefault();
        setOpen((o) => !o);
      }
      k = e.key === KONAMI[k] ? k + 1 : e.key === KONAMI[0] ? 1 : 0;
      if (k === KONAMI.length) {
        k = 0;
        document.documentElement.toggleAttribute('data-retro');
      }
    };
    const onClick = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('[data-open-palette]')) setOpen(true);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onClick);
    };
  }, []);

  useEffect(() => {
    if (!open) setSearch('');
  }, [open]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 1800);
    return () => clearTimeout(t);
  }, [toast]);

  const run = (fn: () => void) => () => {
    setOpen(false);
    fn();
  };
  const go = (href: string) => run(() => navigate(href));
  const ext = (url: string) => run(() => window.open(url, '_blank', 'noopener'));

  const cmd = search.trim().toLowerCase();
  const easterEgg =
    cmd === 'sudo hire-me' || cmd === 'sudo hire me'
      ? { label: 'Permission granted ✓ — open mail client', action: run(() => (location.href = `mailto:${email}?subject=Let's work together`)) }
      : cmd.startsWith('sudo')
        ? { label: 'alessandro is not in the sudoers file. This incident will be reported.', action: run(() => {}) }
        : cmd === 'rm -rf /' || cmd === 'rm -rf'
          ? { label: "I'm afraid I can't let you do that.", action: run(() => setToast('Filesystem is read-only.')) }
          : null;

  return (
    <>
      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        label="Command palette"
        shouldFilter={!easterEgg}
        overlayClassName="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        contentClassName="fixed z-50 left-1/2 top-[14vh] -translate-x-1/2 w-[min(640px,calc(100vw-32px))] rounded-2xl border border-border bg-surface shadow-2xl shadow-black/30 overflow-hidden"
      >
        <div className="flex items-center gap-3 border-b border-border px-4">
          <span className="font-mono text-accent text-sm" aria-hidden>❯</span>
          <Command.Input
            value={search}
            onValueChange={setSearch}
            placeholder="Search projects, links, actions… (try sudo)"
            className="h-12 w-full bg-transparent outline-none text-[15px] placeholder:text-subtle"
          />
          <kbd className="font-mono text-[11px] text-subtle px-1.5 py-0.5 rounded border border-border">esc</kbd>
        </div>
        <Command.List className="max-h-[min(420px,60vh)] overflow-y-auto p-2 text-sm [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-subtle">
          <Command.Empty className="px-3 py-8 text-center text-subtle">
            <span className="font-mono">command not found</span> — try “mpv”, “github” or “email”
          </Command.Empty>

          {easterEgg && (
            <Command.Group heading="terminal">
              <Item onSelect={easterEgg.action} value="easter-egg">
                <span className="font-mono">{easterEgg.label}</span>
              </Item>
            </Command.Group>
          )}

          {!easterEgg && (<>
          <Command.Group heading="Projects">
            {projects.map((p) => (
              <Item key={p.id} onSelect={go(`/projects/${p.id}`)} value={`${p.title} ${p.tagline}`}>
                <span className="text-fg">{p.title}</span>
                <span className="ml-2 text-subtle truncate">{p.tagline}</span>
              </Item>
            ))}
          </Command.Group>

          <Command.Group heading="Navigate">
            <Item onSelect={go('/')}>Home</Item>
            <Item onSelect={go('/#work')}>Projects</Item>
            <Item onSelect={go('/#education')} value="education studies university degree thesis">Education</Item>
            <Item onSelect={go('/#packages')}>pub.dev packages</Item>
            <Item onSelect={go('/#open-source')}>Open source contributions</Item>
          </Command.Group>

          <Command.Group heading="Actions">
            <Item
              onSelect={run(() => {
                navigator.clipboard.writeText(email).then(() => setToast('Email copied'));
              })}
              value="copy email address contact"
            >
              Copy email address
            </Item>
            <Item onSelect={run(() => (location.href = `mailto:${email}?subject=hello`))} value="send email mail contact">
              Send an email
            </Item>
            <Item
              onSelect={run(() => {
                const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
                document.documentElement.dataset.theme = next;
                try {
                  localStorage.setItem('theme', next);
                } catch {}
              })}
              value="toggle theme dark light mode"
            >
              Toggle theme
            </Item>
          </Command.Group>

          <Command.Group heading="Links">
            {socials.map((s) => (
              <Item key={s.url} onSelect={ext(s.url)} value={`open ${s.label}`}>
                {s.label}
                <span className="ml-auto text-subtle">↗</span>
              </Item>
            ))}
          </Command.Group>
          </>)}
        </Command.List>
      </Command.Dialog>

      <div
        role="status"
        aria-live="polite"
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-full border border-border bg-surface px-4 py-2 text-sm shadow-lg transition-all duration-300 ${toast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}
      >
        {toast}
      </div>
    </>
  );
}

function Item({ children, onSelect, value }: { children: React.ReactNode; onSelect: () => void; value?: string }) {
  return (
    <Command.Item
      onSelect={onSelect}
      value={value}
      className="flex items-center rounded-lg px-3 py-2.5 cursor-pointer text-muted data-[selected=true]:bg-surface-2 data-[selected=true]:text-fg"
    >
      {children}
    </Command.Item>
  );
}

function isTyping(e: KeyboardEvent) {
  const t = e.target as HTMLElement;
  return t.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName);
}
