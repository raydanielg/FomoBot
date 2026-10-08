import Image from "next/image"
import Link from "next/link"

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center gap-8 overflow-hidden bg-background p-6 md:p-10">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black_30%,transparent_100%)]" />
        <div className="absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(ellipse_50%_60%_at_50%_0%,var(--primary),transparent_70%)] opacity-20" />
        <div className="absolute -bottom-24 -left-24 size-96 rounded-full bg-[radial-gradient(circle,var(--chart-1),transparent_70%)] opacity-15 blur-2xl" />
        <div className="absolute -right-24 -bottom-24 size-96 rounded-full bg-[radial-gradient(circle,var(--primary),transparent_70%)] opacity-10 blur-2xl" />
      </div>
      <div className="relative flex w-full max-w-sm flex-col gap-7 animate-in fade-in-0 slide-in-from-bottom-6 duration-700 fill-mode-backwards">
        <Link href="/" className="flex items-center gap-3 self-center">
          <Image
            src="/fomobot-logo.png"
            alt="Fomobot logo"
            width={48}
            height={52}
            priority
          />
          <div className="flex flex-col">
            <span className="text-xl leading-tight font-semibold tracking-tight">
              Fomobot
            </span>
            <span className="text-xs leading-tight text-muted-foreground">
              WhatsApp automation
            </span>
          </div>
        </Link>
        <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 fill-mode-backwards [animation-delay:150ms]">
          {children}
        </div>
      </div>
    </div>
  )
}
