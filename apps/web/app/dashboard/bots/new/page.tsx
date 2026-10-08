"use client"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { DashboardShell } from "@/components/dashboard-shell"
import { PageHeader } from "@/components/page-header"
import { HugeiconsIcon } from "@hugeicons/react"
import { Loading03Icon } from "@hugeicons/core-free-icons"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"
import { toast } from "sonner"

import { useBotMutations } from "@/hooks/api"
import { errorMessage, fieldErrors } from "@/lib/api/client"

const schema = z.object({
  name: z.string().min(2, "Give your bot a name"),
  description: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export default function NewBotPage() {
  const router = useRouter()
  const mutations = useBotMutations()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  async function onSubmit(values: FormValues) {
    try {
      const bot = await mutations.create.mutateAsync(values)
      toast.success(`Bot "${bot.name}" created`)
      router.push(`/dashboard/bots/${bot.id}`)
    } catch (e) {
      const fe = fieldErrors(e)
      if (fe.name) setError("name", { message: fe.name })
      toast.error(errorMessage(e, "Could not create the bot."))
    }
  }

  return (
    <DashboardShell crumb="New bot">
      <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
        <PageHeader
          title="Create a bot"
          description="A bot is one WhatsApp connection. You'll scan a QR code to link it."
        />
        <Card className="max-w-lg">
          <CardHeader>
            <CardTitle className="text-base">Bot details</CardTitle>
            <CardDescription>
              You can change these later in bot settings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="name">Bot name</FieldLabel>
                  <Input
                    id="name"
                    placeholder="Support Bot"
                    aria-invalid={!!errors.name}
                    disabled={isSubmitting}
                    {...register("name")}
                  />
                  {errors.name && <FieldError>{errors.name.message}</FieldError>}
                </Field>
                <Field>
                  <FieldLabel htmlFor="description">
                    Description{" "}
                    <span className="text-muted-foreground">(optional)</span>
                  </FieldLabel>
                  <Textarea
                    id="description"
                    placeholder="Handles customer support chats on WhatsApp…"
                    rows={3}
                    disabled={isSubmitting}
                    {...register("description")}
                  />
                  <FieldDescription>
                    Internal note — only your team sees this.
                  </FieldDescription>
                </Field>
                <div className="flex gap-2">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <HugeiconsIcon
                          icon={Loading03Icon}
                          strokeWidth={2}
                          className="size-4 animate-spin"
                        />
                        Creating…
                      </>
                    ) : (
                      "Create bot"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => router.back()}
                  >
                    Cancel
                  </Button>
                </div>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
