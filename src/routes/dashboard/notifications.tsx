import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/notifications')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/notifications"!</div>
}
